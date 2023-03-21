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
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxAGUweNtUp5KJADYtkzMPIzJYAbQAMAXUQp0sSZXTVdIAB6IATAEYAbHQDsATgAcGgMwa7lhwBYH7pYANCAAnojWAXS+GpbuAKw+Dg4a8V4OAL4ZIWhYuISkFDT0TKzsLKhgJBChApo6SCDI+obGphYITu6+dE5OvmkuLr5xvrYOIeEI1k6WdBpjHqku8f0umdlNGNj4xGRUtIyKbByV1bVq1g16BlJtjR1dPX0DGkMj3eOTVml08Qm2ay+Oz-BZ+LI5bb5PZFQ4AYXIuAA1jQoGwAGYsbiwMCoE4sEjcPCIviUHAkfgQOraUzNW5GEwPCIxFx0NyuayWfo+dyzb7TFZ0WzuawaJzWazxIE+XzuCFbPK7QoHegI5GojFYnF48qE4lgUnkyl1K60lp3RmgDpAt5ssUuTncgJ8sJWcZCuwOB0jFyWWyuWzy3I7Ar7Yp0ACifFxGtoAHdlIqxNQSEQwMJRImQywU2n6mb6fcrRFZhoheL3C5bMDBiL+XYy-EHJZfE5bDyxnFLEGoUqw4cGL2xOQSBxqOgWABBADyAElYAI4TIyUjICwIKgSAn41O5ywAEZEvDGfONOmtS3mKyBJzRN5uPycjzxeL8rlllJt1ut9zJWXxHskxhFU6DhM4pGoNFSGQAQAFkSGQfEcHAyBTxuC92kQeIXHcXpLGfHCxX6ZJ61sMsxTSWxVnbbCBkAkNgPDAB1EhDEglh0XQPEN2YFguJYclqBwMAZDghDOB4HEIHQONqDQppzQZTCEEsYZcMlSxVPcbpVNlN8nA-MVbHbXw3E9X96OhZVwwAEU3OMNRnWcD1CddNygKBUTExCuGxMAuAANzAeTzwtZSRV5XoNA8VtVg0asfH5B1ohWcYvViWwq1mSy+1heg7K3Ry933VyeI8rz4J8ySwG4ZAQsUosrwQbTMrofDZTbcUxTsdx61WNqHUsf4cLcYzrBy0M8roAqHPYpyXLc5hPMgxdlxwVcIAEkghJE3dnJ4hNDzwY85JpM8GsvDpdPUxItJ0tT638OhJSGasUn9AJ-AmxjDgAMRodhyAE8CitnARByTFgRw4Jz1DO9CwqZZrnFwkU0j6Yz-nGWx619eZ1hbAIHHbIYAiyTZxwgOBaSHH6wALDCkYIHHXQQZn5mizmua5jZISA6yB2OcpfOjCAGcR4sEBGes20cN4ElbZsqwdb6BZKIXTiqGpxaUpGvVw5wxsBIbJS8GX7BSHD4kV1TMvGzZgys-tVURdaNUoTE-J1Dg9RJKQjUgHXGutCV4miWUHUSImqN61mZjLLlukiHSvCGwMHdptW6AAGXQaoNTAMx2AgtFHfwIPLoiUPw8rDTo-+N9TMcQi3lbbGBgAjP+edyNo1QWMwATMvk1TenzsLSvpjIsPYg0ZwJVSpsXFIstKziKt3DIw3wS7his4AJUgShKnwFhjyh9A03kRQK+UhsZ-w+frEXr03yotlq0iJtVmbJxeYVPePcIbZmhjmCcsNb5IxsPFNknh3pdDeKKWOUwGx0DXpWYUW82w7z5oAqaYEqgl04AhSBktZRzG0oRGw1hfwOE5ObOWVsbbK3trgp2U0WJsTRJxbi7k+J4kEsJGQpCmp+liHLJw8QyJvGJnPfkIoeheCkbKDwMw-6qx7jNUGC0yrLSgCIjoEUDYjVFMCQIitcZzGws2KRHhKzDDnhoqa-0JCwCBshQhoMDGIE3uI-00VhjzzoXESxfwCa2MoQ4-+w86Z0BEDIfIElYCsRwN45qf8w6Yxan0KUvhQnWLTnY94jjyZAA */
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
        on: {
          '': [
            {
              target: 'Checking if user is authenticated',
              cond: 'isProjectNew',
            },
            'Loading existing project',
          ],
        },
      },

      'Checking if user is authenticated': {
        on: {
          '': [
            {
              target: 'Entering new project name',
              cond: 'isAuthenticated',
            },
            'Redirect to home page',
          ],
        },
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
