import { createMachine, assign } from 'xstate';
import L from 'leaflet';

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
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxAGUweNtUp5KJADYtkzMPIzJYAbQAMAXUQp0sSZXTVdIAB6IATAEYAbHQDsDgBwBmV7eeWALAFY-vrYANCAAnojWDq50rg7WAJyW8a7W3t4J7gC+mSFoWLiEpBQ09Eys7CyoYCQQoQKyAO4koerapsj6hsamFgjJ3nTxdrYJic7j-iHhCNbO8Y6B3nMaXv6Wbtm5GNj4xGRUtIyKbBxVNXWNzerWOkggHQZS3Xe9-YPDo+sT3lNWS3Q+EYaDSWXzWSyWWybe7bAp7YqHADC5FwAGsaFA2AAzFjcWBgVAnFgkbh4FF8Sg4Ej8CD1GRNFqaW56R5GEwvCLeByWQYOWz8+L+VzOWyueK-GZuGLpXy+YXOJy2CEOaF5HaFfYlOjItEY7G4-GEiokslgClUml0hnXZn3TpPdmgXqpbm8-m2QXeYWi8VhKy2XwxVIJPm+Iay7yq2G7IoHegAUT4BL1tAayny+BY1BIRDAwlE6fVWZzYCZ7XtbJ6Vg03nm1g08T81nr3IbDgldg0dDWDcsGjl3j7-ajGY1CNK0bE5BIHGo6BYAEEAPIASVgAkRMkpqMgLAgqBIadTi9XLAARqS8MYy3cHl1HeY-r4HI5G5ZXOlm-5Jn6EEku-y3g1u4PguC4I7qvCcbamcUjUJipDIAIACyJDIESOCwZAN4sveVYIL4UoijY-hxGGoKuB2thdhotjeKKviWA4GiRK4kIQXCsZagA6iQhjwSwWLoIS+7MCwwksFS1A4GAMgoWhnA8PiEDoA01A4XarLPE6VjxHE3b9qktH+OMCoSv+dCAcBbFcgqzgcTGmqHAAIgeDR6suK7nqEe4HlAUAYvJ6FcHiYBcAAbqWbS3hW2mPggbGeACrgaGKCq+DWXg-L+zjWHQXJDA4fjUWCGWWA5Y7Qa5h4eaeZ4+aJ-mBahwVKWA3DIBpd4OvhH7xPYYK5XEXrCkxlG-tYYYArKdjOEBUS1uxOQwqOUFatV7kCZ53m+cwAXwRuW44DuECSSQ0mySeXmiWmF54Fe6nRbhPUcn+el5RlYJAQGSzjO2E1cnQ1hsc4qXCqxpkVWthwAGI0Ow5CSbBtUrgIDCTiw04cJ5rS2t1lavWKNiWQ2KTghkbG+B2Xh0P29H8iC-ajdky1zhAcDtJO0NgOWWkPr0BDBL+gu08CYvi+LKrLWqnFOaUxwVCFSYQLzeGvYOHb9ZZhEyq4cqeClUtbKtXGHGUSgVGctSqy9OkIC40RRJEQIpH4ZkTVrAZzZNeseG4GhGytkGm-QOrHXqlA4qFRocCa5JSBakA2wTdvNg48yiqlCTUW4aSa12PgfiM1EegHjZQyHdAADLoDUepgGY7BwZiMv4MncXOpEGcpSk-UrB+2XTD4ziOO4AdMQ4spDMDFdy3Qib8KgKZgGmrdiNmubt-zERRNEaT63p-a0RrE3UdK-gBvEuWDrKviz+OdAAEqQJQVSZlemPoLm8iKFv+GsXvPwHhD4ZTopYcyAY6Cg2bFfFik1wR32llzSu6NRyYxnFmecOM-6vQhHrAESQ7BxFmD4awVEuwfgvmGa+oJZT32goiZGAlEI4Ltl6HkSRGzEMPp6TW9gva631v7QOa9uZ0F4vxTEQkRJ+XEoSKSMkZCsPimNPKAcL50SvjYca0wUjREFDWRUudBSgnoetNyKMdqNX2lAZRvREo8jTuTUUNDqY8n8HYfwaR+QzyQSbOecMJCwERphaozcrp2MQLEFKgw9I2X7MxIYbjuzpB+t4kYrgzGHBEDIAoilYB8RwJEhA6RUqDDFP1Fwco+T-WmCQlJni0j018dkIAA */
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
            target: 'Project has no AOIs',
            actions: 'setProjectName',
          },
        },

        entry: 'setEnteringProjectNameStatus',
      },

      'Redirect to home page': {},

      'Project has no AOIs': {
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
            target: 'Project has no AOIs',
            actions: 'resetMapEventHandlers',
          },
        },
      },

      'Finish creating AOI': {
        on: {
          'Project has AOIs': 'Select mosaic',
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
        return {
          ...context,
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
    services: {},
  }
);
