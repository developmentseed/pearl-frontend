import { useEffect, useMemo, useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import config from '../config';
import logger from '../utils/logger';
import get from 'lodash.get';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import toasts from '../components/common/toasts';
import { useRestApiClient } from './auth';
import {
  actions as checkpointActions,
  checkpointModes,
  useCheckpoint,
} from './checkpoint';
import { useExploreContext, usePredictions, useProject } from './explore';
import { actions as predictionsActions } from './reducers/predictions';

export const messageQueueActionTypes = {
  ADD: 'ADD',
  SEND: 'SEND',
};

export const instanceActionTypes = {
  SET_TOKEN: 'SET_TOKEN',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
};

export const instanceInitialState = {
  connected: false,
};

export function instanceReducer(state, action) {
  const { type, data } = action;

  switch (type) {
    case instanceActionTypes.SET_CONNECTION_STATUS: {
      return {
        ...state,
        connected: data,
      };
    }
    default:
      logger('Unexpected instance action type: ', { action });
      throw new Error('Unexpected error.');
  }
}

// There is no need to create a context for instance because it is used only one time, in PrimePanel.
// If this changes we need to create a Instance context and add the provider to the tree.
export const useInstance = () => {
  const history = useHistory();
  const { restApiClient } = useRestApiClient();
  const {
    currentCheckpoint,
    dispatchCurrentCheckpoint,
    fetchCheckpoint,
  } = useCheckpoint();
  const { aoiName, aoiRef, currentProject, setCurrentProject } = useProject();
  const { dispatchPredictions } = usePredictions();
  const { selectedModel } = useExploreContext('useWebsocket');

  const [websocketClient, setWebsocketClient] = useState(null);

  const [instance, dispatchInstance] = useReducer(
    instanceReducer,
    instanceInitialState
  );

  // Create a message queue to wait for instance connection
  const [messageQueue, dispatchMessageQueue] = useReducer(
    (state, { type, data }) => {
      switch (type) {
        case messageQueueActionTypes.ADD: {
          return state.concat(JSON.stringify(data));
        }
        case messageQueueActionTypes.SEND: {
          websocketClient.send(state[0]);
          return state.slice(1);
        }
        default:
          logger('Unexpected messageQueue action type: ', type);
          throw new Error('Unexpected error.');
      }
    },
    []
  );

  // Listen to instance connection, send queue message if any
  useEffect(() => {
    if (websocketClient && instance.connected && messageQueue.length > 0) {
      dispatchMessageQueue({ type: messageQueueActionTypes.SEND });
    }
  }, [websocketClient, instance.connected, messageQueue]);

  async function initInstance(projectId) {
    // Close existing websocket
    if (websocketClient) {
      websocketClient.close();
    }

    // Fetch active instances for this project
    const activeInstances = await restApiClient.getActiveInstances(projectId);

    // Get instance token
    let token;
    if (activeInstances.total > 0) {
      const { id: instanceId } = activeInstances.instances[0];
      token = (await restApiClient.getInstance(projectId, instanceId)).token;
    } else {
      token = (await restApiClient.createInstance(projectId)).token;
    }

    // Use a Promise to stand by for GPU connection
    return new Promise((resolve, reject) => {
      const newWebsocketClient = new WebsocketClient({
        token,
        dispatchInstance,
        dispatchCurrentCheckpoint,
        fetchCheckpoint: (checkpointId) =>
          fetchCheckpoint(projectId, checkpointId),
        dispatchPredictions,
      });
      newWebsocketClient.addEventListener('open', () => {
        setWebsocketClient(newWebsocketClient);
        resolve();
      });
      newWebsocketClient.addEventListener('error', () => {
        reject();
      });
    });
  }

  return useMemo(
    () => ({
      runInference: async () => {
        if (restApiClient) {
          let project = currentProject;

          if (!project) {
            try {
              showGlobalLoadingMessage('Creating project...');
              project = await restApiClient.createProject({
                model_id: selectedModel.id,
                mosaic: 'naip.latest',
                name: 'Untitled',
              });
              setCurrentProject(project);
              history.push(`/project/${project.id}`);
            } catch (error) {
              logger(error);
              hideGlobalLoading();
              toasts.error('Could not create project, please try again later.');
              return; // abort inference run
            }
          }

          try {
            showGlobalLoadingMessage('Fetching classes...');
            const { classes } = await restApiClient.getModel(selectedModel.id);
            dispatchCurrentCheckpoint({
              type: checkpointActions.SET_CHECKPOINT,
              data: {
                classes,
              },
            });
          } catch (error) {
            logger(error);
            hideGlobalLoading();
            toasts.error('Could fetch model classes, please try again later.');
            return; // abort inference run
          }

          if (!aoiName) {
            hideGlobalLoading();
            toasts.error('AOI Name must be set before running inference');
            return; // abort inference run
          }

          try {
            await initInstance(project.id);
          } catch (error) {
            logger(error);
            hideGlobalLoading();
            toasts.error('Could not create instance, please try again later.');
          }

          try {
            // Get bbox polygon from AOI
            const {
              _southWest: { lng: minX, lat: minY },
              _northEast: { lng: maxX, lat: maxY },
            } = aoiRef.getBounds();

            const polygon = {
              type: 'Polygon',
              coordinates: [
                [
                  [minX, minY],
                  [maxX, minY],
                  [maxX, maxY],
                  [minX, maxY],
                  [minX, minY],
                ],
              ],
            };

            // Reset predictions state
            dispatchPredictions({
              type: predictionsActions.START_PREDICTION,
            });

            // Add prediction request to queue
            dispatchMessageQueue({
              type: messageQueueActionTypes.ADD,
              data: {
                action: 'model#prediction',
                data: {
                  name: aoiName,
                  polygon,
                },
              },
            });
          } catch (error) {
            logger(error);
            hideGlobalLoading();
            toasts.error('Could not create instance, please try again later.');
          }
        }
      },
      retrain: async function () {
        // Check if all classes have the minimum number of samples
        const classes = Object.values(currentCheckpoint.classes);
        for (let i = 0; i < classes.length; i++) {
          const aClass = classes[i];
          const sampleCount =
            get(aClass, 'points.coordinates.length', 0) +
            get(aClass, 'polygons.length', 0);
          if (sampleCount < config.minSampleCount) {
            toasts.error(
              `A minimum of ${config.minSampleCount} samples is required for every class.`
            );
            return;
          }
        }

        showGlobalLoadingMessage('Retraining...');

        // Reset predictions state
        dispatchPredictions({
          type: predictionsActions.START_PREDICTION,
        });

        // Add prediction request to queue
        dispatchMessageQueue({
          type: messageQueueActionTypes.ADD,
          data: {
            action: 'model#retrain',
            data: {
              name: aoiName,
              classes: classes.map((c) => {
                return {
                  name: c.name,
                  color: c.color,
                  geometry: {
                    type: 'GeometryCollection',
                    geometries: [c.points, ...c.polygons],
                  },
                };
              }),
            },
          },
        });
      },
      applyCheckpoint: async (projectId, checkpointId) => {
        try {
          showGlobalLoadingMessage('Applying checkpoint...');

          if (!websocketClient) {
            await initInstance(projectId);
          }

          // Reset predictions state
          dispatchPredictions({
            type: predictionsActions.START_PREDICTION,
          });

          await fetchCheckpoint(projectId, checkpointId);

          dispatchMessageQueue({
            type: messageQueueActionTypes.ADD,
            data: {
              action: 'model#checkpoint',
              data: {
                id: checkpointId,
              },
            },
          });

          hideGlobalLoading();
        } catch (error) {
          logger(error);
          toasts.error('Could not load checkpoint, please try again later.');
        }
      },
    }),
    [
      aoiName,
      aoiRef,
      currentProject,
      currentCheckpoint,
      dispatchCurrentCheckpoint,
      setCurrentProject,
      restApiClient,
      instance,
      selectedModel,
    ]
  );
};

export class WebsocketClient extends WebSocket {
  constructor({
    token,
    dispatchInstance,
    dispatchCurrentCheckpoint,
    fetchCheckpoint,
    dispatchPredictions,
  }) {
    super(config.websocketEndpoint + `?token=${token}`);

    this.addEventListener('message', (event) => {
      if (!event.data) {
        logger('Websocket message with no data', event);
        return;
      }

      const { message, data } = JSON.parse(event.data);

      // On connected, request a prediction
      switch (message) {
        case 'info#connected':
          logger('Instance connected.');
          dispatchInstance({
            type: instanceActionTypes.SET_CONNECTION_STATUS,
            data: true,
          });
          break;
        case 'info#disconnected':
          logger('Instance disconnected.');
          dispatchInstance({
            type: instanceActionTypes.SET_CONNECTION_STATUS,
            data: false,
          });
          break;
        case 'model#aoi':
          dispatchCurrentCheckpoint({
            type: checkpointActions.SET_CHECKPOINT,
            data: {
              id: data.checkpoint_id,
              name: data.name,
            },
          });
          dispatchPredictions({
            type: predictionsActions.RECEIVE_AOI_META,
            data: {
              id: data.id,
            },
          });
          break;

        case 'model#checkpoint':
          fetchCheckpoint(data.id);
          break;
        case 'model#prediction':
          dispatchPredictions({
            type: predictionsActions.RECEIVE_PREDICTION,
            data: data,
          });
          break;
        case 'model#prediction#complete':
          dispatchPredictions({
            type: predictionsActions.COMPLETE_PREDICTION,
          });
          dispatchCurrentCheckpoint({
            type: checkpointActions.SET_CHECKPOINT_MODE,
            data: {
              mode: checkpointModes.RETRAIN,
            },
          });

          break;
        default:
          logger('Unknown websocket message:');
          logger(event);
          break;
      }
    });
  }
}
