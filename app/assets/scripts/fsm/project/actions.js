import get from 'lodash.get';
import set from 'lodash.set';
import { assign } from 'xstate';
import L from 'leaflet';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfArea from '@turf/area';
import toasts from '../../components/common/toasts';
import { BOUNDS_PADDING } from '../../components/common/map/constants';
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
    const { currentImagerySource } = context;
    const { imagerySource } = event.data;

    // Bypass if imagery source is already selected and hasn't changed
    if (
      currentImagerySource &&
      imagerySource &&
      currentImagerySource.id === imagerySource.id
    ) {
      return {};
    }

    // Apply new imagery source and reset mosaic
    return {
      currentImagerySource: imagerySource,
      currentMosaic: null,
    };
  }),
  setCurrentMosaic: assign((context, event) => {
    const { mosaic } = event.data;

    return {
      currentMosaic: { ...mosaic, tileUrl: getMosaicTileUrl(mosaic) },
    };
  }),
  setCurrentModel: assign((context, event) => ({
    currentModel: event.data.model,
  })),
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
    const { currentAoi } = context;

    if (currentAoi?.shape) {
      currentAoi.shape.remove();
    }

    const isFirstAoi = context.aoisList.length === 0;
    if (isFirstAoi) {
      // If first AOI is being deleted, reset all AOI-related context
      return {
        currentAoi: null,
        currentImagerySource: null,
        currentMosaic: null,
        currentModel: null,
      };
    } else {
      return { currentAoi: null, currentPrediction: null };
    }
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

    let aoiShape;

    // Add latest AOI to the map
    if (latestAoi && latestAoi.bounds) {
      aoiShape = L.geoJSON(latestAoi.bounds).addTo(mapRef);
      mapRef.fitBounds(aoiShape.getBounds(), {
        padding: BOUNDS_PADDING,
      });
    }

    return {
      currentAoi: { ...latestAoi, shape: aoiShape },
      aoiActionButtons: {
        addNewAoi: true,
        uploadAoi: true,
      },
    };
  }),
  applyExistingAoi: assign((context, event) => {
    const { mapRef, currentAoi, aoisList } = context;
    const { aoiId } = event.data;

    const aoi = aoisList.find((aoi) => aoi.id === aoiId);

    // Clear existing AOI layer
    if (currentAoi?.shape) {
      currentAoi.shape.remove();
    }

    // Add AOI to the map
    let aoiShape;
    if (aoi && aoi.bounds) {
      aoiShape = L.geoJSON(aoi.bounds).addTo(mapRef);
      mapRef.fitBounds(aoiShape.getBounds(), {
        padding: BOUNDS_PADDING,
      });
    }

    return {
      currentAoi: { ...aoi, shape: aoiShape },
      aoiActionButtons: {
        addNewAoi: true,
        uploadAoi: true,
      },
    };
  }),
  updateAoiLayer: assign((context) => {
    const { mapRef, currentAoi } = context;

    // Remove AOI layer, if exists
    if (currentAoi?.shape) {
      currentAoi.shape.remove();
    }

    const geojson = currentAoi.geojson || currentAoi.bounds;

    // Add new layer from geojson, if exists
    let aoiShape;
    if (geojson) {
      aoiShape = L.geoJSON(geojson).addTo(mapRef);
      mapRef.fitBounds(aoiShape.getBounds(), {
        padding: BOUNDS_PADDING,
      });
    }

    return {
      currentAoi: {
        ...currentAoi,
        shape: aoiShape,
      },
    };
  }),
  onAoiDeletedSuccess: assign((context, event) => {
    const { currentAoi, aoisList } = context;
    const { aoiId } = event.data;

    // Remove AOI layer
    if (currentAoi?.shape) {
      currentAoi?.shape.remove();
    }

    return {
      currentAoi: null,
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
    currentCheckpoint: event.data,
  })),
  setCurrentTimeframe: assign((context, event) => ({
    currentTimeframe: event.data.timeframe,
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
  refreshPredictionTab: assign((context) => {
    const { currentImagerySource, project } = context;

    const isExistingProject = project?.id !== 'new';

    return {
      imagerySourceSelector: {
        disabled: false,
        placeholderLabel: 'Select Imagery Source',
      },
      mosaicSelector: {
        disabled: !currentImagerySource,
        placeholderLabel: 'Select Mosaic',
      },
      modelSelector: {
        hidden: isExistingProject,
        disabled: !currentImagerySource,
        placeholderLabel: 'Select Model',
      },
    };
  }),
  updateCurrentPrediction: assign((context, { data }) => {
    let predictions = get(context, 'currentPrediction.predictions', []);

    // Add prediction to the list if bounds exists
    if (data.bounds) {
      const [minX, minY, maxX, maxY] = data.bounds;

      // Build prediction object
      predictions = predictions.concat({
        key: predictions.length + 1,
        image: `data:image/png;base64,${data.image}`,
        bounds: [
          [minY, minX],
          [maxY, maxX],
        ],
      });
    }

    return {
      sessionStatusMessage: `Received image ${data.processed} of ${data.total}...`,
      currentPrediction: {
        ...context.currentPrediction,
        processed: data.processed,
        total: data.total,
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
  setRetrainMapMode: assign((context, event) => {
    const {
      retrainClasses,
      retrainActiveClass,
      mapRef: { freehandDraw, polygonDraw },
    } = context;
    const { retrainMapMode } = event.data;

    // Ensure that the freehand draw layers are set
    freehandDraw.setLayers(retrainClasses);

    // Toggle freehand draw
    if (retrainMapMode !== RETRAIN_MAP_MODES.ADD_FREEHAND) {
      freehandDraw.disable();
    } else {
      freehandDraw.enableAdd(retrainActiveClass);
    }

    // Toggle polygon draw
    if (retrainMapMode !== RETRAIN_MAP_MODES.ADD_POLYGON) {
      polygonDraw.disable();
    } else {
      polygonDraw.enable();
    }

    return {
      retrainMapMode: event.data.retrainMapMode,
    };
  }),
  setRetrainActiveClass: assign((context, event) => {
    const { retrainMapMode } = context;
    const { retrainActiveClass } = event.data;

    // Enable freehand draw for the active class
    if (retrainMapMode === RETRAIN_MAP_MODES.ADD_FREEHAND) {
      context.mapRef.freehandDraw.enableAdd(retrainActiveClass);
    }

    return {
      retrainActiveClass: event.data.retrainActiveClass,
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
  setProject: assign((context, event) => ({
    project: event.data.project,
  })),
  initializeNewProject: assign(() => {
    return {
      sessionStatusMessage: 'Set Project Name',
      imagerySourceSelector: {
        disabled: true,
        placeholderLabel: 'Define AOI first',
      },
      mosaicSelector: {
        disabled: true,
        placeholderLabel: 'Define AOI first',
      },
      modelSelector: {
        disabled: true,
        placeholderLabel: 'Define AOI first',
      },
    };
  }),
  enablePredictionRun: assign(() => ({
    sessionMode: SESSION_MODES.PREDICT,
    sessionStatusMessage: 'Ready for prediction run',
  })),
  enterRetrainMode: assign(() => ({
    sessionMode: SESSION_MODES.RETRAIN,
    sessionStatusMessage: 'Ready for retrain run',
  })),
  enterPredictionRun: assign(() => ({
    sessionStatusMessage: 'Running prediction',
    globalLoading: {
      disabled: false,
      message: 'Running prediction',
    },
  })),
  enterRequestingInstance: assign(() => ({
    sessionStatusMessage: 'Starting retrain run',
    globalLoading: {
      disabled: false,
      message: 'Awaiting instance',
    },
  })),
  enterRetrainRun: assign(() => ({
    sessionStatusMessage: 'Running retrain',
    globalLoading: {
      disabled: false,
      message: 'Awaiting predictions',
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
    const { currentAoi } = context;

    if (currentAoi?.shape) {
      currentAoi.shape.remove();
    }

    if (context.rectangleAoi?.shape) {
      context.rectangleAoi.shape.remove();
    }

    return {
      currentAoi: null,
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
        editAoi: true,
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
  redirectToProjectProfilePage: assign((context) => {
    const projectId = context.project.id;
    history.push(`/profile/projects/${projectId}`);
  }),
};
