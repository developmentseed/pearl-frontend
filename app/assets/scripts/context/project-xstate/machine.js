import { createMachine, assign } from 'xstate';
import L from 'leaflet';
import { reverseGeocodeLatLng } from '../../utils/reverse-geocode';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfCentroid from '@turf/centroid';
import turfArea from '@turf/area';
import { aoiActionButtonModes } from '../../components/project/prime-panel/tabs/predict/aoi-selector/action-buttons';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdicAOe9etO72gJwBWABoQAE8bawBmOgjbCIjfSKcEj38AX1TgtCxcQlIKGnomVnYWVDASCBCBHX0kEGQjE3VqcysEWKd-OmsAFk9-Vwj-LxTgsIRre186bQd-eZ7fJwdXefTMjGx8YjIqWkZmaRKyiqrNW1rDY1MWuraOrt7+weGnUdCbW206YftBt38EW0ESc2lc63qmxyO3y+wAwgocABrGhQNgAMxY3FgYFQbA4snkijUKn4EGqenMDWuzVaiFsrkWMwZfR6X18ATGNk6dB6MX8YNsA2sg3sEKyW1yuwKdARuBR1DRlEx2Nx+JkcgUSlJgnOl3qjRudPajOms0ZvXZnI+E2031BoN8wNcbzt-h64qh2zye3oAFE+LjUSxaAB3FgSnIhkhEMACADKYDwEa9yeoMbANSphtpd3CviifN6vg8rgSBYiXImAuiq0GcTerlsTg9GUh2W90v2ABEwOiCmxqE0SGIWABBADyAEkBHCxMokZAWBBUCRw2Hx9OWAAjOR4DRZurUppmPMTUHWOi2ZueWbaaxLexOKuTRwPgW+RauRmzNJtyOdrC9BwicaiKpwJDIAIACykHqjgoGQIeVwnrcoD3PePRXi69jaH0qzaP4vgvr03Q9O4PRsqsApOBE1ieh2UpAXQADqJBNOB6LoHiK7MCw3EsCo1A4GAYgwXBXCqhA6ChlolJHjmp7oYgdFCnQrgitev62AEcQvvYb4BH4X4-kKDGSjCvp0N2q6hsGk5TjuITLquUBQKi4nIJwPA4lwUjIQaNJKZYKn+LYl7zDEZZOkkdhBDaOm2MyToOBEriEfYYV-hsjGWTKNlrvZW7bs5vFuR5sFeZJOLcMgAXHkaZ4gj03yMteczfuF2jPjakyuM4Rmfr434tWZ-6pnlPa2UVjklS5zDuYqs7zsiS5CSJo4OfN4a7ng+5yfqDW5spCCqV0GlNl8Qo6YClYJZ4zj2GlLYRE9vhfJ45nQj6MoAGI0Ow5CCaBM0CNJ+w0BI6CLnQAFMVZ-1DrAQMIeUYFog5CCQ+gpLNDU9WKWhIUIFR3zkcN2j2A4QrvS+oLdMNSxNuRQJ9F9gFWQGJDbmI0hTqQMCoM58Y8KgIksImvP4NxAj84cQsS6L4slDiUtkgTQVE20PR-I4fwabr-LNvF4x9QNH4maN2XthZP37L9SYUIOw6jhAqgkGDGj0NjMNw5N9AO3gTsA2oI7Lu7WPUFDuMHnoGuocaT7fPEpojCCeE9ab8QzERLp4T+ButjlttdgHjtAyHlBh27eAe7iGCoLDYiqFxqBELDE122XQcV0OoeuxH2Mxwd8eNSdSfRMNixp6CPSZ4gTa8kkzZU54sS9GK425V3dBczz0jQUY7E4BLok5DLh+wMf6qqzkSHyShY-E2FUy8kMjJPg2rj6f1SQW8NplrZ+x3nvXmLBD4QFEqfNWF90CQNHCrM++B76HUJsafwHhCzDX8N4PCfh7A-3NnhfokQ-B-jbNQOBcAqSd1LtmTWxoCAEJtAQLoHIOR0W6qsP4ERFjs3hjKIoRwOCSUDBAehCczx9BfDrH47C6IaXeu4Jw-D-YHGKBwE4lQJFP3uJ4LChEWztSIisaw+lWp9FeC4NkeEHCqJ3nKZEwZlRYhxHiEohItQklUJAHRx1iZCnmHQJ81g-CU0mKE+Y+knDdBwb0OIGDGTcPsaXOgAAZdAFRgxgAsOwdGKZGJ+OCvceYXQQlhI8B4QiJsbBgkem4QYdoXC2CLCk5iAZ+CoGDBuOG0ZYxFK1rUnojxgSqXcAWQYZjeo1gZMkd6Bl5hPTaVZEQEBKBlHwCwfcLByDoFjBGQ4AzjShOGd0UZdhxlpTolWRKwT2FgibC2Neyz8p9gHJXMODkjlnl6EkH4wxQmfhwU2ewPQXwzLLJMeZmUMERBefCEG4FSDIG+SdF0l4UixCFBlSi39eq4XUpYrw1ivhsk3sXb6qS2IcTRK3eaaIBLrVEqi4mD4eQpwWH8FpuFmGmzLD8EFQw+STJwfC+gBU7LgS2nNMqi0oAsraEMSmb8ORPTBFMfOL4EgzGZjgjwAQ54qK3iXZiiNAbAzRjNBVKklhdE4Qky0BknyENzkMB8UxXq9CAbQ9p6Z94sDloLYWStpCS3Pqga1JNmp0A5MMaK5E+TEXxf1V1wwSwFg8MMsVdBA7Bz7lXAetdI2UUcNeYZ8yYgtT8CRKI14-iaQ1bMNmxrKW+u5mAy+18w3SwjQpBhUigUxu8C02idpK1asvIKYZbx3yGuzaAg+VDRzdv3L2x+-i2iAgMsEzoUwWoggwWC5NcjGS8ICPMgs2aGBlDWfgZopRyjaL7ZIk6AxYg-CejgoYzZBgTp1S09wfwnRM03ukIAA */
    predictableActionArguments: true,
    id: 'project-machine',
    initial: 'Page is mounted',

    context: {
      displayGlobalLoading: true,
      mapEventHandlers: {
        dragging: true,
        mousedown: false,
        mouseup: false,
        mousemove: false,
      },
      project: {},
      sessionStatusMessage: 'Loading...',
      aoiStatusMessage: 'Loading...',
      aoiActionButtons: {
        drawNewAoi: aoiActionButtonModes.ACTIVE,
        confirmAoiDraw: aoiActionButtonModes.HIDDEN,
        cancelAoiDraw: aoiActionButtonModes.HIDDEN,
      },
      imagerySourceSelector: {
        message: 'Loading...',
        disabled: true,
      },
      mosaicSelector: {
        message: 'Loading...',
        disabled: true,
      },
      modelSelector: {
        placeholderLabel: 'Loading...',
        disabled: true,
      },
      mosaicsList: [],
      imagerySourcesList: [],
      modelsList: [],
    },

    states: {
      'Page is mounted': {
        on: {
          'Resolve authentication': {
            target: 'Fetch initial data',
            actions: 'setInitialContext',
          },
        },
      },

      'Page is ready': {
        always: [
          {
            target: 'Checking if user is authenticated',
            cond: 'isProjectNew',
          },
          'Loading existing project',
        ],
      },

      'Checking if user is authenticated': {
        always: [
          {
            target: 'Entering new project name',
            cond: 'isAuthenticated',
          },
          'Redirect to home page',
        ],
      },

      'Loading existing project': {},

      'Entering new project name': {
        on: {
          'Set project name': {
            target: 'Define initial AOI',
            actions: 'setProjectName',
          },
        },

        entry: 'initializeNewProject',
      },

      'Redirect to home page': {},

      'Define initial AOI': {
        entry: 'initializeAoiList',

        on: {
          'Clicked draw new AOI button': {
            target: 'Waiting for drag or cancel',
            actions: 'setupNewRectangleAoiDraw',
          },
        },
      },

      'Creating map': {
        on: {
          'Map is created': {
            target: 'Page is ready',
            actions: ['setMapRef', 'toggleGlobalLoading'],
          },
        },
      },

      'Waiting for drag or cancel': {
        on: {
          'Map mousedown': {
            target: 'Drawing AOI by dragging',
            actions: ['startNewRectangleAoiDraw'],
          },
        },
      },

      'Drawing AOI by dragging': {
        on: {
          'Map mousemove': {
            target: 'Drawing AOI by dragging',
            internal: true,
            actions: 'updateRectangleAoiDraw',
          },

          'Map mouseup': {
            target: 'Finish creating AOI',
            actions: ['endNewRectangleAoiDraw'],
          },
          'Clicked cancel AOI draw button': {
            target: 'Define initial AOI',
            actions: 'resetMapEventHandlers',
          },
        },
      },

      'Finish creating AOI': {
        invoke: {
          src: 'geocodeAoi',
          onDone: {
            target: 'Enable Imagery Source Selector',
            actions: 'setCurrentAoiName',
          },
        },
      },

      'Enable Imagery Source Selector': {
        entry: 'enableImagerySourceSelector',

        on: {
          'Imagery Source is selected': {
            target: 'Enable Mosaic Selector',
            actions: 'setCurrentImagerySource',
          },
        },
      },

      'Fetch initial data': {
        invoke: {
          src: 'fetchInitialData',
          onDone: {
            target: 'Creating map',
            actions: 'setInitialData',
          },
          onError: {
            target: 'Redirect to home page',
          },
        },
      },

      'Enable Mosaic Selector': {
        on: {
          'Mosaic is selected': {
            target: 'Enable Model Selector',
            actions: 'setCurrentMosaic',
          },
        },
      },

      'Enable Model Selector': {
        entry: 'enableModelSelector',

        on: {
          'Model is selected': {
            target: 'Prediction ready',
            actions: 'setCurrentModel',
          },
        },
      },

      'Prediction ready': {
        entry: 'enablePredictionRun',
      },
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isAuthenticated: (c) => c.isAuthenticated,
    },
    actions: {
      setInitialContext: assign((context, event) => {
        const { projectId, isAuthenticated, apiClient } = event.data;
        return {
          project: { id: projectId },
          isAuthenticated,
          apiClient,
        };
      }),
      setInitialData: assign((context, event) => {
        const { mosaicsList, imagerySourcesList, modelsList } = event.data;
        return {
          imagerySourcesList,
          mosaicsList,
          modelsList,
        };
      }),
      toggleGlobalLoading: assign((context) => {
        return {
          displayGlobalLoading: !context.displayGlobalLoading,
        };
      }),
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
        const { imagerySource } = event.data;
        return {
          currentImagerySource: imagerySource,
          mosaicSelector: {
            disabled: false,
            message: 'Select a mosaic',
          },
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
      setMapRef: assign((context, event) => {
        const { mapRef } = event.data;
        return {
          mapRef,
        };
      }),
      initializeNewProject: assign(() => {
        return {
          sessionStatusMessage: 'Set Project Name',
          imagerySourceSelector: {
            disabled: true,
            message: 'Define AOI first',
          },
          mosaicSelector: {
            disabled: true,
            message: 'Define AOI first',
          },
          modelSelector: {
            disabled: true,
            placeholderLabel: 'Define AOI first',
          },
        };
      }),
      enableImagerySourceSelector: assign(() => {
        return {
          sessionStatusMessage: 'Select Mosaic & Model',
          imagerySourceSelector: {
            disabled: false,
            message: 'Select Imagery Source',
          },
        };
      }),
      enableModelSelector: assign(() => ({
        modelSelector: {
          disabled: false,
          placeholderLabel: 'Select Model',
        },
      })),
      enablePredictionRun: assign(() => ({
        sessionStatusMessage: 'Ready for prediction run',
      })),
      resetMapEventHandlers: assign(() => {
        return {
          mapEventHandlers: {
            dragging: true,
          },
        };
      }),
      setupNewRectangleAoiDraw: assign(() => {
        return {
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
      initializeAoiList: assign(() => {
        return {
          sessionStatusMessage: 'Set AOI',
          aoiStatusMessage: 'Draw area on map or upload an AOI geometry',
        };
      }),
    },
    services: {
      fetchInitialData: async (context) => {
        const { apiClient } = context;

        const { mosaics: mosaicsList } = await apiClient.get('mosaic');
        const { imagery_sources: imagerySourcesList } = await apiClient.get(
          'imagery'
        );
        const { models: modelsList } = await apiClient.get('model');

        return {
          mosaicsList,
          imagerySourcesList,
          modelsList,
        };
      },
      geocodeAoi: async (context) => {
        const centroid = turfCentroid(context.currentAoi.geojson);
        const [lng, lat] = centroid.geometry.coordinates;
        const aoiName = await reverseGeocodeLatLng(lng, lat);
        return { aoiName };
      },
    },
  }
);
