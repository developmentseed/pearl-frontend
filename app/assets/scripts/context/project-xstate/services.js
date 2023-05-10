import { reverseGeocodeLatLng } from '../../utils/reverse-geocode';
import turfCentroid from '@turf/centroid';
import config from '../../config';
import get from 'lodash.get';
import { delay } from '../../utils/utils';
import { WebsocketClient } from './websocket-client';
import logger from '../../utils/logger';
import toasts from '../../components/common/toasts';
import { getMosaicTileUrl } from './helpers';

export const services = {
  fetchInitialData: async (context) => {
    const {
      apiClient,
      project: { id: projectId },
    } = context;

    // Initialize project and aois
    let project;
    let aoisList = [];
    let timeframesList = [];
    let checkpointList = [];
    let sharesList = [];
    let currentAoi;
    let currentTimeframe;
    let currentImagerySource;
    let currentMosaic;
    let currentModel;
    let currentShare;
    let currentBatchPrediction;

    // Fetch lists
    const { mosaics: mosaicsList } = await apiClient.get('mosaic');
    const { imagery_sources: imagerySourcesList } = await apiClient.get(
      'imagery'
    );
    const { models: modelsList } = await apiClient.get('model');

    // Fetch api limits
    const { limits: apiLimits } = await apiClient.get('');

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

      sharesList = (await apiClient.get(`project/${projectId}/share`)).shares;

      currentShare = sharesList.find(
        (share) => share.mosaic?.id === currentMosaic?.id
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
      currentImagerySource,
      currentMosaic: {
        ...currentMosaic,
        tileUrl: getMosaicTileUrl(currentMosaic),
      },
      currentModel,
      currentShare,
      currentBatchPrediction,
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
      bounds: geojson.geometry,
    });

    return { aoi };
  },
  fetchAoi: async (context, event) => {
    const { apiClient, mosaicsList } = context;
    const { id: projectId } = context.project;
    const aoiId = event.data?.aoiId || context.currentAoi?.id;

    const aoi = await apiClient.get(`/project/${projectId}/aoi/${aoiId}`);

    const timeframesList = (
      await apiClient.get(`/project/${projectId}/aoi/${aoi.id}/timeframe`)
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
    };
  },
  requestInstance: async (context) => {
    const { apiClient } = context;
    const { id: projectId } = context.project;

    let instance;

    // Fetch active instances for this project
    const activeInstances = await apiClient.get(
      `/project/${projectId}/instance/?status=active`
    );

    // Reuse existing instance if available
    if (activeInstances.total > 0) {
      const { id: instanceId } = activeInstances.instances[0];
      instance = await apiClient.get(
        `/project/${projectId}/instance/${instanceId}`
      );
    } else {
      instance = await apiClient.post(`/project/${projectId}/instance`);
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
      if (instancePhase === 'Running') {
        break;
      } else if (instancePhase === 'Failed') {
        throw new Error('Instance creation failed');
      }

      // Update timer
      await delay(config.instanceCreationCheckInterval);
      creationDuration += config.instanceCreationCheckInterval;

      // Check timeout
      if (creationDuration >= config.instanceCreationTimeout) {
        throw new Error('Instance creation timeout');
      }
    }

    return { instance };
  },
  runPrediction: (context) => (callback, onReceive) => {
    const { token } = context.currentInstance;
    const websocket = new WebsocketClient(token);

    onReceive((event) => {
      if (event.type === 'Abort run') {
        websocket.sendMessage({
          action: 'instance#terminate',
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
            type: 'Received checkpoint',
            data: { currentCheckpoint: data },
          });
          websocket.sendMessage({
            action: 'model#status',
          });
          break;
        case 'model#timeframe':
          callback({
            type: 'Received timeframe',
            data: { timeframe: data },
          });
          break;
        case 'model#prediction':
          callback({
            type: 'Received prediction progress',
            data,
          });
          break;
        case 'model#prediction#complete':
          callback({
            type: 'Prediction run was completed',
            data,
          });
          break;

        default:
          logger('Unhandled websocket message', message, data);
          break;
      }
    });
    return () => websocket.close();
  },
  createShareUrl: async (context) => {
    const { apiClient } = context;
    const projectId = context.project?.id;
    const aoiId = context.currentAoi?.id;
    const timeframeId = context.currentTimeframe?.id;

    const shareUrl = await apiClient.post(
      `/project/${projectId}/aoi/${aoiId}/timeframe/${timeframeId}/share`
    );

    return { shareUrl };
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
};
