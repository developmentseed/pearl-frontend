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
import ReconnectingWebsocket from 'reconnecting-websocket';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '../components/common/global-loading';
import { Button } from '@devseed-ui/button';
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
import { featureCollection, feature } from '@turf/helpers';

const messageQueueActionTypes = {
  ABORT: 'ABORT',
  ADD: 'ADD',
  ADD_EXPRESS: 'ADD_EXPRESS',
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
      // gpuStatus will change, update previousGpuStatus
      if (data.gpuStatus && data.gpuStatus !== state.gpuStatus) {
        newState.previousGpuStatus = state.gpuStatus;
      }

      // Apply passed data
      newState = {
        ...newState,
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
  const { currentProject, setCurrentProject, projectName } = useProject();
  const { dispatchPredictions } = usePredictions();
  const { currentAoi, aoiName, aoiRef } = useAoi();
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
        case messageQueueActionTypes.ABORT: {
          // This action allow the abort message to be followed by messages passed in the action,
          // useful to apply a checkpoint next, for example.
          websocketClient.sendMessage({ action: 'model#abort' });
          return (
            (data.queueNext &&
              data.queueNext.map((m) => ({ express: false, message: m }))) ||
            []
          );
        }
        case messageQueueActionTypes.ADD: {
          return state.concat({
            express: false,
            message: data,
          });
        }
        case messageQueueActionTypes.ADD_EXPRESS: {
          // Add message to the queue beginning
          return [
            {
              express: true,
              message: data,
            },
          ].concat(state);
        }
        case messageQueueActionTypes.SEND: {
          const { message } = state[0];

          // make instance busy to avoid sending several messages (model#status is ok)
          if (message.action !== 'model#status') {
            applyInstanceStatus({ gpuStatus: 'processing' });
          }

          // Send message
          websocketClient.sendMessage(message);

          // On abort
          if (message.action === 'model#abort') {
            // Also request a status
            websocketClient.sendMessage({ action: 'model#status' });
            // And clear the queue
            return [];
          }

          // On regular messages, remove it from the queue
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
    // Send abort message if GPU status changed from 'initializing' to 'processing'
    // which means an job was already running.
    if (
      instance.previousGpuStatus === 'initializing' &&
      instance.gpuStatus === 'processing'
    ) {
      dispatchMessageQueue({
        type: messageQueueActionTypes.ADD_EXPRESS,
        data: { action: 'model#abort' },
      });
    }
  }, [websocketClient, instance.gpuStatus]); // eslint-disable-line

  // Listen to instance connection, send queue message if any
  useEffect(() => {
    if (
      websocketClient &&
      instance.wsConnected &&
      instance.gpuConnected &&
      messageQueue.length > 0
    ) {
      // Send message if instance is ready or first message is express
      if (instance.gpuStatus === 'ready' || messageQueue[0].express) {
        dispatchMessageQueue({ type: messageQueueActionTypes.SEND });
      }
    }
  }, [
    websocketClient,
    instance.wsConnected,
    instance.gpuConnected,
    instance.gpuStatus,
    messageQueue,
  ]);

  // Disconnect websocket on unmount
  useEffect(() => {
    return () => {
      if (websocketClient) {
        websocketClient.close();
      }
    };
  }, [websocketClient]);

  async function initInstance(projectId, checkpointId, aoiId) {
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
    let doHideGlobalLoading = true;
    if (activeInstances.total > 0) {
      const { id: instanceId } = activeInstances.instances[0];
      instance = await restApiClient.getInstance(projectId, instanceId);

      // As the instance is already running, apply desired checkpoint when
      // ready.
      if (checkpointId) {
        if (checkpointId !== instance.checkpoint_id) {
          doHideGlobalLoading = false; // globalLoading will be hidden once checkpoint is in
          dispatchMessageQueue({
            type: messageQueueActionTypes.ADD,
            data: {
              action: 'model#checkpoint',
              data: {
                id: checkpointId,
              },
            },
          });
        } else {
          fetchCheckpoint(
            projectId,
            checkpointId,
            checkpointModes.RETRAIN,
            true
          );
        }
      }

      if (aoiId && aoiId !== instance.aoi_id) {
        doHideGlobalLoading = false; // globalLoading will be hidden once checkpoint is in
        dispatchMessageQueue({
          type: messageQueueActionTypes.ADD,
          data: {
            action: 'model#aoi',
            data: {
              id: aoiId,
            },
          },
        });
      }
    } else if (checkpointId) {
      instance = await restApiClient.createInstance(projectId, {
        checkpoint_id: checkpointId,
        aoi_id: aoiId,
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
        fetchCheckpoint: (checkpointId, mode, created) =>
          fetchCheckpoint(projectId, checkpointId, mode, created),
        dispatchPredictions,
        dispatchMessageQueue,
        dispatchAoiPatch,
        onError: () => {
          if (websocketClient) {
            websocketClient.close();
            setWebsocketClient(null);
          }
          // Fetch checkpoint that existed at time of execution
          fetchCheckpoint(
            currentCheckpoint.project_id,
            currentCheckpoint.id,
            null,
            true
          );
        },
      });
      newWebsocketClient.addEventListener('open', () => {
        setWebsocketClient(newWebsocketClient);
        applyInstanceStatus({
          wsConnected: true,
        });

        // Hide global loading on connect, if necessary
        if (doHideGlobalLoading) hideGlobalLoading();
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

  const abortJob = (queueNext) => {
    // If GPU is not connected, just clear the message queue
    if (!instance.gpuConnected) {
      dispatchMessageQueue({
        type: messageQueueActionTypes.CLEAR,
        data: {
          action: 'model#abort',
        },
      });
    } else {
      dispatchMessageQueue({
        type: messageQueueActionTypes.ABORT,
        data: {
          queueNext,
        },
      });
    }

    // Clear prediction and checkpoint
    dispatchPredictions({
      type: predictionsActions.CLEAR_PREDICTION,
    });
    dispatchCurrentCheckpoint({
      type: checkpointActions.RESET_CHECKPOINT,
    });
  };

  const value = {
    instance,
    setInstanceStatusMessage: (message) =>
      applyInstanceStatus({
        gpuMessage: message,
      }),

    abortJob,
    initInstance,
    loadAoiOnInstance: (id) => {
      showGlobalLoadingMessage('Loading AOI on Instance...');
      //return
      dispatchMessageQueue({
        type: messageQueueActionTypes.ADD_EXPRESS,
        data: {
          action: 'model#aoi',
          data: {
            id,
          },
        },
      });
    },
    runInference: async () => {
      if (restApiClient) {
        let project = currentProject;

        if (!project) {
          try {
            showGlobalLoadingMessage('Creating project...');
            project = await restApiClient.createProject({
              model_id: selectedModel.id,
              mosaic: 'naip.latest',
              name: projectName,
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
          hideGlobalLoading();
          return; // abort inference run
        }

        if (!aoiName) {
          toasts.error('AOI Name must be set before running inference');
          hideGlobalLoading();
          return; // abort inference run
        }

        try {
          await initInstance(
            project.id,
            currentCheckpoint && currentCheckpoint.id,
            currentAoi && currentAoi.id
          );
        } catch (error) {
          logger(error);
          toasts.error('Could not create instance, please try again later.');
        }

        showGlobalLoadingMessage(
          <>
            Running model and loading class predictions...
            <Button
              style={{ display: 'block', margin: '1rem auto 0' }}
              variation='danger-raised-dark'
              onClick={() => {
                abortJob();
              }}
            >
              Abort Process
            </Button>
          </>
        );

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

      try {
        await initInstance(
          currentCheckpoint.project_id,
          currentCheckpoint.id,
          currentAoi.id
        );
      } catch (error) {
        logger(error);
        toasts.error('Could not create instance, please try again later.');
      }

      showGlobalLoadingMessage(
        <>Retraining model and loading predictions...</>
      );

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
              // sometimes there are only points or polygons
              // convert MultiPoint to Feature
              let features = [];
              if (c.points.coordinates.length) {
                c.points = feature(c.points);
                features = features.concat(c.points);
              }
              if (c.polygons.length) {
                // convert Polygons to Feature
                c.polygons = c.polygons.map((p) => {
                  return feature(p);
                });
                features = features.concat(c.polygons);
              }

              return {
                name: c.name,
                color: c.color,
                geometry: featureCollection(features),
              };
            }),
          },
        },
      });
      dispatchCurrentCheckpoint({
        type: checkpointActions.CLEAR_SAMPLES,
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

        dispatchCurrentCheckpoint({
          type: checkpointActions.SET_CHECKPOINT_MODE,
          data: {
            mode: currentAoi ? checkpointModes.RETRAIN : checkpointModes.RUN,
          },
        });

        dispatchCurrentCheckpoint({
          type: checkpointActions.SET_AOI_CHECKED,
          data: {
            checkAoi: true,
          },
        });

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
    loadAoiOnInstance,
  } = useCheckContext(InstanceContext);
  return useMemo(
    () => ({
      instance,
      loadAoiOnInstance,
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

export class WebsocketClient extends ReconnectingWebsocket {
  constructor({
    token,
    applyInstanceStatus,
    dispatchCurrentCheckpoint,
    dispatchMessageQueue,
    fetchCheckpoint,
    dispatchPredictions,
    dispatchAoiPatch,
    onError,
  }) {
    super(config.websocketEndpoint + `?token=${token}`);

    const self = this;
    this.pingCount = 0;

    this.addEventListener('open', () => {
      // Send first ping
      self.send(`ping#${this.pingCount}`);

      // Check for pong messages every interval
      self.pingPong = setInterval(() => {
        if (
          typeof self.lastPong !== 'undefined' &&
          self.lastPong === self.pingCount
        ) {
          // Ping pong went ok, send next
          self.pingCount = self.pingCount + 1;
          self.send(`ping#${self.pingCount}`);
        } else {
          // Pong didn't happened, reconnect
          self.reconnect();
        }
      }, config.websocketPingPongInterval);
    });

    this.addEventListener('close', () => {
      if (typeof self.pingPong !== 'undefined') {
        clearInterval(self.pingPong);
      }
    });

    this.addEventListener('message', (event) => {
      try {
        if (!event.data) {
          logger('Websocket message with no data', event);
          return;
        }

        // Handle pong first as it changes dynamically
        if (event.data && event.data.startsWith('pong')) {
          this.lastPong = parseInt(event.data.split('#')[1]);
          return;
        }

        const { message, data } = JSON.parse(event.data);

        // Parse message
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
            hideGlobalLoading();
            // Request new status update after abort is confirmed
            this.sendMessage({ action: 'model#status' });
            break;
          case 'model#aoi':
            dispatchCurrentCheckpoint({
              type: checkpointActions.SET_CHECKPOINT,
              data: {
                id: data.checkpoint_id,
              },
            });
            dispatchPredictions({
              type: predictionsActions.RECEIVE_AOI_META,
              data: {
                id: data.id,
              },
            });
            break;
          case 'model#aoi#progress':
            showGlobalLoadingMessage('Loading AOI...');
            break;
          case 'model#aoi#complete':
            hideGlobalLoading();
            this.sendMessage({ action: 'model#status' });
            break;

          case 'error':
            logger(event);

            dispatchMessageQueue({ type: messageQueueActionTypes.CLEAR });
            dispatchPredictions({ type: predictionsActions.CLEAR_PREDICTION });

            if (
              data.error.includes('Processing') ||
              data.error.includes('Retrain')
            ) {
              this.sendMessage({ action: 'instance#terminate' });

              toasts.error('Processing error, instance terminated');
              onError();
              hideGlobalLoading();
              break;
            }

            this.sendMessage({ action: 'model#status' });
            hideGlobalLoading();
            break;
          case 'model#checkpoint':
            if (data && (data.id || data.checkpoint)) {
              fetchCheckpoint(data.id || data.checkpoint, null, true);
            }
            applyInstanceStatus({
              gpuMessage: `Loading checkpoint...`,
            });
            this.sendMessage({ action: 'model#status' });
            break;

          case 'model#checkpoint#progress':
            showGlobalLoadingMessage('Loading checkpoint...');
            break;
          case 'model#checkpoint#complete':
            fetchCheckpoint(
              data.id || data.checkpoint
              //checkpointModes.RETRAIN
            );
            hideGlobalLoading();
            this.sendMessage({ action: 'model#status' });
            break;
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
            hideGlobalLoading();
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
            hideGlobalLoading();
            // finish waiting for patch
            this.sendMessage({ action: 'model#status' });
            break;
          default:
            logger('Unknown websocket message:');
            logger(event);
            break;
        }
      } catch (error) {
        logger('Error handling websocket event', { event });
        return;
      }
    });
  }

  sendMessage(message) {
    this.send(JSON.stringify(message));
  }
}
