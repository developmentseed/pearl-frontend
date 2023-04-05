import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEguti+CMMRUl4Xx+NmAzpAyUIUjE9iuFmXjpI49ibo4Xq1gKV50Le960I+lDPm+X4-n+AEsBAqAkJ2T4vuBX7QbB8F6ohc4pqAzz2MMvh0MMQz-OkywDAyqy7kp9hcieZGuBmtH8sifoihcajBpwJDIAIACyNmRjgFmQAhdzJo8snWHY2jOFmUQeA4ukFgyHxgmMbppNaExwue46mUKADqJBtFZMroMqfHMCwGUsCo1A4GAYj2Y5XDhhA6DtloknuchXndCe7iuC4CR-AWWEOr4mnjIpPjWo48Q4QMTjGUivpJSllnSulmX8dKuX5YVxW-nAPGLUVImQVlnYwXgcHVYm0meZY1gun4JYeNSVHxFRXXhIgZLEu8fzpPM3x0p4Z47HRCXHMlqXTblWXzcq63LdxkB5SQBUbRBvH8Tt4laDcs6GjJJ3dDdJExIZ7KvThfgEYEzL44R7hUeTo2XmZ14I62cNQWE8PMFAUolcgnA8IqXBSG5eJo8dcnps45LpF4J6ggMSz4fdCC6c6LgDf81LOsTX01iZ43HLTAn06JjPM1ArPBuznPhtwyB80h871QQnzNaCUSDTYCQdfYRO-DEfgUmpQxjPEVP0TTdNWQzTPA8bUBcatkNg5tzOI3tEmHQLxp2+TCzzGS0tLGyd0zCeVEsqRCSGd4ni+IHv30AAYjQ7DkLxd716H+s8NQECwAIFXHDQEjoOK9AXkHQp19QDdN8xeuQVB7edwgffoFq7QNFbR1p8SIIxGhDjrGpyQET4zgbpv3JUaRNFxT9Wu1yOFBsOPagkGIvGqCQ3caPQi+D3Qw-V3QNc76N3rk-F+EA34L2oP3Zeyc16pxQr0ewdBrSvVBBsAYqsGR5j6FuQY7JdLfHmOrP+N8AFAIfm0Z+r88DvyVBgVAv8xCqBmkQX+8VSGALwPfEBlAqHgJoZA6BqgV56DgR5NOqk6AuhLlCVYrUpiy0mCSYkVFYgrDLoEKupCVoQGUA8So1QsS-koP2MSSdqBjhjhAMRdUMYUkSO8GwxJYT2hItCd2ssoQK3IvaOIrx3RUi0fWUoVRdH4HaAYy4wgwAAEduBwA4ltIqI5pw1X5uIhcnwlKbj8FmDw647QpDBIMSYuZYSJCCQxHReiImYjqCtf8kMOzx12vtGxNsMarBdDENkLoCEkXNARBwCw-AAhtGWcY0JKlmWqeEjQkSsQiDiQkyGcNYDthMBQdp6MuirAGlIpwA03Q4UcEWQYdA+pNWpFuf40yhSzP0XU6JyyXyrNErAcgJAqgsAAKpCAADLbMFogEEyR+jO0Mp4MZFI7S7mahuakWZvAfE0VfTWwS6BNn4MqNAkAanzNQLwXUKcMn1RtAsL40ItyIriINAiGZinzFxl01B7g7mNmbDi0J+KLGEuoPUFGUl4FksmC4dB1Lhi0oUTMQaCR3hsm8BSeSPgbDsvoFiiMuKwmPKJZoHEqNSUY3JWKqlLtJWu00hsM03gBormVhMNlaKxoYuFBZaeH9e5QIHkPdhLq3Wt0-IIpewjYFpOtjsyIbo+ioN0iq9MzpD4ZFJFSKI-hfHzDVXQJZ8SXythoC+aGhUPVfy9T-EhGLs0JLzdQAtMMg0wIOkC40KiwSqNeOLSYEUPEyrGVIlYgQbrQleCNJ11MhSVtzVZfNNCYYCDoRlRhzCMqsPLQxCdU0H61sKvWkNjaw3rwXC20kvg4hiwdL8bM3bEA3Uosg2EeTvhsirN9dFa7eDjyslqnlAguAQCKgIAteAFQGMKpQKQ1j93CrscsC5u5VzIo3EEQ+AILnkzwmpLMvlM1CHfa2L9cz+UiFA+BvKYpxQtBoHgJth6BgLC5EEQu2ZYiuEPisHGVI-axD3FmbDuHP3coI9E4jkM1D9hlPxfs1H6rQiejaZIsJXhNQyFehAFJfI9PIisS0fgjKjpHscHD1AP3Snww8ITYAwOQ1MxEvIUBuJSbsfYdMFz0wDFLs6cYRM7CLBtBCeTLpBi8aM3hgTZnXyz1QKOPlDmujQiaqSXpII7C6RdqczxK5HQrAoq4h0VEgvGcsdq9o0cisEt4CwdsJBVQRe1DF69CKLlkl8gNQYWE2QERRYsM1NoRh2FUvlkLeLBMPNqeVyrHAcDoCIMBFJEGSW2Niw18WMIWtKPa7LeSulFhYWdB4NSQRHUvudQxV11QN3D2LXQb+Prr5+rOyFuiO6Hir0g4aroXxvB3rsK9Xx9j6SeKOYsTwyqnHccrnp-+-zQKASYfwYSEFiUGoW9e2IJIXayOSP8DI0rI1Qn6CMb2RD7R2EzQANWfpQfh0htoWIR3VhqYs6P-EdhuX2MsZVQgWLa90FEcwXrJxTqnCdaecQTEjjpckXYkhaysc+4sATs+vdCN43xKI+TdMTgXYhKeqGpwjEX349XzYl6dE9JJ5hsmtKsE83sCKli9lmP2RCHCZo1cqPFiTOZ-oEK+CAgFSAczAFIPgLBPkdzEEqWA9O7avDeCpNxLpMLbk8T95ByQnEkTWFES+R2x3a3YMBEgTNLJMzhpV1ABXf3PwEAAaTAGAQPuiN2tPmbixpc3xcRu6AMIiDH5Klyc+RHcR8fPy6WAM74z6NbHbMg2Jv7q4aTYrxGcbhsYAd6FW96wJE1JKVVgEQyEI0syp8GCQa3w0KDUt0EV38+A0+9EoVTlkYI6uVe8jhqHxMzW9iOSKE7pj9r06RmosJcFEMxhYgp9V1Z879pQEcGkeJF9C0NoW8DpO9gUGoM53hlsc5yQNwOsUM8wcwTwnQnNDtp8891VYDNpo52945JtqAnwiAzE2l38TdMCnNsDs5948D85r1PBnBBolhdx0w4tVUIdSFrwC8mEwhWwLYQIwI4Yq9ioflgJodIYJBBd457wI9o9oQogfN2RnZdxVhFdVNKIkFSYvEKYoDfU107w-xG44Z-l2A8BEdN8P8CA0JHQogAhgcQR7Q7Qxg3hXpEgsJfhSxwdc99N6ARBxM4AnDRIXCXwBVjcu8vDtIaQmoe8RhstNJSJMsT18YnAxYeMJCMUGwLAAYQMZ0oAI945tovcBw9CpZDDOc7ALCzC2Rzp-Z8ZvsswbpM1hQNB7woBuBUBWxmkEc7IjAUocBIxFQI98A380iMCCBz8wRKJWdqQL4KQQhZYQQsJnolYtxc5UVoj-5hjGDKAxiJirIpjOJPxSAYBUAmZYAeBUBCoFjklliN9ap2D1jgC+0FIAQqRIDNI8xilKVgir9xgc8KCYiRQRibjxjJiwBOxpj0A-0X4KhFiCgVj0CN5DkDlHcnEFJvgzCnBQQXBKVlNSJiQvAhjkTbi0SMTOJ103lIJ1lNlyA9DyZwp5INgbpSIsJfJYVnNegCinEqUthyiTtmTUT7j0SaD10Gjkl+A9Cr9FhBpKJNhWszCYQ+h-ABoXQKJfhPBGS5SzIrjRjFTpQHjvxjFTFUDLF29NSbopFdTsw0EPNYViwnFAgNhyYLcoiET-5XxkBgJZCrIwAqjJ04DOIe4S1+4y07CzIIyozWxYzXDp4nsRFdBo8yQLkhTZV3RAyNg7RL1SQBoSJ8wTwEhM1bwI8N1sz4yaCkyrtS0btX0aZ1Ssy4yN0II8zQ1Vi04vhXpSRWtVhxY9IuQ7QoRFJyRaQuR9tziwzSEOTAI4ZsSUl3D-j0iAo0dhpiYTxlh9iZgAjMxNNiQJhmc-BsNYkc1tQ1TmzmjBV9y1iohzpwj9s1JDIHBACEA-8-ItxVF0x9JiE0yhQpDYBC8mYmFUBWBF9kTUBSB9FlDa969G9qiXS28AJo9aNmQO1AgPBRgqIdwFN+g8x0xgCHQxhyDoDoLpCi8WAEKkLH8UK0KIkMLfwl569AJoYwhKsmZcKIY-j0lPCJY+hM8T1-BMcKK5U1MqJfJVwR0LjSFTthEA0WAPkvlpA-l-lLtrs2FbsTt-UEyuTPlvkDLhy91RyFx7QNxk1hCMgBoqRKT-FFYKIiEmpfJILTLrTzL45dLrKAU51UB6FF08AWETKeyhRNLBz3krL9KAVbKXt7L6p01HFiQAC0Jpyixb1SLRZRD0FshqxqAsS4B9QoLaBCSUI8DmQsYbRswvhXgWNZY7YkE9whDrRTTyYbRM00RIwypmwIA6rbY7AnFSQQRrkjx1xzzEByZiIlhXLfJnFAsrT7lThIw6lxqMYeglqAQ3KUgh0dw-gkENwXZPBBopYxYhiyM80wxFRlQKg1QYxNRdcxqPCASOiSQ8YsIKIswd5NJ5IEt7RnRTDaRbCAqhQ3dWSxw6Jex+w9rnhvsRlBhhggyxZsadwhgkFqQ4snAEhZLZT1KK08Uqh8AWA4JQ8ptpBkBTgUbrB-BpLiZfhvA0JwiiwkEAg1MwjQKGKaqbxm4WIhJEkmbFxVhiI3M3NpYFrZgUhmROQ-zswUFxCyazL7srIA8JaehqTSjXFmMjD-sZhNNUN6KNxBTGdM1-oN0ZpDYcpQZkCxBdalVnBXgbz8ElhCYNtEhFJ+r7Q6QYQSJGyQ4LLoJw45pI5danM-hSRyJlKyRORKJNIyILkvS8wQRdJ7RM0x4J4-0p5tLZ5eBO5Xa06mpdIBkn09wuiMwRYnYhT-APbc7yEeE+E35dbktnAqRpyPgYQnYGQYopEHABhdwJUBhBrQtalDEZgPzjQAgkE6R3RfDhgfFAKBhPtDIsdfJD8HRXdn9rMytjpw0MDB9GsogHBWq-Afae1AhFgAQ6RVhVYA5NrjgErp4JbL74VzrLrgds5E0jS-hAhroB10wHyXkN1p1kDP7wKXAyRyIXZ2QUgOtPY2R3QbpgD3QBt+MhtbET7m0AgpFyYtI9xxk+C5Y0FHEmo0Jxg6QOohigrh4JaghFIQzC4fB5h-B6VoR3h+pNNxZyI2RM0ocwJYcElNoy7zdEgnA-AhhSKsxcb5gYhst2RnRYQggX6NazJydtchcacJHvr0iqTW1B1vhegUF5bCJFzfMT0Eg9wVx97sUWAPd45f0wBdbyRtImqMg0J3L2qZULR46-8fInFnRBaYb89YKZDqaaBS9RJy9K8sTn4Y7eqDxz1XhqUMhLGtMSwhS+7nREhwm4rGxqCIIY7JEK71h2R-hpYOtiwa6XRJhyJyJGzmLozpR5DodXGkmXbDG1iKQvhSQVxfJ5YSIT16VxZSQAQ2Q5g8xrQHz4iPl45ki8Bdb41+hvbSL70FGDjvhmQBpHLcjT1xZXcqiN1Kbaj6jtyEYmjXa1cqKgH7Q-bFMiYxZkEKI8xz5dSogmTriWSlS2TPxXbPASYgGPNXhWdAK3FmRlVJhgooQ+tM0MyxB2nnGByP6+mN4wnnobpiG+6kMDjcsiG4TJVpGimZ9oK+yYz0WA1O7z9npObyRITWR5zhhwUCi1FQRLStHx1HyVktzRIdz+A9q4JkAQU1rtSN7fgVLPBQgI8ZRVnMYIClI66IimoMx0xQhZ4k4iAQUyTJWRDQQtxZWQAJioByBFWXgiJfILSVh1XSlQgNkIB5AiRtBQgFAbiLWQUFFnhTTu7VW7XIVNXdn9k8ZDWZX4TGLIm4LWKvl2LIIGCmDd0vdknMWUJs6iKtM+pPgrqCJZcpFiZpmNG4hQyo3-Qgq1lkrfkAUJb7R9xAhkgqRmryKDioglaEHSI4UPhZTsggA */
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
            actions: ['clearCurrentAoi', 'refreshPredictionTab'],
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
