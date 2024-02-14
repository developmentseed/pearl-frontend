import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsZ7MLhvQisRxhy0DVEXGmYhjFoGMgn63p2UsSjVUmNb5kAgTZhQIMLQaB4BJfOHMwUUhxHdLCU8ec3GZlGcXFk5c9mOEjTc6NYSXJGCyjgFgbYSAcCVGIAo3lXVry6YNfoQRJiUlHRudIz1KRYThFEV4IxaQIjZalDlda7kNqbWINmYALDsCBtK4x95hJ9i7Uq2k5NlaHuLoWSEZ63H0TER4X4bpNxQhsPEGdtq504jvJu-gv6+yygA+muScDWoEWGBaAZCQJixC5Fk74WFaToUPpTadD7prCkbPwFUNrTVVN4HqBVNiuh7xcKOuwyx+lRRmFezCiHhjeA2KeLwl9q2PpYhxyM3HuWVD44mDNgnEDCZ3GW7M2kJPuztGI356F-jHu6sa9TXHZ28eoLiATCShPnJE8Z8T2ZJOIGhJ5r45dvh0W8LhY1Io7JTw-j3SB-dB4lI5ZF6oP7IIQKgaoZeeggNY2zIWVSE6kiDWwn5hA0IlhYR6oyPCXJ71X1UzZN8lSJCZYcjQCVcMnzFU00igQX5qAdalecXgY8Qw5a6MeO0FoXY+o+jmOkeloQni9hSDcxkXo+GNU1tQLWf3taoZ1haFieMaD6wNg7Q2sS8vG-5hW4jlbSN+NCKI7s+0UwcL8YY7Jdxbea610M53JXSCOz1h4Z3BvSDIDtzL8zsUcFlFlTdLq3PutmP2-cUIMjaWUsOqTqrxHfCiARIIKwWP1bY8cIQI2Wyg-aAIZLqhob7aByusA0FYCLwHp2ndxGsZUtxuhbCSwlN0Qhe7XCCw4SsjipyTSNhjVU+oKNmUtPTtcDTZVCVeBFT6PKpQKQyO9Puf81Cc0pkAtQhZPRRwB8eQFcGMMILqHWPD0p9ThyquXMiD1wbkq4oJTtr4DdsrUJnBUUCCeDCsIVju1+E6cK0JYSJD8Ky8nrv6CK+V8d7lDyfcx394HkcYhv3B8hIMVS2Y1yFjCkWRb28KY2mvQkTSWwXdsMzzTpzp3vdgH19DNQeGCOl-8JhQYvRLSeBe4t-wYi-iJA3K7FDcIFfu5V13r3uBe++896OdAUB+Kl9C1hc5oW0FDBt4t9OLgjPIJ+OyJRK+led-Q3Tt8M9UAjjWfMm1ETDdEczVspjsyLEARBFI9H4O7GyOaKfIEFCG6KCGMI-lnp7lHCduYnDk+Ijtuijt8mVrBhaL8nLvdMoqTOXkpuRMZDuNpBMFWn-KUh3h7uvqgVpqgLwCumujIO-jqKXhkgenmuXDZk4KVu1LjByDvFyKCD4PLm3vQavtnr1s+simwauhwDgA6k6twTzgAf5j4NAYUj8EEDuBsNBjMBFM4D8IaoRDaMkKCMpnQUllFowUxDFl-HFj-PYSxAzj+kPOlovDDoIlofprMOWDJuyMRJpE7CCotiyPYnaLhLdL8OyKniphTvQISmBEBAwvwOJJBPxkbqjnEGIiCJMOMDIsuJpBfjML5phGyJsMMJsB4M7mnmwukeBFkY0rtPUGjP-kERyOaNZldLaMuLnNuJbosIythOLA4MkR4TZK0ZkYzjkbxJoHiPkbgasMNFCoaoahfOhPENuKOlhCUcZAkHEJpHYYlixAAGrPyUBgI4b7TmK5HB52xOALCsi-C7glaJA7jbgZB9DoROzY6UE-DGo3HF73HSCPGdG6Y9HG5tSPQnJl4p5KaBClZRB27eDlHHgsjLgzGXEMzsAgQkBhAthRIZFxzq7PwCB4ogQZHQwtYQlxwPibovHHjzClgsjDAyIFJKaQHZjiKDSmY5h9J1YpHp6sREkMKkkOTkkxKSRUmVQiigRKjATRJAQIyKlsnDFewyIyLoQgbnImH+bzaqSlpjBBAeBshk7ilsI3hSkklkl0nylQSKn04qnSBykakKnoBgJiCwnNTwm2AxFYQcjLjnyeB8mX7RBExJEbjeDWkK7-pwANwIyErfp5Fwmo4EC1YxA+BKJ0R4QBozAghsj9DN7nKERlhFLNH0HJlYpxzpmvhdE4GpxcjOCUi3QDChp4TGn6QnyLBvC7iZy7hGn2Zfo-pVD4CwxQCbpxz7Spr9gvFoLvDfBQgao7i-LmbXRjB-DzBibHIXHwpJYaAPhQDCotgrK5ELqwBLrsHrotL4DYFrHrxRBgggh+J7k5hLCVEerHjOCi64RRD+CPTSG1knnUBnkXkORXm8RfikAwCoBswc7CqXYsAbpbp-6BnZmbCYTYTDGR4aQ0ZFqTAxC0irgngS74nHmeGnmUDnmoCXlgAdjXm+k7QVAYVPlYUdJBEEB1GVY5gFw+CbgbgOieDvl7zDCsgFqt7gW0WQX0XQUyiwU-iorPLelQRvIfLkDLmFixTYQOI8nnKiVFoZjX4-HDF-BxARZ0UMVMUsW8RqVLHNLYaEbYW4F8UPaLDKz4S4UlEOgbh9D+BPZjDyaRk2UKV2UwXMWdFGImJf7mI-6ATLmDriK+U9qUjVZHIlgoaBBUj6mQgRVQWMXRUOU-gbS-5qkUmxJmJslKb9EnETDGUVF9kETsihlfFLDHwMQyEQXFX2WdH8raVCoiqajioXbSAypyrLmWFYSbk7jkRsicilYsiwj9D4RmTpWTS9UsSNrNotifrfrRbdyuF9zuEEnCh7XvoHVfqvhTy+ECIryBFBlXoLC+z-k8iFFLBiVOCqTwHoTaSwYWQ7UMwtI-qHV3Utw-gnV0DfwJY0Wg3YY3VHVQ0PX+FPWtnwJjCiGDBKagEmRwgOiwg5pvRwjiHUU1o2ROU6jzlg1LnPXZnFqj4DDgGFgmaggBV7gjAggYRNVvSwpyVU2PJoo00Iwa6tItkvnwKwHDTc0shEybhOBE06pUHKLZJiYRaOEyivLYq4oEqEouGw1uHw2U3CheFTzoW63SD61o0PAY1S1KrY7H4glfDJ4Oi-BHzslKYjBhSa0pYW1Yo4rW1EoCA0J5T0KMJ5TMKzFm1a1xyB161Eq21Za6DB4giGrDRKZSFXQci44epcirnC4UE+rlxJlKgjjQnPEM0eXGQbHnKA3HhRDZgLZSZaQxC53eKrV4RHmm3awOlswIxB0kCpoUI6LPx74PISof7xwtgJUWK-4vG4Q6q52kaLgrBBDbisiYS7igg-C512BRDGr2mwDEkD2SRD0j2gI8IT1-iLxgDQxz1JXPlZk11vBOihWrAaSeA2gHF4R-XBWjCqrGTGoDhUIf7P5oGZnuUmgjDXSDB2jnJSKBD5ysj7jQjGRfQOI2kx3HCgM4reFMEBk8XwnHgeJ34ZBIJFnCE8nTYBAp6vAbgU0NbCjU0wRWoNwoEw1w0sII0sPC0dHQTsPyEPDJ0wLV0mjrZvWbguJv1QbFkepUpYQJGaRwipBJlJpZQ8phJDWCoJqg6LnB5Y5FF6UqJ3T0QrUrAyYfaIamaaS0EXWU7DjJpaM4hDgjhVAaMpqkA8zq5uXEOo6Fnvl2Ong3omQOjsi4ygjlwJA+1fHqPOMLJ1BvgQBAQeMJO3mOqsniPzh0QZDYJ5gRHMpyIeqfbeXrj9K0Rik4MZ5OOaOJODjDiJoJNQ594lQMIASGOaTmhxCLgpA+BLAt0epHrDRvBWkGrkQC22l1meMuN1C0mQlNN1M4DtPrq9hOqwCdMjAuAjRQY0QZgOgZiz4TByYYM2g93MOOMzP1M6P3w4DCqiojjM6dZTV+Nuq4F0RbMk6ZhZ00wrWbDMg7gZiUiEQ9WC18NXMoq1MppVBPLorcVvMmg-CeD3YDOInnKE0wZrXqyGqgiNHnOpF0AiAQsxrU0YqaVW34pEqGOkguCrBhZuC-AWM-C6qkORm5WxDxOaNcw9596pNQsuZ5D76bTB5GmxSW67jaTaRxD0jLg5j3bGSkgSscsg3gvOPcub68uLM0ACBqGZOtIivTGXq0hN0BA-2BofT9Bj74QcjzA8icvNyRy+Oa5ULa5XZ57wu7qtQn59B3T-BY6TFjAHMoZKN70spIayVTMcpEtqsmw8u+6tqSiF4Gtuj-J-DLhmRLC6QlnfAAlfHKwTr1H2vK655b755troAdosDF6vgGt-3xQIO9BfTyMICMiaTt08gTHArYMOM1MzPqvuu4b-qTjJvkz4RAu7k2bNuOjv3Up7HR5MMEvRtcuxsavb7r675CsdPZNesoa4zkQOCSu7hHtTtnjX7JCV7xGbYquXMxuRxv55TuO8AishGWuwhnGMiwhTtDCgbIKZU7jrhVM9uEv8vqtXMYFh3lLB6JFiKUgoaFIZBdUHNmUhHy2TCMgaRFugcJOsHmIqH2p6uaGY2tSfYLBrlHiMvlwrU6mHN3Rn6qyYcmz3tyCmLHTz3JXbtYxPbvCrCh6Uqy5ZslNDC6k7HQgfnsi-bQ57aA5wzg4TVRg4fK4vE5jkxujLB+COJ2jNv-vvBwibiqrlibh-ASf67-bjVA704F4Vtip4dOQgSUDP3QOoQsgyZ+DyaSKHMCezA+39DnuPSfAESBDGe7YthPPlSycs7nDXYcddCxR5a1bzBBCifE59l5ZOhWjGTfs8jfBBemehf9j9YQ4yB-Z6IYEI6UBI4vFCdHhy5dUBBhTbgSIE5lw-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-XqxH56tTjee-USV0Da7vAUM-wTPuknwjVDHojIf5EBRUlItPQ2QIAA */
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

          'Pressed upload AOI button': {
            target: 'Displaying upload AOI modal',
            actions: ['toggleUploadAoiModal'],
          },

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

          'Mosaic was selected': {
            target: 'Loading mosaic',
            actions: ['setCurrentMosaic', 'clearCurrentPrediction'],
          },

          'Apply existing timeframe': {
            target: 'Applying timeframe',
            actions: 'setCurrentTimeframe',
          },

          'Delete timeframe': 'Deleting timeframe',
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
            target: 'Redirect to project profile page',
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
            actions: [
              'hideGlobalLoading',
              'clearCurrentPrediction',
              'setTimeframesList',
              'setCurrentTimeframeTilejson',
              'onPredictionComplete',
            ],
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
            actions: ['setCurrentAoi', 'updateAoiLayer'],
          },

          'Close upload AOI modal': [
            { target: 'Define first AOI', cond: 'isFirstAoi' },
            { target: 'Prediction ready' },
          ],
        },

        exit: 'toggleUploadAoiModal',
      },

      'Refresh AOI List': {
        always: [
          {
            target: 'Applying existing AOI',
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
          'Mosaic was selected': {
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
              'setTimeframesList',
              'updateAoiLayer',
            ],
          },
        },
      },

      'Deleting existing AOI': {
        invoke: {
          src: 'deleteAoi',
          onDone: {
            target: 'Refresh AOI List',
            actions: ['clearCurrentAoi', 'onAoiDeletedSuccess'],
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
            actions: 'updateRetrainMapMode',
          },

          'Add retrain sample': {
            target: 'Retrain ready',
            internal: true,
            actions: 'addRetrainSample',
          },

          'Set retrain active class': {
            target: 'Retrain ready',
            internal: true,
            actions: 'updateRetrainMapMode',
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
          'Requested AOI share URL': 'Creating AOI share URL',
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
            actions: [
              'hideGlobalLoading',
              'clearRetrainSamples',
              'setCurrentTimeframeTilejson',
            ],
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
              'setCurrentCheckpoint',
              'setCurrentTimeframe',
            ],
          },
          'Instance activation has failed': {
            target: 'Redirect to project profile page',
            actions: 'displayInstanceActivationError',
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

      'Loading mosaic': {
        invoke: {
          src: 'fetchLatestMosaicTimeframe',
          onDone: {
            target: 'Prediction ready',
            actions: ['setCurrentTimeframe', 'setCurrentShare'],
          },
        },
      },

      'Applying timeframe': {
        entry: 'enterApplyTimeframe',

        on: {
          'Timeframe was applied': {
            target: 'Prediction ready',
            actions: 'hideGlobalLoading',
          },
        },

        invoke: {
          src: 'applyTimeframe',
        },
      },

      'Deleting timeframe': {
        invoke: {
          src: 'deleteCurrentTimeframe',

          onDone: [
            {
              target: 'Applying timeframe',
              cond: 'hasTimeframe',
            },
            'Configuring new AOI',
          ],
        },

        exit: ['setCurrentTimeframe', 'setTimeframesList'],
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
