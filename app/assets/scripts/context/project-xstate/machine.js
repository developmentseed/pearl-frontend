import { createMachine, assign } from 'xstate';
import L from 'leaflet';
import { reverseGeocodeLatLng } from '../../utils/reverse-geocode';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfCentroid from '@turf/centroid';
import turfArea from '@turf/area';
import { aoiActionButtonModes } from '../../components/project/prime-panel/tabs/predict/aoi-selector/action-buttons';

export const sessionLevel = {
  INFO: 'INFO',
  ERROR: 'ERROR',
};

/**
 * These are helpers to set context without repetion, mostly used on onEntry
 * actions.
 */
const set = {
  sessionStatus: (sessionStatus) =>
    assign((context) => {
      return {
        ...context,
        sessionStatus,
      };
    }),
  aoiStatus: (aoiStatus) =>
    assign((context) => {
      return {
        ...context,
        aoiStatus,
      };
    }),
};

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdgCcADgcBmAKxuXT+ydbJwAaEABPG2tPOk9PWxdtABZvexck229-AF9ssLQsXEJSChp6JlZ2FlQwEghwgR19JBBkIxN1anMrBFtPJ29YuOjop097Tzc3MMiEazS6bW9R7Tck+2s-WyTc-IxsfGIyKlpGZmkqmrqGzVtmw2NTLpaevoGhzxH+8cnpiJtbNo6KlrK4nNpAUEMtZdq19kUjqVTgBhBQ4ADWNCgbAAZixuLAwKg2BxZPJFGoVPwII09OY2o9Ot1ELY1i46Ns3J5Et4nGtPNpPDMbO91k5QS5eU4Bn17LCCgdiscynRUbhMdRsZQ8QSiSSZHIFEoqYJbvdWu0nszemyOUkuTy+UkBUL-nNtEDxe53NZlvZATs8nDCocSid6ABRPhErEsWgAdxYCqKcZIRDAAgAymA8En4fhU+mmvTLUyXjZxrZFtYXP4BesMj5hXNvECkqtwbW4kttDkg8nQ8rTgARMA4spsagdEhiFgAQQA8gBJATIsTKdGQFgQVAkRMJ+fLlgAIzkeA0xZaDI6ZnLcwC7KcSXFAwhMtds3mjk+I3brIctjyvmSpIvQyJXGomqcCQyACAAsjB+o4BBkCXg8N7PKArzaNYSR0L6iQQtEzpcs21i4fhQSpA4SzrLYoJASGIHhnQADqJAdFBOLoMSO7MCwPEsCo1A4GAYjwYhXC6hA6DxlodJXqWt5YYgnxcnQSSJFs0L2G49hkfY37kZ8f4eP6jGKoiLHDru8axouS4nuE267lAUBYhJyCcDwhJcFIaEWoyymWKpvhAtEUzeJpyxjHpzYJFWOGBN4KVBL62wWQiYYqjZe72Uex7OXxbkeQhXlSYS3DIAF15WnekyrMCzoei4kxvO4BluHQbjGZknjOpMkqZYOoF0LldlQQ5Tkucw7maqu64YluwmibOU18Ymp54Oe8nmrVZYqQgakxJpqwuNs9G6fpbr0dYzhUUkuF+IKWzDcxKoAGI0Ow5BCRB+UrjJpw0BI6CbnQA7vacX1TrAv3IbUkHYg5CAg+gVKdE0NVKZhIUII99r4ck3jcq2aR9GR4KxOR7jOpdQRLG9VmfTmFCTtOs4QKoJACED9Bo+DkPM9DrO-d9agztu3Oo9QoMYxeejY0FuM9IEbbOq1zrLMsnxkdyiyuNFT4bOMzpM9lIt4Gz4uUJLXN4DzRIYKgENiKo3GoEQEPAcL9AfaL7MS5z0to-Lu1Kxh1pqxpGv9T4vojM2HgaW4vL2B6Gz+Ksbi5EG1DoBAcD0j7FtgCWyvWgQ12zAQgy1vXDeN545tDuU5z6lJ0YQOXkd3o9ZHrHQEx8nyrUuP6Tgt6NFQXBwVz1D3dWHbdeF9MsrWGePrLeAZQJTPaPiCps8R6VPLFqhisbavihLElUZJGpSqiQIvB145kKXOD13j0U+qfpC4AyTh8K1gCO2WioJJ79hLq3OgAAZdAdRYxgAsOwJGeYmKv2Cq8FKgw+TpVBPaLImkyKNQ8BCRIDh3AxRhNApivs6BRn4KgWMB5IaFjLopCud5rDE1iFkSYkwkhENTmRVs+FWTpxrI2dIXIz4qhEBASgNQCznhYOQdA6YkznCwSrGwfCfCtS5GsERO8brnWcDWHC50lgeB9PIkcY4Jw20lg5XR1pfTPg5GkKxJNoiAmsGI8KkjrEyIPg4sC-0oKkGQO4u8bhxRDwfH4c6dgNi726msLkrZjqSIiWxDi6CPYzWxIJFaYk4mHXrDEZIbglj+CfCkQJbpNjsg2FySR0jJRyjoZZUuY1bIA2msVOaUBKl4x8E+Dk5FoRxDZH8T8Lg7r0Q6XpLpqR8kwx+n9RGANxk9HbM6aselPi1gJusTqQ8fyrB8MEOIzdelZVgdmMQKYuCwA4jgfZiBhHxGppsMYvguTaGrjYJZ0zVmZ2ij0vY9D+n+ytmLKcQcpYO2+fjQefV-S00MgMUEZFoh2mCP4KUAx3APNyEAA */
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
      sessionStatus: {
        level: sessionLevel.INFO,
        message: 'Loading...',
      },
      aoiStatusMessage: 'Loading...',
      aoiActionButtons: {
        drawNewAoi: aoiActionButtonModes.ACTIVE,
        confirmAoiDraw: aoiActionButtonModes.HIDDEN,
        cancelAoiDraw: aoiActionButtonModes.HIDDEN,
      },
      mosaicSelector: {
        disabled: true,
        message: 'Loading...',
      },
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

        entry: 'setEnteringProjectNameStatus',
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
            target: 'Select mosaic',
            actions: 'setCurrentAoiName',
          },
        },
      },

      'Select mosaic': {},
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
          ...context,
          project: { id: projectId },
          isAuthenticated,
          apiClient,
        };
      }),
      setInitialData: assign((context, event) => {
        const { mosaics } = event.data;
        return {
          ...context,
          mosaicList: mosaics,
          mosaicSelector: {
            disabled: false,
            message: 'Select a mosaic',
          },
        };
      }),
      toggleGlobalLoading: assign((context) => {
        return {
          ...context,
          displayGlobalLoading: !context.displayGlobalLoading,
        };
      }),
      setProjectName: assign((context, event) => {
        const { projectName } = event.data;
        return {
          ...context,
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
          ...context,
          currentAoi: {
            ...currentAoi,
            name: aoiName,
          },
        };
      }),
      setMapRef: assign((context, event) => {
        const { mapRef } = event.data;
        return {
          ...context,
          mapRef,
        };
      }),
      setEnteringProjectNameStatus: set.sessionStatus({
        level: sessionLevel.INFO,
        message: 'Set Project Name',
      }),
      resetMapEventHandlers: assign((context) => {
        return {
          ...context,
          mapEventHandlers: {
            dragging: true,
          },
        };
      }),
      setupNewRectangleAoiDraw: assign((context) => {
        return {
          ...context,
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
          ...context,
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
          ...context,
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
          ...context,
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
      initializeAoiList: assign((context) => {
        return {
          ...context,
          sessionStatus: {
            level: sessionLevel.INFO,
            message: 'Set AOI',
          },
          aoiStatusMessage: 'Draw area on map or upload an AOI geometry',
        };
      }),
    },
    services: {
      fetchInitialData: async (context) => {
        const { apiClient } = context;

        const { mosaics } = await apiClient.get('mosaic');

        return {
          mosaics,
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
