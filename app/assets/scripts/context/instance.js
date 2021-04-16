import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useHistory } from 'react-router';
import T from 'prop-types';
import config from '../config';
import logger from '../utils/logger';
import get from 'lodash.get';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import toasts from '../components/common/toasts';
import { useAuth } from './auth';
import {
  actions as checkpointActions,
  checkpointModes,
  useCheckpoint,
} from './checkpoint';

import { actions as predictionsActions, usePredictions } from './predictions';
import { useProject } from './project';
import { useAoi } from './aoi';
import { useModel } from './model';

const messageQueueActionTypes = {
  ADD: 'ADD',
  SEND: 'SEND',
};

const instanceActionTypes = {
  SET_TOKEN: 'SET_TOKEN',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  SET_STATUS: 'SET_STATUS',
};

const instanceInitialState = {
  status: 'disconnected', // 'initializing', 'ready', 'processing', 'aborting'
  connected: false,
  statusText: 'Fetching...',
};

function instanceReducer(state, action) {
  const { type, data } = action;

  switch (type) {
    case instanceActionTypes.SET_CONNECTION_STATUS: {
      return {
        ...state,
        connected: data,
        status: !data ? 'disconnected' : state.status,
        statusText: data ? 'Instance connected' : 'Instance disconnected',
      };
    }
    case instanceActionTypes.SET_STATUS: {
      return {
        ...state,
        previousStatus: state.status,
        status: data,
        statusText: data,
      };
    }
    default:
      logger('Unexpected instance action type: ', { action });
      throw new Error('Unexpected error.');
  }
}

const InstanceContext = createContext(null);

export function InstanceProvider(props) {
  const history = useHistory();
  const { restApiClient } = useAuth();
  const {
    currentCheckpoint,
    dispatchCurrentCheckpoint,
    fetchCheckpoint,
  } = useCheckpoint();
  const { currentProject, setCurrentProject } = useProject();
  const { dispatchPredictions } = usePredictions();
  const { aoiName, aoiRef } = useAoi();
  const { selectedModel } = useModel();

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
          return state.concat(data);
        }
        case messageQueueActionTypes.SEND: {
          websocketClient.sendMessage(state[0]);
          return state.slice(1);
        }
        default:
          logger('Unexpected messageQueue action type: ', type);
          throw new Error('Unexpected error.');
      }
    },
    []
  );

  useEffect(() => {
    // This checks if instance status changed from 'disconnected' to 'processing'
    // which means an job was already running. If this is the case, send an abort
    // message to clear the instance.
    if (
      instance.previousStatus === 'disconnected' &&
      instance.status === 'processing'
    ) {
      websocketClient.sendMessage({ action: 'model#abort' });
    }
  }, [websocketClient, instance.status]);

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
        newWebsocketClient.addEventListener('message', () => {});
        setWebsocketClient(newWebsocketClient);
        resolve();
      });
      newWebsocketClient.addEventListener('error', () => {
        reject();
      });
    });
  }

  const value = {
    instance,
    setInstanceStatusMessage: (message) =>
      dispatchInstance({
        type: instanceActionTypes.SET_STATUS,
        data: message,
      }),
    sendAbortMessage: () =>
      websocketClient.sendMessage({ action: 'model#abort' }),

    initInstance,
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
          toasts.error('Could fetch model classes, please try again later.');
          return; // abort inference run
        }

        hideGlobalLoading();

        if (!aoiName) {
          toasts.error('AOI Name must be set before running inference');
          return; // abort inference run
        }

        try {
          await initInstance(project.id);
        } catch (error) {
          logger(error);
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
        if (!websocketClient) {
          await initInstance(projectId);
        }

        // Reset predictions state
        dispatchPredictions({
          type: predictionsActions.CLEAR_PREDICTION,
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
      } catch (error) {
        logger(error);
        toasts.error('Could not load checkpoint, please try again later.');
      }
    },
  };

  return (
    <InstanceContext.Provider value={value}>
      {props.children}
    </InstanceContext.Provider>
  );
}

InstanceProvider.propTypes = {
  children: T.node,
};

const useCheckContext = (fnName) => {
  const context = useContext(InstanceContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <InstanceContext> component's context.`
    );
  }

  return context;
};

export const useInstance = () => {
  const {
    instance,
    setInstanceStatusMessage,
    sendAbortMessage,
    initInstance,
    runInference,
    retrain,
    applyCheckpoint,
  } = useCheckContext(InstanceContext);
  return useMemo(
    () => ({
      instance,
      setInstanceStatusMessage,
      sendAbortMessage,
      initInstance,
      runInference,
      retrain,
      applyCheckpoint,
    }),
    [instance, initInstance, runInference, retrain, applyCheckpoint]
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
        case 'model#status':
          dispatchInstance({
            type: instanceActionTypes.SET_STATUS,
            data: data.isAborting
              ? 'aborting'
              : data.processing
              ? 'processing'
              : 'ready',
          });
          break;
        case 'info#connected':
          logger('Instance connected.');
          dispatchInstance({
            type: instanceActionTypes.SET_CONNECTION_STATUS,
            data: true,
          });
          this.sendMessage({ action: 'model#status' });
          break;
        case 'info#disconnected':
          logger('Instance disconnected.');
          dispatchInstance({
            type: instanceActionTypes.SET_CONNECTION_STATUS,
            data: false,
          });
          break;
        case 'model#aborted':
          logger('Previous run aborted.');
          dispatchPredictions({
            type: predictionsActions.CLEAR_PREDICTION,
          });
          dispatchCurrentCheckpoint({
            type: checkpointActions.RESET_CHECKPOINT,
          });
          // Request new status update after abort is confirmed
          this.sendMessage({ action: 'model#status' });
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
          this.sendMessage({ action: 'model#status' });
          break;
        case 'model#checkpoint#progress':
          this.sendMessage({ action: 'model#status' });
          break;
        case 'model#checkpoint#complete':
          this.sendMessage({ action: 'model#status' });
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
          // Request new status update after abort is confirmed
          this.sendMessage({ action: 'model#status' });
          break;
        default:
          logger('Unknown websocket message:');
          logger(event);
          break;
      }
    });
  }

  sendMessage(message) {
    this.send(JSON.stringify(message));
  }
}
