import { reverseGeocodeLatLng } from '../../utils/reverse-geocode';
import turfCentroid from '@turf/centroid';
import config from '../../config';
import get from 'lodash.get';
import { delay } from '../../utils/utils';
import { WebsocketClient } from './websocket-client';
import logger from '../../utils/logger';
import toasts from '../../components/common/toasts';
import { getMosaicTileUrl } from './helpers';
import { SESSION_MODES } from './constants';
import { round } from '../../utils/format';

export const services = {
  fetchInitialData: async (context) => {
    const {
      apiClient,
      project: { id: projectId },
      currentInstanceType,
    } = context;

    // Initialize project and aois
    let project;
    let aoisList = [];
    let timeframesList = [];
    let checkpointList = [];
    let sharesList = [];
    let currentAoi;
    let currentCheckpoint;
    let currentTimeframe;
    let currentImagerySource;
    let currentMosaic;
    let currentModel;
    let currentShare;
    let currentBatchPrediction;
    let sessionMode = SESSION_MODES.PREDICT;

    // Fetch lists
    const { mosaics: mosaicsList } = await apiClient.get('mosaic');
    const { imagery_sources: imagerySourcesList } = await apiClient.get(
      'imagery'
    );
    const { models: modelsList } = await apiClient.get('model');

    // Fetch api limits and available instances
    const {
      limits: apiLimits,
      availableInstances,
    } = await apiClient.getApiMeta();

    if (availableInstances[currentInstanceType] === 0) {
      toasts.error('No instances available, please try again later.', {
        autoClose: false,
        toastId: 'no-instance-available-error',
      });
      throw new Error('No instances available');
    }

    // If project is not new, fetch project data
    if (projectId !== 'new') {
      project = await apiClient.get(`project/${projectId}`);

      currentModel = modelsList.find((model) => model.id === project.model_id);

      // Fetch project aois
      aoisList = (await apiClient.get(`project/${projectId}/aoi`)).aois;

      // If there are aois, fetch the first one's timeframes and mosaics
      if (aoisList.length > 0) {
        currentAoi = aoisList[0];

        timeframesList = (
          await apiClient.get(
            `project/${projectId}/aoi/${currentAoi.id}/timeframe`
          )
        ).timeframes;

        if (timeframesList.length > 0) {
          currentTimeframe = timeframesList[0];
          currentMosaic = mosaicsList.find(
            (mosaic) => mosaic.id === currentTimeframe.mosaic
          );
          currentImagerySource = imagerySourcesList.find(
            (imagerySource) =>
              imagerySource.id === currentMosaic.imagery_source_id
          );

          // Fetch timeframe tilejson
          try {
            currentTimeframe.tilejson = await apiClient.get(
              `project/${projectId}/aoi/${currentAoi.id}/timeframe/${currentTimeframe.id}/tiles`
            );
          } catch (error) {
            logger('Error fetching tilejson');
            toasts.error('There was an error fetching the prediction layer.');
          }
        }
      }

      // Get project's checkpoints
      checkpointList = (await apiClient.get(`project/${projectId}/checkpoint`))
        .checkpoints;

      if (currentTimeframe) {
        currentCheckpoint = await apiClient.get(
          `project/${projectId}/checkpoint/${currentTimeframe.checkpoint_id}`
        );
      }

      sharesList = (await apiClient.get(`project/${projectId}/share`)).shares;

      currentShare = sharesList.find(
        (share) => share.timeframe?.id === currentTimeframe?.id
      );

      // Get running batch predictions
      const { batch: batchPredictions } = await apiClient.get(
        `project/${projectId}/batch?completed=false&order=desc`
      );

      // If there are running batch predictions, get the first one that is not errored or aborted
      if (batchPredictions.length > 0) {
        currentBatchPrediction = batchPredictions.find(
          ({ error, aborted }) => !error && !aborted
        );
      }
    }

    return {
      apiLimits,
      sessionMode,
      mosaicsList,
      imagerySourcesList,
      modelsList,
      project: project || { id: 'new' },
      aoisList,
      checkpointList,
      timeframesList,
      sharesList,
      currentAoi,
      currentTimeframe,
      currentCheckpoint,
      currentImagerySource,
      currentMosaic: {
        ...currentMosaic,
        tileUrl: getMosaicTileUrl(currentMosaic),
      },
      currentModel,
      currentShare,
      currentBatchPrediction,
      retrainClasses: currentTimeframe?.classes
        ? Object.keys(currentTimeframe.classes).map((key) => ({
            ...currentTimeframe.classes[key],
          }))
        : [],
    };
  },
  geocodeAoi: async (context) => {
    const centroid = turfCentroid(context.currentAoi.geojson);
    const [lat, lng] = centroid.geometry.coordinates;
    const aoiName = await reverseGeocodeLatLng(lng, lat);
    return { aoiName };
  },
  deleteAoi: async (context, event) => {
    const { apiClient } = context;
    const aoiId = event.data?.aoiId || context.currentAoi?.id;

    // Bypass if aoi has no id
    if (!aoiId) return {};

    const { id: projectId } = context.project;
    await apiClient.delete(`/project/${projectId}/aoi/${aoiId}`);

    return {
      aoiId,
    };
  },
  createProject: async (context) => {
    const {
      apiClient,
      project: { name: projectName },
      currentModel,
    } = context;

    const project = await apiClient.post('project', {
      name: projectName,
      model_id: currentModel.id,
    });

    // Update page URL. For the context of this page, it is ok not to use
    // react-router as we are not keeping track of the project ID in the
    // URL at this point.
    window.history.replaceState(null, projectName, `/project/${project.id}`);

    return { project };
  },
  createAoi: async (context) => {
    const { apiClient } = context;
    const { name, geojson } = context.currentAoi;
    const { id: projectId } = context.project;

    const aoi = await apiClient.post(`/project/${projectId}/aoi`, {
      name: name,
      bounds: geojson.geometry || geojson,
    });

    return { aoi };
  },
  fetchAoi: async (context, event) => {
    const { apiClient, mosaicsList } = context;
    const { id: projectId } = context.project;
    const sharesList = context.sharesList || [];
    const aoiId = event.data?.aoiId || context.currentAoi?.id;

    const aoi = await apiClient.get(`project/${projectId}/aoi/${aoiId}`);

    const timeframesList = (
      await apiClient.get(`project/${projectId}/aoi/${aoi.id}/timeframe`)
    ).timeframes;

    let latestTimeframe;
    let latestMosaic;

    if (timeframesList.length > 0) {
      latestTimeframe = timeframesList[0];
      latestMosaic = mosaicsList.find(
        (mosaic) => mosaic.id === latestTimeframe.mosaic
      );

      // Fetch timeframe tilejson
      try {
        latestTimeframe.tilejson = await apiClient.get(
          `project/${projectId}/aoi/${aoi.id}/timeframe/${latestTimeframe.id}/tiles`
        );
      } catch (error) {
        logger('Error fetching tilejson');
        toasts.error('There was an error fetching the prediction layer.');
      }
    }

    return {
      aoi,
      timeframe: latestTimeframe,
      mosaic: latestMosaic,
      share: sharesList.find((s) => s.timeframe?.id === latestTimeframe?.id),
    };
  },
  activateInstance: (context) => async (callback) => {
    try {
      const {
        apiClient,
        currentInstanceType,
        currentTimeframe,
        currentCheckpoint,
      } = context;
      const { id: projectId } = context.project;

      let instance;

      const instanceConfig = {
        type: currentInstanceType,
        ...(currentTimeframe?.id && { timeframe_id: currentTimeframe.id }),
        ...(currentTimeframe?.checkpoint_id && {
          checkpoint_id:
            currentCheckpoint?.id || currentTimeframe.checkpoint_id,
        }),
      };

      // Fetch active instances for this project
      const activeInstances = await apiClient.get(
        `project/${projectId}/instance?status=active&type=${currentInstanceType}`
      );

      // Reuse existing instance if available
      if (activeInstances.total > 0) {
        const { id: instanceId } = activeInstances.instances[0];
        instance = await apiClient.get(
          `project/${projectId}/instance/${instanceId}`
        );
      } else {
        instance = await apiClient.post(
          `project/${projectId}/instance`,
          instanceConfig
        );
      }

      // Confirm instance has running status
      let instanceStatus;
      let creationDuration = 0;
      while (
        !instanceStatus ||
        creationDuration < config.instanceCreationTimeout
      ) {
        // Get instance status
        instanceStatus = await apiClient.get(
          `project/${projectId}/instance/${instance.id}`
        );
        const instancePhase = get(instanceStatus, 'status.phase');

        // Process status
        if (instancePhase === 'Running' && instanceStatus.active) {
          break;
        } else if (instancePhase === 'Failed') {
          callback({
            type: 'Instance activation has failed',
          });
        }

        // Update timer
        await delay(config.instanceCreationCheckInterval);
        creationDuration += config.instanceCreationCheckInterval;

        // Check timeout
        if (creationDuration >= config.instanceCreationTimeout) {
          callback({
            type: 'Instance activation has failed',
          });
        }
      }

      const { token } = instance;
      const websocket = new WebsocketClient(token);

      callback({
        type: 'Instance is running',
      });

      websocket.addEventListener('message', (e) => {
        const { message, data } = JSON.parse(e.data);

        switch (message) {
          case 'error':
            callback({
              type: 'Instance activation has failed',
              data: { error: data.error },
            });
            break;
          case 'info#connected':
          case 'model#checkpoint#progress':
          case 'model#timeframe#progress':
          case 'model#timeframe#complete':
            // After connection, request status
            websocket.sendMessage({
              action: 'model#status',
            });
            break;
          case 'model#checkpoint#complete':
            apiClient
              .get(`project/${projectId}/checkpoint/${data.checkpoint}`)
              .then((checkpoint) => {
                callback({
                  type: 'Checkpoint was applied',
                  data: { checkpoint },
                });
                websocket.sendMessage({
                  action: 'model#status',
                });
              })
              .catch((error) => {
                callback({
                  type: 'Instance activation has failed',
                  data: { error },
                });
              });
            break;

          case 'info#disconnected':
            // After connection, send a message to the server to request
            // model status
            websocket.sendMessage({
              action: 'model#status',
            });
            break;
          case 'model#status':
            if (data.processing) {
              // Instance is processing a different timeframe, abort it
              if (instanceConfig.timeframe_id !== data.timeframe) {
                websocket.sendMessage({
                  action: 'model#abort',
                });
              }
            } else {
              // If a timeframe is specified and it is different from the
              // current timeframe, request it
              if (
                instanceConfig.timeframe_id &&
                instanceConfig.timeframe_id !== data.timeframe
              ) {
                websocket.sendMessage({
                  action: 'model#timeframe',
                  data: {
                    id: instanceConfig.timeframe_id,
                  },
                });
              } else if (
                instanceConfig.checkpoint_id &&
                instanceConfig.checkpoint_id !== data.checkpoint
              ) {
                websocket.sendMessage({
                  action: 'model#checkpoint',
                  data: {
                    id: instanceConfig.checkpoint_id,
                  },
                });
              } else {
                // Instance has the same timeframe and is not processing, it should be ready
                callback({
                  type: 'Instance is ready',
                  data: { instance },
                });
                websocket.close();
              }
            }
            break;
          default:
            logger('Unhandled websocket message', message, data);
            break;
        }
      });
    } catch (error) {
      callback({
        type: 'Instance activation has failed',
        data: { error },
      });
    }
  },
  runPrediction: (context) => (callback, onReceive) => {
    const { apiClient, project, currentAoi } = context;
    const { token } = context.currentInstance;
    const websocket = new WebsocketClient(token);

    callback({
      type: 'Created instance websocket',
      data: { instanceWebsocket: websocket },
    });

    onReceive((event) => {
      if (event.type === 'Abort button pressed') {
        websocket.sendMessage({
          action: 'model#abort',
        });
        // Ideally we should thrown an error here to make the service
        // execute the 'onError' event, but XState doesn't support errors
        // thrown inside onReceive. A fix is planned for XState v5, more
        // here: https://github.com/statelyai/xstate/issues/3279
        callback({ type: 'Prediction run was aborted' });
      }
    });

    websocket.addEventListener('message', (e) => {
      const { message, data } = JSON.parse(e.data);

      switch (message) {
        case 'error':
          callback({
            type: 'Prediction has failed',
            data: { error: data.error },
          });
          break;
        case 'info#connected':
          // After connection, send a message to the server to request
          // model status
          websocket.sendMessage({
            action: 'model#status',
          });
          break;
        case 'model#status':
          // If not already running or aborting, request prediction
          if (!data.processing && !data.is_aborting) {
            websocket.sendMessage({
              action: 'model#prediction',
              data: {
                aoi_id: context.currentAoi.id,
                mosaic: context.currentMosaic.id,
              },
            });
          }
          break;
        case 'model#checkpoint':
          callback({
            type: 'Received checkpoint id',
          });

          // Fetch full checkpoint data
          apiClient.get(`project/${project.id}/checkpoint/${data.id}`).then(
            (checkpoint) => {
              callback({
                type: 'Received checkpoint',
                data: { checkpoint },
              });
            },
            (error) => {
              callback({
                type: 'Prediction has failed',
                data: { error },
              });
            }
          );

          // Update checkpoint list
          apiClient
            .get(`project/${project.id}/checkpoint`)
            .then(({ checkpoints: checkpointList }) => {
              callback({
                type: 'Received checkpoint list',
                data: { checkpointList },
              });
            });

          websocket.sendMessage({
            action: 'model#status',
          });
          break;
        case 'model#timeframe':
          callback({
            type: 'Received timeframe id',
          });

          // Fetch full timeframe data
          apiClient
            .get(
              `project/${project.id}/aoi/${currentAoi.id}/timeframe/${data.id}`
            )
            .then((timeframe) => {
              callback({
                type: 'Received timeframe',
                data: { timeframe },
              });
            });
          break;
        case 'model#prediction':
          callback({
            type: 'Received prediction progress',
            data: { prediction: data },
          });
          break;
        case 'model#prediction#complete':
          apiClient
            .get(
              `project/${project.id}/aoi/${currentAoi.id}/timeframe/${data.timeframe}/tiles`
            )
            .then((tilejson) => {
              callback({
                type: 'Prediction run was completed',
                data: { tilejson },
              });
            })
            .catch((error) => {
              callback({
                type: 'Prediction has failed',
                data: { error },
              });
            });

          break;

        default:
          logger('Unhandled websocket message', message, data);
          break;
      }
    });
    return () => websocket.close();
  },
  runRetrain: (context) => (callback, onReceive) => {
    const {
      apiClient,
      project,
      retrainClasses,
      retrainSamples,
      currentTimeframe,
      currentAoi,
    } = context;

    const retrainPayload = {
      name: context.currentAoi.name,
      classes: retrainClasses.map((c) => ({
        ...c,
        geometry: {
          type: 'FeatureCollection',
          features: retrainSamples.filter((s) => s.properties.class === c.name),
        },
      })),
    };

    const { token } = context.currentInstance;
    const websocket = new WebsocketClient(token);

    /**
     * Ping pong logic
     */
    let pingCount = 0;
    let lastPintCount;
    let pingPongInterval;
    websocket.addEventListener('open', () => {
      // Send first ping
      websocket.send(`ping#${pingCount}`);

      // Check for pong messages every interval
      pingPongInterval = setInterval(() => {
        if (lastPintCount === pingCount) {
          pingCount = pingCount + 1;
          websocket.send(`ping#${pingCount}`);
        } else {
          // Pong didn't happened, reconnect
          websocket.reconnect();
        }
      }, config.websocketPingPongInterval);
    });
    websocket.addEventListener('close', () => {
      if (pingPongInterval) {
        clearInterval(pingPongInterval);
      }
    });

    /**
     * Handle events received from the machine
     */
    onReceive((event) => {
      if (event.type === 'Abort retrain') {
        websocket.sendMessage({
          action: 'instance#terminate',
        });
        // Ideally we should thrown an error here to make the service
        // execute the 'onError' event, but XState doesn't support errors
        // thrown inside onReceive. A fix is planned for XState v5, more
        // here: https://github.com/statelyai/xstate/issues/3279
        callback({ type: 'Retrain was aborted' });
      }
    });

    /**
     * Handle events received from the websocket
     */
    let isStarted = false;
    websocket.addEventListener('message', (e) => {
      // Update ping count on pong
      if (e.data.startsWith('pong#')) {
        lastPintCount = parseInt(e.data.split('#')[1], 10);
        return;
      }

      const { message, data } = JSON.parse(e.data);

      switch (message) {
        case 'error':
          // Send abort message to errored instance
          websocket.sendMessage({
            action: 'model#abort',
          });

          // Send error message to the machine
          callback({
            type: 'Retrain has errored',
            data: { error: data.error },
          });
          break;
        case 'info#connected':
          // After connection, send a message to the server to request
          // model status
          websocket.sendMessage({
            action: 'model#status',
          });
          break;
        case 'info#disconnected':
          // After connection, send a message to the server to request
          // model status
          websocket.sendMessage({
            action: 'model#status',
          });
          break;
        case 'model#status':
          if (!isStarted && data.processing) {
            // Send terminate message to stop orphaned retrain
            websocket.sendMessage({
              action: 'instance#terminate',
            });
            callback({
              type: 'Retrain has errored',
              data: { error: data.error },
            });
          } else if (!isStarted && !data.processing) {
            isStarted = true;
            if (data.timeframe !== currentTimeframe.id) {
              websocket.sendMessage({
                action: 'model#timeframe',
                data: {
                  id: context.currentTimeframe.id,
                },
              });
            } else {
              websocket.sendMessage({
                action: 'model#retrain',
                data: retrainPayload,
              });
            }
          }
          break;
        case 'model#checkpoint':
          callback({
            type: 'Received checkpoint id',
          });

          // Fetch full checkpoint data
          apiClient
            .get(`project/${project.id}/checkpoint/${data.id}`)
            .then((checkpoint) => {
              callback({
                type: 'Received checkpoint',
                data: { checkpoint },
              });
            });

          // Update checkpoint list
          apiClient
            .get(`project/${project.id}/checkpoint`)
            .then(({ checkpoints: checkpointList }) => {
              callback({
                type: 'Received checkpoint list',
                data: { checkpointList },
              });
            });

          websocket.sendMessage({
            action: 'model#status',
          });
          break;
        case 'model#timeframe':
          callback({
            type: 'Received timeframe id',
          });

          // Fetch full timeframe data
          apiClient
            .get(
              `project/${project.id}/aoi/${currentAoi.id}/timeframe/${data.id}`
            )
            .then(
              (timeframe) => {
                callback({
                  type: 'Received timeframe',
                  data: { timeframe },
                });
              },
              (error) => {
                callback({
                  type: 'Prediction has failed',
                  data: { error },
                });
              }
            );
          break;
        case 'model#timeframe#progress':
          callback({
            type: 'Received timeframe progress',
            data: {
              globalLoading: {
                disabled: false,
                message: `Loading timeframe progress: ${round(
                  (data.processed / data.total) * 100,
                  0
                )}%`,
              },
            },
          });
          websocket.sendMessage({
            action: 'model#status',
          });
          break;
        case 'model#timeframe#complete':
          callback({
            type: 'Timeframe was applied to the instance',
            data: {
              globalLoading: {
                disabled: false,
                message: `Timeframe was loaded`,
              },
            },
          });
          websocket.sendMessage({
            action: 'model#status',
          });
          break;
        case 'model#retrain#progress': {
          callback({
            type: 'Received retrain#progress',
            data: {
              globalLoading: {
                disabled: false,
                message: `Retrain progress: ${round(
                  (data.processed / data.total) * 100,
                  0
                )}%`,
              },
            },
          });
          break;
        }
        case 'model#retrain#complete':
          callback({
            type: 'Received retrain#progress',
            data: {
              globalLoading: {
                disabled: false,
                message: `Retrain was finished, awaiting predictions...`,
              },
            },
          });
          break;
        case 'model#prediction':
          callback({
            type: 'Received prediction progress',
            data: {
              prediction: data,
              globalLoading: {
                disabled: false,
                message: `Prediction progress: ${round(
                  (data.processed / data.total) * 100,
                  0
                )}%`,
              },
            },
          });
          break;
        case 'model#prediction#complete':
          apiClient
            .get(
              `project/${project.id}/aoi/${currentAoi.id}/timeframe/${data.timeframe}/tiles`
            )
            .then((tilejson) => {
              callback({
                type: 'Retrain run was completed',
                data: { tilejson },
              });
            })
            .catch((error) => {
              callback({
                type: 'Retrain has errored',
                data: { error },
              });
            });

          break;

        default:
          if (data?.error) {
            callback({
              type: 'Retrain has errored',
              data: { error: data.error },
            });
          } else {
            logger('Unhandled websocket message', message, data);
          }
          break;
      }
    });
    return () => websocket.close();
  },
  createShare: async (context) => {
    const { apiClient } = context;
    const projectId = context.project?.id;
    const aoiId = context.currentAoi?.id;
    const timeframeId = context.currentTimeframe?.id;
    const sharesList = context.sharesList || [];

    const share = await apiClient.post(
      `/project/${projectId}/aoi/${aoiId}/timeframe/${timeframeId}/share`
    );

    return { share, sharesList: sharesList.concat(share) };
  },
  requestBatchPrediction: async (context) => {
    const { apiClient } = context;
    const projectId = context.project?.id;
    const aoi = context.currentAoi?.id;
    const mosaic = context.currentMosaic?.id;

    const batchPrediction = await apiClient.post(
      `/project/${projectId}/batch`,
      {
        mosaic,
        aoi,
      }
    );

    return { batchPrediction };
  },
  applyCheckpoint: (context) => (callback, onReceive) => {
    const { currentCheckpoint } = context;

    const { token } = context.currentInstance;
    const websocket = new WebsocketClient(token);

    /**
     * Ping pong logic
     */
    let pingCount = 0;
    let lastPintCount;
    let pingPongInterval;
    websocket.addEventListener('open', () => {
      // Send first ping
      websocket.send(`ping#${pingCount}`);

      // Check for pong messages every interval
      pingPongInterval = setInterval(() => {
        if (lastPintCount === pingCount) {
          pingCount = pingCount + 1;
          websocket.send(`ping#${pingCount}`);
        } else {
          // Pong didn't happened, reconnect
          websocket.reconnect();
        }
      }, config.websocketPingPongInterval);
    });
    websocket.addEventListener('close', () => {
      if (pingPongInterval) {
        clearInterval(pingPongInterval);
      }
    });

    /**
     * Handle events received from the machine
     */
    onReceive((event) => {
      if (event.type === 'Abort retrain') {
        websocket.sendMessage({
          action: 'model#abort',
        });
        // Ideally we should thrown an error here to make the service
        // execute the 'onError' event, but XState doesn't support errors
        // thrown inside onReceive. A fix is planned for XState v5, more
        // here: https://github.com/statelyai/xstate/issues/3279
        callback({ type: 'Retrain was aborted' });
      }
    });

    /**
     * Handle events received from the websocket
     */
    let isStarted = false;
    websocket.addEventListener('message', (e) => {
      // Update ping count on pong
      if (e.data.startsWith('pong#')) {
        lastPintCount = parseInt(e.data.split('#')[1], 10);
        return;
      }

      const { message, data } = JSON.parse(e.data);

      switch (message) {
        case 'error':
          // Send abort message to errored instance
          websocket.sendMessage({
            action: 'model#abort',
          });

          // Send error message to the machine
          callback({
            type: 'Instance has errored',
            data: { error: data.error },
          });
          break;
        case 'info#connected':
        case 'info#disconnected':
        case 'model#checkpoint#progress':
          // After connection, send a message to the server to request
          // model status
          websocket.sendMessage({
            action: 'model#status',
          });
          break;
        case 'model#status':
          if (!isStarted && data.processing) {
            // Send abort message to stop previous process
            websocket.sendMessage({
              action: 'instance#abort',
            });
            callback({
              type: 'Instance has errored',
              data: { error: data.error },
            });
          } else if (!isStarted && !data.processing) {
            isStarted = true;
            if (data.checkpoint !== currentCheckpoint.id) {
              websocket.sendMessage({
                action: 'model#checkpoint',
                data: {
                  id: context.currentCheckpoint.id,
                },
              });
            }
          }
          break;
        case 'model#checkpoint#complete':
          callback({
            type: 'Checkpoint was applied',
            data,
          });
          break;

        default:
          if (data?.error) {
            callback({
              type: 'Retrain has errored',
              data: { error: data.error },
            });
          } else {
            logger('Unhandled websocket message', message, data);
          }
          break;
      }
    });
    return () => websocket.close();
  },
};
