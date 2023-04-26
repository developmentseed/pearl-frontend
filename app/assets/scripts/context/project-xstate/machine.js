import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEgutjWr4dATFudLxD4dKeAy0LpG8Sw4Rm2iOPYYyOF6tYCledC3vetCPpQz5vl+P5-gBLAQKgJCdk+L7gV+0GwfBeqIXOKagM8lFRHQwxDP8RFfAMDKrLuCn2FyJ5Zv8GY0fyyJ+iKFxqMGnAkMgAgALJWZGOBmZACF3MmjwydYdjkS4AzJCuqwUu49gMh8YJjG6aTWhMcLnuOxlCgA6iQbQWTK6DKrxzAsOlLAqNQOBgGItn2Vw4YQOg7ZaBJrnIR53Qnu4rguAkfwFl4DjWup4zoT41qODhSwDE4hlIr6iXJeZ0ppRlfHSjleUFUVv5wNxC2FcJkGZZ2MF4HBVWJlJ7mWNYLp+CWHjUvY7JXb4XXEu8fzpPM3x4XuI2XiZSUpVNOWZXNyprUtXGQLlJD5etEE8Xx21iVoNyzoa0nHd08SrE1ubsk9fjpH4BGBMyWNQjpNpVjstHxcc17Q62kNQWEUPMFAUrFcgnA8IqXBSC5eKI0dsnps45I4yeoK+UR6lcn0u44QC7pskEZ5k0ZY2U9TFm0-Tf1M8GLNs+G3DINzSHznVBABPY7xRFSqPEjaFJ43mlvJNj7KPYrNbK-WN5q9KGsM1A2tQJxK0g4DG0MzDu3iQdvPGmbQULPMZKDSRG7qQ46HjK4NgJK4sRBLC710SZABiNDsOQPF3uX6siVBPDUBAsACOVxw0BI6DivQF7F0KZfUBXVdMTTdcN03CDt+gWrtA0RuHXHxIgjEvh2JRIJEckBE+M4G6L9yV3Z9RsXkyr9AlyOFBsAPagkGIPGqCQLcaPQk9d3QPcU2fF+V+XN93xAD8J7UA7tPaOc9Y4oV6Bba0T1QQbAGM6W64REB5j6FuQY10yzzHdh-U+dBz54Evr-Sgt9754EfkqDAqB35iFUNNIg784p4IIUQ6+JD-6AMnqA-a4C3Jx2UnQF02dORo1OgySYJJiRXViCsPOsIvBF0-owKoEBlAPEqNULEv5KD9lElHagY4Q4QF4bVZGFJEiW2JLCe09gEj2gIpLOgXgiJOABEyKkii8HLVUfgdoGjLjCDAAAR24HAdim1CojmnNVHmfCFyfAUpuPwWYPDrjtCkMEgxJi5lhIkTxXtlGQDUX4zEdRlr-hBh2cOO09omJNsjAKYJ+qu20rI80BEHALD8ACO23xxjQnyfRbxxSND+KxCIEJYSQaQ1gO2EwFA6lIy6KsfqginDNL+EsRwRZBhOKCI1akWEtjH09kMlRIyDGlMCZMl80yRKwHICQKoLAACqQgAAyiy+aIBBMkfoOEc4ZjiCke2yCEADDiIsZIwx0jeA+IEQZJkmz8GVGgIpvjRmoF4LqGOcS6o2gWF8aEW5qS7gSFMMFgVMnzDzv4bSsD3CIqFMiiMaKfHqKxdQeo8NJIQPxZMFw8CSXDDiDhLeCR3hsm8BSSiPgbBMsbM2VF5yMWXOxZoHECM8XIwJYK4lOcRXkvUhsM03h+orn+B4CYCr-RmRHt+VuL9gGd27kwgpwo7W10-EAkBqgZ56C+caK2fRYHaTlemZ0W8MikipFEfw9o4gKJOaNApEzQkvlbDQF8YMCpPzbs6t+uDU3BPTZNK+2bwY+qnn6sBMTjZLMQFIsE0jXheAdL8bMwVKU9MESsQINsnoJptXQNNYTM3UArbmyh6UaF0PSgwot9FR0Zoslm8hlauE1p4XW+eC4m2kl8HEYWkxwpdpmKjCiGFYQpO+GyUmHsU1Lt4APCybKLkCC4BAQqAhs14AVBogqlApDGJ3XysxywnG7lXHCjcQRxVNSCGSLMKkYTDqEM+1sb7VWBMA8B3KYpxQtBoHgQNe6BgLC5Ihhw2ZYiuC3isGI1JUnkViAMHBbqn3UBfdKLDDwcNgCAyDNQ-YZR8X7KRuq0J7o2mSLCV4jUMhnsbXmZw-VnErEtH4AyyaPpCnQ1xzDKq+MiFwyDXjfi8hQC4hJsx9h0x7L3DnRIzpxh4zsFCxqdnZMukGGhjDr6jPtAEK+euqBRycps10aEjVSRsmhMMBwxI84ERXI6FYsKbEOiun5gzAX0V8eGaqyovAWDthIKqUL2pIvKapDEdqtKgrJ2cVvQIB6MgJ2zuMdjJ9U3+Z44FjQwd2UlJK2VjgOB0BEGAlEkDuLTFRY3AhskLHiQSLZMa7Six2rOg8ERfZw6PXVDLT3PNTqO6Fo4yZQ7fqAu0Srdw2eoHtVdC+N4K9dhB1OHMfSSlzTFieFlTYCkvlh3vNAoBWh-AhIQRxVq+bymtzNShAff4GQKUzCiFCfoIw-CJGcfaOww6ABqt9KAAP4BHAxMPqv1ScF02FwPKLaUPjuDIfQ6RumzisbSUQj5K0fSZEnYgyeqGkFtKnHEExw-qbJK6fQoQrz8D4K6badzXTqyuYROMLXDpZcqIp4S2ZfuCxAQCpBWZgCkHwFgjzG5iCVLAGnZtXhvCUrYqENJ2oEUHRhZIQPbFrF57r1RZaYeQwm6gWgyoxv+xgLN6XDb6ou4UoggIecITbMpT4MEOFvgrxwmySYjKdO90bCH+1wWRIFSVZGLWzknvw6T8WBwKy9xE3dJn89dIENQbjR22I97F1IvL164OFTALh5zetGp0cE-fPqgnd4bbswb3JGnbtAIYjfAB1ELLQRg-fQ2mP7i4eNBPiIHo2pDeZfWD30v5Oq+2RIPPZ4ZwA0IXpmi-KkvSjrzsGAiQGEK2AbCBGBJDJ+rfAIC8sBODiDBIKThPiJPePbk7tCPJBuOyACruKsOkARBRBbITFCEFCTGhneH+JXJDO8uwHgLDrys9tYCvI6LvrCADuvEpuCmMG8E9HjiMCsIgqQaJnABQSJFQS+NynNjft0CvM4DSI1AMMSM4nuOpNnGloeljE4DjFmLrhYIflUPgGDFAPbuHFtEbgOKgb5FCpge1NgWSHjGdGMNCPMB9lmKjAdmfpQFANwKgK2FUjDjZEYMlDgJGIqPbvgPXhIYngQLnk0jdLAofIFHaH8CSIcqRKePLG4dQPeJ4d4RZL4RxJ+KQDAKgPTLADwKgAVMEZEmEfHnQY3lEd3r2sMMkExgPupHmJkkSpwQXuMHzg+rpscMKO4dkT4WAJ2H4egF+nfBUCEQUOEXPgvOsmslmCuD5uWLgWCk4KCC4ESoptnAoRkVkV4SMWMRxMutqOHLMvMuQKgUFGFJRBsKjNnO1ORHaCMM4L0CoUDsSscvzv0f6EMUcbkaMUfmccYZEvwKgQXosKRMzioc1mCjCH0P4P1C6LCr8J4Emr8aXv8ZkR4YCdKHkd+NorojPgYmiuPpCajIIhRNCG6KCC5q8c3vLBsEFPMGyAcXiTkQScCTDuUtxCAeDtUrDE7iMJRE4szhMM8a8EoRsc4hbCsvaEsBkNnIPpdkKK+MgMBEARZGADoSur7BxI6nQK-K6j1vRBqVqa2LqdQfavdluo9hEfPmbG8L8ETP8O6IEKCD9jMBvPKf1LYvmCeAkMOrePbmWtafqUfkaSaYwmaSZKGSOFaXqaHl+HaQ8A6fMZAmME1A1G2nZtpEFFyHaArv8rSFyHtgij-ngmcXchEmGWYdfpEVENnD5BnFRssCEAiWMJmOpqtpMLSL4KQTcucZDJMVEuIZmabFEGdO1PjvjnnA4J3j8lCO8VuNIumLpN1qcldp6gaZBA8k8tIG8u8qdsaQWqaduUKNdimfuY8s8seWmf6roDToqehJREsIMAzlSOsTMLYkvLuLCtgo1ORFuQLlebuRcXeUeR8gINOtQgAXgPQrGZeQMRBTMlBa8h8o+bWo6caAmk1HsV8J4CvKsOjj8k4BbB4M4tCJ-vAqQYqKOOLkfk7tpKsJBl8MIlECkt7gMDEA6C0jjMSqqXGUKH-rAAAfTJDIeSQEbqQqorfOgEHCINmmFhHK2KSYYhSY2U6WSBSKSNaHZglkMHZp2Rjs4iSHuB6RRNaHYFECGf-rQpJSJNJbJf-OwopZxFPGACDBpeSQBCxdvosFRKRR4HmGRbMHuDIRuHThWJ5vENkNWNQBMXAPqGqbQJOcjAQGvsyKjFdBkCvN+XRmCmbBbG3rCHwajOyA4MOmiJGKVM2BABlc8LZX0MtockeOuKZYgEFHxUqbCuRFYr5lWQUrVecJojMDVJIT0D1QCP1FSJjEVRjn8BbBuDnJ4DhGLJiX0diSKARpmmGIqMqBUGqDGJqKLo1bUVNXYIjpjO1LClmCvNuBsWKfSqWDgbSMJShfQHrscWOLRL2P2E1Z5HpJBkMDsTjBDazgxtSNFq4lKskKQaonoaOHBDbpNtIMgKcEDVIZtiriet4IriMEWH6eyKgvMGucXlib-tXMxIJOEtjT0GxRRAMK8DnINF1bMCkMyJyERK8DJgMAdhBebgzV5GCJoTYrRpgd6YgOpk4kMN1P4KLD4MOl9GWtNP7NlADFPmIAzTKs4K8KttdEsLjBsYkOhMQfaHSDCLYiGT7NUprLNIHAzYZQsHZoqelpyBROnDjE4jSf1SCK9cOv3IPF+sPF6tBGPPAJdZEYvAsHFbYqnnuD+cpp4Njq7Arn+fFcNfRCwj-GwnJQ-CLYuQpB8HZh8DCJjuItaIItRtdcKgLdnSZIVhyuNdjebE4i6CuIrSMEREueCruInHCkMLmB8JTdtUonroYsNpirwG3T4OKVxSLPMIEM-o2ikAsM0XSKsIglnVTXgtefatjQ4DnEFW2qtQDsnFGkiZsmffLKREOaWuOpOmAEfRuS4GSOZSCikARM9IIhWKjN3u6DltxlPRctjReuhDpBpHuHbKvQgPcWCCoSkMsXSO1J9WBahUdoZrRNjUEOhGyf4J0v8H4OweYm8EkN4CCG2tRYOY3UKGDmBJDmEhtLre5rnDFUMFRVmKzvMDEBluyM6PIs6MTggaLpTiw9HTpXuDlesvaEFKgg4KzkvGhOnmRMrug38XQJPQbuHJ+i-ZI3HOSJpLlTaNmBxU9N7lsW7VCF5EDs6GPUPsyiPnuc7QIp5usOyP8IND-cWEnZ3T4BDfZeJY5cATAWASJBATrQYyhEIuhPnHNSvOMGg97oeqWSeE6EeN-nvcWoIQ8uHKIXgAzRGv0MbVRdetw12TaDENCFdD3Uem2toboQUAYUYaOdDKYbrRRCSP1djMzskK5pSsbRhLCnmAfDSXZXQwMQCVyW2DyV+LrZ4ATJsi5nzVssoVyDGkEG2t9nYFtY48cBaWINqdKBGTeQsxszDVlgHtrkWD1eWZ4CKokA6CGeCUmTaV6iLbng9IruSO0ayMWcMKWYMDIqCHs2lfQDWYgXWVEhlXBMgD8gNdCR-qCFuPhCAPbjKIUyjFRApECr8A6HnNkqEPXFHEQD8kDmCJjAPSi8C6EN4VAOQFiy8HpeRBiXwYS+mKEHMhAPIESNoKEAoB4Yyz8hSs8KiTIXi+yxmJy12aslS94DS54ILVg+HQefeR8tjfaPuCvUxqY1dK8VU9gjnNdQCDbZMxC3ACOOIxBM7VqwesC2oQptmDuOXVCikOMJKY1GCyJZTA5YAeHC5ZEzxO5VALaxYgkMCn7hsJ+TuP6VehsLnGFf4FndkEAA */
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
          src: 'createShareUrl',
          onDone: {
            target: 'Prediction ready',
            actions: ['setShareUrl', 'onCreateShareUrlSuccess'],
          },
          onError: {
            target: 'Prediction ready',
            actions: 'onCreateShareUrlError',
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
