import { createMachine, assign } from 'xstate';
import L from 'leaflet';
import { reverseGeocodeLatLng } from '../../utils/reverse-geocode';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfCentroid from '@turf/centroid';
import turfArea from '@turf/area';
import { aoiActionButtonModes } from '../../components/project/prime-panel/tabs/predict/aoi-selector/action-buttons';
import config from '../../config';
import get from 'lodash.get';
import { delay } from '../../utils/utils';
import toasts from '../../components/common/toasts';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdicAOAMxvt9z7dvWAFgAaEABPG2sAVjoATn8nGMjrJ20HANsnAF9MkLQsXEJSChp6JlZ2FlQwEghQgR19JBBkIxN1anMrBFt3AOiogICYz1T3P0iQ8IRk2zp7W0i4uMX7a20PbNyMbHxiMipaRmZpCqqaus1bRsNjUw6mrp6+ugGhkZ7xyZseun8fF1sHhigQ2OWa2wKe2KhwAwgocABrGhQNgAMxY3FgYFQbA4snkijUKn4EHqenMLVu7U6iEBthidG07m87k8S20kVcX2mbkZzNckXcawC9hi9kiAU24PyuyKB3ocNwSOoKMo6Mx2NxMjkCiUxMEl2uzVadxp3Vc9L5LLZ9I5XLCNiZdGZ9gCKW8MQ8kXFUryO0K+xKdAAonxsciWLQAO4sP0FSMkIhgAQAZTAeFjEPwCaTDQpJupDxszKczsCTns4otiW5UWssQF1lcLmB1hiTkFvqzAeh9AAImBUSU2NQ2iQxCwAIIAeQAkgIYWJlAjICwIKgSDHo1O5ywAEZyPAaPNNSltMxF6ZCgJzSJ3jJ+VmRJzc9yJZwfb3pebueyuLsyj28p0DCZxqCqnAkMgAgALJQVqOBgZAJ43Oe9ygI82iBL8rj2E41h4akyQCrWATaL8d7pPSCzMrYgwAf6ULAQA6iQbQQai6A4uuzAsFxLAqNQOBgGIsHwVwGoQOgUZaOSp4FheGG0tWVo+DaMR2ty9jaAyLh2OKlaLHe9gMZCcpBn2G5RhGM6zvuoRrhuUBQMiYnIJwPBYlwUgocaVKKZYjr4c42kxEM2hYdo+HcoKDKBIM2h9K6dieqZsqBoclmbjZu57g5PHOa5cHuRJWLcMgvlnqal7WCWZZuoZ1YTA6CCrO4dABO4gqEa4YVke4aVARZVk5XZeWOcwLkqguS6IqugnCROtkTTGB54EeslGlVhZKVeUX1RWVb0s1UxJKWnhNjMuFhb+g1MUGABiNDsOQAlgaNAhSYcNASOgK50HG6W9nQT2jrAr2IdU4EorZCA-egxLtA0lUKehgXTLh9ZrB2iVjIE8xadhwzAp1gp+MMWRgoDQ2HKGJB7mI0izqQMCoA5KY8KgwksGmjP4FxAjM8cbM85z3MVFifMkij-lo10rJ-h1HK-rViz6YT7Wk7+KS9QlA1U9292HA96YUCOY4ThAqgkJ9Gj0PD-3U0b9Am3gZvPWo45rtbcPUL9iPHnoMtoWahHOu2FZq4KmOkbM4rDGMYqsgKfR3eZxum69HuUF7Vt4Db2IYKgANiKonGoEQAOG+nLuZ+bnuWz78MB5twfVbtYdvi48dRO4Mcta4N5RQKYp-neXWD2nGX0HTDPSDBRhsTgPMiQUAsL7AS9apLBTIXJqHt+jfeRLMCzJIMEfHxrHVddr6x9UyU-A7PjMsAvEAiSvUvr+gH8ThLq98B7y2qjM0nUOQvDPtYNswxeonUQG1G+3UdYP31lsQCztGBVAgMoO4lRqi1AEAwVAlAkz7kPBoTMcAsQQDbjtdGnUxgNm0k4D4YomwxSwnQSIHoIq1SineGIT9gKhn4DiNAkBcHtEqLwMkIDZZmibKsF4Ajcb+BFLYbkthvDODsF1DIrIwoVklAbDBNcQxhnEdgqRlDUCyMNPmBRNVMYqJxp1dRBMWqBAZBfaBTJnxuD-P+UxjFzGiM1BInB+BpF2OoPUaw8iQ7OOUdjHh7j8aaJap4Us2i-BkW9ByeKlN0GhOniBd6EFbK22+n7P69AnbmNAlDUavt-aqCRkHfefkkm7WPqfM6F8XBXy8dougHgHBMjsICLqiRhFBhEAAR24HAaGI5YD5yEsmL69tamO2rmUxZyz1kRhoOskgmzWkI3aYHXQdCApdHAf0KBMC+41iyRA5ITIwqDx+akOZhxDkrJOdQM5myBCFy4iXMuXFK4NIOWAJZQKIKnI2cJS5LdkZdO2vcxAjzIFJGgTEWBbyphdXrPheY9ILRvjopEf59A0x4HKms1FWy7Z0AdvU-ZwNGXMpRectFzdrmtyxaAy8AQLQ3i6pyC+ZMSWIGZP0FIb4JWqtcH8kJZkDm8FHBBSJNi4l3LlogJIqRYhRXbBpRK6QYi1lcPWN0OkooBCbJMsK9LynNL1d2apOzfp7LMWUpp7TvWAXRcKzFiTD7y1-K4JW3VVbAgcNyDwvwEh-iSq6PCt0pTUF-nACk3L5SOJ6ejAg9huTlsZBFGttaa2ug9WUE4HAJJhggCW6NuLrCkQZPSYYHIegnzdHRRtxwtRnFqB2+hjx6RD1FCkFInUoj2imARTWNq7BeCbPRTVQNgKKkRCc9UWIcQVHxLqIkqhIBTpxd0JI0QM3QOfBKXCQxayijGd6BI7ZtJRQSGg6UpTgYABl0A1AjGACw7BVnUxvcau9UQ5iDyfR2CVrpbUjNmNrZIiRmwSlYSZXdNMZ6WIjNuamOYwBwcURyBkOlnzaPVUCPCtYkjOFcLhbNDgJQ9EIyUrVwMRA4KqNmI8LByDoDIcgY41Gaq0cZIkVh6x1hvhYy1WdLwiUskStpZsrIPUDiHLQeuOclpzlk7tAi+1hiGScCKXoUVOHRAtLVaBqtnXWA9cG1ZpBkAWfRs2esqx0iDx8N4CK7h33rvpJu9V26TH8b3UGVi7EUTlwmiifiC0RL+ceM+dqv6OMZDcx2F8LVguxArJ6OIPgNIJcAwJ4CWVrKVNyvlJyU0oC5cdJWOYDUCP+F6CuhBZFnTeAFPhCUHJOxEcwaDF6b0vUw3M-JJxlmKuejs96fwdhkhlamIg2qzYmQRScLfOls2wnUHpq-IWrN2Zi2kLzNeqBusIEVY4VhBEiXel6Eka+R3lWnfOx6127tRwN29vnN7gxHB5IWBKnSZ2-C1kQwRuwSRcI1uKQ1pLtNrtzzfovZQX8XtvZVqWP8SabpjHSFpEUuiMhxBgR8D1L9575onM9-mr3VuloeYlONb5ap43wyKAHfcgdRRB5dspxDJHRNsQQqYB9p24u278CKro8NGIwwds1zY3QBNgSfWwbPLFUKiXg2Jb2rP1hs+KOzPgyL7YVQzsYCsoqpHVSfLzFTluznJ-8BTWF8N2c6i4WsOlfhjG0WMBInIU4esBcc5FILWUw7tGMvCnI6RtgR6+X87HmRMl40kUeHreXuX5ZsmHz7Yi1ZdVFcs8CMbkRcEyDjC6J4cmTzqiM+rFdo2xfBnhoz7X4XLArWqr5EovEFH0E+iR2xMgA3C4G3mB-dnJ3H346isLobvMkFNsw3Q1Zlc+EmOP1-AREOcFg6Wqh4A3DQGRw+xW7R4+1VhbhXMeFSXau3sql3tLpyL3tkJkEAA */
    predictableActionArguments: true,
    id: 'project-machine',
    initial: 'Page is mounted',

    context: {
      globalLoading: {
        disabled: true,
      },
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
      primeButton: {
        label: 'Ready for prediction run',
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
            actions: ['setMapRef'],
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

        on: {
          'Prime button pressed': 'Enter prediction run',
        },
      },

      'Enter prediction run': {
        entry: 'enterPredictionRun',
        always: [
          {
            target: 'Creating project',
            cond: 'isProjectNew',
          },
          {
            target: 'Creating AOI',
            cond: 'isAoiNew',
          },
          'Requesting instance',
        ],
      },

      'Creating AOI': {
        invoke: {
          src: 'createAoi',
          onDone: {
            target: 'Requesting instance',
            actions: 'setCurrentAoi',
          },
        },
      },

      'Requesting instance': {
        invoke: {
          src: 'requestInstance',
          onDone: {
            target: 'Setup instance',
          },
          onError: {
            target: 'Prediction ready',
            actions: 'handleInstanceCreationError',
          },
        },
      },

      'Setup instance': {
        invoke: {
          src: 'setupInstance',
          onDone: {
            target: 'Running prediction',
          },
        },
      },

      'Running prediction': {
        always: [
          {
            target: 'Ready for retrain run',
            actions: 'handlePredictionFinish',
          },
        ],
      },

      'Creating project': {
        invoke: {
          src: 'createProject',
          onDone: {
            target: 'Creating AOI',
            actions: 'setProject',
          },
        },
      },

      'Ready for retrain run': {
        entry: 'enterRetrainIsReady',
      },
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isAoiNew: (c) => !c.currentAoi.id,
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
      setCurrentAoi: assign((context, event) => ({
        currentAoi: event.data.aoi,
      })),
      setMapRef: assign((context, event) => {
        const { mapRef } = event.data;
        return {
          mapRef,
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
      handlePredictionFinish: assign(() => ({
        globalLoading: {
          disabled: true,
        },
      })),
      enterRetrainIsReady: assign(() => ({
        sessionStatusMessage: 'Ready for retrain run',
        primeButton: {
          disabled: false,
          label: 'Retrain Model',
        },
      })),
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
        window.history.replaceState(
          null,
          projectName,
          `/project/${project.id}`
        );

        return { project };
      },
      createAoi: async (context) => {
        const { apiClient } = context;
        const { name, geojson } = context.currentAoi;
        const { id: projectId } = context.project;

        const aoi = await apiClient.post(`/project/${projectId}/aoi`, {
          name: name,
          bounds: geojson,
        });

        return { aoi };
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
      setupInstance: async () => {
        return {};
      },
    },
  }
);
