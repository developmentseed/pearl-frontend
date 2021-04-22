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
import { useAoi, useAoiPatch } from './aoi';
import { actions as aoiPatchActions } from './reducers/aoi_patch';
import { useModel } from './model';

import { wrapLogReducer } from './reducers/utils';

const messageQueueActionTypes = {
  ADD: 'ADD',
  SEND: 'SEND',
  CLEAR: 'CLEAR',
};

const instanceActionTypes = {
  APPLY_STATUS: 'APPLY_STATUS',
};

const instanceInitialState = {
  gpuMessage: 'Loading...',
  gpuStatus: 'not-started', // 'ready', 'processing', 'aborting'
  wsConnected: false,
  gpuConnected: false,
};

function instanceReducer(state, action) {
  const { type, data } = action;
  let newState = state;

  switch (type) {
    case instanceActionTypes.APPLY_STATUS: {
      newState = {
        ...state,
        ...data,
      };
      break;
    }
    default:
      logger('Unexpected instance action type: ', action);
      throw new Error('Unexpected error.');
  }

  // Update display message for some GPU states.
  if (data.gpuStatus === 'aborting') {
    newState.gpuMessage = 'Aborting...';
  } else if (data.gpuStatus === 'ready') {
    newState.gpuMessage = 'Ready to go';
  }

  // Uncomment this to log instance state
  // logger(newState);

  return newState;
}

