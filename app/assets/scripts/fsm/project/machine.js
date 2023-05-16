import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEgutjWr4dATFudLxD4dKeAy0LpG8Sw4Rm2iOPYYyOF6tYCledC3vetCPpQz5vl+P5-gBLAQKgJCdk+L7gV+0GwfBeqIXOKagM8lFRHQwxDP8RFfAMDKrLuCn2FyJ5Zv8GY0fyyJ+iKFxqMGnAkMgAgALJWZGOBmZACF3MmjwydYdjkS4AzJCuqwUu49gMh8YJjG6aTWhMcLnuOxlCgA6iQbQWTK6DKrxzAsOlLAqNQOBgGItn2Vw4YQOg7ZaBJrnIR53Qnu4rguAkfwFl4DjWup4zoT41qODhSwDE4hlIr6iXJeZ0ppRlfHSjleUFUVv5wNxC2FcJkGZZ2MF4HBVWJlJ7mWNYLp+CWHjUvY7JXb4XXEu8fzpPM3x4XuI2XiZSUpVNOWZXNyprUtXGQLlJD5etEE8Xx21iVoNyzoa0nHd08SrE1ubsk9fjpH4BGBMyWNQjpNpVjstHxcc17Q62kNQWEUPMFAUrFcgnA8IqXBSC5eKI0dsnps45I4yeoK+UR6lcn0u44QC7pskEZ5k0ZY2U9TFm0-Tf1M8GLNs+G3DINzSHznVBABPY7xRFSqPEjaFJ43mlvJNj7KPYrNbK-WN5q9KGsM1A2tQJxK0g4DG0MzDu3iQdvPGmbQULPMZKDSRG7qQ46HjK4NgJK4sRBLC710SZABiNDsOQPF3uX6siVBPDUBAsACOVxw0BI6DivQF7F0KZfUBXVdMTTdcN03CDt+gWrtA0RuHXHxIgjEvh2JRIJEckBE+M4G6L9yV3Z9RsXkyr9AlyOFBsAPagkGIPGqCQLcaPQk9d3QPcU2fF+V+XN93xAD8J7UA7tPaOc9Y4oV6Bba0T1QQbAGM6W64REB5j6FuQY10yzzHdh-U+dBz54Evr-Sgt9754EfkqDAqB35iFUNNIg784p4IIUQ6+JD-6AMnqA-a4C3Jx2UnQF02dORo1OgySYJJiRXViCsPOsIvBF0-owKoEBlAPEqNULEv5KD9lElHagY4Q4QF4bVZGFJEiW2JLCe09gEj2gIpLOgXgiJOABEyKkii8HLVUfgdoGjLjCDAAAR24HAdim1CojmnNVHmfCFyfAUpuPwWYPDrjtCkMEgxJi5lhIkTxXtlGQDUX4zEdRlr-hBh2cOO09omJNsjAKYJ+qu20rI80BEHALD8ACO23xxjQnyfRbxxSND+KxCIEJYSQaQ1gO2EwFA6lIy6DbC2q5+rpleMMZxdotzQPSBmHCGQk7uEGSZYZvjRmlMCZMl80yRKwHICQKoLAACqQgAAyiy+aIEoi6Uk5EXQbHTCubcyCEDZhGApWW-Ugq7jsKcoU5z1FXMHHMwhlccDcFQFUPgV8XxgwKiwPAYRkDRJjnEuqHI0G5gFvackV10mUX6FyLMyxKIOgRaiFRIyDFXIAEKqEvmgIpFyDE4HQEQYCUTjExONksn5ww+gryCDYGWG5JhIJmERIY7xnFUgdP4WENhOX0CbPwZUwqfHIt4Lqclpiug2gWF8aEW5qS7gSFMMFgVMnzDzv4bSsCTnH09vRM1EZLU8sqDahMCMKXI0dS4eBrrhhxBwlvBI7w2TeApJRHwxrg2jQKWGi13LRVRuoNiO19SHWTETS6nOKaPXqQ2GabwMKRgAgmEGpWhb6LCjMiPb8rcX7AM7t3JhBT+3VEmhtIBIDVAzz0F840Vs+iwO0nm4F9IvUK3+dnDcZJXEKILR9IUEzQkvlbDQfF4Mn5t1HW-XBBTz1hKvdQG9BU51TwXWA2V88FxSLBNI14XgHS-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-MwUnKLZ78PAytTx7Tg7-RHMr0wxFRf9VRowNRlAk8HbSTwK4VDSqj9kswV5QUZg1gdt7QwayRaQazM66Bi1sSxxaJex+wI7ngxculBhhhZLnEzTIhGqHpZDXEs1kg3DVF6jRw4IWByAJVpBkBTh+7AjScroghfgdqRgRgiwyzclUF5hdkg7jKhRGIHxBJwkt7FxVg4qhshtBpPaLbmROQSLswYF81fLJ1+KO8H6ehYSq7yy4hrCpdEA9UnEhhup-BRYfAzMvoZ1pp-ZsoAZcDgGc1nBXhCdrolhcYGTEh0Igolg+s9sKIfLUS8EqZ+IzK6Y98pRgH6qFg+t7QIpoic104cYnFAz9l1gA026r7jh+5B5JNh5a5IJ65eAm5sG9IMIPgJTEFKj6TpdPBLdXZPyh94gzMWEf42EcqH5gHV5ciPhwd8cLioGvbrRBEfNbDk0BgzMHtLlw6y7tiKQsxFhO0G19UPg7RPBLCQQfB8xJgM6RHTUf9say11sjo5Vti+sukTwV4RZ5gCKCIUgFhkgYzVhEFdGrbjgGddyH6HAc4lrC8gi7Dswt5nRymi9eM6R0wYbLyyNwYSnaKXBErX6SGMmb82Q5YKHqRL7UbBMbsFt3r6l4njQON0IdINI9w7ZxaxSwRSiUgsxWR2phGRn-R+Ke4H6gh0IYz-BOl-g-Bi9zE3gkhvBgn2HYyCn6AVcwJ1dYaIJ5HTjEhfc1wPB2o1GJ75hjaFnJZ5FnQ48jCk8PcNoWG9xtbwCm6YSpFQ8l40I8484lJnymComG9w4JMwBgGstJDVhdavhXgE72MLRSRnEoQvJVVnRhneLGx0CpGWGBE9r1h2R-hBoMniw9wBawmcZ6LtmGJUrlDVC9CNCRItCxBsG46hb0wyx1nNmp9GNmUPh6CVx9sEiPDw5Ui8BgHgV+hCHvmjUsxjibQYhoQroiKmNQMai6iChGjmisLoY2jsGKISQBHsZjTkg5L2NCGMJKbYM84Y80L7nbj4ysSNScTPxsHPACY-g7YEMNx9kSiuR-k97tIrS7BwnBX+yxAmzpQLzin3GF5aWp7Lt59K8ixvbfzPAU0Pm6XUCGItzmydzB0TGcIVnabKW8x3Q6QPzhgVXBgZFQRs36W6t0apljCIkQKI64JkAKaLTMZdxditx8IQBMcZRdWUYqIFIMxvA4jUX0xQh64o4iAKaaTK7l2oah3QgHioByAt2XgaryI7SD2Mwj2QA5kIB5AiRtBQgFBpiH2KbPVnhrTci93fgHRD3yKF3+pL393yIh21LTKpHzLNLXkPkH6vWZ9Go58V5aQAnoglgV4yw7TnE3CAqIXXni2UJD03hLXAnoXKdxac4pzcdfaCzGpR3G3+rBrw4RrJWeJxqoAWHyQmoEg4hvLnVBhfnZgVyuMNhc41r-B8n-76JDqnljqmbZ30B52JarYMIPngMPAoRPUN2t2ohGpDOEhzbjnicQAT24Iz2JbTprPCXJPnQ00QA72gO5O4hrPbZaSTx7Ov2f3ZgXR-2Et72t2cZQghdJsAvbPgulmDOKd3PO1TPmnRwoJ4bonTEpmFwRgJguN0FjccIqd1INVl5Qt-tdiiIzNPwIAE8MMDERBubkoDEcWH6INPNpFfc8HCwGTKQy9Sx5hGooRxh5bMggA */
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
      sessionMode: 'predict',
      aoiStatusMessage: 'Loading...',
      aoiActionButtons: {
        uploadAoi: true,
        drawFirstAoi: true,
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
      aoisList: [],
      mosaicsList: [],
      imagerySourcesList: [],
      modelsList: [],
      currentInstanceType: 'cpu',
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
          'Define first AOI',
        ],

        entry: 'hideGlobalLoading',
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
            target: 'Define first AOI',
            actions: 'setProjectName',
          },
        },

        entry: 'initializeNewProject',
      },

      'Redirect to home page': {},

      'Define first AOI': {
        entry: ['initializeAoiList', 'showFirstAoiActionButtons'],

        on: {
          'Pressed upload AOI button': {
            target: 'Displaying upload AOI modal',
            actions: 'toggleUploadAoiModal',
          },

          'Pressed draw first AOI button': {
            target: 'Waiting for drag or cancel',
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

          'Pressed cancel AOI draw button': [
            { target: 'Define first AOI', cond: 'isFirstAoi' },
            { target: 'Requested AOI delete' },
          ],
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
            target: 'Define first AOI',
            actions: 'resetMapEventHandlers',
          },
        },
      },

      'Finish defining AOI bounds': {
        invoke: {
          src: 'geocodeAoi',
          onDone: {
            target: 'Configuring new AOI',
            actions: 'setCurrentAoiName',
          },
        },
      },

      'Fetch initial data': {
        invoke: {
          src: 'fetchInitialData',
          onDone: {
            target: 'Creating map',
            actions: ['setInitialData', 'refreshSessionStatusMessage'],
          },
          onError: {
            target: 'Redirect to home page',
          },
        },
      },

      'Prediction ready': {
        entry: 'enablePredictionRun',

        on: {
          'Prime button pressed': 'Enter prediction run',
          'Request AOI delete': 'Requested AOI delete',
          'Pressed new AOI button': 'Waiting for drag or cancel',
          'Requested AOI switch': 'Applying existing AOI',
          'Requested AOI share URL': 'Creating AOI share URL',

          'Switch current instance type': {
            target: 'Prediction ready',
            internal: true,
            actions: 'setCurrentInstanceType',
          },

          'Batch prediction completed': {
            target: 'Prediction ready',
            internal: true,
            actions: 'setCurrentTimeframe',
          },

          'Switch to retrain mode': {
            target: 'Idling in retrain mode',
            actions: 'setSessionMode',
          },
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
          'Starting prediction',
        ],
      },

      'Creating AOI': {
        invoke: {
          src: 'createAoi',
          onDone: {
            target: 'Starting prediction',
            actions: ['setCurrentAoi', 'updateAoiLayer', 'prependAoisList'],
          },
        },
      },

      'Requesting instance': {
        invoke: {
          src: 'requestInstance',
          onDone: {
            target: 'Running prediction',
            actions: ['setCurrentInstance', 'clearCurrentPrediction'],
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
            actions: ['clearCurrentPrediction', 'hideGlobalLoading'],
          },
          'Prediction run was completed': {
            target: 'Prediction ready',
            actions: 'hideGlobalLoading',
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
            actions: ['setProject', 'refreshPredictionTab'],
          },
        },
      },

      'Load latest AOI': {
        entry: [
          'updateAoiLayer',
          'refreshPredictionTab',
          'showExistingAoisActionButtons',
        ],
        always: [
          {
            target: 'Prediction ready',
          },
        ],
      },

      'Validate drawn AOI': {
        always: [
          {
            target: 'Exiting rectangle AOI draw mode',
            cond: 'isLivePredictionAreaSize',
          },
          'Display AOI area modal dialog',
        ],
      },

      'Enter edit AOI mode': {
        on: {
          'Add map event handlers': 'Editing AOI',
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

          'Pressed AOI cancel button': 'Define first AOI',
          'Pressed AOI confirm button': 'Exiting rectangle AOI draw mode',
        },
      },

      'Displaying upload AOI modal': {
        on: {
          'Uploaded valid AOI file': {
            target: 'Finish defining AOI bounds',
            actions: [
              'toggleUploadAoiModal',
              'setCurrentAoi',
              'updateAoiLayer',
            ],
          },
        },
      },

      'Refresh AOI List': {
        always: [
          {
            target: 'Prediction ready',
            cond: 'hasAois',
            actions: ['loadLatestAoi', 'showExistingAoisActionButtons'],
          },
          'Define first AOI',
        ],
      },

      'Exiting rectangle AOI draw mode': {
        entry: ['exitRectangleAoiDrawMode', 'updateAoiLayer'],
        always: [
          {
            target: 'Finish defining AOI bounds',
          },
        ],
      },

      'Configuring new AOI': {
        entry: ['refreshPredictionTab', 'refreshSessionStatusMessage'],

        on: {
          'Mosaic is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: [
              'setCurrentMosaic',
              'refreshPredictionTab',
              'refreshSessionStatusMessage',
            ],
          },

          'Imagery source is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: [
              'setCurrentImagerySource',
              'refreshPredictionTab',
              'refreshSessionStatusMessage',
            ],
          },

          'Model is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: [
              'setCurrentModel',
              'refreshPredictionTab',
              'refreshSessionStatusMessage',
            ],
          },

          'Requested AOI switch': 'Applying existing AOI',
          'Request AOI delete': 'Requested AOI delete',
          'Prime button pressed': 'Enter prediction run',
          'Pressed upload AOI button': {
            target: 'Displaying upload AOI modal',
            actions: ['clearCurrentAoi', 'toggleUploadAoiModal'],
          },
        },
      },

      'Applying existing AOI': {
        invoke: {
          src: 'fetchAoi',
          onDone: {
            target: 'Prediction ready',
            actions: [
              'setCurrentAoi',
              'setCurrentMosaic',
              'setCurrentTimeframe',
              'setCurrentShare',
              'updateAoiLayer',
              'refreshPredictionTab',
            ],
          },
        },

        entry: 'clearCurrentAoi',
      },

      'Deleting existing AOI': {
        invoke: {
          src: 'deleteAoi',
          onDone: {
            target: 'Refresh AOI List',
            actions: 'onAoiDeletedSuccess',
          },
        },
      },

      'Requested AOI delete': {
        always: [
          {
            target: 'Refresh AOI List',
            cond: 'isAoiNew',
            actions: ['clearCurrentAoi', 'refreshPredictionTab'],
          },
          'Deleting existing AOI',
        ],
      },

      'Creating AOI share URL': {
        invoke: {
          src: 'createShare',
          onDone: {
            target: 'Prediction ready',
            actions: ['setCurrentShare', 'setSharesList', 'hideGlobalLoading'],
          },
          onError: {
            target: 'Prediction ready',
            actions: 'onCreateShareError',
          },
        },

        entry: 'enterCreatingShareUrl',
      },

      'Reset drawn AOI': {
        entry: ['closeAoiAreaModalDialog', 'setupNewRectangleAoiDraw'],

        always: 'Waiting for drag or cancel',
      },

      'Display AOI area modal dialog': {
        entry: 'displayAoiAreaModalDialog',

        on: {
          'Restart drawing button pressed': 'Reset drawn AOI',
          'Proceed button pressed': {
            target: 'Exiting rectangle AOI draw mode',
            actions: 'closeAoiAreaModalDialog',
          },
        },
      },

      'Starting prediction': {
        always: [
          {
            target: 'Requesting instance',
            cond: 'isLivePredictionAreaSize',
          },
          {
            target: 'Request batch prediction',
          },
        ],
      },

      'Request batch prediction': {
        invoke: {
          src: 'requestBatchPrediction',
          onDone: {
            target: 'Prediction ready',
            actions: ['setCurrentBatchPrediction', 'hideGlobalLoading'],
          },
        },
      },

      'Idling in retrain mode': {},
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isFirstAoi: (c) => c.aoisList?.length === 0,
      isAoiNew: ({ currentAoi }) => !currentAoi || !currentAoi.id,
      isAuthenticated: (c) => c.isAuthenticated,
      isLivePredictionAreaSize: ({ currentAoi, apiLimits }) =>
        currentAoi &&
        currentAoi.area > config.minimumAoiArea &&
        currentAoi.area < apiLimits.live_inference,
      hasAois: (c) => c.aoisList?.length > 0,
    },
    actions: { ...actions },
    services: { ...services },
  }
);
