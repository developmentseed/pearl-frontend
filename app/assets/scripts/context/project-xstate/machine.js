import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdicAOJ9tuuALLe-frAFYAGhAAT0RbQIBmOj9tez97a21A71SAXwzQtCxcQlIKGnomVnYWVDASCDCBHX0kEGQjE3VqcysEa2jbAE46HqdAp283aOs7UIiEe21+icDre1Hez1to3qycjGx8YjIqWkZmaXLK6trNWwbDY1N2xs7uvoHbIZGxidspyO9Y61cs3W0UWvjmgS2TR2+X2RSOpVOHHONTq1huTRa9w6iG0PwQ2khuV2BQOxToAGEFDgANY0KBsABmLG4sDAqDYHFk8kUahU-AgdT05madza2IQI363lmHnS3mG9kWeLetmcTlsQWS43cvXWhOhe0Kh3olNwtOo9MoTJZbI5MjkCiUfMEV3RItaZkeiEldGl2ll2nlTkV1jx0VGdDW6vDQNc2ms+ryhtJRwAonw2XSWLQAO4sIn5bMkIhgAQAZTAeHzBqr1GLYHqwsxYq9XVcDmcuuiTmi9l6gOi4bxgR8cScvT73W1XmiieJsONdAAImAGcU2NRWiQxCwAIIAeQAkgIGJVYKyICwIKgSHnc3ujywAEZyPAaRuNd1Y1uD-10ZLeD42hAQE-h4k4Ex0IE6yuD4Qxxr4thzjCRpkiua60BuW47gex6nnAF7MsgYjoNUD6Hs+r7vkKn7Np6oCdL+Tj-tYgHpCBrHeHi7auFBwbpL2urgk4yHJnCJrnGoFqcCQyACAAsrJdo4JJkAfrcHoPAxkTjtY-7QVEwyLCOgHKuMvquNECT+n8iz+q4okkuJdAAOokK00kMug7LXswLDeSwKjUDgYBiApSlcDaEDoDmWg0Rp37aQgg7yv+4yzIE9iuBMvQuHi-jaL60HZeMvb2FZ3iOQuaE3jmWa4c+YRXjeUBQHS4XIJwPCslwUjqRior0ZYiCBAkY4Ai40G9L0PTaNEYbqpGgFeF41i6qxVWoUcS61fVj5Pk1vmte1imdZFrLcMg-Vfi2SU+n6AZBiGeK9DES29GxuWBoOmzZFCSZOYuO23ntFEHc1zBtRaJ5noRQUhThj6+XmL54G+cVunRWnDRK3hSjKgaBgqSrhN61jMeqczpblAmzn9BZiYuABiNDsOQgWSaDAjRUcNASOg1L0AzgNkizm6wOzKlVFJ9K4QgfPoHybT1NdWPin8f4CaMSzjssXGkwgthE76CSSrBuW9kh9M1tVaZ1k+YjSIepAwKgTVljwqAhSwFaO-g3kCM7Jxuz7nve+UrJ+-yquDdjnTLbEQIbCGwETsq310KsAIxLlHhZQm1sA7b9BM5WFBYWo25XqoJDcxo9AK4LdDC8XdCl3g5es5XO4QDX8vUPzSvUboMeaeKGp9nEgFzSMgSrOqThmbE-Z9vYyT+lE00QoX85bSXZfs13lBV73eC12yGCoM3YiqF5qBEM3Nt723B8V8fPd9wrQ8Y6PiU4xP-Q-Bxm7PKeebw8QTGYoGBwgQDJzA+p4TaKZ6DphIA7aQ8kjDuRwD7UK+QA6YNgNgu0kd8hqXigNMerYYhzWcMMd4c8KrfANkbP4md4yuBzi4BI2UkHOVQeglgmCIChVwVHAh6ARE7gjng-A5DMax3FCZf43R2yjUSBsfW0xWHLw4VwvOvCd4oWQYwSoEBlD3AqFUFEp5KAlkomjDQ1YCLyKbIo6hqxYhWT6AkNePRdTcVVCsdYnhpSrEqkYxmZJ8LmPwG0KxFxhBgAAI7cDgPyciV48H3F-rdHG5VXr-gXt0AqMR5oG3cLEVwr1YFzxSBBRUfDFzpn4OyNAkALHxNQLwQUCiqFJWiICRw45DJvHVOtEIBtIFFSsiMTh5U4xBCaWSFptp2mxMsd06gdRrhuP6TjQZa9OyjJcH0DUkzpjdkKl4cEtg7nDAnNKZZdtWnOI2V0npmg0R7L-oxIZxzYFjLOUEfKHYogTGqT0dsbwPrPIktLLmPMG4DwFkLJ+JjySc2knLL+qhlZ6FyUNeO7ZE6eGTnZap9gIFeEzpU5YyQZT2BEpEkWRwRCpPSVmGgsAz7BVLEiugjc0VF2fuytJPKuXUB5SQPl-dB54uHoSuOI0rKxHeAwma0DuIBF9GxDUdzAS9A2iy1uYrOXSW5bykKAgL7eWvrfbyD8W6ipSeKmWG5pWytxTkglFCbpEpVbQ9VRlNW+Gpf0bK-p4w9kAjUhyJrRW8E3NJdZnSNACC4FIgQ0q8AsisSFSgUgIBKqUSZOgKQ+zrAgmCUMBsRiODmO2Oa7YPDmzhXQIQSasypriemkQBai2BSpNSZoNA8AluoXPVUyxsofWmoqWCeJFSFTmrAnwsEtbb22CKkxnbqDJvpD2+4SSB2QBYGoEsDIbwlgnUlWBhTAxMrsGkf0yRhxvQtgkOeo1cr9nbXug9by03bP7WAQtZ6j3xNyFAWGt6cawMSOWlwEK3Br1rdMIMmcjZpA8DCoIBdt2713V2lNZjgMCF3E+byVYtlwc6Jlcy6pZi3NbUMMMiH12BnVICdsSx7D-pI4esjvbtkxOAxUXgLAcwkE5FR1A0c-Vq2oT4FRgyogJHWB9bVqoXBuAcHc8EsEBP7u7cJ49YmRMSeoFJmTgV0BEGIpWVxtF3F3pU+W1R6mNFaYNjNZiQErIFIM4ghNGKsVCYBnXXmKKm7OrCwi0jAM5WKwVT-RTrmcYa2YlrBpuswJTNobqPwdz-B-G7PGwjxjnIADVtyUFPtIZG1ncK9J+XkzoACp7ANnmAxevnFpZTWICboyRprttq2IerqhGu1Wa0eHZfTfmRCWIA6eIC54bz69orw-RBspHgfelw7bVnsg6VWBqmbSy7ggJeUgnUwBSD4CwcgMqICO1QLAOjNh-GvHeKMSyXwXqTz+LTUBVyImVaidtdgxESBNSkk1Bq0nUCAczduAQABpMAYB7vmPdajdGzjzzOYSu1nSRr9L3KMkEddL1pRpXlP4XKrFkgVf+kR-heOuYNRwN5Wg7JpMcCOjAYt6X9lPEyo4bKQIexdiCFoxARqdOpBjRqHofZfqQ9ZSgrn2L5s855LacowuSeUKW10Iyzh5Qgl8IM3UVKKmLVYnYJXBTZnHd17Leb+FieXh5zKhGDj0ZfbbB2EZ3ZBIDiHP1wqOsQTaHsqNfwHuPJe7wrDM9PONBrnvkH4ebWA2h+GV2HsfYo8K8Nr45w8Zpzdimu2pcMOb5hCzJdEiZELuSPRwAVWIqRERl4JB1b94+NcjsQ+HOLyc8Z5zwK6kzokNRsxEjfob9kxF9dBUxeFRzoG6+9eHmS9-FWYvzfLEgoOTho1MopD8Bc34tCjb9g20x5D-7VxnnZg1AAMuwPArWXNxcbB2wp8I8y9ypo9tErJeIYF3AE8Jx4It12cqtFwRAr04Av9Hxf8eUFsC9lUi9jkwCV4Up04UhnArIjU0g14-AllIRqBJE4BhR0VxI8DxQCBTIDYCB3BfQRlRhwwRwlh3B20EQ7RIoMwIBWDWwAhlRgxfRyZ-R9sNQggQRhCTg7RkRphSdC8K1Cpq11hAJjJgJ79DZzIARlgDIYJZhjUtdW5TQaQuVrRWR2RyguRHReRpsJDADzd-BHAStRga87k+h3AZDHAAgPAIIE8lCYgkC4t+EMxUAsx7xhYiwSxJCkoggRwoItRporIJpylpgRxl5LIeFuwmUQsbCXVzFKh8Bz10Bnt7NpBkATg0j-5RhVQQFpco0UhhgIFBwkM1oPoF11g9Y18MJThNxu5yIWjGI5gV1v0Z0Rw4xmFphS8oI55wlFhJoIJ21MUEt6Q7tpjIhYE1VBgNFFh84tsjjAhnA+xioNQAhUhyp203JU8WA74IZ6QAp4ZQpDjkoRxri+w3AyUogNh0NEA2i6B2x+wPoVMYIIdkCod6BgY6oD9GoPioYoBfjRo5i50+hWJ+wAR8oII4gjYn0n8lhoj20xY2YOY9ipivCycEB0gPpdUNRKVuEogK8dFq9kh8NGcQxjt7ZHYWAg5XZ3Yw5pBfZ8FUBfj5RPB2F3Bv1hsZp042E84FhWIqDFgqTX4j4T4a5fjWFvBITz8lgQQcpljfhHBFhVhzC51oJmUKiTEBFhTCFiEpT-YZSGTC9RoRhIxqkRgAhyYJgHdtFTY4hIUv1sodZ4TYjmkhSMEGCdwPS3wvStD8CENrjFh9tAw1p-BjDuT1S+StSCMETtdTEOlLMNDfjEgdVfBFQlDYJEgwSEBOFCpqlBiexAU8zBTXlIMnEtlfiQRcooIUg8Z+wjCXAK9sp-w+h3hoC-hbidjwt6T0z1YX1nA+g8ZHi4wspqVmIzDOENZpczT38OUJULUpUrUwAsSFDITOEKpMpLJ5Rei9JewAQbJVhIjk9QtnIANTNKy-5-UMy0hds-h7iE9gw8oKkIwHAEhIFRo-Bexly6ThZZSqYoIjYbcbJoIQQIF4xy0n81gKSRtSy4yyRv9+8WAb5+AeVVyzdGSghClppKYRxJo5pQzIgaVvpLIJ40gqDxth9psIZYp6LgLx4EhjSFk49yZxhcoXpZDBxv0KC55EgrYnS4jXkztMlLtfiUhYI4gE87BWJBw3hjCJx+gldo1QIfC2dyLodYBYd4caBEdHxkdUcu8xBDSISOilguiVc6dQjuwPpY1uwew6YNLmlPcxKlN0jEhHBs43AoSmUYgK9c44hJxgxgJWI5gyLmCgYm84dW8+8O9Hw0cvLvT8CQROF-xcoliegc4WyfBVRhtAQjYF5dy19HZ3VcIazRsBhH1lghgspbJuJlgBrKkogfArDYz8qyQ0DP9MlsC8A9K2KBhhgAgohlhtQuToD2EmVpQ-FAx40sggA */
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
            actions: 'setupNewRectangleAoiDraw',
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
