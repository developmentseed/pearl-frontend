import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdicAOe+4DMn7QE5rrp5OADQgAJ6Itg6+dAAs9k7aHp6xAKwJqdYAvlmhaFi4hKQUNPRMrOwsqGAkEGECOvpIIMhGJurU5lYI1taets7W9rbarrb9brapoREItnapdLaJU32x1rGuqa45eRjY+MRkVLSMzNKV1bX1mrZNhsamnc3dvf2Dw6Pjy2PT4ZH2PpLT5pVwubTaJz2XYtfaFI4lU7lC4cK51BrWe4tNpPLo2PoDJxDEZjCa-GaRSEDWLrHw+AIQpww-IHIrHUp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQBp6cytR4dPEIJypGLxJL9DKZVwUubWCF0fzapJQoJEzzMuGHYonejc3D86iCygisUSqUyOQKJQKwS3LFq9pmF6IbW6+z6hzao0mkbWRYeRLDTy9bZOXwOgpO9mnACifAlApYtAA7iwWYUqyQiGABABlMB4OuOzvUJtgRqqnEa6M9FwDWz+Pr2XyuXypTYpifaJYbVKeba+Gd5pm5WGFtmI+gAETAQtKbGo7RIYhYAEEAPIASQEDGqsHFEBYEFQJFrNbvT4sAARnIeAaAOzQRriI6xFC6apFCtjrIkyb-HMoyeHEniuGMmzWE4sHZLu9ZFoedAnmetAXleN4Ps+r5wB+orIGI6C1ABj7AaB4EqpBQ5RqA3SwfY8GIch2iobMmSOKkS6+Ou2HLCJBasgiLpclcaiepwJDIAIACyun+jgmmQBBDyRs8gmRIkmGuJsmxbP4mxEouvjLvMaQuL09ibNhKnws6HIAOokO02lCugkrfswLBRSwKjUDgYBiAZRlcL6EDoNWWi8RZ0HWQgmzaJh9giakmTjNO1gmoC1h0NsDjaBskKxA4tgBaR6lHj+1aVnRwFhF+P5QFAAppcgnA8OKXBSOZ2LqgJliIJ4vh5nE2hIfYni+atvk1WhuF0HYiR2PZc5jDuez7mpHI9b+-WAUBQ0xaN42GZNGXitwyDzVBw6Fes6x0B4-irRsTh0iaNLjthm3avEZpElde6qUFpz3X12kDc9w3MGNnovm+TGJcltGATFtYgXgYG5eG-FWctRUbPVoN9M5kMlSa7n1e485QiJ23zqknUHupABiNDsOQCWaY9z5ZacNASOgvL0CRYscpLl6wDLJk1Fpgp0QgyvoAqHSNH9DOavO2ENQRaYEjS9l-LM+G+LEzgEdmKQlQ5KMa7dpa9kBYjSI+pAwKgQ2tjwqDJSw7Zh-gUUCBH5zR4nccJ5U4rJ4qVuLYz3TLCVdD2RXTkbGCB2zNEThLOk3hpnmAS2DsxHdkH9BliQofh5HEox9n0hJ4UqciAAjtwcCKhxX4pR2-Z5QtlmaqXdkOThOrV65aHjOkcQVf0QQe9tfSi93dDix2FDUWo15fqoJACIr9Cm2rdCB+j9A33gd9SwfjeCAz8TbUBVubHiuhC5rxHFEda-h5J+DsCMVqbkBiAnsusMYoxrSXx-tfW+MtAGUEfiAvAL8JQYFQF-MQqhIqoCIF-LuBC-4AMvEAp+FCwEQNUBbPQMCCpM3gTERBPh-BREZLERcNIlhEgSJmduSEA4sOLD3EOYcWD6SMGFHAidF4p1QAZHRyh-R50KGZFe-0lqvAJB8Ek3xJiuxsmXBC8wdSbgknOEWncboEN7v3LRJi9Fj0McIMA09Z6QHnhARe-BBEAyZm8QkxIvhkimCmWCDd26JFcNYXwiY1z2l8WjNRdAAmaO0bEm8oSwJGKqSlMxBiC5WOtiOfCThxyTh2jOOcC5962Xtu4zc7kdQVXwWUhiEBlBPCqDUdEr5KDNi4jTDQXZGKWPpkXTUAR3j4RKjtJGIk5wpncKIzaa1Yg+DGdqCZZEpkzI6HM644TImwDngNapS8Ek2JWt4VwINVq+F8hJeYeZnFzChACpGwKrklSUtCEpgVJnVGmfgJ5aJ6gMXfNE-8ONuJ00HNskc3g7bbU3CC2S7sIVmh8MdDYM5IR+Dqnc9SZZ+CSjQJAR5azUC8GVFs2BhVYxxHjNtQpkkbA7QbmmESmY1ryXzEirqHJ2V+i5Wi2ZfLqANDuESoVTMRV6nFYaAIJo0x+AtPZW0zLswe1Zaq8snLUU8uoFUflmhMT6qEd0I1YqDRJjNWhIYQRAXiu8fObQsQHWnE5HLbGT5X4aHfuA1W6tVFkTjQbeWPCzZ8KgT84uLjN6Vx3i5WuNhYIDB2gkeMiRnJlRjfQKeM93mVhoO8kgSUWxvzoB-dNfiykttnu26gnbu25sgXTQtOy7HyIcekmlWZjrDHwmVdy4Mm10GHW27SHaKHdoEFQqKtD6FRSYd-IdETW2GwvOO5Kk783TtacSwqyT7FpJ+Bk-enjAVBCudgyE7gt1CF4JebSGrXUCC4NUgQna8BijmclSgUgIAzvaVSuRmQ4LbViCVEIwbZKOAKagnCSQtjjOVZrU4oHqDgcFJB9FGhwnIdQwlHkvJWg0DwOht9skYjDHXVEM0slpHBvWMuCu84aRXInCBsDlZGNPBY2AFD0S1DNiFD+ZsvGkmZEwptWS0qJygxpdmT2bgPEOxNfJujimXVMZ1SIVj0SlNPPyFAYmunXibBiKuBC7lQbGmDb0AFdoilJCGD466pSyK0fo+szVHQBC3iAlFTs2rvM2HSMuDwVzNw4WnBVc14xWafA8NOWc1rbMJbc8xh5jn3VuurCQaUaXUAtMFT6mwY4ljdMq304Lbtj4gwFmM+I20O4xeRXFhTEGHPKYa1q3gLAWscBwOgIgLEl5oZfQa14vWJxvAG-OIbNhfIxEhgU9mIw6TRdRjN9SWa+Hzf3EmpWqbP6XszfGhj3ZH1PEtnt7rcxliiPyeIlBUjzUpEwp02IPMEcBF8tGqjV8AAybFPx0P4O8jiArvWJIO50vrx3emnZTHVOI7d3D5Kwf0DqaOCEADVryUHIdISmbq6IE74q+pmwlRLDHEpKno+Ej4M8qsVbw93vvqVZ2IdnqhOe9W54msMhPflFTgiDBCwv9mi8Ig1GcmRGTrgJFutVkpuWdgGjBlst4ICflIJNMAUg+AsHIF2iAYdUCwCywgNc8ly4pE6f4eyVUTRjDiHmKYtt1w0+KdNlVGN2AsRIENLSQ0BotdQAlmD14BAAGkwBgFd9M291NabrJxbtrrRPEBrhEnQCEvkkwez6DS5qG0EbZhcOCYDTOyklgr-LFLgENt579GtvGo1Nma6LQgVa611w6jy-JbMmQTSJGXCG2cQQJI79R8n6jPdR8JufANZKTr-SvRgHXhfmpVo4WOtqULUJRl5Nqgj8uEIUgFJKn4yIhPyvhH3CiNkTWxSYivy7TJhWVpgDyBlZlnHZghihjQgFiWHmC2Dy1pXSEt3PwgPomJmiSvw0DPEYXgKgUfxghZhBhQPBlgnQNmFhxBktEM1SD8CySTwexT2PDTzoTCErB+lYnYjt3QBAVSgAFUWIsdokJA2dPwBozww4A8m9FhW9YIKoO91xoZNwLQo1ODAQphmp4ct0Tww5b0ede1+1mFB0yILCOwc1TYp0gd68tcggyo6BsxehTp4wfB7JMkKpy4ClNhpMqpYIQNTw3wZYBp0d2A8Bed8oG8l9SRvCkJsJ8l4xNhv0653AAVsIhYtg8xsipteDT9t1oi4BYjAJ4j3ldV3DF8kD6CwYOZmDIgcJMIRgkD-AhYEJLcLBwCkMD0oBNFPleoppYkkjV4Qd1CW8kgtCdRaQIU0h6pnZJhW5yUNgchdxqAJC4BVQM0XQaDCoCB7ATQzj5iIRribjNokIt1kR-QMpywIATiBcK1Qd-BnA1xGoa4LoHjzh-RMU3iS5gUuifZsJfNW8IUohZwLR3Y48cIhhj9yir43Q+R20fRxRJRKgZQgx5RldXi+d9tEAaRHAogrl10KVtgYSjtvj1wxg-jthLcnVKx-wNZGxmwQTK01pnAa57JOlIYRJPBFw4TLRgUIR5JAg3Aojplqh8AWAwJPdNtpBkBzhuS5hMjG4EJTsLofjFx1wDCCJZw8Myo1xzDTxzwSFH46INS0hNgW9-B5wRg8w1oYSo1HAzQIRt4osiQt1ntb0XcNSkIdRBg-BITZJ7IJIUw7BMI2pUERJJFIYeC5cQowpb0GFZ84pJRSYUoNTOCrlnBrlYItCMIUxIsLRkI7ACkwZEUQCCFMZ5ZBpZ8CYoANTl9MIAhAgrlDkUhcjEAClFhqUfBOkkT5gt1tZpZZZs0L98ztoDM8x4g2otgJwxMpIgQ8lq4liNhVoWS+5NF04o5h5uB45R5mkopgzbRtSEZZwaTdDg0dpPY7AJIg9+gm4JyiF75SFgFn4NTvEQY0hOD5JHZTDFxtR6Cg8wQEIxhlIh8yIKlpBtFYBdF9F84LziSQcJx7Jy4tgthHYrsztIUzQ4hkJ-AFjRhgDUT-ENFEL9ialzzUANSGU4z3IgZlg8wwQCM65Bl-1yUEgqsHiFsMV5lZhkiPCmVvCK5kcTcYSZxPZhdvETMiQhgWSOVEtXUms7T3IlhZxvJOj-DAjCMthviCJ2L25yM6yqKykAz5ZgyJMLQzS0x5IRhKtzV4gBMyoOlNxfCVF7D1Id1b191YCwBgzLk4gkF4Ya05wRTCNeT+gxglEPYEdAgat7NuVHMmKskQYKTByzRiRzVhgG41pV9tg+hIZ-Tfsux9w-zthvC8NY8HB8IFgYdgZNork3AaREFGd6yylMd2IcdZ4OImKiMGoo0iQo0-AvAUwdQiqadTdsIwQ0gt0Fcld+A8YcohqMKUi0htpJLEI8kRhcxoZfI4gNgmC8KSoUq4K2Ub8bd557c5zvAW9FzfJ25+M1z8QPJPIXyJJjCphzCBCM9FSaBs9AJc988JDrx8yo04diyCIrRAhzVu9nyxEWoO8CChjbStqtc8MAhy449yo6pNwIUkxBhvZAggNGSAbYB08hDtIRCsd7rIaxBoaSdswHAfAvJ4wPj5wYhXAXy0hIQKojQLTLDbLsbF91woQGpKS-Z8k18gjPY5JSqaczooitNqj546i8A7TJSGpAh+bxg7Q8MYScJq00gkIIRJFswBihj5SRixiKYJiHqJabYJJd9NpAgpSckPqiokILRILIZtRGT5wdisggA */
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
        drawNewAoi: true,
        confirmAoiDraw: false,
        cancelAoiDraw: false,
        uploadAoi: true,
      },
      aoiModalDialog: {
        revealed: false,
      },
      uploadAoiModal: {
        revealed: false,
      },
      imagerySourceSelector: {
        placeholderLabel: 'Loading...',
        disabled: true,
      },
      mosaicSelector: {
        placeholderLabel: 'Loading...',
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
          {
            target: 'Load latest AOI',
            cond: 'hasAois',
          },
          'Define initial AOI',
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
          'Pressed draw new AOI button': {
            target: 'Waiting for drag or cancel',
          },

          'Pressed upload AOI button': {
            target: 'Displaying upload AOI modal',
            actions: 'toggleUploadAoiModal',
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
        entry: 'setupNewRectangleAoiDraw',
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
            target: 'Validate drawn AOI',
            actions: ['endNewRectangleAoiDraw'],
          },
          'Pressed cancel AOI draw button': {
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

          'Requested AOI delete': 'Deleting AOI',
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
          'Requested AOI delete': 'Deleting AOI',
        },
      },

      'Enable Model Selector': {
        entry: 'enableModelSelector',

        on: {
          'Model is selected': {
            target: 'Prediction ready',
            actions: 'setCurrentModel',
          },
          'Requested AOI delete': 'Deleting AOI',
        },
      },

      'Prediction ready': {
        entry: 'enablePredictionRun',

        on: {
          'Prime button pressed': 'Enter prediction run',
          'Requested AOI delete': 'Deleting AOI',
          'Pressed new AOI button': 'Waiting for drag or cancel',
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

      'Load latest AOI': {
        entry: 'loadLatestAoi',
        always: [
          {
            target: 'Prediction ready',
          },
        ],
      },

      'Validate drawn AOI': {
        always: [
          {
            target: 'Display tiny AOI warning modal',
            cond: 'isAoiTooTiny',
          },
          'Exiting rectangle AOI draw mode',
        ],
      },

      'Enter edit AOI mode': {
        on: {
          'Add map event handlers': 'Editing AOI',
        },
      },

      'Display tiny AOI warning modal': {
        entry: 'displayAreaTooTinyModalDialog',

        on: {
          'Keep editing button pressed': {
            target: 'Enter edit AOI mode',
            actions: 'closeAoiModalDialog',
          },
        },
      },

      'Editing AOI': {
        on: {
          'AOI corner was dragged': {
            target: 'Editing AOI',
            internal: true,
          },

          'AOI center is dragged': {
            target: 'Editing AOI',
            internal: true,
          },

          'Pressed AOI cancel button': 'Define initial AOI',
          'Pressed AOI confirm button': 'Exiting rectangle AOI draw mode',
        },
      },

      'Displaying upload AOI modal': {
        on: {
          'Uploaded valid AOI file': {
            target: 'Finish creating AOI',
            actions: [
              'toggleUploadAoiModal',
              'setCurrentAoi',
              'updateAoiLayer',
            ],
          },
        },
      },

      'Deleting AOI': {
        invoke: {
          src: 'deleteAoi',
          onDone: {
            target: 'Refresh AOI List',
            actions: 'onAoiDeletedSuccess',
          },
        },
      },

      'Refresh AOI List': {
        always: [
          {
            target: 'Prediction ready',
            cond: 'hasAois',
            actions: 'loadLatestAoi',
          },
          'Define initial AOI',
        ],
      },

      'Exiting rectangle AOI draw mode': {
        entry: ['exitRectangleAoiDrawMode', 'updateAoiLayer'],
        always: [
          {
            target: 'Finish creating AOI',
          },
        ],
      },
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isAoiNew: (c) => !c.currentAoi.id,
      isAuthenticated: (c) => c.isAuthenticated,
      isAoiTooTiny: (c) => c.currentAoi.area < config.minimumAoiArea,
      hasAois: (c) => c.aoisList.length > 0,
    },
    actions: { ...actions },
    services: { ...services },
  }
);
