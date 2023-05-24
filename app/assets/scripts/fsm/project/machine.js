import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862Jy7wTJuXiwj42GePSfxssy8QZkMjj2GMjjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPBRUR0MMQxeK4bI2GMW7hIgqw7vJ9hwqe2ZKZm1ECqi-qihcaghpwJDIAIACyNlRjgFmQIhdwpo80nWHYG4uAMyTLqsBaAhpCAnuaYxumknITP4xkon6woAOokG0VmyugKo8cwLCZSwKjUDgYBiPZjlcBGEDoG2Wjie5KFed0p7uK4LgJDamb2F4DicvS9jjO8Picr8fgqU48VXmZKVpTKGVZbxMp5QVRUlX+cBcUtxVCVB2UdrBeDwTVSaSZ5ljWOWfilh4rgrFC9jfL1-w2HQ12svMbx4bu420ZNqWWTNeXZQtKobStnGQPlJCFZtkHcbxu2iVoNwzkaUmnd0PL2C1eZQukXwsr4BGBGCuPYbChZ2p6Ow0aZwo3nDLYw9BYSw8wUDSqVyCcDwSpcFIbkEijJ0yRmzj-Cyp6Uv5bK9XCfQ7iRrjXYyRPnlTJmJccdN8QzwlMyzUBsyGHNcxG3DIPzyFzg1BABPYz1RLSPLxFEjKOITrz28kI1QjabJfTTmv01ZjPM4DhtQBxa3gyDW0s-D+1iUdgsmjbhYLPMfVLDm-z3aFp53eCrjHoksRBI4vj+xr9AAGI0Ow5DcfedfB7rPDUBAsACJVxw0BI6ASvQl7fcKtfUPXjeMTrUHQW3HcIL36Dau0DQW8dKfOyCMRcg46xsskBE+M43wbxMqzJDuld1jXw4UGwY9qCQYjcaoJBdxo9ALwPdBDwH194LfdcH5PwgC-ee1A+5L0TqvZOqFeh205LjSkGwBjK3pPmGIi5brli9qrb06sr50GrjfBugDKCP2fngV+yoMCoG-mIVQs0iDfzHL-QhxC75tHISAyhYCIGqGXnoaBHkU5KXSHQcsRcEgYzalMUKkwnrOzurEFYrhYiBEvnRVaEBlAPEqNUHEf5KB9hEgnago4o4QCEfVNG0ImRF2duXdkmM-ghRmGTPorJ2RxGUqCWkGizJaJ0e0PRlxhBgAAI7cDgGxbaxVhxTlqgLYR84nBPWtN4LkuMhhvAdCkc0gxJh5nLokfxwpAn4GCdiOoq0ALg3bLHPaB0rFWzRkFc0vwfa6RUZaAiDgFh+EVnabB4w-ilPRFUbRFSNAhJxCISJ0TwYw1gG2EwFBmmoy6KsAYdA+p9XZIMJYnUHTHjJG8TG5F-AJArheFhVdGATKCdMqpYT5mvkWcJWA5ASBVBYAAVSEAAGXWULRAHoFiFkxtmJYisKIhFCssJ64w4gDD6pMYYYzSgPKmWY55A4Vn-wbjgbgqAqh8Dvq+SGRUWB4DCMgBJSdkkNU6nYeSbwhjO1BKyVxoKUUxFZMMRIO4bBwgxfcyAjycX6LqAAIVULfNA4rsX5XQEQEC8TLGJMths0FKxzSskZLY5qG5ZEzExn1HZ-wUg8lLoyBENzqZ3PKbo3F+Lb7wT0XgXiNAuYQHpcjRlaNqR2x3OTbCUQdzcoQHdBI+4PA2iWJMLY9r8F0UbPwFUCrJnOt4HqBl1iuh2gWKpP4m5ro7gSCaxABZ8nzFUf4XSiC7VqwSgQtNkZM0SsqDmxM-r82IELS4ZBpbhgwkrQgBWfQrneGhBRHwNhRVtozVi7N1BcR5paQWyYg6S3HhHRW3qGxzSeAzHCEYit4SipFBZKeb8e7gP7oPW5BCr3VD+ltXhi9+FQM1WvecDs+iIN0nO0i8QD4ZB2bSKI-gvHzFFW+CpEh+FWRoBSqGT48oduxQIL81BUNUvOLwMeIZgUmhOUuZ2yRvFeEinSUK0ITzPQpBuBtzsfBwYQ0h0MuHKFodmuYrN7RsPccpZiGZYQSPznceIkiGNfjQiiARFIzhYgOF+MMLxuCf53Pg2oRDb6UM8apXxzDDwBA6coHp4JXyODUMyq5H9MCGrOxSC4VSSxoS7kzDLJSdA-CzuGOuLqTa8EtrokIQjLYTOCZfaocGBmRMsDbGAaCsBF4DzwBJpzzUWrYQoksLwHJrr+AIn1BYcJ+U5k5MpedybQtmXC9QIjMoosaAEFwX1JUKV4EVHooqFn7Pru1eOn2OzegZL+EpHcB8eTyRQcML4vxRUNaa-xiVYS+tSCAhQIMLQaAZYcwGrokJoQxGVkpXSwryyRsNYsQKtjYRfC8EtiLVkWurpEBt8Gag+yyl4n2TLNj-BPUGL0S0ngFN0eg+Iy1G4hmXeC1pghy3IvLsEx9sA-WgJvdHOgKAnEAdHeas4ZlRO-iDA3ARNOrnMy4x+OyRRz3Gso8VaZt8M9UAjkadMhVtSNWDZBcNuEzJYidSCndPwBE2RHszn4SElIhiaafWFl7zXUetadZU3giWSBqnZzqAnValLmhZNRtR-wVjkV6oMFqHI2R+FUpMLqjOVtvcjgJp5Wu2w6+VaqsQ6qDfjp8Ee14Q0gg7mQb1XSR8qOUgGaCSmIWJrChi2+oet6P73q-ojuiKeUc0Q-ZAw6AfVLeAtJubMyknD3YIh0275EbTCt3FEUVAKwJAXofwQSkFc29o3ZpajYjlKK1UqeJvBNQrZhZL5-li49kFJb23lgHfolbXqEjCSjnWlxDBLCHktJ5jYXPduVkCxyIOHLbW0kC-wLL67+xTQeJe9DdsBRRYJ+cydThDmFYlOhdRGo51K8P8LpAjkrmZAAGqPyUDcLSA7RmLd4B42xOD9LpC-C7gUS6RFxuwT4ZAeJy5FwrAXY-CiqQFiDQGxZxzwH37r51R96NR3R9Cwhch+A+Di6RpRAzbeDLiSIsjLhPa1ZJ6azsAgQkBhAthmygTgQwztaPwCC-IgRt7gyIZkFAQwwPh+6IFk7vDfBQgkR2DkR9Q16rD9DzC77kyFhLb3j-gNwwwArsB4A94b6HYkiDCLBRABCeB9RjCRoghES4yJBdQAHKyWG-ZwA2HCR2Gvhr784pxcjOCUhXQDCsaoHpC9RFxOhvC7gZy7hdSK4OqtoWDTS9Y8ZQB+6xw7Q+r9iaH+SLDHx6ERqGGQ4XRjB-DzB2ADDAGXoaAPhQDEotj1Ld52RGCpQ4BRhKh+74ADZP4C4ECbDmhOA5gOCBAZgj7FiZhuGQY5zcgJ7Z5mQijdGUC9GoD9FgAdjd5fikAwCoDMypbEr4YcDjEFBTFOF9rozD4QbLgAgKxcjHJbqvApBDAnilb8HNqCEBgHFHEnFnHsRDEdZjFxKTF87THryKzzG7hcji4rEU7wqeDEzeCqQjBsgZBJqgnDzHD7HUA9F9FWQDHsRzJRJvKqEfKurkCaGFgRQUQbA8hFxdTYkzADAZiuaCqfElokmJ5kngmUmHHUkyi0k-j0kr4wwdbxKaEyaLAkTkSbCDCsgOgbh9D+ByaUTUbHpdFSmQk0mnGr6GLGJc5mI86ASqkzYzp-Bujy5-DHIljCqBBUiYzYTXKkmsIUlUnHEWnQk-g1JcQSGL6MwIyIEjCv4FaJATC8nKS7i9Rco7ILF3TjC4wOCmnBlQmr54qrKErEqkojjxZoY0p0qaGKwLCj6j6qJEnFbwqkz9Bn4sialeJwbIAgRiFWRgCFGvg3rdwZ59xZ5gHChvi9liD9kyiDn2FTwF5fpF4HavE2xiLUa75G6cjUYbAOgf47K-CYwbBn4JCip3h+5voLnDktw-ijl0CfyPr5F0SXnDgtg3lvqQTLkPArxrl0G2BjA27amrCJmFhwgOhMH9CJA2hf74wgnimsIKmMnlFxL8COG0HP5RBFx+RLFBCnjLBwr8ljBZj8rOzJkvT+mIV3LIU6ioVXlVE0FJLrn-4DSEkshsiqKqaQUnZCpKIZj6R5Epp7HXp3ksCfLfLSD-IArp6PmZ7PnCXJ6iUyhLJfI-LSU-kCK6AB5OIoFBAnjgU-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-wTIA6rF04zhWUj3PYF+6ygQ-oyUQn3HorBE6FKhAzwJxECgrCrmg+-eB++DDYHHFQDkDB+2AJDxE0dBGqJR8gArIQDyCRDlihAKCHGZ+gqyLPDlg3Ubjh+FaZgdPwp6nqkDDJ8bip-WV1e2W+V-KAqTv7JiKluQiddR66kN9AWiKlqZja8LWtXDiUFbSweTOkOeAo3R1WfHjmrfDAvJnNROvac3jXcrVQRrWPfcSbVQBr92L0Zk-FqDCguRDHll4DslzxpPVA-0BQ1vWvbRd3e6AT3lGgdgWgAQSic9DhFCCB9g+LsfxokAowBYq64+GPvBDj5Rpzo4AoEj8CgEkRQg6favrMCPbYCkB7hL0qEGL6l9Zg5fEAJXwz7B8WQoQLoPANIEOxyBkIK3G6GwHFc8Bx-NZvQGprQRaab2GLhMDLzl4lIATO3OrQujlwNwHUQamMEno69ym6dKpJOwyAlgPABSOXF1CVjpkHArmQ-iTDyxSNJ2RMTWlCnO6x446ecX4E6CLgcFlIq4G0KF02ZcY9msHG0L5kGSXYB8IaGbnEAwQJVvggLM1NkGyBAA */
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
          'Activation has errored': {
            target: 'Prediction ready',
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
          'Received retrain progress': {
            target: 'Retraining',
            internal: true,
            actions: 'setGlobalLoading',
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
            actions: 'updateCurrentPrediction',
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
            actions: 'hideGlobalLoading',
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

        entry: 'enterActivatingInstance',
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
