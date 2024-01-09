import get from 'lodash.get';
import set from 'lodash.set';
import { assign } from 'xstate';
import L from 'leaflet';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfArea from '@turf/area';
import toasts from '../../components/common/toasts';
import { getMosaicTileUrl } from './helpers';
import history from '../../history';
import { RETRAIN_MAP_MODES, SESSION_MODES } from './constants';

export const actions = {
  setInitialContext: assign((context, event) => {
    const { projectId, isAuthenticated, apiClient } = event.data;
    return {
      project: { id: projectId },
      isAuthenticated,
      apiClient,
      globalLoading: {
        disabled: false,
      },
    };
  }),
  setInitialData: assign((context, event) => ({ ...event.data })),
  setProjectName: assign((context, event) => {
    const { projectName } = event.data;
    return {
      project: {
        ...context.project,
        name: projectName,
      },
    };
  }),
  setCurrentAoiName: assign((context, event) => {
    const { aoiName } = event.data;
    const { currentAoi } = context;
    return {
      currentAoi: {
        ...currentAoi,
        name: aoiName,
      },
    };
  }),
  setCurrentImagerySource: assign((context, event) => {
    const { currentImagerySource, currentModel, currentMosaic } = context;
    const { imagerySource } = event.data;

    // Bypass if imagery source is already selected and hasn't changed
    if (
      currentImagerySource &&
      imagerySource &&
      currentImagerySource.id === imagerySource.id
    ) {
      return {};
    }

    const nextContext = {
      currentImagerySource: imagerySource,
    };

    // Reset model if imagery source is not applicable
    if (currentModel && currentModel.imagery_source_id !== imagerySource.id) {
      nextContext.currentModel = null;
    }

    // Reset mosaic if imagery source is not applicable
    if (currentMosaic && currentMosaic.imagery_source_id !== imagerySource.id) {
      nextContext.currentMosaic = null;
    }

    // Apply new context
    return {
      ...nextContext,
    };
  }),
  setCurrentMosaic: assign((context, event) => {
    const { mosaic } = event.data;

    return {
      currentMosaic: { ...mosaic, tileUrl: getMosaicTileUrl(mosaic) },
    };
  }),
  setCurrentModel: assign((context, event) => {
    const { currentModel, currentImagerySource } = context;
    const { model } = event.data;

    // Bypass if model is already selected and hasn't changed
    if (currentModel && currentModel.id === model.id) {
      return {};
    }

    // Reset imagery source and mosaic if model does not support to them
    const modelImagerySourceId = get(event, 'data.model.imagery_source_id');
    if (
      currentImagerySource &&
      currentImagerySource.id !== modelImagerySourceId
    ) {
      return {
        currentImagerySource: null,
        currentMosaic: null,
        currentModel: event.data.model,
      };
    }

    // If all conditions are met, apply new model
    return {
      currentModel: event.data.model,
    };
  }),
  setCurrentAoi: assign((context, event) => ({
    currentAoi: { ...event.data.aoi },
  })),
  showFirstAoiActionButtons: assign(() => ({
    aoiActionButtons: {
      uploadAoi: true,
      drawFirstAoi: true,
    },
  })),
  showExistingAoisActionButtons: assign(() => ({
    aoiActionButtons: {
      uploadAoi: true,
      addNewAoi: true,
      deleteAoi: true,
    },
  })),
  clearCurrentAoi: assign((context) => {
    const { currentAoiShape } = context;

    currentAoiShape?.remove();

    return {
      currentAoi: null,
      currentAoiShape: null,
      currentPrediction: null,
      currentMosaic: null,
      currentShare: null,
      currentTimeframe: null,
    };
  }),
  prependAoisList: assign((context, event) => {
    const { aoisList } = context;
    const { aoi } = event.data;
    return {
      aoisList: [aoi, ...aoisList],
    };
  }),
  loadLatestAoi: assign((context) => {
    const { aoisList, mapRef } = context;
    const latestAoi = aoisList[aoisList.length - 1];

    // Remove the current AOI shape from the map, if it exists
    context.currentAoiShape?.remove();

    // Add the latest AOI to the map, if available
    const aoiShape = latestAoi?.bounds
      ? mapRef.setAoiShapeFromGeojson(latestAoi.bounds)
      : null;

    return {
      currentAoi: latestAoi ? { ...latestAoi } : null,
      currentAoiShape: aoiShape,
      aoiActionButtons: {
        addNewAoi: true,
        uploadAoi: true,
      },
    };
  }),
  applyExistingAoi: assign((context, event) => {
    const { mapRef, aoisList } = context;
    const { aoiId } = event.data;

    const selectedAoi = aoisList.find((aoi) => aoi.id === aoiId);

    if (!selectedAoi) {
      throw new Error(`AOI with id ${aoiId} not found`);
    }

    context.currentAoiShape?.remove();

    const aoiShape = mapRef.setAoiShapeFromGeojson(selectedAoi.bounds);

    return {
      currentAoi: { ...selectedAoi },
      currentAoiShape: aoiShape,
      aoiActionButtons: {
        addNewAoi: true,
        uploadAoi: true,
      },
    };
  }),
  updateAoiLayer: assign((context) => {
    const { mapRef, currentAoi, currentAoiShape } = context;

    currentAoiShape?.remove();

    const geojson = currentAoi.geojson || currentAoi.bounds;

    let aoiShape;
    if (geojson) {
      aoiShape = mapRef.setAoiShapeFromGeojson(geojson);
    }

    return {
      currentAoi: {
        ...currentAoi,
      },
      currentAoiShape: aoiShape,
    };
  }),
  onAoiDeletedSuccess: assign((context, event) => {
    const { aoisList } = context;
    const { aoiId } = event.data;

    return {
      aoisList: aoisList.filter((aoi) => aoi.id !== aoiId),
    };
  }),
  setCurrentInstance: assign((context, event) => ({
    currentInstance: event.data.instance,
  })),
  setCurrentInstanceType: assign((context, event) => ({
    currentInstanceType: event.data.instanceType,
  })),
  setCurrentInstanceWebsocket: assign((context, event) => ({
    currentInstanceWebsocket: event.data.instanceWebsocket,
  })),
  setCurrentInstanceStatus: assign((context, event) => ({
    currentInstance: {
      ...context.currentInstance,
      ...event.data,
    },
  })),
  setCurrentCheckpoint: assign((context, event) => ({
    currentCheckpoint: event.data.checkpoint,
  })),
  setCurrentTimeframe: assign((context, event) => {
    const { currentCheckpoint } = context;
    const newTimeframe = event.data.timeframe;

    const retrainClasses =
      newTimeframe?.classes || currentCheckpoint?.classes || [];

    // Apply new timeframe and (re-)initialize retrain classes
    return {
      currentTimeframe: { ...newTimeframe },
      retrainClasses,
    };
  }),
  setTimeframesList: assign((context, event) => ({
    timeframesList: event.data.timeframesList,
  })),

  setCurrentTimeframeTilejson: assign((context, event) => ({
    currentTimeframe: {
      ...context.currentTimeframe,
      tilejson: event.data.tilejson,
    },
  })),
  setCurrentBatchPrediction: assign((context, event) => ({
    currentBatchPrediction: event.data.batchPrediction,
  })),
  setSessionMode: assign((context, event) => ({
    sessionMode: event.data.sessionMode,
  })),
  refreshSessionStatusMessage: assign((context) => {
    const { sessionMode } = context;
    let sessionStatusMessage;

    const isFirstAoi = context.aoisList.length === 0;

    if (!get(context, 'project.name')) {
      sessionStatusMessage = 'Set Project Name';
    } else if (!context.currentAoi) {
      sessionStatusMessage = 'Select AOI';
    } else if (!context.currentImagerySource) {
      sessionStatusMessage = 'Select Imagery Source';
    } else if (!context.currentMosaic) {
      sessionStatusMessage = 'Select Mosaic';
    } else if (!context.currentModel) {
      sessionStatusMessage = 'Select Model';
    } else if (isFirstAoi) {
      sessionStatusMessage = 'Ready for prediction run';
    } else if (sessionMode === SESSION_MODES.RETRAIN) {
      sessionStatusMessage = 'Ready for retrain run';
    } else {
      // Keep existing message if none of the above conditions are met
      sessionStatusMessage = context.sessionStatusMessage;
    }

    return {
      sessionStatusMessage,
    };
  }),
  updateCurrentPrediction: assign((context, { data: { prediction } }) => {
    let predictions = get(context, 'currentPrediction.predictions', []);

    // Add prediction to the list if bounds exists
    if (prediction.bounds) {
      const [minX, minY, maxX, maxY] = prediction.bounds;

      // Build prediction object
      predictions = predictions.concat({
        key: predictions.length + 1,
        image: `data:image/png;base64,${prediction.image}`,
        bounds: [
          [minY, minX],
          [maxY, maxX],
        ],
      });
    }

    return {
      sessionStatusMessage: `Received image ${prediction.processed} of ${prediction.total}...`,
      currentPrediction: {
        ...context.currentPrediction,
        processed: prediction.processed,
        total: prediction.total,
        predictions,
      },
    };
  }),
  clearCurrentPrediction: assign(() => ({
    currentPrediction: null,
  })),
  setMapRef: assign((context, event) => ({
    mapRef: event.data.mapRef,
  })),
  updateRetrainMapMode: assign((context, event) => {
    const {
      retrainClasses,
      mapRef: { freehandDraw, polygonDraw },
    } = context;

    const retrainMapMode =
      event?.data?.retrainMapMode || context.retrainMapMode;

    const retrainActiveClass =
      event?.data?.retrainActiveClass || context.retrainActiveClass;

    // Ensure that the freehand draw layers are set
    freehandDraw.setLayers(retrainClasses);

    // Toggle freehand draw modes
    if (
      retrainMapMode !== RETRAIN_MAP_MODES.ADD_FREEHAND &&
      retrainMapMode !== RETRAIN_MAP_MODES.DELETE_SAMPLES
    ) {
      freehandDraw.disable();
    } else if (retrainMapMode === RETRAIN_MAP_MODES.ADD_FREEHAND) {
      freehandDraw.enableAdd(retrainActiveClass);
    } else if (retrainMapMode === RETRAIN_MAP_MODES.DELETE_SAMPLES) {
      freehandDraw.enableSubtract(retrainActiveClass);
    }

    // Toggle polygon draw
    if (retrainMapMode !== RETRAIN_MAP_MODES.ADD_POLYGON) {
      polygonDraw.disable();
    } else {
      polygonDraw.enable();
    }

    return {
      retrainMapMode,
      retrainActiveClass,
    };
  }),

  addRetrainSample: assign((context, event) => {
    const { retrainSamples, retrainActiveClass } = context;

    // Create a shallow copy of the sample
    const sample = {
      ...event.data.sample,
    };

    // Apply current retrain class to the sample
    set(sample, 'properties.class', retrainActiveClass);

    // Append sample to the list
    const newRetrainSamples = retrainSamples.concat(sample);

    return {
      retrainSamples: newRetrainSamples,
    };
  }),
  updateRetrainClassSamples: assign((context, event) => {
    const { retrainClass, samples } = event.data;
    const { retrainSamples } = context;

    // Because of the way the freehand draw layer works, we need samples in
    // batches
    return {
      retrainSamples: retrainSamples
        .filter((s) => s.properties.class !== retrainClass)
        .concat(samples),
    };
  }),
  clearRetrainSamples: assign((context) => {
    context.mapRef.freehandDraw.clearLayers();
    return {
      retrainSamples: [],
    };
  }),
  setProject: assign((context, event) => ({
    project: event.data.project,
  })),
  initializeNewProject: assign(() => {
    return {
      sessionStatusMessage: 'Set Project Name',
    };
  }),
  enablePredictionRun: assign(() => ({
    sessionMode: SESSION_MODES.PREDICT,
    sessionStatusMessage: 'Ready for prediction run',
  })),
  enterActivatingInstance: assign(() => ({
    globalLoading: {
      disabled: false,
      message: 'Activating instance...',
    },
  })),
  displayInstanceActivationError: assign(() => {
    toasts.error(
      'Could not start instance at the moment, please try again later.'
    );

    return {
      globalLoading: {
        disabled: true,
      },
    };
  }),

  enterPredictionRun: assign(() => ({
    sessionStatusMessage: 'Running prediction',
    globalLoading: {
      disabled: false,
      message: 'Running prediction',
    },
  })),
  enterRequestingInstance: assign(() => ({
    globalLoading: {
      disabled: false,
      message: 'Awaiting instance...',
    },
  })),
  enterRetrainMode: assign(() => ({
    sessionMode: SESSION_MODES.RETRAIN,
    sessionStatusMessage: 'Ready for retrain run',
  })),
  enterApplyCheckpoint: assign(() => ({
    sessionStatusMessage: 'Applying checkpoint',
    globalLoading: {
      disabled: false,
    },
  })),
  exitRetrainMode: assign((context) => {
    const { freehandDraw, polygonDraw } = context.mapRef;

    // Disable all draw modes
    freehandDraw.clearLayers();
    freehandDraw.disable();
    polygonDraw.disable();

    return {
      retrainSamples: [],
      retrainMapMode: RETRAIN_MAP_MODES.BROWSE,
    };
  }),
  enterRetrainRun: assign(() => ({
    sessionStatusMessage: 'Running retrain',
    globalLoading: {
      disabled: false,
      abortButton: true,
    },
  })),
  exitRetrainRun: assign(() => ({
    globalLoading: {
      disabled: true,
    },
  })),
  resetMapEventHandlers: assign(() => {
    return {
      mapEventHandlers: {
        dragging: true,
      },
    };
  }),
  setupNewRectangleAoiDraw: assign((context) => {
    const { currentAoiShape } = context;

    currentAoiShape?.remove();

    if (context.rectangleAoi?.shape) {
      context.rectangleAoi.shape.remove();
    }

    return {
      currentAoi: null,
      currentTimeframe: null,
      currentPrediction: null,
      rectangleAoi: null,
      aoiStatusMessage: 'Drag on map to select area',
      aoiActionButtons: {
        cancelAoiDraw: true,
      },
      mapEventHandlers: {
        dragging: false,
        mousedown: true,
        mouseup: false,
        mousemove: false,
      },
    };
  }),
  startNewRectangleAoiDraw: assign((context, event) => {
    return {
      aoiStatusMessage: 'New AOI',
      mapEventHandlers: {
        dragging: false,
        mousedown: false,
        mouseup: true,
        mousemove: true,
      },
      rectangleAoi: {
        bounds: [event.data.latLng],
      },
    };
  }),
  updateRectangleAoiDraw: assign((context, event) => {
    const boundStart = context.rectangleAoi.bounds[0];
    const boundEnd = event.data.latLng;
    const bounds = [boundStart, boundEnd];

    // Update map layer
    let shape = context.rectangleAoi.shape;
    if (!shape) {
      shape = L.rectangle(bounds, {
        interactive: false,
      }).addTo(context.mapRef);
    } else {
      shape.setBounds(bounds);
    }

    // Calculate area
    const aoiGeojson = turfBboxPolygon(
      [boundStart.slice().reverse(), boundEnd.slice().reverse()].flat()
    );
    return {
      currentAoi: {
        area: turfArea(aoiGeojson),
        geojson: aoiGeojson,
      },
      mapEventHandlers: {
        dragging: false,
        mousedown: false,
        mouseup: true,
        mousemove: true,
      },
      rectangleAoi: {
        bounds,
        shape,
      },
    };
  }),
  endNewRectangleAoiDraw: assign(() => {
    return {
      mapEventHandlers: {
        dragging: false,
        mousedown: false,
        mouseup: true,
        mousemove: true,
      },
    };
  }),
  exitRectangleAoiDrawMode: assign((context) => {
    const { rectangleAoi } = context;

    if (rectangleAoi?.shape) {
      rectangleAoi.shape.remove();
    }

    const isFirstAoi = context.aoisList.length === 0;

    return {
      rectangleAoi: null,
      aoiActionButtons: {
        uploadAoi: true,
        addNewAoi: !isFirstAoi,
        deleteAoi: true,
      },
      mapEventHandlers: {
        dragging: true,
        mousedown: false,
        mouseup: false,
        mousemove: false,
      },
    };
  }),
  displayAoiAreaModalDialog: assign(() => ({
    aoiAreaModalDialogRevealed: true,
  })),
  closeAoiAreaModalDialog: assign(() => ({
    aoiAreaModalDialogRevealed: false,
  })),
  toggleUploadAoiModal: assign((context) => ({
    uploadAoiModal: {
      revealed: !context.uploadAoiModal.revealed,
    },
  })),
  initializeAoiList: assign(() => {
    return {
      sessionStatusMessage: 'Set AOI',
      aoiStatusMessage: 'Draw area on map or upload an AOI geometry',
    };
  }),
  handleInstanceCreationError: assign(() => {
    toasts.error(
      'Could not start instance at the moment, please try again later.'
    );
    return {
      globalLoading: {
        disabled: true,
      },
    };
  }),
  handleRetrainError: assign(() => {
    toasts.error('An unexpected error occurred, please try again later.');
    return {
      globalLoading: {
        disabled: true,
      },
    };
  }),
  setGlobalLoading: assign((context, event) => ({
    globalLoading: {
      ...event.data.globalLoading,
    },
  })),
  hideGlobalLoading: assign(() => ({
    globalLoading: {
      disabled: true,
    },
  })),
  displayAbortButton: assign((context) => ({
    globalLoading: {
      ...context.globalLoading,
      abortButton: true,
    },
  })),
  enterCreatingShareUrl: assign(() => ({
    globalLoading: {
      disabled: false,
      message: 'Creating share URL',
    },
  })),
  onCreateShareError: assign(() => {
    toasts.error('Could not create share URL, please try again later.');
    return {
      globalLoading: {
        disabled: true,
      },
    };
  }),
  setCurrentShare: assign((context, event) => {
    return {
      currentShare: event.data.share,
    };
  }),
  setSharesList: assign((context, event) => {
    return {
      sharesList: event.data.sharesList,
    };
  }),
  setCheckpointList: assign((context, event) => {
    return {
      checkpointList: event.data.checkpointList,
    };
  }),
  redirectToProjectProfilePage: assign((context) => {
    const projectId = context.project.id;
    history.push(`/profile/projects/${projectId}`);
  }),
  onPredictionComplete: assign(() => {
    return {
      aoiActionButtons: {
        addNewAoi: true,
        uploadAoi: true,
        deleteAoi: true,
      },
    };
  }),
};
