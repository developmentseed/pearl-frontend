import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJTY1DaJDELAAggB5ACSAgYVVgioQCwECoCQnYdu+34sAARnIeAaDOTRJgSC4EPYwy+HQwxDP86TLAMDKrLuWH2FyJ5Zv8GZerWApXnQt73rQj7Pq+n4-n+cCAfKyBiOgNSQV+MFwQhepIXOKagM8UQjDEVJeF8fjZgM6QMlCFIxPYrgUekjj2JujjUfyyJ+iKFxqMGnAkMgAgALJWZGOBmZAiF3MmjySdYdjaM4WZRB4DikQWDIfGCYxumk1oTHC57jsZQoAOokG0FkyugyogcwLBpSwKjUDgYBiLZ9lcOGEDoO2Wiia5KEed0J7uK4LgJH8BbyQ6viEeMmE+NajjxIpAxOIZSK+glSXmdKqXpaB0rZbl+WFRxAGQDlJB5QVAnAaBnawXg8GVYm4nuZY1gun4JYeNSenxHpHXhIgZLEu8fzpPM3x0p4Z47DRcXHNe22tmxMFhFtzBQFKRXIJwPCKlwUguXihoSSddXps45LpF4J6ggMSwqfdCCkc6Lh9f81LOoEGTDZeJn-WBgNQdBIMZVA4PBpD0PhtwyAI8h861WhW6NaCUT9TYCRtfYqmBGC3jsnu4w4-E1O0bTAMWUDTOg6zENLVx80bUDGU7cJB2zkjx3PA69gLPMZJ40sbJ3TMJ56SyWkJK4sRBLCKu-fQABiNDsOQwF3sHGuMzw1AQLAAhlccNASOg4r0BeqtCkHT6wKHEDh0+keCdB0exwgSfoFq7QNLzR3GgQxIgjEvh2OhIJ4ckqk+M4G4N9yelaQZMU-aNxwByOFDMWoL7AaoJDxxo9Dl6ndDp-7dBj3gE-B1Pr4QLPZfUMnlciboNcW3XvT2HQ1qvaCGwDBTDJ5n0W6DOypHfPMX01kZI+B+Podt6UGnnvPAc8lQYFQCvMQqgppEBXrFP+68AGT2Abvfe5dj4HTPm5OuuE6Aug9lCVYzUpgE0mCSYkelYgrC9rCLwfskEcQgMoB4lRqhYj-JQfsQk9oaDHJxZyVVEa4IXBSRI7wbDElhPaTS0IpYEyhMTLweEnAAiZFSRh9ZShVBYfgdo7DLjCDAAAR24HAUcRsCojmnMIvmyMuifCwpuPwWYPDrjtCkMEgxJi5lhIkLRdFmGsIMZiOoesVoQU1qbHBNUUarBdDENkLoP6aXNKpBwCw-AAhtGWcY0JAkmWCfo-hYTjFmIsStIGsB2wmAoLE-m8SnB9BurENkfwliOCLIMOgPUGrUi3P8QpQomz8GVGgSAITSm8F1Idc+C4bQLC+NCIWww4j9VUhmbx8wvb+FIrfdwwzGzNnGboqZ1BKgzITObURtVFkuHvqs3cEtO4JHeGybwFJ0I+BsEc+goyIwTL0Ww1AVycQ3LiV0e5yydLizWS8gm6FEmeHTFyEYAIJiHKHr-bRplqgTQEvPROh8U5p0Qbi4UZkGZfgPkfVQVc9ANIcZEN0fRb6kR+emZ0ncMikipFEfw9o4gMOxSNXFIgKmwAJTQKVa18pEsXiS5eq8kESvMVK1sMqwHrVpRXelJ8mWW0QFQsE1DXhY0mGFBRMxNiYRSYEG60JXhDVFTTIUaqLGauoLK9aAgIFpWgbAtK8CVXitMeq6V3rtX5V1Vg6udja5iIcKa3wcRMYOl+Nma1xqnBX08M3W+7JorfRxXRIQvAC7SiBecgQXA86FVlXgBU7D8qUCkBAQ1xpoRfF6buVc3gUiU1eY1IIZIsx4SzN5P5dBy3UErQI4F7RjGtvbTlMU4oWg0DwJ2sRAwFhclHQ4bMsRXCdxWDEak7jvKxGUtO2d87q0lOoMusAbaVpqH7DKUC-Yd21WhE9G0yRYSvAahkbNCAKTeSSSolYlo-BUVdRnY497WyPoeC+t9QE0MGLyFAf8sBf0oxuumXp6YBie2dOMaWdhFg2ghEBl0gw70VtQ2cp9Ag3zF1QKOUFZsxLzL-eMRqpF2QghbsSL2qkVyOhWDpWR1tfDMbnaxyZ7Hikgt4CwdsJBVRce1IRroTsR1kmvcSChbJVIfEws3akNoRh2Fwkph9bH0PqdCZp7THAcDoCIDxGxHaE0CaIxuYzMI+qDHkhZxFKw+iBEGIkc0QQsUlrFXRSl+LWM0QVXQJeZLh4UqpRZdOsb9XYMC7clGXxvDX1fq9IV4j6SKL6tZzw3ypF7iiNOgAMnxICMD+BSsJQZ41sQSTi2Ickf4GQyEzFFmykYfhEgqPtHYadAA1F8lBQHSGNhctisyIWNKtpjfd-wRYbjwhkVSUIFh9SGBkWEKKxjrc29t0GFUhs3EO8yuq4sSThZWP3LG6jrt4WcbpLyboVsvbEFt1QO3tp7e-NiOZFXngfJJPMNk1pVgnkW6pUsMR5KKzkoNadALlSTMsVBOtA43wQCAqQKGYApB8BYOQNaEAxBKgI+VyF1hNJg5wnIl0cltyKLq9fZIUjNJrCiIPFLbq-rsB4iQEG5kQZA206geddaXwCAANJgDAMzlhBLdr7QEctALqP+fdAGOpUd6FPY2xUTuLutHgdLDSd8KsiukP-LN9SjjUFvM64jJ57WMAbffaNXVV4bx3RsgCF7CEXTFE+DBP1b4zd+rY6COToPhcQ+CXyicyMLNo-Dfj8WAKTg9xqXdOnm1dIR19oFZm2Ifuf6pZMg2Iv0p9sRKAkDA2r4Lcn1j3Xa2tssZKSUk7SzAJZI5hPE6G2yWe9K8D8lQfyPh+bW89Qe8qAiC8P2tXtC7gbbvDnw7ckG4pOxAIYpXcqLxi-MQ2va8KuYFhFbNzLxPxEDHroVAAKo8S9YrQSCvabT3jc6X7drWY9xiy7irD4w2q6RXyvR0hKJ6TX53p3j-ihxAxdbsB4AHb8Zo7WDNyOhRABCtZtzgZtxvCvRLYjArAUyEFfpwAkFQRkFSr1BfZUF24EDNzOA0gNQO4jByaERaQyapo4FOCYxZjk4WC74trapQDc6bTGzQx5yUHVRHanS4y0bsioFYEYHGqBCYRjBOryS+Tkjd6hppYaD3hQDcCoCthRLI42RGBJQ4CRiKjc74BCK27GHdDZ6yy3S3wDwUghAEwgjyTPSkxbiOyBDTrChuGUAeFeEWQ+E-hfikAwCoAgywA8CoD5RBHWKhEx4iERH1yt4ELnYAhUhd6ER5jeLLJjDkh0jjAK5b4B4ijZG5HeFgCdj7Z+H1rVEhH6Z84NGtLOA3RZgriMblhWGEydEuDLJgZaTEgir+5rxZHH45GeFjETHI4epSpVJQQ1J1LkCIHX6hToQbA3RaTyTeR2gjA+RSLyFSIrJbBf5ILHHuFnH5HjGEpXHU6CT1o2KIF56LD9S6SbARYbEwixbNIug6S-AoqZEjFgnSgFG-heE8IT4XITLW7wk3QELInZh3yUZfG15si-BkRY6KZAm4pvjIA8T-4WRgDqEarF4JyKrJzKrkp0Rck8mtj8nkHUolYPDxrhE-ZoRvAsk3bkwywbB2hZqkh9SaT5gngJDTq3jc4EoymCl74-jCk5ZKp5alq0zWJmkCkEpsTykMqnzzHKlfCvSkgRarBYxkRch2hQiYTki0hch4R+AHGDFrxQk3EwmOkDiX5+RjaDSUwnjLAJEzBtyZgwZmaTC0jsmHGqrhqVIj5QSwn8BCFKlx62A2G9rLbLZewODN6IDkjqR9rULpjkTfwuG0y-5q4sAwKoCsCj7ZGn6lb6H65G4m4sBU6thklW6ASX57rMgWqBAeCjB6Q7jAb9B5jpit4OhjCb59lCg-6wCq4gzDmjmh7jmkBsKgHEkVzG5ARrRhDaYgyLkUnLmem1nYx9Cy6pr+CTY7lvKQZ6TeSrgurVjUDoB5zwBITil+hT6oQP7Mg3T4HZhfCvCnoExoRXwN7e5UiQX8q9lIVChoiRglTNgQAoUCx2BSKkgggDJHjrhZmIDX4aRLAPbeTSJMYclBKnCRhhJ0Uow9CcUAh9RUiia4WzZ-BXwbjiyeD9S4yYyZHrqaphiKjKgVBqgxiajw60X1Fel9qIkqGwpYXi4uzoSkjyLOjoG0jOHkXHJjLnFjg0S9j9iiVSQUS9pDA7GYyBU7hDBXzUjQjX7rJAWAnFlhosJVD4AsDwTs4+bSDICnDeU0GkSkiUy-Byz2YzZtmrC6nywbDzBbgOjGn5xnBPg7wCQZWLhFW6TkbkZ4zsWzApDMich4SvCAYDCZGFbShM71U9Cgj9DE6rAnrmGNYzAwa9JDBdT+A4w+DTqJQaFTTaxZTKhj7DVfLOCvBmbvxLB+CESJCYTX7e59HeSaTGnqyWnAxR5SjDU2x-CkgqIQVkici6SES+XdkrLrD7JOX5Z0RZwhxhyMTUowQlwIVGHKkNwLANSkRpLJ4KybKeD9CiyvH+D7XTobxbw1VoIzxgLDUtwSEfA2wfAwiiwMhRQEJHp2CjbUh9UCVFIuahIcIzAw1x4BBXx0juj0HDDLatkIADDVZexTbeSp4VXM0jLl7YbTLHT2Jc0+C9Jr4ODYVRnOzGopALDJBY6rAUzKzS3HDpb0qFz1Vq2NRuhYyKWtb2w8qxYdLW3MlImEGSqRo+r5Tm3dkuBkgqLizsgpCWa-AEIVjEaJDuhOYqaLrIyK1doBAELX5ER7i5Ka2Ex3ySINQFqshtT9UZZFbjj1VBCYRsmuw+DzD+CbLQjvC9QwZYwqJsjda9ZDnw6DZsQ7U0Yu5yxDCblZjBXzAxBybsjOj0LOgw5w78DvZI5fhPVbGI1li9A3xtVqShl0apoJB7grjk7l5U6bS07DXkjEQYU2hYVUivSqQWivXtleRSLOgnnOU3gDnq40Ca5QTa665wUvhPXWhsqcG4RCwZBL2wYlivEU3OgJaF4aFt3GV-n4II3rDsj-B4yWbFgKwuiTAqIqLGmP0AGQHAE04f1iA7VbimorhXWsmpqbJYykgAhshzB5jWjcHEGbQCF4DDVcr9BHWbmwh2BonfDMh9T2jNwqJppYxqEaHxVaE6FGzbT6FgBEMnh7kdL2inUgbSyYzXw6R5j9zImdZG3+j4l5GEkQlQOc11xcgZgHh+CUY9WdJyFch8pBABl9TEgjDTqSliC8nSjmkunfg7W33PQ3SJ0U1BBFicURmeBrKJBS0xV0QmkjjSnOnUrE3Z7PRCPkidGsjBnDD9CJCDA0KgjRmnnIalnXHlkJmmlyPQPmDwTIBtm8VmVv6ghbieChDc4yisORFjASEZjeCcFey+KhDFx8JEBtlSJgiiaNOQUtMgBeFQDkAdMvDqTeRPYOj9PpihC1IQDyBEjaChAKA5HzNtlkLo5dNYQ9O-CrMZjrOJH1MTO9NTMDFFMP0Xl-7N0jnSBjknETkPkENPXhW9KwY9SfBKWqSA4h1BA0NBAcjsnZBAA */
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
        addNewAoi: true,
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

          'Pressed cancel AOI draw button': 'Requested AOI delete',
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

          'Pressed AOI cancel button': 'Define initial AOI',
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
          'Define initial AOI',
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
