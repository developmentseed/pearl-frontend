import { createMachine, assign } from 'xstate';
import L from 'leaflet';
import {
  reverseGeocodeFromBounds,
  reverseGeocodeLatLng,
} from '../../utils/reverse-geocode';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfCentroid from '@turf/centroid';

export const sessionLevel = {
  INFO: 'INFO',
  ERROR: 'ERROR',
};

export const aoiStatuses = {
  LOADING: 'LOADING',
  EMPTY: 'EMPTY',
  CREATING: 'CREATING',
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
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxAGUweNtUp5KJADYtkzMPIzJYAbQAMAXUQp0sSZXTVdIAB6IATAEYAbHQDsDgBwOArM4CcGgCyfrzraWADQgAJ6I1g4AzHTRDtaezpZulhrO1hruAL7ZoWhYuISkFDT0TKzsLKhgJBBhApo6SCDI+obGphYIntE+dP4OGtHWiZYjtrahEQhjdBoalrZ2GtZLS565+RjY+MRkVLSMimwcNXUNatbNegZSnS3dvf2Dw6Oe43ZT4VZuGnR+SxpcYJRaWZw+LatHZFfalI4AYXIuAA1jQoGwAGYsbiwMCoU4sEjcPDIviUHAkfgQRraUxtO5GEyPSI+dJ0Wy9NaTByTIHOaaRZxuOgeXmudKJZxgqEFXbFA5lOhI1HorE4vEEqrE0lgcmU6mNa709r3ZmgbrWNnODlcpa2XlBcGChBLByi2zDNwfZzRQJuWyQvLQwp7EqHegAUT4+LVtAA7spQ2JqCQiGBhKIk-KWKn000TYyHhbIh9-m4fDY-rY3BNAi6VqLK9yXIFhtForKYWHFUcACJgTFlcSGWQsACCAHkAJICBEyCkoyAsCCoEiJhMTmcsABGJLwxgLLQZHXN5is0UsnjoQKGl5igY0nhdV-+kzZ7lcPj6Fa7ybhEbKucUjUBipDIAIACyJDIISODAZAR63KeXSIB4sSBDY1ipM8bIhD8syevMga2M4ELChKvJ-vKAFKgA6iQhigSwmLoASq7MCwbEsJS1A4GAMhQTBnA8HiEDoPG1BIa0ppMqhroQpYAzxORCTRM8Dgvt4HKPp+Djfj4v7BnKsLhkqfZrvGapTtOu5hCua5QFA6JCbBXC4mAXAAG5gNJJ5mvJIzqTpIwbJWSyuC6GQAg4-ikT4EIBhF1Gmb29AWeu1nbju9kcU5LnQW5olgNwyB+bJxbnggHYOgMfwfJ6sW1tYDbejebipCkvixZYfhBts-5mf2llZbZOUOcwzmgXOC44EuEA8SQfECVutkcYme54AeUl0seFVnt04KVspLgJWpGkNj47rWJeyQxL0LhXm4KU9vC9AAGI0Ow5A8cBo0COJRw0F56BLnQJmvYBn0SLAP3wbUIEYjZCDA+gBpMk05VFgdiB+qRAyrD4CXNdEAYNkR7j+DYngdW4UqWLkwbUOgEBwPS3YKm9hYoSyCAEN8Mz8y9nOARUShVO5MYQNzAW85WDaePYNYQipQJRJ1wu0UcYuEuc9Qy3JvMuLEMSJHT8QpDdCtKx436PTY7hAprQ30Cqc1qpQ2IeVqHA6mSUgGpABuVZaowin0kyeokPiNQr-y9aTN1Wp4Qy+M9xkc1r9AADLoHUapgGY7CI9mRTBzjsxh3EMeTKsngx1kL4JY4HbpA6HYeBoQTO2ldDRvwqBxmAiYQymaZgOX8krP0rixf4wqkWRbjk-8P5+L67gBt+DMZ4NvcAEqQJQNT4CwB4sOQ6DpvIiiT7z090LPnjzwGZHCi+NaP6sCckZWNU929OgA4hy0BHFIMcNk74lldJkJWyx65ZFrH4UiK9q4VgXqsXwwoAGAQRH9Zi4EoFVW3jeZ+3pRhrFcB1aI1sOS21Vg7DWu8aIuzoAxJiGJWLsUclxAkvF+IyCIYdT0Sk-gZBpv4dICUfAuiCnVDQFZGpcjsDg8yI1mI2TshNfKoEhG4xurECsSR1IZASkkBsyQmx2GSFdDetZ04DRYb3aG31foI1Gno6qIiATRAWL0b0xNLCaQItha8CjhSK1sH0JemxmGpUASIGQRQRKwEYjgTxPhRixBGB1TIV42Q1mXiEyxFZrG9WNu4UmjNshAA */
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
      aoiStatus: aoiStatuses.LOADING,
    },

    states: {
      'Page is mounted': {
        on: {
          'Set initial page props': {
            target: 'Creating map',
            actions: 'setInitialPageProps',
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
            actions: 'setAoiName',
          },
        },
      },

      'Select mosaic': {},
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isAuthenticated: (c) => c.isAuthenticated,
    },
    actions: {
      setInitialPageProps: assign((context, event) => {
        const { projectId, isAuthenticated } = event.data;
        return {
          project: { id: projectId },
          isAuthenticated,
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
      setAoiName: assign((context, event) => {
        const { aoiName } = event.data;
        return {
          ...context,
          aoiName,
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

        let shape = context.rectangleAoi.shape;
        if (!shape) {
          shape = L.rectangle(bounds, {
            interactive: false,
          }).addTo(context.mapRef);
        } else {
          shape.setBounds(bounds);
        }
        return {
          ...context,
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
          aoiGeojson,
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
          aoiStatus: aoiStatuses.EMPTY,
        };
      }),
    },
    services: {
      geocodeAoi: async (context) => {
        const centroid = turfCentroid(context.aoiGeojson);
        const [lng, lat] = centroid.geometry.coordinates;
        const aoiName = await reverseGeocodeLatLng(lng, lat);
        return { aoiName };
      },
    },
  }
);