function aoiBoundsToPolygon(bounds) {
  // Get bbox polygon from AOI
  const {
    _southWest: { lng: minX, lat: minY },
    _northEast: { lng: maxX, lat: maxY },
  } = bounds;

  return {
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
  const { dispatchAoiPatch } = useAoiPatch();
  const { selectedModel } = useModel();

  const [websocketClient, setWebsocketClient] = useState(null);

  const [instance, dispatchInstance] = useReducer(
    instanceReducer,
    instanceInitialState
  );

  // Apply instance status
  const applyInstanceStatus = (status) => {
    dispatchInstance({
      type: instanceActionTypes.APPLY_STATUS,
      data: status,
    });
  };

  // Create a message queue to wait for instance connection
  const [messageQueue, dispatchMessageQueue] = useReducer(
    wrapLogReducer((state, { type, data }) => {
      switch (type) {
        case messageQueueActionTypes.ADD: {
          return state.concat(data);
        }
        case messageQueueActionTypes.SEND: {
          const message = state[0];
          if (message.action !== 'model#status') {
            applyInstanceStatus({ gpuStatus: 'processing' });
          }
          websocketClient.sendMessage(state[0]);
          return state.slice(1);
        }
        case messageQueueActionTypes.CLEAR: {
          return [];
        }
        default:
          logger('Unexpected messageQueue action type: ', type);
          throw new Error('Unexpected error.');
      }
    }),
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
    if (
      websocketClient &&
      instance.wsConnected &&
      instance.gpuConnected &&
      instance.gpuStatus === 'ready' &&
      messageQueue.length > 0
    ) {
      dispatchMessageQueue({ type: messageQueueActionTypes.SEND });
    }
  }, [
    websocketClient,
    instance.wsConnected,
    instance.gpuConnected,
    instance.gpuStatus,
    messageQueue,
  ]);

  async function initInstance(projectId, checkpointId) {
    // Close existing websocket
    if (websocketClient) {
      websocketClient.close();
    }

    applyInstanceStatus({
      gpuStatus: 'initializing',
      wsConnected: false,
      gpuConnected: false,
    });

    // Fetch active instances for this project
    const activeInstances = await restApiClient.getActiveInstances(projectId);

    // Get instance token
    let instance;
    if (activeInstances.total > 0) {
      const { id: instanceId } = activeInstances.instances[0];
      instance = await restApiClient.getInstance(projectId, instanceId);

      // As the instance is already running, apply desired checkpoint when
      // ready.
      if (checkpointId) {
        dispatchMessageQueue({
          type: messageQueueActionTypes.ADD,
          data: {
            action: 'model#checkpoint',
            data: {
              id: checkpointId,
            },
          },
        });
      }
    } else if (checkpointId) {
      instance = await restApiClient.createInstance(projectId, {
        checkpoint_id: checkpointId,
      });

      // Apply checkpoint to the interface as the instance will start with it applied.
      fetchCheckpoint(projectId, checkpointId, checkpointModes.RETRAIN);
    } else {
      instance = await restApiClient.createInstance(projectId);
    }

    // Use a Promise to stand by for GPU connection
    return new Promise((resolve, reject) => {
      const newWebsocketClient = new WebsocketClient({
        token: instance.token,
        applyInstanceStatus,
        dispatchInstance,
        dispatchCurrentCheckpoint,
        fetchCheckpoint: (checkpointId, mode) =>
          fetchCheckpoint(projectId, checkpointId, mode),
        dispatchPredictions,
        dispatchMessageQueue,
        dispatchAoiPatch,
      });
      newWebsocketClient.addEventListener('open', () => {
        setWebsocketClient(newWebsocketClient);
        applyInstanceStatus({
          wsConnected: true,
        });
        resolve(instance);
      });
      newWebsocketClient.addEventListener('error', () => {
        reject();
      });
      newWebsocketClient.addEventListener('close', () => {
        applyInstanceStatus({
          wsConnected: false,
          gpuConnected: false,
          gpuStatus: 'disconnected',
        });
      });
    });
  }

  const value = {
    instance,
    setInstanceStatusMessage: (message) =>
      applyInstanceStatus({
        gpuMessage: message,
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

        hideGlobalLoading();

        try {
          // Reset predictions state
          dispatchPredictions({
            type: predictionsActions.START_PREDICTION,
            data: {
              type: checkpointModes.RUN,
            },
          });

          // Add prediction request to queue
          dispatchMessageQueue({
            type: messageQueueActionTypes.ADD,
            data: {
              action: 'model#prediction',
              data: {
                name: aoiName,
                polygon: aoiBoundsToPolygon(aoiRef.getBounds()),
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
      let sampleCount = 0;
      for (let i = 0; i < classes.length; i++) {
        const aClass = classes[i];
        sampleCount +=
          get(aClass, 'points.coordinates.length', 0) +
          get(aClass, 'polygons.length', 0);
      }
      if (sampleCount < config.minSampleCount) {
        toasts.error(
          `At least ${config.minSampleCount} sample${
            config.minSampleCount === 1 ? '' : 's'
          } should be provided for retraining.`
        );
        return;
      }

      // Reset predictions state
      dispatchPredictions({
        type: predictionsActions.START_PREDICTION,
        data: {
          type: checkpointModes.RETRAIN,
        },
      });

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
    refine: async function () {
      const classes = Object.values(currentCheckpoint.classes);
      let sampleCount = 0;
      for (let i = 0; i < classes.length; i++) {
        const aClass = classes[i];
        sampleCount += get(aClass, 'polygons.length', 0);
      }
      const checkpoints = Object.values(currentCheckpoint.checkpointBrushes);

      for (let i = 0; i < checkpoints.length; i++) {
        const ckpt = checkpoints[i];
        sampleCount += get(ckpt, 'polygons.length', 0);
      }

      if (sampleCount === 0) {
        toasts.error(`At least one sample must be provided for refinement`);
        return;
      }

      showGlobalLoadingMessage('Requesting AOI patch...');
      Object.values(currentCheckpoint.checkpointBrushes).forEach((ckpt) => {
        ckpt.polygons.forEach((polygon) => {
          dispatchAoiPatch({
            type: aoiPatchActions.INIT,
            data: {
              name: `${ckpt.checkpoint.name} (${ckpt.checkpoint.id})`,
            },
          });
          dispatchMessageQueue({
            type: messageQueueActionTypes.ADD,
            data: {
              action: 'model#patch',
              data: {
                type: 'brush',
                checkpoint_id: ckpt.checkpoint.id,
                polygon,
              },
            },
          });
        });
      });

      Object.values(currentCheckpoint.classes).forEach((cl, index) => {
        cl.polygons.forEach((polygon) => {
          dispatchAoiPatch({
            type: aoiPatchActions.INIT,
            data: {
              name: `${cl.name}`,
            },
          });

          dispatchMessageQueue({
            type: messageQueueActionTypes.ADD,
            data: {
              action: 'model#patch',
              data: {
                type: 'class',
                class: index,
                polygon,
              },
            },
          });
        });
      });

      // Clear samples from the checkpoint object
      // Prime panel calls mapRef.polygonDraw.clearLayers()
      dispatchCurrentCheckpoint({
        type: checkpointActions.CLEAR_SAMPLES,
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

        await fetchCheckpoint(projectId, checkpointId, checkpointModes.RETRAIN);

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
    refine,
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
      refine,
      applyCheckpoint,
    }),
    [instance, initInstance, runInference, retrain, applyCheckpoint]
  );
};

export class WebsocketClient extends WebSocket {
  constructor({
    token,
    applyInstanceStatus,
    dispatchCurrentCheckpoint,
    dispatchMessageQueue,
    fetchCheckpoint,
    dispatchPredictions,
    dispatchAoiPatch,
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
          applyInstanceStatus({
            gpuStatus: data.isAborting
              ? 'aborting'
              : data.processing
              ? 'processing'
              : 'ready',
          });
          break;
        case 'info#connected':
          applyInstanceStatus({
            gpuConnected: true,
          });
          this.sendMessage({ action: 'model#status' });
          break;
        case 'info#disconnected':
          applyInstanceStatus({
            gpuConnected: false,
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
        case 'error':
          logger(event);
          dispatchMessageQueue({ type: messageQueueActionTypes.CLEAR });
          dispatchPredictions({ type: predictionsActions.CLEAR_PREDICTION });
          this.sendMessage({ action: 'model#status' });
          toasts.error('Unexpected error, please try again later.');
          break;
        case 'model#checkpoint':
          if (data && (data.id || data.checkpoint)) {
            fetchCheckpoint(data.id || data.checkpoint);
          }
          applyInstanceStatus({
            gpuMessage: `Loading checkpoint...`,
          });
          this.sendMessage({ action: 'model#status' });
          break;

        case 'model#checkpoint#progress':
        case 'model#checkpoint#complete':
        case 'model#retrain#complete':
          if (data && (data.id || data.checkpoint)) {
            fetchCheckpoint(
              data.id || data.checkpoint,
              checkpointModes.RETRAIN
            );
          }
          applyInstanceStatus({
            gpuMessage: `Loading checkpoint...`,
          });
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
        case 'model#patch':
          //receive new patch
          dispatchAoiPatch({
            type: aoiPatchActions.START_PATCH,
            data: {
              id: data.id,
            },
          });
          this.sendMessage({ action: 'model#status' });
          break;
        case 'model#patch#progress':
          dispatchAoiPatch({
            type: aoiPatchActions.RECEIVE_PATCH,
            data,
          });
          //receive image
          break;
        case 'model#patch#complete':
          dispatchAoiPatch({
            type: aoiPatchActions.COMPLETE_PATCH,
          });
          // finish waiting for patch
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
