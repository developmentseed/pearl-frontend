import { createMachine, assign } from 'xstate';
import L from 'leaflet';
import { reverseGeocodeLatLng } from '../../utils/reverse-geocode';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfCentroid from '@turf/centroid';
import turfArea from '@turf/area';
import { aoiActionButtonModes } from '../../components/project/prime-panel/tabs/predict/aoi-selector/action-buttons';

/**
 * These are helpers to set context without repetion, mostly used on onEntry
 * actions.
 */
const set = {
  sessionStatusMessage: (sessionStatusMessage) =>
    assign((context) => {
      return {
        ...context,
        sessionStatusMessage,
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
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdicAOewE4AzE4As1618AVgAaEABPG2svOi9bLy97Ww93a217V18AXyywtCxcQlIKGnomVnYWVDASCHCBHX0kEGQjE3VqcysEeKcgukC7eyD3bV9fVycwyIRrTzptBwn7J0WvbW0gnLyMbHxiMipaRmZpSura+s1bJsNjU07m7t7+wYcR+zGJqYibW206EE5h5tB4Qclkhlti1doUDiVjgBhBQ4ADWNCgbAAZixuLAwKg2BxZPJFGoVPwIA09OZWvcOl1ELZMh4FszIWkvL5tK5Qr9Zn06L44r5mUl7HFbNYtrkYQV9sUjvRkbh0dRMZQcXiCUSZHIFEoKYJrrcWm0Hoyeiy2a4OdouTy+TM0gDVqs4kF7AFvP5ofk9kVDqU6ABRPgEjEsWgAdxY-sKUZIRDAAgAymA8HHYfhE8nGrTzQynjZEgD3E5bJ77MNJl5pjYggCvLzMk5vF45m3srL4wqg8cACJgLGlNjUdokMQsACCAHkAJICRFiZSoyAsCCoEixmMzhcsABGcjwGnzzTp7TMxYF8yCQO0Ff+oLi9dm1YGHiC8RWDg8fmsfrZoGCLKhcajqpwJDIAIACyUG6jgYGQGedyXo8oDPNogR0MyfhgqCjauD4r4BL4AzLJkgRcuMTj2IB8rAUqdAAOokO0EFYughKbswLBcSwKjUDgYBiLB8FcNqEDoNGWg0uehZXhhiAdkRAwSlKyRYUEfQke+1ift+FaeP+9EBvCTEDlu0aRnO86HuEG5blAUAYmJyCcDw+JcFIKFmvSimWMp2msikRHNiMbZeN4r4QmyIIeP4QRcrY-xeKZcKKsGlnbjZ+4Hg5PHOa5cHuRJ+LcMgvkXha17NjyAy0c+vgeHMUX2LprjOAZiRGX+vo9kB5lZVZuV2fljnMC56pLiuaLroJwlTrZE2xkeeAnrJprVUWSkICpMStRpILSjp-JStYzgSq4rhgik4wJE46V9iBdAAGI0Ow5ACWBo0CFJxw0BI6BrnQvaMcG73jrAX2ITU4GYrZCCA+gFIdI0VUKehgUIP4vhOHQLXCk4cy+PYEyuCRqwfiCwobL+jYyjsDFDccr0ZhQY4TlOECqCQf0aPQyMg2DLP0GzeAcx9aiThuvNI9QQOo6eegY-5WPdCsTZ3RskWSj8zpRQsQQpEkGzDGCj0DczmWs+zX1S5QMs83gfMEhgqCg2IqicagRCg4NNti3bnPS9zcvI0rm2q2hlqa7E2sPu2KX64gtpCm2Di8qKlZpAB0LUOgEBwLSAf9mABZq5aBDtfy1cLBsDeNw3tjdkzZmBycFQcBJ4YQBXMfXv4JGk4CYK2vpxurEE-VtxlZed2cHAXHU-c1bt51kZsxPb-aIKZLpZa414ja0X4jNyu388qmikaari+KEpUJIGuSqiQKvO3Y5Wd50D+7grJ8Iiul8YnUSJ4Dwtg+jaTolbS+L0AAy6BaiRjABYdg8MswMQ-gFZ4d5+h-2rI1IB-I0idVPq4MY111gRTzrPZ6TEwz8FQJGXcYNczl3kpXa8aRggDHtM+DYN0XDWBIo2HCN0AhETNm2MET1wbHBEBASg1QcwnhYOQdAyY4ynGwerGwYxXj8O8IIv8xMYoQN-mCasSQIEpH0q3C+c8XpDhHLQEOjsloLl0ZaaUI8Tafiiv4MY6RREAmZC1awUj0gyI8HI0WdBEQ-QgqQZA3jryTAul6Rs8Qop2Dxh4A+dBKLChPisYIcSO6sXYpiH2E1MT8QWiJNJu11j+CKQkY+Thj4QICCRG6gJbQRU8GMbeFT57ZWshBZa41CpTSgM07GnSYiTEbM1NwCQ0gp1mC1BYgzJjDLxtYS2dD5Fiw+tDb6cNRoLO6NyNpUCjlSlJt-GuzoMij15JAnkwpUhpVgU4pi6YxAJi4LANiOAbmIHGG0-wCV7pHIobYDqHzp5k2GH0HwxzHH0IhsHB2TteaQpxiPFKpM7DxEiaCV5UQYgpTKdEJKSQbo5ByEAA */
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

      'Select mosaic': {
        entry: 'setSelectMosaicSessionStatus',
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
      setEnteringProjectNameStatus: set.sessionStatusMessage(
        'Set Project Name'
      ),
      setSelectMosaicSessionStatus: set.sessionStatusMessage(
        'Select Mosaic & Model'
      ),
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
          sessionStatusMessage: 'Set AOI',
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
