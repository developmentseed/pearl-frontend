import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEgutjWr4dATFudLxD4dKeAy0LpG8Sw4Rm2iOPYYyOF6tYCledC3vetCPpQz5vl+P5-gBLAQKgJCdk+L7gV+0GwfBeqIXOKagM8lFRHQwxDP8RFfAMDKrLuCn2FyJ5Zv8GY0fyyJ+iKFxqMGnAkMgAgALJWZGOBmZACF3MmjwydYdjkS4AzJCuqwUu49gMh8YJjG6aTWhMcLnuOxlCgA6iQbQWTK6DKrxzAsOlLAqNQOBgGItn2Vw4YQOg7ZaBJrnIR53Qnu4rguAkfwFl4DjWup4zoT41qODhSwDE4hlIr6iXJeZ0ppRlfHSjleUFUVv5wNxC2FcJkGZZ2MF4HBVWJlJ7mWNYLp+CWHjUvY7JXb4XXEu8fzpPM3x4XuI2XiZSUpVNOWZXNyprUtXGQLlJD5etEE8Xx21iVoNyzoa0nHd08SrE1ubsk9fjpH4BGBMyWNQjpNpVjstHxcc17Q62kNQWEUPMFAUrFcgnA8IqXBSC5eKI0dsnps45I4yeoK+UR6lcn0u44QC7pskEZ5k0ZY2U9TFm0-Tf1M8GLNs+G3DINzSHznVBABPY7xRFSqPEjaFJ43mlvJNj7KPYrNbK-WN5q9KGsM1A2tQJxK0g4DG0MzDu3iQdvPGmbQULPMZKDSRG7qQ46HjK4NgJK4sRBLC710SZABiNDsOQPF3uX6siVBPDUBAsACOVxw0BI6DivQF7F0KZfUBXVdMTTdcN03CDt+gWrtA0RuHXHxIgjEvh2JRIJEckBE+M4G6L9yV3Z9RsXkyr9AlyOFBsAPagkGIPGqCQLcaPQk9d3QPcU2fF+V+XN93xAD8J7UA7tPaOc9Y4oV6Bba0T1QQbAGM6W64REB5j6FuQY10yzzHdh-U+dBz54Evr-Sgt9754EfkqDAqB35iFUNNIg784p4IIUQ6+JD-6AMnqA-a4C3Jx2UnQF02dORo1OgySYJJiRXViCsPOsIvBF0-owKoEBlAPEqNULEv5KD9lElHagY4Q4QF4bVZGFJEiW2JLCe09gEj2gIpLOgXgiJOABEyKkii8HLVUfgdoGjLjCDAAAR24HAdim1CojmnNVHmfCFyfAUpuPwWYPDrjtCkMEgxJi5lhIkTxXtlGQDUX4zEdRlr-hBh2cOO09omJNsjAKYJ+qu20rI80BEHALD8ACO23xxjQnyfRbxxSND+KxCIEJYSQaQ1gO2EwFA6lIy6DbC2q5+rpleMMZxdotzQPSBmHCGQk7uEGSZYZvjRmlMCZMl80yRKwHICQKoLAACqQgAAyiy+aIEoi6Uk5EXQbHTCubcyCEDjFiKSSirxyS+Aog4U5Qomz8GVGgIpFyDGoF4LqGOcS6o2gWF8aEW5qS7gSFMMFgVMnzDzv4bSsCTnH09vRZFEY0U+PUVi6g9R4aSQgfiyYLh4EkuGHEHCW8EjvDZN4CklEfA2ERY2ZsqKVEjMxdizQOIEZ4uRgSoVxKc6ivJepDYZpvD9RXP8DwExFX+jMiPb8rcX7AM7t3JhBThT2trp+IBIDVAzz0F840Vs+iwO0vK4F9JKUK3+dnDcZJXEKKZaNApEzQkvlbDQF8YMCpPzbi6t+uDU3BPTZNK+2bwa+qnv6sBMTjZLMQFIsE0jXheAdL8bMwVKU9MESsQINsnr2iPkrFN9E01hMzdQCtubKHpRoXQ9KDCi1jpLROiyWbyGVq4TWnhdb54LibaSOFrb23hS7TMVGFEMKwhSd8NkpMPajpMkIXgA8LLsrVQILgEBCoCGzXgBUGiCqUCkMYvd-KzHLCcbuNZ-wNxBAlU1IIZIswqRhLaugL7qBvulB+jFgTgOgdymKcULQaB4CDQegYCwuTIYcNmWIrgt4rBiNSVJ5FYgDBwe6sdr7Wx4YeARsAIGQZqH7DKPi-ZKN1WhPdG0yRYSvEahkc9ja8zOHWSCSibo-AGWTR9IUWGcOGI5e0ITInAICb8XkKAXFpNmPsOmJx6YBi52dOMPGdhFg2ghApl0gwMNGf46q-Dr566oFHFy+zyys6kjZNCYYDhiR5wIiuR0Kx9k2IdFdQLfH30hcE+czlvAWDthIKqcL2potqapDEdqtKgrJ22dGwIR6MgJ2zuMbjJ9U15dwwVszRWSklbKxwHA6AiDASiWB3FpjlkbiQ2SDjxIJFshNdpRY7VnQeCIkERlI6DPHE9dUMtPc83Oo7oWnjJljv+vy7RKt3DZ7gZ1V0L43hr12EHU4cxUaL3NMWJ4OVNgKS+Qw+80CgFaH8CEhBHF2q5tqa3M1KEB9-gZApTMKIUJ+gjD8IkZx9o7AYYAGq30oAA-gEcDFw+q-VJwXT9mg8otpQ+O4Mh9DpG6bOKxtJRGHY+w79AydiAp6oaQW0accQTAj+pskrp9ChCvPwPgrptp3NdOrK5hE40tRh1lyoinhLZj+gQr4ICAVIKzMAUg+AsEeY3MQSpYB07NjCjCfxbFQhpO1Aig6MLJBB7YtY-P9eqLLXDyG43UC0GVKN-2MAZuy4bfVd3ct-CKbiI5xwW9fiCN+BuEHXPJj7cF73Rs4eHVm5EgVZVkYtbORe4j1PxYHCrE40Td0Ofo0WPaug+DVEKJh++htYOFTAJR5zetGp0dk-fPqgnd4bbswb1hUgi9AJ0bfCB1EbLQRh8R44uU7iUeNBPiIHo2pTe5fWD30v5Oq+2Tr8bZ4ZwA0BjmuhCuDD152DARIGEK2AbCBGBJDN+rfAIC8sBJDiDBIOThPiJPeE7q7tCPJBuOyDhHYBRGSARNgeCNhMTEFIFneH+JXJDO8uwHgPDnyq9tYCvI6LvrCEDuvKpuCmMG8E9ATiMCsIgsQRJnAGQSJBQS+DyrNjft0CvM4DSI1AMMSM4nuOpNnOlnCljE4DjFmPrhYCPlUPgGDFAE7uHFtCbgOCgb5N5hge1LuKsOkHjGdGMNCPMF9lmKjBhsKGfpQFANwKgK2FUnDjZEYMlDgJGIqE7vgI3mISngQDhKCDEDdLAofIFHaH8CSNSOsluKnEmgduXv6O4Z4d4RZL4RxJ+KQDAKgPTLADwKgAVMEZEmEUnjQc3lEXSE1IClELLHIqwU4DEV5C6ERDhF-gLsujdrkV4T4WAJ2H4egD+nfBUCEQUOEXPgvE4G-ieOMCDsMOWDYWCl0ZkkSiptnHIa4SMfkdKIUd+OOrcggZBLMvMuQCgUFGFJRBsKjNnO1ORHaCMM4L0EoSDsSlsPptkSKMcWMRMRxBccbtMVEigf0YsKRKzkoc1jMDCH0Bnt7vsr8J4JkWXkom4dQPeHkSCaPtorojPgYmiuPtCajIIhRNCG6KCO5h8a3vLBsEFPMGyEcXiR4aMQUeMUScDIBMAZDtUrDK7iMJRE4qzhMG8a8Aodsc4hbO3vaEsEcgigCUoq+MgMBIARZGAFoRmt6udnQK-G6j1vRBqVqa2LqZQQ6o9jus9hEfPmbG8L8ETP8O6IEKCH9ogBvAqf1LYvmCeAkD-pEmWlafqb7BxE6kaQWiacyiZLeE7qGXqYfj6tug8PaYsZAmME1A1G2o5tpEFFyHaErv0IkH8FyLtoEMQTctqIYSGSYdfpEW0SSFmBnHRssCEGCuvJmM4hsFkm6X4NWaWnchEomSYbyjVOIbYIED1CMLtkRHnA4N3kiVCF8bsnCumLpN1nGUKLdimSwA8k8tIG8u8oacaYwqaTdl6hGdcY8s8iebaemYGo2fPo0rCZ8YfCyR5l2e3hKXChyF0TnK4deeHIefeR8gILOtQv-ngPQheTuUdiBTMneceR8o+QGroHTqsOKXEF5M4oED4HCjssji0ipk9CkP8VkUoiIIqKOJLqPq7tpKsNBl8MIlECkn7gMLEdaC6GSHSPsg+kMUKL-rAP-vTJDEeSQCbqQqorfOgEHDReQhFhHK2KSYYhSS+XHGSBSKSNaI5olkMI5p2Vjs4iSHuO6RRNaHYFED-n-rQuJSJJJdJf-OwvJZxFPGACDGpeSQBIxdvosFRKsOjnmJjpEHuFIfGt4BWI1NpBhoOEpadgNhoNQZOSnnjuhBghIpyIEOnM4geLKv0UMKuXFQlcFuioJjLg0eIYak1Coe1oNAWOpLYiSM6AECrnmORFiUJccOCdBKoJfFZslVGeed1fQL1VBP1ZXINdQOhbWg6caKjmCF-q1Kgs4sZd6bEOhCsOgt8KuJ6GqV4klZiponUIOHMoQpXDgF4VUHbhulPiwHgGEMgNEvNQemKjELmALPaOSFdOkuKeSCuCpCsDwdkNWNQFMXAPqNdiUJmabLCsyKjFdBkCvFSE9AyGbBbHuPLC6EFMkK8OyQdQUmiJGKVM2BALDcjD0CDqSCCKkUeOuOtQgEFLEcqfsgCjBqXqNScOUBiCdRTc8EuBbACP1FSJjExmCl8G2t5jnJ4DhGLF1dDUdiRpmmGIqMqBUGqDGJqOLuTVVU2TBrCeofslmCvKCjMGsHFvaK1WSLSIJYrfQAboST3L2P2PzZ5HpNBkMHsTjD7ezixtSF-q4tKskMQaojoaOHBPbhNtIMgKcG7RIRtmrpMJ1criMEWL6eyKgvMLspzfbQxNXMxIJOEvHT0MxRRK5q5oNIzTnDaFKoRK8PJgMMBSdq2FbiXV5GCEbe3nEBgV6QgL2U4kMN1P4KLD4Bhl9GWtNP7NlADFPmICXbKs4PjRgqjEsLjNsYkOhLjfaPxeRLYj-j7NUprLNIHCXfpQsI5kqRlpyBROnDjE4jSWzVptCHbZeX3OXA8kPDXDedBGPPAHrY6YvAsDFS8YgmoVsf9p4Ljq7ErrYuSBhiwj-GwjJQ-O3UuQpB8I5h8DCNjuItaIIvRlgSKk3YTUMkdWMjMKlfPhSFmIsACNrjSMHnaJ4OhEsH8C6RmGPaQyZAbiZmqpULwPHY5l0ieCvCLPMDOQRCkAsHjXSKsIgvEM3XdjefHQ4DnAFW2oXkDsnFvM6Bo4EArv2umEOWuiGFOpugVKo5uS4HxZXZvVI3nmyHLI5mWbnW-T1X1nwxivHZeuhDpBpHuHbM-ggE8WCEoSkFmKyO1K-QhXai3fdvyPHUEOhGyf4J0v8H4KweYm8EkN4CCG2s4gTVRXghDmBNDmEhtAvV5rnAzmuB4O1BA5EI1AsOFdmJLPIs6KTvAeLtTpUwA1pXuAjcsVbV0VIuzkvGhHnHnEpHmfrnXkbuHN+mACXeSJpIjTaNmKxWjZShaKSIU8SEeJLG47E3QA2JXt6mfQIjFesOyHBuLN2sWHuOSO6D4D7bZaJfZUAdAaASJOAfPf0yhEIuhPnCLSvOMNE37nCqWR8LviuIlnwaQeHMIXgCXcCv0GvfUzelmEkbXf1EqXOXEMLJodoQUHoQYZDEYUswvfCv0CFUsKzskN+RemvRhPsnmAfDSTZdw7ucCTyaCZ+AvZ4ATH8HbIOhuPsooVyP8kEG2r9nYAre4-QOaWINqdKGGSmYK1KwHdlsHrrkWMzRWZ4KKokA6MGYmZacmQ6u3dEQ9MruSB1ayMWcMNC4MDIqCAqyc+CSOVXGORTXBMgN6QCobbuL8ORK66EE7jKCiyjFRApBmN4DwdM+mKEPXFHEQN6escGwm2G-hCAN4VAOQNGy8DpeRJiYm5w93nMhAPIESNoKEAoB4YW96RSs8L0VIfG78A6Em8uYG-1Fm6G1uJ4Eo-uWBahe8kI5vQHo1EHivLSMw9EEsCvGWJic4sQbRb0xBGfd9Ueq63VTtsEznGSN5ikOMFKc0+82JeHE5X8zxK5VAFuxYgkHEBRUSoMI07MH6dehsLnHS7Fdy8cPFU8oleVfUvWkdP6z8lbBhCay2h4FCBSpG9G1EI1NBwkFbLviDkgqm3BOmyE6dKh6sMenB+Knm420h4xqh7bBsSeGtiAFWzW7MC6PW8JgW9GzjKEG9j5pR+h2k7R+bVB9toR8+86DhCY0JBNRdV46YmB8GntteugujnLex9sZMMC5uAWPpewaDZkEAA */
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
