import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdicAOJwFYAzB4Asr-21fJwAaEABPG21rAE46GO8vL2sPayTXIIBfTLC0LFxCUgoaeiZWdhZUMBIIcIEdfSQQZCMTdWpzKwQ02LovWwyAvxjtEfswyIQHGMcnWxmHJ2tteztXbNyMbHxiMipaRmZpCqqaus1bRsNjUw6mrp64-sHfYdGViaiYpzpo7S9XLY7KNYr4Ns0tgVdsUDmVjhxTrV6tYrs1WrdOjZkk8Btohr4RmNPggnNoPPEPKNbG5PHMZuC8ttCnsSnQAMIKHAAaxoUDYADMWNxYGBUGwOLJ5Io1Cp+BB6npzC0bu1MSSCXRfPYgX5XPYnATfMTltrNbYAQMnF57ACwTkIfkdkV9vQObgedQ+ZRBcLReKZHIFEpZYILqjlW0zPdEAa4lqdf59YbiQM9XRqUl7BkBl5-gzIU6WQcAKJ8UW8li0ADuLEZBUrJCIYAEAGUwHhawWO9RG2AGkr0aro91XNZZjFlg5UkE0in9bY6EmgitfD4PHr847mTD6AARMD8kpsahtEhiFgAQQA8gBJAQMKqwEUQFgQVAkGvVy+3lgAIzkeAaP2TQRhiw5JDM8TWNBo7msEyxeMSfg-Nmqz2B4CQDNSm5MtCLp0Puh60Mep7nted4PnAz5CsgYjoDU343n+AFAYqIGDlGoBdBBjgTjBdhePB-zEvYCTpsEMTuAa3hWk4OFQs6rJsqcaiepwJDIAIACyGn+jgKmQMB1yRncXGINSE6Lh4ti+LYeJeAk1jGmS2iLnZeoEuu1IePY8mFjudAAOokG0an8ugYpvswLARSwKjUDgYBiNpulcL6EDoFWWhscZYFmQg9j+L48Siea-RuAMTkRIggKak4MRla41r1ROMR+du+G7u+VYVuRf7hK+75QFAvIpcgnA8CKXBSEZaIqpxliIJSjgZh467rqS1juMSwReM4cxpIJthrfYeLtXhrJdR+vU-r+A1RcNo06eNaUitwyCzaBQ75bGmraikiaxka1UILZ1h1YJ9WFQM3xyfadb+Z13U3Uxd2DcwI2evej7UfFiVkT+UU1v+eCAdl4YcaZi3qnG-26kmMTA5MPng7ZMyFb41ieK8tjnYpBwAGI0Ow5BxSpKMCBlBw0BI6BcvQCMdayQsnrAov6dUql8uRCAy+gsrtA0n2U2qq6QaSoxNUsuZkiJtUeJ4fG+FqSyuOs8NdhdJY9r+YjSDepAwKgA0tjwqCJSwbZ+-gEUCAHRzB5HYcRxUIrR3KxvzVTXQEtEdCuJJ7j-a8qx2652hLNoDh2Ah+p80W9AC+2FAkWoZ6vqoJCSxo9B6-LdCK17jfN6Lwtt+eECd7r1CywbrG6JnJlqkConiW7NdV6SAzOak6Y2S4rjeAMGF2psW5D3QTd4C3Y+UO3k94F3ooYKgA9iKo4WoEQA+e-zw-X6PE848O6P2nrPVQhs9CLzytTFecQbLryBJvKurhnJBCsiMXO64Gp5g9ufP+dBSwkF9tILSRgQo4EjklAoscyGwAof6NOBRDI5TmkvYc3gYh7TJNZP40ErTjBBlmculdq5IOavXAKRCSEsDIRAJKVD060PQPI88qdqH4BYRTLOaoMLJDoKkIEB0C7WiZogYRvxRGrHEXXPBuECGUQgMoW4lRqhIgfJQJszFSYaE7FRLRA4dEcJiJZDCjMJzWWdniYkbtXC-C4VzPRNkfJwzPvYhujAqhOPwO0VxZxhBgAAI7cDgHKRir5qH8Ggd9amhUAglQakkakgJRxzlsAuWyVdVzJAyA1XydiFIZMcc43JiI6iUSfJASsYAax9RJmTapC0uh1OKjMRp5UWlVUmMdU68QtTakPnZCuyRJH4VLPwMUaBIAjN8agXgCptHsPyg5HyvxYlNW8M7BwKYATkmdm4Cc7Toi2V5gMxGrJzl+iudklxdzqD1EuIEp51MXmODxLEnwglbKCO2akOJ3lYzQQQdhMFStvYXL8TC0Z9zNAoiRTA7iCQ0XvMxV8nF5l0LklHE4dChU8Q2gSKcpS4s1LkW7tLGecsFa-wycpTWKMwH6wgfPRZ2dEC53BgXN2PKgQly2eZfwcQ1qAmsHq60qwhUHBEMU0pFYaCwEfglZsUte6Sv7oPAh1qSkOrtdQB1JAnWKrnuTVVuiHLcLWnZZY-DrRzn6JqVI6FlijB5d8S19AvW2rUvax1iUBDPwim-D+EVv4eoyZmn12a-W5rAEG5VIbWFfSWUtcNvxI18K5rGkGRy4mjkpGtLUwQMheHTXQIQvATxqWhTc+FXBVECH9XgYUrjEqUCkBAUNHD9R7UpN0w0VpGYpm8OSKNFokikleNYUd47qCTr5NOnJGgCmrvXXFTkXIWg0DwJu-KPkMh7IdgSAu-xvndrNr8ByBdfBVzgg4a9E6KwPtuM+sAa6plqCbPyd8TYf3Uz-cVLFKR2mUkZmYqYglwawwcqJbQIG-DwdvYhrJM6UNoZfEh3JeQoA41w10HylIDEGjmHBExtgUymt4ggkJAKtoTgY3eylLGLy-gih2OFvGlpLHBlXQSXgXBjnQohbtx1XKH1NdEfUo4bTyaY9cx98Lhn2cqLwFgVYSAShU6gDOjaTbBP0YYrmQITGFSPXMfOwjTo+QnGSK9pKL43oUxxp9jnYUubcxwHA6AiC0XbAE9iQTf0JIMTXYxXCQvdvsPqeIuZvCAlGOufpaTBkBTlRAqdXZxWutlu6mVLWRX3q7HW24RsfMFepmbWYtHJJ6bSLRjwPzTRjDsLJacG44sEIADL0RfO-fgDrGIPPpTUh4VnnDRanMsTmRnJjLEglzFp-wRgGndk18FBwABqZ5KAP2kETagB2NNTDHPA-wsFJxb1QSDZ2e0uHUfNKJBYXDR2fbEN91Qv3ur-bFWGI7zagerwQWD5B28QbQXJFXf4o4HJpB1LF17ZL6CQrFNcjsfU53NgvBAF8pBxpgCkHwFg5AA0QD9qgWAgPHh9FxPiQkHwoe2UXO4bVgkeHzFHbudgtESADVUgNPqbnUAKbnWeAQABpMAYBedOK1t4smfjJkbtG8iroFlwboRsu5F5+rQYDHzm7C0qwVdjlSQ6dJUjrcSz6plw3fp0vo2Gnl3Kx2bAO0cFZzw-RCrGuJK2hIefjUhNzOaUdxYI+itvAIKP0o-QVAejAR3jyGUp8Ps4LUVdTpbSrikHPq5NQzArhXOk7SQ9lvD6FbWFeJnUSjwG-Gtv5647VSOMcZ3JxJpnNd9Va0+i8Mq9BHmlWR+9bOWXifFEcZTKjxoQ8X95-k0X2qLaK-6pr+nFdna6DtWUjmA7PUDV1ea7vzhAVjvR0QMRs4qIm4ACqtE22UyEgX2L4fUh4fsgOqKbyGKny2KIkWYBiSQDknglWgko46ulSEsLqdAfc0q+CGS+4fsNuOseswaI2jeyeBU1kcSKwmy26SwoQ3aCQxUKQ9k5USwhm16B4j4osfUG27AeAh2+WzuNgp2L+7eb+s43agIe0pIbgJGVIeojWoezW+EIgWGcAUhP4MhDqCKrBeOT+44r+l26h2yPKPwAiMk3M64-gJeFg4+K6jqUAfs5SRME08i8hSeeOPEUE-EcElcm+CAAIvETUHknM7SGQti9o1AKicASox+JQD+w4BA7KCAhRvwtGZR5R5RR+NBAUcI-oaUZYEA+R+UnMO8e0aQ3wh8AQSQowo6tRJwbikw4RS+JorkSwq4pqwOucZGywAmtknMQ60GsQZIo6bo3IdqPoIoYoFQkoQYMo6OjRChTeoMWoe8gQvyeIQQx0rRdA7ROhXRuYbU62GSTOFYX4isDYTYTR1MKQuBLMf+MwTUNoZGiwHSLgnMAQOYPg4hTiVQ+ALAgEguWW0gyARwXxLuwQC4emx6E4LgQIXMKYISjg4ah81kQIx09ITxAUhER4t87c5EaJiA-QdgNx7gAhhULy3gZczgeI0kwQrwJBlJ+ErWNuPODJUwa0WhyQ7SyShia0zkVo+c3wyQZs4aoK9OF8wUvhn88eMUYoeMSUYp+oKQEGnMFm-CQISEXMfQPCzUh82ocGgpl0yM5eqM90Q0mMUAYplI5cHeOqW03SLgSEBo+c56NWY4G0o6KsIsYs8qLpYptk9SQQmCFUrs82Qi9U+cGeISowtkHBJePsgR8cQcIcyc0gUcNCqA8ZGEC4Jo7SjM8wx03u+ocQ7gnChIuZAwkZI8rcd8E8ncYpdkzs4WhogeMwuYRRtc6Ycw7JsSfSdOhhb2jOBZpC5CygiiFZXpDge0AIF6aQDs1ocRpI25nhhBwQL+p8C5DOhCy5siWR545ZMclZhxbB-GxUgICQvysQXCaZkwzZmZbZOZx0nZjpsIzGTmYyhpNOzg5oXCFk0GngP55kgGU5NkW0Lg+BhU+ZFKSW-2cKYp1oaYD21o3whcwQc4-wey7g1GlIwGHgKx-WjE8ZNo5c0wa4OJq4KY-gKEqedkISpJaQ4hNqlaXo1as+YAm5qw6Y3KdkgeyQbS5IJGHBlUwOjx6pnqCG7WdmMCTaS+PkAIeyKwOYp0BcRRW5K0dS68+BjMI6IFroDFis8ZlU+cFcokna8EkO2y1orkMxR5GQ9UfgNlalGSW2DEu2pSjFz5thnhzgw6NOGElOfBN2FcC4B8OYQISQ85o++EKOaO-A6MWUEVQxy8K4i41ObgxBYwZGq45IjsE4Zs7Mqll5F8TOLALO5S7OYpywbs6YtGNohUokrwQQO0nMU5-ga0skqFABsAWuOuNAeuP4BuRukBYgA5GJfQGeGEXMB0+JUOvupULgDUHyVcjVWVEKp+hVbCRxY4K+W0NorZZIDUpqw1cYNOl2FcjMJJU1M1IBsB4BP4xuK1kVS+zUqymEdkGy20IMcwcSq40OQh-QrwF5p1BwdB7YKMhpSw5OFGZpgW3u8w1oi4nS1OKwhUVo4hphas5SlheAnVGEPwPgAQ71qwQQkN2yMwPwlWlsXCSwdZgVTVBCxYPhNusJ-hgRfUwRHVQNao-QtGvwvpbgW0RiPecYwGIwGQKSPR2QmQQAA */
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
