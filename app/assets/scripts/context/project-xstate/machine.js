import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEAsBAqAkJ2HYsB+n4sAARnIeAaDOTRJgSC4EPYwy+HQwxDP86TLAMDKrLuWH2FyJ5Zv8GZerWApXnQt73rQj6UM+b5fj+f4AfKyBiOgNQQV+MFwQhepIXOKagM8UQjDEVJeF8fjZgM6QMlCFIxPYrgUekjj2JujjUfyyJ+iKFxqMGnAkMgAgALJWZGOBmZAiF3MmjySdYdjaM4WZRB4DikQWDIfGCYxumk1oTHC57jsZQoAOokG0FkyugyrAcwLBpSwKjUDgYBiLZ9lcOGEDoO2Wiia5KEed0J7uK4LgJH8BbyQ6viEeMmE+NajjxIpAxOIZSK+glSXmdKqXpSB0rZbl+WFb+cBcfNBUCVBGWdrBeDwZVibie5ljWC6fglh41J6fEekdeEiBksS7x-Ok8zfHSnhnjsNFxcciXJZN2UZbNyqrYtnGQDlJB5WtkFASBW3CVoNyzoaElHd0V2aTEriwtC8xLH4qmBMyz10lC7h6eTw2XiZ15w62MPQWEsPMFAUpFcgnA8IqXBSC5eIo4dzz2OmzjkukXgnqCAxLCpt0IKRzouH1-zUs6RMfTWRmjcctOgfTgmM8zUCs8G7Oc+G3DIHzyHzrVaFbo1oJRP1NgJG19iE78MR+BSeFDGM8RU7RNN0xZDNM4DJtQBxy3gyD63M-DO0iftAvGmh5MLPMZIy0sbI3TMJ56SyWkJNj3ieL4QfffQABiNDsOQQF3g3YcGzw1AQLAAhlccNASOg4r0BewdCvX1CN83jH61B0Ed13CD9+gWrtA01sHenxIgjEvh2OhIJ4ckqk+M4G5b9yelaQZMVfdrdcjhQbAT2oJBiEBqgkD3Gj0EvQ90CPNc6C1wfk3BuL834QA-ovagA8V4p3XmnVCvR7B0GtM9UEGwBhqwZHmPoW5BjslIt8eYGsAF3yASAp+bRX7vzwJ-JUGBUD-zEKoKaRB-6xXIcAvAj8wGUBoZAuh0DYGqFXnoBBbl064ToC6UuUJVjNSmHLSYJJiR6ViCscugRq7kKWhAZQDxKjVCxL+Sg-YhLJ2oGOWOEAJE1TRhSRI7wbDElhPaTS0IPZyzJn0LweEnAAiZFSHR9ZShVH0fgdoRjLjCDAAAR24HANiG0CojmnFVfmkiFyfCwpuPwWYPDrjtCkMEgxJi5hxlsG+WtQmMHCQYqJmI6hLX-ODcCDMEZ2NtmjVYLoYhshdEQzS5pVIOAWH4AENoyzjGhCEuieiGkaGiViEQCSkngxhrAdsJgKBdNRl0VYfUZFOD6m6RSjgiyDDoD1Bq1Itz-DmSZJs-BlRoEgIsqxqBeC6lTlk2qNoFhfGhA7YYcR+qqQzKU+Y2N-CkXQe4R5QpnkRjeREwxXzqD1CRmJRB-zJguEwSC3cbtj4JHeGybwFJ0I+BsIixszZXn1MiUsjF2Jfn2K6ACglwLXagpJXLdCfTPDpi5CMAEEwEXVJGrU4UZkZ5fz7jAwew9OEyrlW3T8wjl6iPgRkm2+zIhuj6Og0iNL0zOmPhkUkVIoj+HtHELwdL6CrMSS+VsNAXyQ3ygqn+Sq-5kNqS6pJ7rqCeqhlquBe09mC0QGosE6jXgS0mGFLxMxNiYUGYEK6uN7VOroEGt1FkPV0KhgIBhaVmGsLSuwgNdEC0TSfmG-KEadVRr1RvBccbSS+DiOLB0vxsyptjU4FBlcCnfDZFWT6NS628AnhZVFHyBBcAgAVAQnq8AKiMflSgUhbHttxQ45Y1zdyrm8CkImpLGpBDJFmPCWZvJ5qEHO1si7mWYpEDuvdOUxTihaDQPA0bjTQhklyG9DhsyxFcMfFYWMqT+1iHuLMT6X0LqZQ8WJX7wZqH7DKEC-YgOdvJCSG0yRYSvAahkIdCAKTeX6X4lYlo-BUSldTIUz7qDzulG+jDn6wC7vBjxqJeQoCcUI7VK66ZrnpgGGXZ04xCZ2EWDaCEZGXSDBQ5x196H2gCFfHPVAo4MXiaPQ1UkAyQR72JNjVSK5HQrB0u4h0elNNcesWi3TCz32VF4CwdsJBVQGe1CZro+dr1km8n1QY8k2SqQ+JhXe1IbQjDsLhVz2n3nvpjh5llvn-McBwOgIgPE0n7vZd00LG5wswiiyo2LAqVh9ECIMRI5ogiSundKuisrqgNpHj6ugv8VW3zVb17TNEW0PDXgev5aMvjeFQfg569rHH0m8acxYnhqUuKQ1XVjo9jgABk+KARYfwF860fnI1m6F2IJJXbyOSP8DISiZjO2NSMH2JD7R2DzQANVfpQQR0hNpWMgldnFN3rBkh8DI-4TsNx+1lmmqECw+pDAyLCYVYx-uA+B4nMH7EEzXY5dD12JIosrEvhLQJqloRvG+LpLybofu47EED1QIO4aE+-JoHEJOKvHR7SSeYbJrSrBPD7VSpZvZZn9iQhwebkXKneckzmq69MQEAqQDmYApB8BYOQSGEAxBKlgCF6Hrw3g4Q8S6OS25vHLdQckFxmk1hRGvp1tjOt2A8RIEzcyTMYb+dQG5ldr8BAAGkwBgF1-oht21drWNaWVgXBrugDHUje9CZdhZ+J3CfZTNOljDO+FOzWXWnnx-lTDQroeIz5aNjAVPkPSd1St1hNWARsYQgud4nwYJ+rfF3v1MXQQlfV41XpwS+UGWRkjs5Gbbe0IfEzBL2I5IoTuj72muk17T22oHbEcvtaq9-Uuy0ritevVrUTynNPMa6qZ3eBLJSSl85xYBLJHMJ4nTCw6xXt7vQA2JPtKODpfhsjPhoE+EQBYrtBbk-sLC-jnIfOSBuLZrEHDksLuCKuMLSvtoAteL7iwmEK2JbLxPxDDOHoVAAKo8QnbgwSB44Jz3im4IEEAgYJZnwuy7irDI6xq6QoIkxqTkw2gn6qp1p3h-hNwwyHbsB4AQ7VSC7dC7yOhRABBbYHzUYHxvDPSJDyS-Clh7Ze4HbOpSFwAyGCRyEvhYrlbp4EC7zOA0gNSZ4jCOaERaT2Y9okxODizIYEHkINgWDn5VD4CQxQCm4JybTq4DjsGcHKbsg8GCH8E0aBCYQBwkx2DKRXR5rCjQGUBQDcCoCtjtLsQ2RGBJQ4CRiKim74CL52GP4cG-Bgi6SI7UhXwUghBywgjySPTKxbh5zaIBEyr5GFHFEWSlHfifikAwCoBMywA8CoD5TVGpJ1Et5KH2Gj6NR25+TtHH6ER5ilJApjDkh0jjCe6AGmEiijFFElFgCdjg7lGrpvwVA1EFD1EP6bwnLHJy4uIYTfApFOCgguBApUZaTEiOrDHdY3HjHSiTGxJrIviQFQRbI7LkBxHkyhToQbBXRaTyTeR2gjA+QuKeEuLApVImGAJ5HUD3hjF3EPHsT1pRGpL8BxGj6LD9S6SbDRYpEwhNZOBb46S-DCq5Ewn0kX7FHmJ35WJvIp5slXQyJcnZgYLyaEnFguKBAbDkyi7GGXGAKvjIA8SkEWRgDBGFpgHsS9y+oDz+oSEmQGlGmtimnyEzyTZiK6DsFkjXI4n9SqyakbB2iDqkh9SaT5gngJB5q3im4NrOnmmXZWmDZ+rDYzo0wslOlmkNqQRum6oNHpxfDPSkjRarASxkRch2hQiYTki0hch4R+CQmUnkL1rInNzRmxFL7KG2Au4uCDREwnjLBdEzAHyZgMbEgTDw5+BPrxKurajMmtm2GfFIJpEnp+Lix4TYwOA76ICb4+RbjqLpjkSkJ2lChEGwB+5MwsKoCsC175GoCkCGLUFR4x5x7n7SnJ4ATsEDBBDXLtTPajB6Q7jkb9B5jph74OhjAAGn7HnEH+4sAXlXlQE0ksR3lRIPm-jLwx6ASQxhD+ZMyvmynvntn2GSx9Bu49r+BPYAVkq0Z6TeSrhDTwjUDoCrrwBIRHm0ALl2xoHMgYw2jZhfCvDQZyxoQoJ7gQiSZjAjBkh5poiRglTNgQAcVow9AuKkggh3JHjrgDmIDkwaRLCY7eSuIaZQkmQyXnDGIzAbGNFLgoIAh9RUjsjPQ7h-AoIbiuyeD9TSziy5G-ruphiKjKgVBqgxiaic4KWt4dl2Bbgcl+E6RZi7wO6FzoTmb2jOh8G0jiEjZ0TK7ikjy9j9iKVSQUQnpDCgmrn55yyDCwbUjQjkxgpkUUl6mNnvKhGjjwSG5FbSDICnAFXWD+AkVEy-DeC7wGFFgoIBC0b6G7kQVsU3gtxMRPgXaQQ9WLirAaSyayYyxaWzApDMichrnZhoL4ENmjaiIWQ67LU9DAkxWHJxCJFrYzAMbXJDBdT+BSw+B5q-QNpTRGxZTAw35iAXVUrOCvCjmEL4wFx3SJCYSiH2hnHeSaSRmhwWmzwRwzRRwXXCx-Ckh+I0Vkici6SERFX7nArrBwoZUpljwNywBNyrrTwaowTzwsWWWbxFUNSkTDKTp7gpGdGizOw4n+Ag15rcK8LPz8IQIfwXV7xOEfDCwfAwjOwMhRQyIQaRUgoDDSU6YsrmXLUBAoJ0jujqHDArmbkIADALbYzPbeQ94OhK5z5Ca5aHT6qP557fnSSSx4wEzeIpALDJCi6rBqyBzGVCg9anXI3LUOCuyLDOWuVbY5yWpNZ-CBCXRZrpiTmIkNrFo37h37kuAw4bVQ1xZexsjuiSaJDujpZoaZb2JO3AYBAyLkxER7hTIQ3ywYLOINS7zjB0htS5HqrcbjjLVBCYQ6lFw+B4zUaOJvBJDeA9HCxoF5rHb8RnZJLrSA1Ka55DVDAeDyQpGDDzAxCObsjOiwhBCB3HV0QA7s746g6r3hVEWHHmZELxVch6V05sj9AqY9oJB7gri20vIsCq4JwrpgAXXEbOA8UZC7xUiOWO7Alz1QheQuLOjTWZU0zQUB40BB6CQh5h5MWvwY3WjGorCTCvAOwZBbWDJgivVQhy3OitYT7n5LV32NGy3W4hQgjsj-AyxxbFhc0uiTB+J+KRnoNkH0GUGCTUGA1bjxorjw1kQpAm0UgSykgAhshzB5jWiTl4YWEJzWF4AXXmof3izb2whZF2jfDMh9T2jDU6SJrk2V5IrBENotXhGREwzRHANSMnhAWJ32hQ0UaEziyoI6R5iXxclRCimIV0kTH3G33M2oRcgZgHh+DyavCI4m0eLMjUqTCBQIMjB5oOliDGnSixmZlfiA3IOPRXQN1y1BBFg6U1meCgqJA21B06xpkmkZkzyS1D6PQ2O0buh0jlnDD9CJCDAaKgj1mNWBpTnrKATuMskgPMPmDwTIBbkGXRU4GghbieChCm4yj6PoxjBOEZjeDEPYzlKhBzzJxEBbl-GbNnO0W7MgDFFQDkCHMvDqTeTY4OgXPpihDbIQDyBEjaChAKAFHvNblKLPAug6RYSnOGENQZj-PdEbMOVbNPMXGQU+6nkkGwUkCXnSDXmIW3mtrq74PLOoRwrMiGF-A3r4IeCqRU4yJEyqOn23XZDZBAA */
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
            target: 'Define first AOI',
            actions: 'setProjectName',
          },
        },

        entry: 'initializeNewProject',
      },

      'Redirect to home page': {},

      'Define first AOI': {
        entry: ['initializeAoiList', 'setFirstAoiActionButtons'],

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
            actions: 'setInitialData',
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
            actions: [
              'clearCurrentAoi',
              'setCurrentAoi',
              'updateAoiLayer',
              'prependAoisList',
            ],
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
            actions: ['setProject', 'refreshPredictionTab'],
          },
        },
      },

      'Load latest AOI': {
        entry: ['updateAoiLayer', 'refreshPredictionTab'],
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
          {
            target: 'Display large AOI confirmation modal',
            cond: 'isAoiTooLarge',
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
            actions: 'loadLatestAoi',
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
        entry: 'refreshPredictionTab',

        on: {
          'Mosaic is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: ['setCurrentMosaic', 'refreshPredictionTab'],
          },

          'Imagery source is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: ['setCurrentImagerySource', 'refreshPredictionTab'],
          },

          'Model is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: ['setCurrentModel', 'refreshPredictionTab'],
          },

          'Requested AOI switch': 'Applying existing AOI',
          'Request AOI delete': 'Requested AOI delete',
          'Prime button pressed': 'Enter prediction run',
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
            actions: 'clearCurrentAoi',
          },
          'Deleting existing AOI',
        ],
      },

      'Display large AOI confirmation modal': {
        on: {
          'Keep editing button pressed': {
            target: 'Enter edit AOI mode',
            actions: 'closeAoiModalDialog',
          },

          'Proceed anyway button pressed': {
            target: 'Exiting rectangle AOI draw mode',
            actions: 'closeAoiModalDialog',
          },
        },
        entry: 'displayAreaTooLargeModalDialog',
      },
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isFirstAoi: (c) => c.aoisList?.length === 0,
      isAoiNew: ({ currentAoi }) => !currentAoi || !currentAoi.id,
      isAuthenticated: (c) => c.isAuthenticated,
      isAoiTooTiny: (c) => c.currentAoi.area < config.minimumAoiArea,
      isAoiTooLarge: (c) => c.currentAoi.area > c.apiLimits.live_inference,
      hasAois: (c) => c.aoisList?.length > 0,
    },
    actions: { ...actions },
    services: { ...services },
  }
);
