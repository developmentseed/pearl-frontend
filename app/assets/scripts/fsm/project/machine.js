import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862Jy7wTJuXiwj42GePSfxssy8QZkMjj2GMjjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPBRUR0MMQxeK4bI2GMW7hIgqw7vJ9hwqe2ZKZm1ECqi-qihcaghpwJDIAIACyNlRjgFmQIhdwpo80nWHYG4uAMyTLqsBaAhpCAnuaYxumknITP4xkon6woAOokG0VmyugKo8cwLCZSwKjUDgYBiPZjlcBGEDoG2Wjie5KFed0p7uK4LgJDamb2F4DicvS9jjO8Picr8fgqU48VXmZKVpTKGVZbxMp5QVRUlX+cBcUtxVCVB2UdrBeDwTVSaSZ5ljWOWfilh4rgrFC9jfL1-w2HQ12svMbx4bu420ZNqWWTNeXZQtKobStnGQPlJCFZtkHcbxu2iVoNwzkaUmnd0PL2C1eZQukXwsr4BGBGCuPYbChZ2p6Ow0aZwo3nDLYw9BYSw8wUDSqVyCcDwSpcFIbkEijJ0yRmzj-Cyp6Uv5bK9XCfQ7iRrjXYyRPnlTJmJccdN8QzwlMyzUBsyGHNcxG3DIPzyFzg1BABPYz1RLSPLxFEjKOITrz28kI1QjabJfTTmv01ZjPM4DhtQBxa3gyDW0s-D+1iUdgsmjbhYLPMfVLDm-z3aFp53eCrjHoksRBI4vj+xr9AAGI0Ow5DcfedfB7rPDUBAsACJVxw0BI6ASvQl7fcKtfUPXjeMTrUHQW3HcIL36Dau0DQW8dKfOyCMRcg46xsskBE+M43wbxMqzJDuld1jXw4UGwY9qCQYjcaoJBdxo9ALwPdBDwH194LfdcH5PwgC-ee1A+5L0TqvZOqFeh205LjSkGwBjK3pPmGIi5brli9qrb06sr50GrjfBugDKCP2fngV+yoMCoG-mIVQs0iDfzHL-QhxC75tHISAyhYCIGqGXnoaBHkU5KXSHQcsRcEgYzalMUKkwnrOzurEFYrhYiBEvnRVaEBlAPEqNUHEf5KB9hEgnago4o4QCEfVNGfVJjyRwoFVRXgNhuzztdFqJF-gqO+H4QsGizJaJ0e0PRlxhBgAAI7cDgGxbaxVhxTlqgLYR84nBPWtN4LkuMhhvAdCkc0gxJh5nLokfxwpAn4GCdiOoq0ALg3bLHPaB0rFWxsbpc0vwfZtMxpaAiDgFh+EVnabB4w-ilPRFUbRFSNAhJxCISJ0TwYw1gG2EwFBmmoy6KsAYdA+p9XZIMJYnUHTHjJG8TG5F-AJArheFhVdGATKCdMqpYT5mvkWcJWA5ASBVBYAAVSEAAGXWULRAHoFiFkxtmJYisKIhFCssJ64w4gDFsc4mwYzSgPKmWY55A4Vn-wbjgbgqAqh8Dvq+SGRUWB4DCMgBJSdkkNU6nYeSbwhjO1BKyEKMxRoxFZMMRIO4bBwgxfcyAjycX6LqAAIVULfNA4rsX5XQEQEC8TLGJMths0FKxzSskZNCOE11vC9RPGIvqiRbql0ZAiG51M7nlN0bi-Ft94J6LwLxGgXMID0uRoytG1I7Y7nJthKIO5uWaWSH0EEHgbRLEmFsO1+C6KNn4CqBVkynW8D1Ay6xXRvBPWDUeZYmSI0IDhCyt0rwdzOJ5CMSmeCEoENTZGDNErKjZsTH6vNiAC0uEzMW1SpbCYZB2X1bCXiNztVFS29NWKs3UFxLmlp+aur9qGHYEt2Yy3QjXV8cu3xmreD6qKkUFkp5vx7uA-ug9bkELPdUP6W1eGL34VAzVa95zZkLPJFkcROS2Ioju8u5qOqMnSOXQYoq3wVIkPwqyNAKVQyfHlNt2KBBfmoEhql5xeBjxDMCk0JylzO2SHEN6OY6ShWhCeZ6FINy6Uej4aDsH4Ohiw5Q5Ds1zGZvaBhjjlLMQzLCIR+cZM+g4Qxr8aEUQCIpGcLEBwvxhjsk+kmptdEYNqDg0+xDnGqXcbQw8fj2HpBkG02+sxXyOCylSmIVyH6YENWdikFwQ7-ixAg3CmYuklJ0D8BRNF64uq2rVhpsyQg8MtiM3xh9qhwZ6cEywNsYBoKwEXgPPAonnPNRathCiSwvAcmuv4Ai47xGTBBDmTkyl0XqYmsKSL1B8MyhixoAQXAfUlQpXgRUeiiqUCkBq5d2ry0+x2b0DJfwlI7gPjyX9gxhj7viKKprLWeMSrCQNob+VxQShaDQLLjn-VdEhNCGIyslK6WFeWYDcJFiBUNbCL4XhVtRasm1xdIhtvgzUH2WUvE+zZbRpCU8LhlzCstJ4WT1H-BiL+IkDcQybuhcbQ144a3ovzr499sAg3wafdHOgKAnFgenaPTskLqi-iLdcTMPSCw7CZlxj8dkii3vNax4q4zb4Z6oBHI06ZCranDe7SuxAZ2nQQfIkV3Sd0-AETZOaQsOY-CQkpEMXBP87mY4+9j9rjrgnWafHZhzI2QXlqLmI12u4fDrBImW8dYJVFDDulCVSJ4G3a4Ibr1r+vF2G6ebwZLJA1R851GTiXSlzQsmcWorxThHeDBahyNkfhVKTC6hz9bn3I68aD2YtsoflWqvsxH47Pby124tK8IaQQdzIN6rpI+5HnFxqVl7u9dE4tPqHpej+16v7e+7+evXNEX2QMOpH2Y5YnqHMCKIt0J5ZH09j-JCmWTqfsle-V4exwAVgSAvQ-gglII5rF6N5F+5KuFg8MeCD259kfE2AKxWHgVu79YQf8Cx-olbXqEjBJE5jYkMP5gjjaLaMuJCATKFFEH8IsPMORO1JuJ1KKt-kfvFqfuxJoHiBfhbqsP5hcm-uSJ1LCNuAOjspVrpAkORuyKKgAGqPyUDcLSA7RmJn7T42xOD9IQbQjsgrCCp06RAZB9DYRL6qRBRRBUSf53KMFiDMHxZxzsHYGAF1Ti6NR3QSaQgjAL7y5lpwF2zeDLiSIsjLg75hbo63jsAgQkBhAthmygTgQwydaPwCC-IgSH7gxwbyFAQwwPj2acE07vDfBQgkRM5bIETkR2wkywh6QUyrb3j-gNwwwArsB4Dn5AEnYkiDCLBRABCeB9RjBlpVZiK4yJBdTOJljXIWF770AiAA5wDJHCSpGvgAHm4pxcjOCUhXQDDOysi7imo5Fuis4Zy27ZgzoWDTT9acZQD2axw7Ter9iBH+SLDHxhHhp9SEwXRjB-DzCbrZg8inoaAPhQDEotj1Jn52RGCpQ4BRhKj2b4Bm54HryKzmhOA5gOAL6bgrDFiZi5G0gHFchy5HHUAnFnFWQXHsRfikAwCoDMzpbEo4YcD3EFBPGZGV4ECbBPSwrCongKxcjHJ2KvApBDCe6x4glgmoDnFgAdiXHoBdZ3FxKPGi7onqGYmvE7K7hAlfGqRCEIBIrEwFrDCsjjC4wUmUCnFUkQk0n-5zJRJvK+EfIurkCBGFgRQUQbA8hFxdQbjHIZhuaCpQF-BxDimSnUm0nsRyl-4wxdbxKBEkR9BQgZjUFFyVYOgbiOlOCwiUTOKeDmFo61GijHESngkyiQk-iGLGKC5mLC6AT2nzbQiMZuga5-DHIljCqBBUiYxiGmmhmtgyln41JcQOGH4NIIycH1p6rUETA6nKQDF5xcpjq7h3SilFyd72r3rBlmnSkWk-h4qrKErEqkojiJbIY0p0qBGKwLCnjkQ7iqJsgAYOikz9Czl-qMZjQyEEJvjIAgR2FWRgCTGvgXrdwD59xD5d5mTbm7ktgHlpFTwT6WYrwV5sl9T+aakKygiZkbAOg5h2xemYwuKngJCip3hl43mHlPpn4nl0Cfy3odl0SgXDjgV3ktxfgPkPBPntGwJjAp6DCy5FZ6RwgOiwjvD-AvRwhp7qKbl0RWkKnzFxL8AZFqGja2Dnx+SfFBCnjLDeY6p7gjAgjOw1kvTVEBmsK0U6j0Vl5LGqFJIYlRAXQVFp5siqJKbEXnZCpKLOmbqnqj4yhLJfI-L-IAr94wWD5wXJpmQ95TwsCfLfLSBGXoUCK6DT7sidT+amEniFiQjkQ8UICkGFoeDNQ-AQ51Y1GsJWWoU2UGX2WAoCDUKZR0IMKZRMLD6WW6Wxy2WGWAqOXvpYUNTsi4zyQ1o4T5w5LwoUXPQwh1pLBvAJFKgjhsH-6cFy52xdQe7Hhhq4yK7bI+WdIsjGntkWW0zWH0LMwwx2UkDepcJkKgQRwiAUr85xwtjRnmIi7NUeaUH+BoqLadS+X8VPS7ifm9V2BRAgUjW2GxwTVTXAIzXE4cSLxgDgwrWxlonMUW42xsqLCUSrBKSeA2jkEQbr7+AZKgjNS6SioDiUL85c756LrT4jAXQHLyJSKBC9T8X7iJkOnsrQgQ1Q297+5tHPFfruKLC7gZAIJeaO6QoWg8jlx+AZiUjeAJGvIC5yoNy57QWwXMLwURYRLyms0EobbYo5VT7PmjaMYLAQYjAbBsqQjjDEXNQ7JXTIpwipAJEeqpSSqhL9mC1upGaLHT5DCMj9BSK9AkTny9QTDmgcrCrDRvCeXq2epa04hDgjhVAa1eqkCcyda+qsmjbLjlwXa5bZKnzxDHIez4y3ZvDJmhWiU67DhO3CYCBvgQBATu2J2wC9hqqG0jDO7-oea16xA-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-oUV-XywO1kf0QMXIUB9CefdB-WzCrOI7vi8eYa7YTEXDCM+unKKUie8pvTMs3vKxJSVBvwTIA6od04w1qM2DCuL2ayjc-oyUTyR5eVFHqFKhAzwJxECgrCrmjN-eCt-4QgBUlQDkBd+2A0G99+krAD8ZihArIQDyCRDlihAKASkL+gqyLPDliA0bir-FaZgb8xdN805T8RueAneQUfLRV-KAr3v7JiL7veUjvQjunn8cKoiTcC7me6Tt5qw4JQltHE4FUdkXITwKzmagZB2OkQM1KsRSDjAayaTXHvj0uoXBrq3EW6lABgFMgaCgyIuMjwyDkF5sf1RICXDjTg1E+kNb5PjRW4nQ1uX6NkH0Hy7-ALUPgHMGjVHTKRCiPwLkq5WZr80YIbNIWtYg4ENRc6S4RTCMHfwikYWHIC6Ak1iAQo28fsRPiA1OYZsM+AaR0M9BfrKwbQ-nXysyiDQFJxmGcWqnoJmYhh72RMYVqrjWDIFeovwJ0EXDgL29sk5fBbvQEZY6Za2GLIqOJ0k5KQUgN2ZxAMEzCA84gGCaqghzmCehsgQAA */
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
      sessionMode: SESSION_MODES.LOADING,
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
      primeButton: {
        label: 'Ready for prediction run',
        disabled: true,
      },
      aoisList: [],
      mosaicsList: [],
      imagerySourcesList: [],
      modelsList: [],
      currentInstanceType: 'cpu',
      currentClasses: [],
      currentRetrainClass: null,
      retrainSamples: [],
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
            target: 'Activating instance',
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
          'Redirect to project profile page',
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

      'Redirect to project profile page': {
        entry: 'redirectToProjectProfilePage',
      },

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
            target: 'Redirect to project profile page',
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
            target: 'Retrain ready',
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

      'Activating instance for prediction': {
        invoke: {
          src: 'activateInstance',
        },

        on: {
          'Instance is running': {
            target: 'Activating instance for prediction',
            internal: true,
          },
          'Instance is ready': {
            target: 'Running prediction',
            actions: ['setCurrentInstance', 'setCurrentInstanceWebsocket'],
          },
          'Instance activation has failed': {
            target: 'Prediction ready',
            actions: 'displayInstanceActivationError',
          },
        },

        entry: 'enterActivatingInstance',
      },

      'Running prediction': {
        on: {
          'Created instance websocket': {
            target: 'Running prediction',
            internal: true,
            actions: 'setCurrentInstanceWebsocket',
          },
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

          'Abort button pressed': {
            target: 'Running prediction',
            internal: true,
            actions: send(
              { type: 'Abort button pressed' },
              { to: 'websocket' }
            ),
          },
          'Prediction has failed': {
            target: 'Prediction ready',
            actions: ['clearCurrentPrediction', 'hideGlobalLoading'],
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
            actions: ['setProject'],
          },
        },
      },

      'Load latest AOI': {
        entry: ['showExistingAoisActionButtons'],
        always: [
          {
            target: 'Retrain ready',
            cond: 'retrainModeEnabled',
          },
          {
            target: 'Prediction ready',
            cond: 'isPredictionReady',
          },
          'Configuring new AOI',
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
        entry: ['refreshSessionStatusMessage'],

        on: {
          'Mosaic is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: ['setCurrentMosaic', 'refreshSessionStatusMessage'],
          },

          'Imagery source is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: ['setCurrentImagerySource', 'refreshSessionStatusMessage'],
          },

          'Model is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: ['setCurrentModel', 'refreshSessionStatusMessage'],
          },

          'Requested AOI switch': 'Applying existing AOI',
          'Request AOI delete': 'Requested AOI delete',
          'Prime button pressed': 'Enter prediction run',

          'Pressed upload AOI button': {
            target: 'Displaying upload AOI modal',
            actions: ['clearCurrentAoi', 'toggleUploadAoiModal'],
          },

          'Switch current instance type': {
            target: 'Configuring new AOI',
            internal: true,
            actions: 'setCurrentInstanceType',
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
            actions: ['clearCurrentAoi'],
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
            target: 'Activating instance for prediction',
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

      'Retrain ready': {
        on: {
          'Switch to predict mode': {
            target: 'Prediction ready',
            actions: ['setSessionMode', 'exitRetrainMode'],
          },

          'Set retrain map mode': {
            target: 'Retrain ready',
            internal: true,
            actions: 'setRetrainMapMode',
          },

          'Add retrain sample': {
            target: 'Retrain ready',
            internal: true,
            actions: 'addRetrainSample',
          },

          'Set retrain active class': {
            target: 'Retrain ready',
            internal: true,
            actions: 'setRetrainActiveClass',
          },

          'Update retrain class samples': {
            target: 'Retrain ready',
            internal: true,
            actions: 'updateRetrainClassSamples',
          },

          'Switch current instance type': {
            target: 'Retrain ready',
            internal: true,
            actions: 'setCurrentInstanceType',
          },

          'Retrain requested': 'Retraining',
        },

        entry: 'enterRetrainMode',
      },

      Retraining: {
        on: {
          'Received retrain#progress': {
            target: 'Retraining',
            internal: true,
            actions: 'setGlobalLoading',
          },
          'Received retrain#complete': {
            target: 'Retraining',
            internal: true,
            actions: ['setGlobalLoading', 'clearCurrentPrediction'],
          },
          'model#status received': {
            target: 'Retraining',
            internal: true,
            actions: 'setCurrentInstanceStatus',
          },

          'Received checkpoint': {
            target: 'Retraining',
            internal: true,
            actions: 'setCurrentCheckpoint',
          },

          'Received timeframe': {
            target: 'Retraining',
            internal: true,
            actions: 'setCurrentTimeframe',
          },

          'Received prediction progress': {
            target: 'Retraining',
            internal: true,
            actions: ['updateCurrentPrediction', 'setGlobalLoading'],
          },

          'Abort run': {
            target: 'Retraining',
            internal: true,
            actions: send({ type: 'Abort retrain' }, { to: 'websocket' }),
          },
          'Retrain has errored': {
            target: 'Retrain ready',
            actions: ['handleRetrainError', 'hideGlobalLoading'],
          },
          'Retrain run was completed': {
            target: 'Retrain ready',
            actions: ['hideGlobalLoading', 'clearRetrainSamples'],
          },
          'About button pressed': {
            target: 'Retrain ready',
            actions: ['clearCurrentPrediction', 'hideGlobalLoading'],
          },
        },

        invoke: {
          id: 'retrain-websocket',
          src: 'runRetrain',
        },

        entry: ['clearCurrentPrediction', 'enterRetrainRun'],
      },

      'Activating instance': {
        invoke: {
          src: 'activateInstance',
        },

        on: {
          'Instance is running': {
            target: 'Activating instance',
            internal: true,
          },
          'Instance is ready': {
            target: 'Load latest AOI',
            actions: [
              'hideGlobalLoading',
              'setCurrentInstance',
              'setCurrentInstanceWebsocket',
            ],
          },
          'Activation has errored': {
            target: 'Redirect to project profile page',
          },
        },

        entry: ['enterActivatingInstance', 'updateAoiLayer'],
      },
    },
  },
  {
    guards: {
      ...guards,
    },
    actions: { ...actions },
    services: { ...services },
  }
);
