import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862Jy7wTJuXiwj42GePSfxssy8QZkMjj2GMjjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPBRUR0MMQxeK4bI2GMW7hIgqw7vJ9hwqe2ZKZm1ECqi-qihcaghpwJDIAIACyNlRjgFmQIhdwpo80nWHYG4uAMyTLqsBaAhpCAnuaYxumknITP4xkon6woAOokG0VmyugKo8cwLCZSwKjUDgYBiPZjlcBGEDoG2Wjie5KFed0p7uK4LgJDamb2F4DicvS9jjO8Picr8fgqU48VXmZKVpTKGVZbxMp5QVRUlX+cBcUtxVCVB2UdrBeDwTVSaSZ5ljWOWfilh4rgrFC9jfL1-w2HQ12svMbx4bu420ZNqWWTNeXZQtKobStnGQPlJCFZtkHcbxu2iVoNwzkaUmnd0PL2C1eZQukXwsr4BGBGCuPYbChZ2p6Ow0aZwo3nDLYw9BYSw8wUDSqVyCcDwSpcFIbkEijJ0yRmzj-Cyp6Uv5bK9XCfQ7iRrjXYyRPnlTJmJccdN8QzwlMyzUBsyGHNcxG3DIPzyFzg1BABPYz1RLSPLxFEjKOITrz28kI1QjabJfTTmv01ZjPM4DhtQBxa3gyDW0s-D+1iUdgsmjbhYLPMfVLDm-z3aFp53eCrjHoksRBI4vj+xr9AAGI0Ow5DcfedfB7rPDUBAsACJVxw0BI6ASvQl7fcKtfUPXjeMTrUHQW3HcIL36Dau0DQW8dKfOyCMRcg46xsskBE+M43wbxMqzJDuld1jXw4UGwY9qCQYjcaoJBdxo9ALwPdBDwH194LfdcH5PwgC-ee1A+5L0TqvZOqFeh205LjSkGwBjK3pPmGIi5brli9qrb06sr50GrjfBugDKCP2fngV+yoMCoG-mIVQs0iDfzHL-QhxC75tHISAyhYCIGqGXnoaBHkU5KXSHQcsRcEgYzalMUKkwnrOzurEFYrhYiBEvnRVaEBlAPEqNUHEf5KB9hEgnago4o4QCEfVNGfVJjyRwoFVRXgNhuzztdFqJF-gqO+H4QsGizJaJ0e0PRlxhBgAAI7cDgGxbaxVhxTlqgLYR84nBPWtN4LkuMhhvAdCkc0gxJh5nLokfxwpAn4GCdiOoq0ALg3bLHPaB0rFWxsbpc0vwfZtMxpaAiDgFh+EVnabB4w-ilPRFUbRFSNAhJxCISJ0TwYw1gG2EwFBmmoy6KsAYdA+p9XZIMJYnUHTHjJG8TG5F-AJArheFhVdGATKCdMqpYT5mvkWcJWA5ASBVBYAAVSEAAGXWULRAIJMwuB+HCeYV0epyMpE6eYw0oRFy8GM0oDyplmOeQOFZ-8G44G4KgKofA76vkhkVFgeAwjIASUnZJDUQTRF0tdDkukczKQdDyJ6SlrpRHmPCGwaL7mQEeVi-RdQABCqhb5oBFZi-K6AiAgXiZYxJlsNmgreKLOIFITz+BWK4mY7JlIxD3ksX4y4WRCvKbo7FuLb7wT0XgXiNAuYQFpcjelaNLViMLKo1JdggoOmtHQVkqlBlDDGjc6mdybWVPFQIN8yAQLMwoEGFoNA8DApNJ1Rk8laR71+AMRWIUZhOCcDpU8itjxOAzkKxs-AVSysmba3geo6XWK6N4J6O4hh2GWJk0tiA4R2EWBuYY3gNini8JTPBCUCENsjM20VlQ22Jk9Z2xA3aXCZiPAO7MQ6ECQgyDsvq2EvHjozPWpsTaMWtuoLiDtLSu1dR3X27MqlB0EW3V8cu3xmreD6kKkUFkp5vx7uA-ug9bkEJA9UP6W1eGL34VAtVa95zZkLPJFkcROS2Iooe6ESwdkdUZOkcugwhVvgqRIfhVkaBkqhk+PKy7MUCC-NQRjFLzi8DHiGbNGGUhLmdskOIb12XfpPM9CkG42XOx8FRmjdHQyccoUx2a5iW3tHY6p8lmIZlhAEw1MmfQcIY1+NCKIBEUjOFiA4X4wx2SfWjfgui1G1C0YQwxtTFKNOsYeDprj0gyAeZQ2Yr5HBZSpTEK5NDMDjMnJcJ+-4sRyMhDzgrUN+rnFRDdF1BELn510SELxls-ntNwdUODbzemWBtjANBWAi8B5Zri16roUKWrYQoksGdzUzkETPeIyYIIcycmUoKwrE1hQleoHxmU5WNACC4O6kqZK8CKj0UVSgUhVVPo1Uen2OzegZL+EpHcB8eTYcGMMX98QhWzfm5p0VYTtu7fyuKCUGa+BGbRpCaEMRlZKV0jYWEKxv1wkWIFaEsJEh+FRVN4exxHtlbvdpkQb3wZqD7LKXifZfsdf8D25coPLSeCs6FSEfVxH-GuuXRkoO4QPdK1ZRbD6MdgB2+DNno50BQE4gT4dAGdn5dUX8G7hqhedSS5mXGPx2SKOZ3N1HcqAtvhnqgEcjTpmytqXtjdz7h1QidOR8iM7dJ3T8ARNk5pCw5j8JCeFYwldPbZ5HLT0yItPmi7F-bIKj1F19dCXcPh1gkUPWesEqjI3H3DasF3KuPcPrjU83gdWSBqg1zqQXR6lLmhZM4tRXjy29UGC1DkbI-CqUmF1BPrO0dLZT1itPbYM8KqVTF7PbXN25+cRaV4Q0gg7mQb1XSR8xPOJtMkUEs6f53Mqwhoe4GP6Qa-nP2DoH680SQ5Aw6OfQfDGZJb0RboTyyJmGdhYbw7dXSLZ1IVAKwJAXofwQSkF20G4Ozq-cI2-XLmUpLrMPsh8JsMMJsB4Pdojqwo-uBC-tEltPUEjBJPFjYkMKGn8OdLaMuJCATKFFEH8IsIihRCLH0g-k-iwHAW-uxJoHiJ-v7qsKGhcorIrH8J1LCNuLujsiNsytCIrOyEKgAGqPyUDcLSA7RmLv4542xOD9LkbQjsgrCJAXZ4EZB9DYSn6qRBRRBURQF3JCFiAiFVZxwSHUFIF1SG6NR3SmaQgjCBAzqBCHr4F2zeD-7HgsjLgI5qxFZmQ3jsAgQkBhAthmygTgQwwraPwCC-IgRP7gy0YGFAQwwPgxZSHi7vDfBQgkR2DkR9TfoMEkyw7kx+K6EEIiC45wANwwwArsB4Af7IHtYkiDCLBRABCeB9RjCHqjZiK4xw4jArDKwPb3j-gVHCRVGviIF+4pxcjOCUhXQDDybkbpC9RFxOhaokxOAsjZj1oWDTRbZqZQAxaxw7Rur9gpH+SLDHyZE7hbKEwXRjB-DzD9rZg8jAYaAPhQCEotj1Lv52RGCpQ4BRhKgxb4C+50HryKzmjrFcjH6bjg6hROZOjhpPFQnPHFF0QiivGUDvGoCfFgAdjv5fikAwCoDMxNaErcYcCAkFAgl1E94ECbBPQUTYEngKxcjHJ2KvBCa0hbIKaolmTonUBvEfFWRfHsQ-GrYAlxLAn640kWF0ngkkY5gOB2EwmAHjDgrkZdTDCsjjC4wvECmYlCkygik-hzJRJvIJEfL2rkApGFgRQUQbA8goqqSqkjDOC9DLGM7kZbC8nCj8mCnYnCm4kIGmnwEwyrbxIpEkR9BQgZjMrLGsjBq-ClgWaUTOKeCeFzrTbHB+kGkBlGlBnv6GLGLa5mK66ASRlXbQhspujwp-DHIlig6BBUiYzqF6n+k4l4nsQ1JcTBHkGMwIxSEjAUShrMoTCakAGLF5ysh2yrC7h3Q6lFyz4wZokYlYkdkIE4qrL4qErEojg1ZMZUo0opGKwLCnjkQ7iqJsh4YOikz9Dnk4ZspRpeFZn0BJopothgDbGvhgbdwr59xr7LlmRvliCBFWSfnVFTw75hYrzd6ynU7OKw556ciT7xAOg5gzm-CYwuJVqQHPlI63hxIIbgXfktw-i-l0CfzQYxoEJ3id4flfkIaQRQUPAwUTGwJjDl6DDm4zp6RwicqQj9CJA2hwiV7qI+nI4RJmk6iHGEUnGwUHa2Dnx+RKlBCnjLDpZGpjBZisgbAFJ55+ADGvLSVhmyXjGgmwKBADQjCV5siqL2b8VumbhKKxn9rAab4yhLJfI-L-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-AHfsKkJcIvzFf2byQnidQnhgr4GNOcjiIOA-12ZLu5cZsEJN4Gbeflp9BXIYypJdR8VwmggtTMGgfjt2XXqNqG33recjU6RPdKQ4TmpXvJBcF53NRXSbVuUFdzdfjefZj-D2tofoRciwoX6ZLyTaFwg0d2jwvkt5uBsiu+Ysbc1s+xkuBnrFrIojcB596O7yNCVH2w-FZStE8tKeMmgkQeyh555XlnyAFw6Jt408jYRKxM-6tDzedvTyQTDD6GSF4ctHr4w7K9Zwinw0ia+2d0AwHP5VZUGs+icpI2j9BJDjZ3SBQPdzB9CvAQdqSLmdPNfHD6GGH8DGFbTLfC3iJOBzmWe6WOEZC27fCqLR553x7ks7V7VBHRGhHCThE9cR-WwSLvClwOaZLyKEb+OCULPOgdUw+B+lFDGxyjF4DxekTussj5MUYMOY9UN35BdenixbE7EOd7EHFhlwzHG9fnl3lT4K4pDKRKuQiiMZDKL-3kQiZtm5nrmQS9eeDExT5kbKTfDkah1gjEGTBj6wg7A7HIKn6zXZgUGKU8F-pDmug8hCwmMSPMWCwwiV0a8sORlFzorgCIKpFYriRHNDXQ1+0IeFNhE5SH5acgwZRJSGAHeEVGpDC0rEk7yft2+IAeCMgE1RJkcYO4SfGq1cQxZZQ0-dGJRHkjk8+i0eDMKEBngJwiAoKA-IsHFyTp0O+EEANiSgDkB+BtgBINMWEEchRBriFZBAHkCRBywoQBQJiVUGgpZEJbQQRuHTIiDMwYgzHuwLkFcDyBdvRih8i8oRVAU3nJzDey+aDRYQUIXJDT18Yb1QcUQTYuSwurT1Jqz-JgTJEjre9yB8uZqBkGV41oxElfYFmOTmb-VdqgNWOCDVb7cRwaUAZbrTgy5iZz4ulDIBwSuzo1EgJcKfLpEJrE0uaquPXjazRjs8k+oiHkP8B8A5hS8J6ZSG0R+C7hDkynEARJSMowRVauvVGPrwwxjN+8m4cJglUry9RJgXfN0LEDgGT4-YkQxFgjziGIAMgJYDwAUkdxdQlYjDBwElmyFrE3ghTbzkTETbSdzclA2IL1AtSEEVwNDVcDaEFZ6thWQWZblHx5RcgcIakTMNuFrRD1TwX-QNCeGbbvkrIG7Ttt4MrbnEaGOYDQilTzjZ1wQr-LJOkSrDZBMgQAA */
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

          'Apply checkpoint': {
            target: 'Applying checkpoint',
            actions: 'setCurrentCheckpoint',
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

          'Received checkpoint list': {
            target: 'Running prediction',
            internal: true,
            actions: 'setCheckpointList',
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

          'Received checkpoint list': {
            target: 'Retraining',
            internal: true,
            actions: 'setCheckpointList',
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
          'Checkpoint was applied': {
            target: 'Activating instance',
            internal: true,
            actions: 'setCurrentCheckpoint',
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

      'Applying checkpoint': {
        entry: 'enterApplyCheckpoint',

        on: {
          'Received checkpoint#progress': {
            target: 'Applying checkpoint',
            internal: true,
            actions: 'setGlobalLoading',
          },
          'Checkpoint was applied': {
            target: 'Prediction ready',
            actions: 'hideGlobalLoading',
          },
        },

        invoke: {
          src: 'applyCheckpoint',
        },
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
