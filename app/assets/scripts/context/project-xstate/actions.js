import get from 'lodash.get';
import { assign } from 'xstate';
import L from 'leaflet';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfArea from '@turf/area';
import toasts from '../../components/common/toasts';
import { BOUNDS_PADDING } from '../../components/common/map/constants';
import { formatThousands } from '../../utils/format';
import config from '../../config';

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
      currentMosaic: mosaic,
    };
  }),
  setCurrentModel: assign((context, event) => ({
    currentModel: event.data.model,
  })),
  setCurrentAoi: assign((context, event) => ({
    currentAoi: event.data.aoi,
    aoiActionButtons: {
      ...context.aoiActionButtons,
      deleteAoi: true,
    },
  })),
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
        deleteAoi: true,
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
        deleteAoi: true,
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

    const newAoiList = aoisList.filter((aoi) => aoi.id !== aoiId);

    return {
      currentAoi: null,
      aoisList: { ...newAoiList },
    };
  }),
  setCurrentInstance: assign((context, event) => ({
    currentInstance: event.data.instance,
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
    currentTimeframe: event.data,
  })),
  refreshPredictionTab: assign((context) => {
    const { currentImagerySource, currentMosaic, currentModel } = context;

    return {
      imagerySourceSelector: {
        disabled: false,
        placeholderLabel: 'Select imagery source',
      },
      mosaicSelector: {
        disabled: !currentImagerySource,
        placeholderLabel: 'Select mosaic',
      },
      modelSelector: {
        disabled: !currentImagerySource,
        placeholderLabel: 'Select model',
      },
      primeButton: {
        disabled: !currentImagerySource || !currentMosaic || !currentModel,
        label: 'Ready for prediction run',
      },
    };
  }),
  updateCurrentPrediction: assign((context, { data }) => {
    // Get bounds
    let predictions = get(context, 'currentPrediction.predictions', []);

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
    globalLoading: {
      disabled: true,
    },
  })),
  setMapRef: assign((context, event) => ({
    mapRef: event.data.mapRef,
  })),
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
    sessionStatusMessage: 'Ready for prediction run',
    primeButton: {
      disabled: false,
      label: 'Run Prediction',
    },
  })),
  enterPredictionRun: assign(() => ({
    sessionStatusMessage: 'Running prediction',
    globalLoading: {
      disabled: false,
      message: 'Running prediction',
    },
    primeButton: {
      disabled: false,
      label: 'Run Prediction',
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

    return {
      currentAoi: null,
      rectangleAoi: null,
      aoiActionButtons: {
        confirmAoiDraw: true,
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
    const aoiGeojson = turfBboxPolygon(bounds.flat());
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
  endNewRectangleAoiDraw: assign((context) => {
    // Take rectangle bounds and generate GeoJSON polygon feature
    const aoiGeojson = turfBboxPolygon(context.rectangleAoi.bounds.flat());

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
    };
  }),
  exitRectangleAoiDrawMode: assign((context) => {
    const { rectangleAoi } = context;

    if (rectangleAoi?.shape) {
      rectangleAoi.shape.remove();
    }

    return {
      rectangleAoi: null,
      currentImagerySource: null,
      currentMosaic: null,
      currentModel: null,
      imagerySourceSelector: {
        disabled: false,
        placeholderLabel: 'Select imagery source',
      },
      mosaicSelector: {
        disabled: true,
        placeholderLabel: 'Define imagery source first',
      },
      modelSelector: {
        disabled: true,
        placeholderLabel: 'Define imagery source first',
      },
      aoiActionButtons: {
        uploadAoi: true,
        addNewAoi: true,
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
  displayAreaTooTinyModalDialog: assign((context) => {
    const aoiArea = context.currentAoi.area;
    const formattedAoiArea = formatThousands(aoiArea / 1e6, { decimals: 1 });

    return {
      aoiModalDialog: {
        revealed: true,
        headline: 'Area is too tiny',
        content: `The AOI area is ${formattedAoiArea} km², please select an
        area greater than ${config.minimumAoiArea / 1e6} km².`,
      },
    };
  }),
  closeAoiModalDialog: assign(() => ({
    aoiModalDialog: {
      revealed: false,
    },
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
  disableGlobalLoading: assign(() => ({
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
};
