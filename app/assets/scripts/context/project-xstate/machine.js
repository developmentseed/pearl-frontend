import { createMachine, assign, send } from 'xstate';
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
import { BOUNDS_PADDING } from '../../components/common/map/constants';
import { WebsocketClient } from './websocket-client';
import logger from '../../utils/logger';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYA7NbrbrAVgCcrgBwBGAMzPbnl4ANCAAnoi2PgAsdB72tpEAbNrafs7OAL4ZIWhYuISkFDT0TKzsLKhgJBChAjr6SCDIRibq1OZWCNbaiT50Uf5RvVEp1onOiSHhCM7esX5RUa6LySPWWTkY2PjEZFS0jMzS5ZXVtZpeDYbGpu2Nnd29-YPDo+OTYYhRtol0PgH2bT+FxJRIbJpbfK7IoHADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQOp6czNG5tDoRZZ0WzaALeDyJVxeWxLKaIRLWPrJZwjDw+PyuHxi8G5bYFPbFOjw3DI6ioygYrE4vEyOQKJQkwQXK5NFq3WkIAIxRnMrys9mc1zcs2JX4inx2AXRMZg7IQvI7Qr7egAUT4OJRLFoAHcWFL8uGSEQwAIAMpgPDRyH4OMJ+qU400+42dIxHyJOIeOxRayuMYO9K-WweTwN1KN7y2SUZmUw+gAETAaOKbGorRIYhYAEEAPIASQEsLEykRkBYEFQJCjkYnM5YACM5HgNDnGlTWmYC11-F46GzXBNPQMfrYHT4mdeetZvIsPE4Eh3fV2A3lU41GVTgSGQAQAFlwM1HBgMgI9rlPO5QE6LxhjoTxtA8OJeldVxelrSs6EFexnGsa1-B8a0-2laFAIAdRIVpQLRdBcVXZgWHYlgVGoHAwDEKCYK4dUIHQCMtApY88zPVCbB6PoHyGaI3gmB10JiJlnFSMZVJSH5aKhf05R7NcIzDKdp13UIVzXKAoBRYTkE4HhsS4KREKNak5MsGxqI8TDXQmH5KwbB0xRI74KImas+R8VkjL9WUDjM9dLO3HdbM4hynOglzROxbhkC8k8TXPFxBT+UsGwrKsa0+BA5kSWwQt8BJImo9ZvRjZLuzoNKLNAqybLs5hHOVOcFyRZc+IEscRs4qM9zwA8pMNMr83ki8qpLMs6urD5pg5WwGQS7phU5YVyPbHrO3ouUADEaHYcheOAjLZ3Eg4aAkdAlzoXqAKel7YDeuCqhA1ErIQX70BJNp6lK2SUL8hBqO0Vw6BcdDBSic6cIdYU6A5W8cMZbpnHFHwkuBg5gxIHcxGkadSBgVBbKTHhUAElgU2Z-B2IEVmjg5vnud58psQF0lkZ81HOhLLxnH6JZBQo6wPx6I7EGa1qWvahIRS8brNn-B6Dke1MKCHEcxwgVQSAEb76DhgGgYt+grbwG2XrUUcV0d2HqD+hHDz0OXkNNE3lZJn40i8Aiq18IitOcLxlYIlqAh6WnPbob3feHf37cdgQcQwVBAbEVQ2NQIhAfukzLett6-coAOHbwEhg9D1REYj6SkPK7aY5VjlenSRPeXZHwHV6U6vCBDwohwsU+UyO7zeboNqEZ5mWEgoxmJwPnBPyIWj9gE-NWl-IEKH7yo-PKJE76ajX++ctvESKIiavFqbV-hGy6nnHedAGZM2kEfCAgkz4y0vugWBY4pbn3wA-DaKNTRDDmLFNIbgV6T3-tefWthDadRNmAlKJRKgQGULcCoVQagCAYKgSgCZdz7g0OmOA2IICRxHmjb42E-gjBOhnVkGcNJxDOuWbC-xV5+DsFQ-qwZ+C4jQJAehbQKi8HJJg+WpoMZYxxuMRYBMPDPhFAyGOvRljVm0PjTeZs6LgLURqTRdD8A6NQHog0uZDHnmMdjdOZj8bf0sY1b4vxFijGiL-b8ToogqMAu4jRtDtHcN8dQOo1gDHP22sE0xeMLHz0cY4dkyxAHskcSkuUsIPrDRnM7DQrsQ7-XoB7cBDTIafV7vDfu4ddACK2kIt+fwvCf1qj-P+UT-ixE1iMG6Tjvh1IOCIAAjtwOAUMhywG7vxRMLs6Bu06U3ahdBNnbP2WGGg+ySCHP6WHdaIzfKdErLHMUvh-jVkTv4ZwEUfh-HTo4xO1YcKrzWfQK5OzbnUHuYc8uqBK7V1ruxBuXSLkwpuaBO5ByBJPMGS8x+m03lfFLFePB6QCEqQBY1fwgUgQ-irOyFeFEoWXN4MOUCnjMk5OOacugEYwA7lgPDJceBXkKy+OMj+kzpmaQ0j0LGSy2QryXg2asHKhBcrDLy7xGgkUouQDXPAdcG7CtFeK1MUrsEjCxonAYicfi3hNhpa02gSIER6AkWY2gaJb1cVi3VPKMkGpyVwZBAh7l4CxIwgSlApD8JJVgoJrhMbY1cICdkfJIhMndT0BZPxJktQiabH0Qb+o6uoNy1E+rbjCFwGARNs0ESImaDQSVKbAmFPZPWBKiRlbAMTtYJVS8GTjAzoyHSfJkmBuMsGmteqw0NpEAmpNLA1AJjRGubM3aClo3FN0Em-wmWpDIT8CKkyGROEHcsTWHry2YqrSGutK62iNvXcuetOjchQEqLAWAtqgk4WdIAyZ2EyFpH-oFX+-qKLmhNrybVr6eFeIbeOHc7E0zZOA72-wsRFKJ1ZI48YdLpj2AcP4YtPxHETErChpdoatHhpYe+7hEYSD4iw6gWW+7BHvNlZM+V39FWNRNukEiysl4YwSDJjlPT+6hv-C0n67T3bnP6op3ZQNCW3CRvx0ZitB0q0WLeD5mtEk63RuOjkjiCKcmiDpTe3pqBILgJSTTAYAkHs6AQazBAVbuGCyF0LNN519UAqUY4HBRIhggD5gTiAs3Y2+HWBKcUGxPkaq1QKmdNbVnjosZxFaF39Wi5qU4NREtGcQB6mIrJT3sgmKkQi9LiJ+EUu8F8Lg50uLK4BBUSJblqmxLicoBIdTElUJAGrZKZj+uqpRSdQIdKzIo7MEmbgCtumiAMDlaSwybiBlmMAc3pVdBfH0ciOM3ANmSHPelEwvWuneFmpwEoIt02hVoyomYDwsHIOgDhyAjjnejq-U6awPD+AFHaUdOWCPBUbG4fG-qM4cr7AOWgtsS5bmnODiqK8YhYXiKKOK1mXxQ8xk6GpyRWrRAU401EpBkCE9HosU6NTYpOl6BndbiAJgq2FP8SZlZXQflcBypiLFUR1zGqiHic1BLs7Rtaa0jg7D2EoumvkkTpjBQmRncUr9vmckx+ZT6o0coTSgKrh4XVYhv1fsT6TGl6TJCzeRUsYpRQcuesOMG71elNIJzJHtaMPy8kcNREKbpV7691leb46asvdBfKvW6-XItykgQfEW7NOYS2kPzC+qB7eIBFKkBkExhS88ovmxqcwU9MjiOnxxcR-et1xx3Uu3cK8IHcJ6xsYxolxBFAEWsnhqqukferVIB295QMPsfZQ8Cy8D-FBmgI3Rl7lkFMEcT5Sk7oUSR-SIWfSs5-pkvg+MC4Gl8FuX8PvmviVgtEMTnA6HvEJb2n1IHel+z6UW7G1AjCZwA+Sw3wzwX8TISw6E2Wx0ikfwNo1o34-q3g4W2e32ECIY6SLGDC2SA+H44omE34ZObgFOtY5E2MvgqQAwQIOcUuX2+c2mn0m+6aDqkQOkikMObgDo+MvwMcOEFEbIswBE2qYAWysKuK8K+KZ2L+SWCAiwVYZBIwAQJuPwCO0wsOoiWaSw5MTIQBXmcoKYsaLkeKDyAkkB2hPINBjInWbIv8CUswjGtaaGfKm+cQFoLo5Y96SwIoGk3Qp0jY6OfIikDGLB3SzO6Y-4m+nWW2ToPQKkSw9ojUL4gUQw7gLqjqJukhZwLA8ulQeAa4NAuiqMpKF24R12ms6cd2JGj20wTqJ6DOt6lMQwxh28FyrCBBOi5Q2Or0s2ihtWMwWkQIGciyaqlm-8vwCS3g1K1glYC+WQGQQAA */
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
            target: 'Checking if user is authenticated',
            actions: 'setInitialContext',
          },
        },
      },

      'Page is ready': {
        always: [
          {
            target: 'Entering new project name',
            cond: 'isProjectNew',
          },
          'Ready for retrain run',
        ],

        entry: 'disableGlobalLoading',
      },

      'Checking if user is authenticated': {
        always: [
          {
            target: 'Fetch initial data',
            cond: 'isAuthenticated',
          },
          'Redirect to home page',
        ],
      },

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
            actions: ['initializeMap'],
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
            target: 'Running prediction',
            actions: 'setCurrentInstance',
          },
          onError: {
            target: 'Prediction ready',
            actions: 'handleInstanceCreationError',
          },
        },
      },

      'Setup instance': {
        invoke: {
          src: 'openWebsocket',
        },
      },

      'Running prediction': {
        on: {
          'model#status received': {
            target: 'Running prediction',
            internal: true,
            actions: 'setCurrentInstanceStatus',
          },

          'Received checkpoint': {
            target: 'Running prediction',
            internal: true,
            actions: 'setCurrentCheckpoint',
          },

          'Received timeframe': {
            target: 'Running prediction',
            internal: true,
            actions: 'setCurrentTimeframe',
          },

          'Received prediction progress': {
            target: 'Running prediction',
            internal: true,
            actions: 'updateCurrentPrediction',
          },

          'Abort run': {
            target: 'Running prediction',
            internal: true,
            actions: send({ type: 'Abort run' }, { to: 'websocket' }),
          },
          'Prediction run was aborted': {
            target: 'Prediction ready',
            actions: 'clearCurrentPrediction',
          },
          'Prediction run was completed': {
            target: 'Prediction ready',
            actions: 'disableGlobalLoading',
          },
        },

        invoke: {
          id: 'websocket',
          src: 'runPrediction',
        },

        entry: 'displayAbortButton',
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

      'Prediction is finished': {},
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
      initializeMap: assign((context, event) => {
        const { mapRef } = event.data;

        const { currentAoi } = context;
        let aoiGeojson;
        let aoiShape;

        // Add currentAoi to map, if it exists
        if (currentAoi && currentAoi.bounds) {
          const aoiGeojson = {
            type: 'Feature',
            properties: {},
            geometry: currentAoi.bounds,
          };
          const aoiShape = L.geoJSON(aoiGeojson).addTo(mapRef);
          mapRef.fitBounds(aoiShape.getBounds(), {
            padding: BOUNDS_PADDING,
          });
        }

        return {
          mapRef,
          currentAoi: currentAoi && {
            ...currentAoi,
            shape: aoiShape,
            geojson: aoiGeojson,
          },
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
      enterRetrainIsReady: assign(() => ({
        sessionStatusMessage: 'Ready for retrain run',
        primeButton: {
          disabled: false,
          label: 'Retrain Model',
        },
      })),
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
    },
    services: {
      fetchInitialData: async (context) => {
        const {
          apiClient,
          project: { id: projectId },
        } = context;

        // Initialize project and aois
        let project;
        let aoisList;
        let timeframesList;
        let checkpointList;
        let currentAoi;
        let currentTimeframe;
        let currentImagerySource;
        let currentMosaic;
        let currentModel;

        // Fetch lists
        const { mosaics: mosaicsList } = await apiClient.get('mosaic');
        const { imagery_sources: imagerySourcesList } = await apiClient.get(
          'imagery'
        );
        const { models: modelsList } = await apiClient.get('model');

        // If project is not new, fetch project data
        if (projectId !== 'new') {
          project = await apiClient.get(`project/${projectId}`);

          currentModel = modelsList.find(
            (model) => model.id === project.model_id
          );

          // Fetch project aois
          aoisList = (await apiClient.get(`project/${projectId}/aoi`)).aois;

          // If there are aois, fetch the first one's timeframes
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
            }
          }

          // Get project's checkpoints
          checkpointList = (
            await apiClient.get(`project/${projectId}/checkpoint`)
          ).checkpoints;
        }

        return {
          mosaicsList,
          imagerySourcesList,
          modelsList,
          project: project || { id: 'new' },
          aoisList,
          checkpointList,
          timeframesList,
          currentAoi,
          currentTimeframe,
          currentImagerySource,
          currentMosaic,
          currentModel,
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
                data,
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
    },
  }
);
