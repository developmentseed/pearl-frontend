import { createMachine, send } from 'xstate';
import { aoiActionButtonModes } from '../../components/project/prime-panel/tabs/predict/aoi-selector/action-buttons';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdgCcADgcvbAZifff9tYANCAAnohuLi50AKwx1vYx9v6RMbYxAL4ZIWhYuISkFDT0TKzsLKhgJBChAjr6SCDIRibq1OZWCNbe2k50kW7W2v4uCU7aACwh4QguMdHx2raTPi5+Llk5GNj4xGRUtIzM0uWV1bWatg2GxqbtjZ3dvf3uQyNjk9MRMRN0w27eeweCaDWxrTZNbb5PZFQ4AYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CB1PTmZq3NodRBOCYLMEg7xuJbuVxfWbeWx-BK2WzWVwTHoxNwQ3I7Ar7Yp0BG4FHUNGUTHY3H4mRyBRKUmCS7XJotO50hAMpkuFlssFuTlhelxZzeCbC522JwCpwSqG7QoHegAUT4uNRLFoAHcWJL8qGSEQwAIAMpgPCR70p6ixsD1KlG2kPGweNx-dKM8aJWxuKZ27m-Cb2dJu2wTazWUbWL15H0yw4AETA6OKbGorRIYhYAEEAPIASQEcLEyiRkBYEFQJAj4YnM5YACM5HgNNnGtTWmZ8whvK2izbGdohgDXDEuYloslLwkeW4YgzMtlIZ3pVheg4TONQlU4EhkAEABZSCNRwUDICPG5T3uUBOjdOY6DmN1nWSPwfCcLlRm0Og7AmOIfHsesLQ2P8oy7IC6AAdRIVpwPRdA8VXZgWC4lgVGoHAwDEGC4K4NUIHQMMtEpY9czPdDEH8S8-jWEEnDSaxQW8LkJgrOgm0BGJtA8TwGQ7KUYT9OgezXMMQynadd1CFc1ygKBUTE5BOB4HEuCkZDDRpRTLEQEzHDsH58LWNIXF06tv1IlxEgSbR6wrEFLOhX1ZTs9dHO3HdXJ4jyvNgnyJJxbhkCCk9jXPM1YmZAErQ5FwuQSIsOS-MU7CbJZssYmz8oc8CnJctzmE8pU5wXZFl0E4SxwmniIz3PAD1kg16rzJTTUZZqLVa9kbQ66sXzoN8W2SCtvwoobAJsgAxGh2HIATQMK2cpMOGgJHQJc6AYp7ZVe4dYA+hCqjAtEnIQf70FJNp6jqhS0LCi8r36M071M3w5k6wIrqSEE7HsVxqN-LYAOs2VAxIHcxGkadSBgVBXITHhUGElgk2Z-AuIEVnjg5vnud58ocQFsk0ZCjHOlZAEcYox9XGWKsZn5Qy4kGV4xQcR66cOZ7kwoIcRzHCBVBIARfvoRGgZB436FNvBzbetRRxXG2EeoAHkcPPQ5dQk1BXsWt9KdHx5go7xzpmUZeXdNInGoy8HHbei0xdug3Y94cvatm2BFxDBUGBsRVE41AiGBnPcpNs2Ps9yhvetvASD9gPVBR4O5JQhr9vDyOfCj2OYnjrkbzIhIUomZ062p-8rMbgMMyZ6RoKMNicD5kT8iF7fYF3jVpfyJCB+C0PzxFBk-iSE79LdbQn2rbX0j6-WPHsI217oBmm8WDbwgCJfeMsj7oFAWOKWB98CXx2ujE0jIfCxBBB4MUgIhSvyJryT+etBgG1-tnWm-8GCVAgMoO4FQqg1AEOQygcZdz7g0KmOAOIIAhyHpjUs3grpCh8JMH4gxgjVgFNoUihZrAilZClboxCaar27OvfgeI0CQCoW0CovAKSIPliabSBklg-DWOlNIlYuTpHcHQVkFMmxfg8H4P+yiAFBjURQzRrDUA6P1DmfR55DFFmMaWMxmVLEMjwUKesdg3ARwjuKEhSimKBlUWwyh+AtHeOoHUaweib77UCcWExZZzGa0QBWIEzg3CgkmK-S8CiV45RcSBGG307YaAdv7QG9Bnb-xab3caM5u5I17kHXQXC9qYyVnwm8345jq0+GI8Y1g6AgnimkJ0cQfjL16S4kQABHbgcBYZDlgJ3IS8Z7Z0Edj0hueywCHOOSGGgZySAXOGYHbaEzQqdDvr8V+QJWQrBfm-GYmVfjx3sF4SeExX4+GcUxA5RyznPOoK8i5pdUDl0rtXLidddmIoecik5LzznCQ+aMr5V9do-MQH8h+gK2TP3GKC8pLZeRJB6DyIy6VugIpskIXgw5wLqPSXcAQXBoECFeXgbENDhKUCkJw6lSDb6JF+OYwYsL4iMnCSCYsOEWyv2qW6flspBXUGFWiUVnjskiAVUqgSiIkTNBoHgb5Cs6XUV5PMsEPI06VnsJY8s2E3TVNMmaAEWdFFNMRUKkMNqMkaGELgMAirlxqDjOiNccYPXIKpjYrZ9Z0oR1EWCrZ-QHCAiBAyOwPIzWHAtVatJtqU0OuXIm6huQoCVFgLAPNaqeSxFiU2Ey3h5jSMsRRaI7pnTjp+P4JsDSCUCvjSKjxSbsnjh3FxFMWSB37WdMMPkbJAR3mWD+SxgI+H1h5JMOw0iHC2AbfQJtCaN3ivIRozd2jqAsDDCQAkO7UCyxVf4w9Xg+HCIwQCQILLwmViqX4OsQovzxW8C+ugb713fs-R+zJvB-2AYEugIgyBmagbydw35kG0EmswXBnBYjw39GqbEu8rhr3LruUxfpJyQbtL+l0p2PGbJ8ffQBCldxUZgfyVM7GN4XB4wfITMR91+jaU0jyBIUL-CYYAGqjkoB3aQa0-1OV0X4uTGEEij2juOi0k8E4RF5CCJIadxhsjiClAzRmTNTRkluWcvj5LgcxiPVZUdx6OantWHopE6w+ErM6FKJkJiYZSeqDRKYJqSvjOOCAEAII+TAFIPgLByBvIgMzVA-bZPUZsD0PoAw3jxw+GUro1j7xOA8PHH4DhX6YZ7OwcjJBXJgVchNADqBm2StHAIAA0mAMAJXKEnI2ltNhfaEFWYawgP1fDx3aBSsMZsSmg1qZWQC78tbgTfmjY04a9M1ttImjgLitA8QAY4KVGAyqqOTMeHEPomc0g0XdJEIi78TKrIpnWSsfglhaoyy9wZs43vEnVOUX7O3QvWZsEkRwpk3ROCGKWC7YKojYScD129NO0oYcSbGmy-pUdwxnPQ3tHCgsCTectZhm0xm7cBwWIxJZTHlgsYlesV0LQinQYMRICSY1PcOKz9i7PZxfu20Vt7GgBy1wF1tA9mNCnBIl6UzqVP70CmdJpxkPwsh-moFAuAVJRPFGF7ShABAKeIAIDEbCURzuk6FOMJTD2V2ylKCcDgEkgwQC956hAzZiItn6GKQIusxRrGV490GhwY8ajODUJPBjJjRFbOkBkvX3S2DT6RO8C9xGsm0oMTD8pkTPNVDiPE5RCTahJKoSAZfb51h1lg-StOKzOdmOnhxWexQ556xltxIZNwgxjHGUfBSfgg6z+HJTKVZ-xV+AIkUe+5fgiZ6r19GjKj4BYAeCrpHpDIGODv8Li8rpQs8CYhd08iQ1ObIQwUUGknoN+Be9AfYA4tAFsRcQWn+isxOZEKUtagoYI0ifuCAl0C8PIC8iQ34GcHeX04EpAyASB5SwOBqqs46dB2BFoUGQwiwt6TY8KkBucrEGuLANcU0aI-ES0IklBF492hkmk8Q+EX4z4NOhaacYw3QkQ6QQ29k30k0v2qIwhJkje7gowNazYc6rKOBpOfw1EgwNoEc7gaQmG4M70n0rSaOwhPQysac+kN4sSNo3QRMyUiQNemcaw-g6WHB-8gCzMLAIs7MnMEs0g-Mh8qAjhohbocQH4PWhhaU2EPhIIfhfgTo1hzc8BbcxcncwhGspE6Qx2NOdYl4zoUOicr8zgFRFECQdgR+q+jMoRx8p8MRgscReOe2+kC8NimkPWdYcwcQHW2ktY9Yiu9ijmdEKuUBribRW8ruY4XRB4PRg8IuKeyQgeAIsi5RAQqmWs9g3h90P8rY2RgR8xucX6YqmStCMwmx3uiwKyacAoUQNosSk6YiLYKyvgRqQIlYgoC8q+qSnaBGGMNKye1gPwKyoOh+x2UKliP8LwjIBBes6kJB9hmujhxa2ElYd446AohEHWL8pErgDi34YObIeeUejaRKTy4EpKfOYAwh-RfCJOSmEiEcAQyJ2kqy8wFY8cLKzYmG2G1q+GoUUJ+aYI2ElE2R6U7oNR5SlY0QGBd4gQJa5iWJAyEpAEjhKBrYcOD6mBdYliRBhkBMNok8hiPmQR9y5wPB-ElQeAa4NAv6whMJzohkB+c8iJs+ZhVS88pkLYsSgQvmC4-mZmiBvRWxyw8w2EQwFoPJXgVaVuKyrYrI8QTYzYEB1xwRbiLA2WPOeWnpvQjg1EFEzoMKSZVuRYnmPWqw-WJxOyHuvYI2Vc42NAk22402s2UCo4xRk8RY9YFEywsSFEiQCUYK-JSQwKhiL4tJbZAYbOMZTx0JJxFZXpr8WhRk2Boocp4wIoawOhSQTuGQQAA */
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
        drawNewAoi: aoiActionButtonModes.ACTIVE,
        confirmAoiDraw: aoiActionButtonModes.HIDDEN,
        cancelAoiDraw: aoiActionButtonModes.HIDDEN,
      },
      aoiModalDialog: {
        revealed: false,
      },
      imagerySourceSelector: {
        message: 'Loading...',
        disabled: true,
      },
      mosaicSelector: {
        message: 'Loading...',
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
          'Ready for retrain run',
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
            actions: ['initializeMap'],
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
            target: 'Validate drawn AOI',
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

      'Ready for retrain run': {
        entry: 'enterRetrainIsReady',
      },

      'Validate drawn AOI': {
        always: [
          {
            target: 'Display tiny AOI warning modal',
            cond: 'isAoiTooTiny',
          },
          {
            target: 'Finish creating AOI',
          },
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
          'Pressed AOI confirm button': 'Finish creating AOI',
        },
      },
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isAoiNew: (c) => !c.currentAoi.id,
      isAuthenticated: (c) => c.isAuthenticated,
      isAoiTooTiny: (c) => c.currentAoi.area < config.minimumAoiArea,
    },
    actions: { ...actions },
    services: { ...services },
  }
);
