import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJTY1DaJDELAAggB5ACSAgYVVgioQCwECoCQnYdu+34sAARnIeAaDOTRJgSC4EPYwy+HQwxDP86TLAMDKrLuWH2FyJ5Zv8GZerWApXnQt73rQj7Pq+n4-n+cCAfKyBiOgNSQV+MFwQhepIXOKagM8UQjDEVJeF8fjZgM6QMlCFIxPYrgUekjj2JujjUfyyJ+iKFxqMGnAkMgAgALJWZGOBmZAiF3MmjySdYdjaM4WZRB4DikQWDIfGCYxumk1oTHC57jsZQoAOokG0FkyugyogcwLBpSwKjUDgYBiLZ9lcOGEDoO2Wiia5KEed0J7uK4LgJH8BbyQ6viEeMmE+NajjxIpAxOIZSK+glSXmdKqXpaB0rZbl+WFRxAGQDlJB5QVAnAaBnawXg8GVYm4nuZY1gun4JYeNSenxHpHXhIgZLEu8fzpPM3x0p4Z47DRcXHNe22tmxMFhFtzBQFKRXIJwPCKlwUguXihoSSddXps45LpF4J6ggMSwqfdCCkc6Lh9f81LOoEGTDZeJn-WBgNQdBIMZVA4PBpD0PhtwyAI8h861WhNokkEmMrK4e4bHdMxsvJLjZr4eZzCsVbfUZo1-QDFlA0zoOsxDS1cfNG1AxlO3CQds5I8dzwOvYCzzGSeNLGyUsPQ4mHjFpCTi94ni+NTtEmQAYjQ7DkMBd6h1rjM8NQECwAIZXHDQEjoOK9AXoHQoh0+sDhxAkdPtHgnQbH8cICn6Bau0DS80dxoEMSIIxL4djoSCeHJKpPjOBuTfcnpWkGTFP3q-QQcjhQzFqC+wGqCQicaPQlfp3Qme-ePk-h6HM+vhA88V9QqfVyJuh11bDe9PYdDWq9oIbAMFMMnmfRboM7Kkd88xfTWav1pveAp470oLPfeeAF5KgwKgNeYhVBTSIGvWKY86AT0AdvJ8u857gMPsfVQNc9Dnzcg3XCdAXReyhKsZqUwCaTBJMSPSsQxaxECAHDejAqgQGUA8So1QsR-koP2ISe0NBjk4s5KqiMiELgpIkd4NhiSwntJpaE9hVJcj6F4PCTgARMipKw5BHFOH4HaDwy4wgwAAEduBwFHCbAqI5pwSL5sjLonwsKbj8FmDw647QpDBIMSYuZYSJH0f-dhkAuEmMxHUA2K0ILa3NoQmqKNVguhiGyF0n9NLmlUg4BYfgAQ2jLOMaEoS6JNn4MqNAETjEiNQLwXUh0L4LhtAsL40ItzUl3Akah0sMz+PmOLfwpE77uDKSZCpEZqlGO4fU6g9QbiWykbVVpLgH6dOGHEfq3cEjvDZN4Ck6EfA2HGUKSZVSOGRLqQ0zQOIlnJK6Ks9pOkbBdK2b0h6GwzTeD6iuMmEwxkjz-nRYUZkGY-iTsvI+acM5ILCaC6oE0BI4Krng0+ST+YoyiBscEKx+ryXTM6buGRSRUiiP4e0cQvCnOOCIKxNjWw0FgOA9ai9k7QtXuvZBdLrHMsZdQZla18oopPgdDFLjED0LBAw14WNJhhVUQTTYmFMmBButCV4Q0gUjTCTyhlFkmUsvygISBaUYFwLSggrlurLG8qRYaoVYARVorFU4+u0iHDSoVrKh0vxsyKulk4a+fsvHfDZCrX+Oq6JCF4EXaU0yrnzK4AXQqgq8AKh4flSgUgIDiutpK5YdB5JvwVv8DcQQdmNSCGSLMeEszeRpfQGN1A42iJme0cxWac05TFOKFoNA8B5uNNCGSXJq0OGzLEVw3cVgxGpN47ysRlKNroM21tCbanzJEF2laah+wylAv2Id0jyQkhtMkWErwGoZADZKvMzhSYgnQm6PwVFtU0yFGu1sG6HidrANmlaP6TF5CgP+WAx7ao3XTEW9MAxvbOnGKpVuZ6bQQgvS6QYK6v0WSAxoAQb5S6oFHHMiDKNoQNVJBkkEbdiTi1UiuR0KwdJKNtv7d9WdaWxu-Zczdv4eOzN4CwdsJBVSEe1KRroLsq1kkXcSWhbJVIfEwq3akQt5IjFeFhrjOH+MdsMYmyognhMcBwOgIgPEHG5rdc0yDG5pMwj6oMeSCmCboVIoseSzoPB4SCIC1WUaTIIrwTpmibKoWp05XCkFYKQv8mdQ8Wu1nllYu8gsTwdhXqUpkfSJVfVlOeCOfIvcUQV0ABk+JAVgfwZlAlGn3MxZJ2IJJXkUOSP8DIHzZjsj6AMHw7Jv72jsCugAai+SgYDpCm2oLViT1h0JRCwoMP4rx8LbiVdmEkYUsaDD0s+n+1q6KjbEON1Qk3trTbYgsppyWbYYUWzhFbXwCK5e+E1Vr2TJYrvOSwCJtioLJoHG+CAQFSBQzAFIPgLByBrQgGIJU4GksPNOnbZwWMqV4QpEo1S9UsKky3BmIYUIV3XnYDxEgINzIgyBsJ1Arbk0vgEAAaTAGAMHnCkW7X2qI5aVnrtI+6CO5Tfd+p2F0mSVS9pMKgnkdegEmOvvs-BfhqCpnacRmM7rGAvP6sSrqitrCFMAjiwhI4buvxSG-A3PIukrS-ORo-Y2RXxdleCXys2ZUFQWZa9m3r4sAUnB7jUu6U3Sq6RVt3KuQIYxYgRoOxMp30pLuxKAkDI2r5Oenx1-muq7g7bvCxkpJSLtFMAlkjmE8To7Z27j2chPtXk+bVM9Qe8qAiBCP2j7tCuf7YF6duSDc9HYgW6WLudM5GTnsbYST2AZOwitm5rxfiQN6eFQAKo8QqytCQY2U9QXvHDzvgvFjC-U2L-GfTVjgjpFCXPNpY9RZMiIA9cBw5A1K+wPAdWxI2ZRgQVujoogAgCsO5b0EAO43hXpEgCUVgKYsM7x-xX8oJ39mUrss8G5W5nAaQGoBhiRNE9xCItJGMFZXo0dMYswvsLBkppQqh8A1ooA4dNpTZoYC4v9qoGtTpcZj9utT9Vhz9JVAgpcMZ5gMsswboV1hQNB7woBuBUBWx4lvxbIjAkocBIxFQ4d8BxE+d2CBdfgwRdINw74h4KQQgCYQRZZqQ8dTwZZxDJDKBpDZCLJ5CfwvxSAYBUAQZYAeBUB8pVD7ENDtdv8btTow9SFpdkh50Y9CI8x-F2kxhyQ6Rxhh5-MHd-RbD7C5CwBOxLsbJ0AU1fD1DxNEdtDG4A9SETxxh5EMJvg+DCZoiXB2kb0tJcCbDm87CZCMisiFC9VmUVogZYB2wTAKBD9c9Qp0INgbotJ5JvI7QRgfJ5FCD5EOkthJ9kEJDWj0jHDMjatui-tBIU0HFD9+o+h2R0xSIAQnMaiYRjinAoRo9fhPBqUVj4U0j2jNjOj2JZDBEM9ptqkedDibpSFdJoQ3RQQEMZi-cZYNhc95g2QV03xkAeI58LIwBKC+VndIU6AV5YVR4wl4TETWwUSP9wV4t8Ez4ijdc0I3hfg1J-h3Qo8Ng7R-VSQ+pNJ8wTwEhid7EkVCS0TE8FCMSsTEEcS6Jbw4duTUSkU2IST0VyTs9bAxhGp6osY7YiYiY7QoQPZEg-guQfMWEnjo1bUbFeioJ9j+BWDJF+dbBkhmtBpKZyivgTCZgO5MxNENgAlaS-A4D6Uejd89iuSBwEw0DUIohzoCUfM8JxYHAQ8nSoQfItwGFTiMsV19NN1TEsQdjjTBJ+jBjyAfdVg+oyjYg2Q-glhozEBBtmQeoGoLCNNshqxqBci4B9QH8SggyBZNJdl3Rw1L04gUcGQ0Jr49wlNlJ5FFikj7cONShThIwSpmwIA2zf87B5FSQQQazhh1xHTEBc8NIlgMh70FFMN9STI0RIxokFypIdt3hxYyF2RXodw-hr4rcPBH1TxHjkjJyRRe1GUwxFQPdVRowNRlBTt5zAjLTRcz1oR5IXkNs1sZg1hKN7RnReDaR79hSJl3cOixwaJex+xzzPIKIi0lsGjMYSKdwhhr5qRyNtF9lkg4DOEaDRx4IoczNpBkBTg8Luh-A+g9IghfhvBW4CUixr4AgKQNh5h4zq8Wy-pC4zgMEQFWJvwOKehL9dI4M4M8ZNzZgUhmROQIzsxb4J93y2EgskVQclKvIwQyClEp1uscsZhXSi0hgup-AcYfAV1EoqCWAppdYsplQ08lLDlnBXg5MP4lg-BCJEhMJb97QEjvJNJidNY+SS5mYZo2YoAlK7Y-hSRNE9ImNORdJCICLTiOl1gRlULgVg5Q484I5GJwUYIy54BQLiim40sPgJjDc9wajjD0YogXQNTNJyQV1UEgE5LQF55zKoysIPg7YPgYReqGQopSEJ1RcNkBhkzdM6leEZg2DdcAhr46R3RADhhNEdIZjvB3hvBvFcwPhJK0Kzl3c20DM5kOK7Z8kK8HAvh5gBDFNAhFgAQ6RVgKZ4hxCYskqOKPrGoX1bpBgz9XYEB+piYX1Ahro1V0wvS7V+VBV1pwbTiXAyRNFXl+s4aoCwRiykKw93QtMW1uMalklnFs8bpYRSFc8iI9wik4axiwRCCUgsxWQ2oQbEVuMaIOKghMIYT-A8l-g-BQCZE3gkhvAzC7Z+8ysKsWAqsbEBIAq7A9kPh+KhgPAoKyL5gYhmN2RnRYQghgajyhQjsTt+BQYKpNamqKTSJR0ggrQhg5I7L+DjbjrXlNkHRl1rbGwHrftNoActbMYb42rsluy8IJdty8xW5cCKR5F9spKbxSdYEKcaAqcoIac6dciXwArdIgrT1rQbowribEKi0woupxgGo+oFdPK2IMqSEGp24w0y146lUbqTbyR3QfASLics7yd58N8l9-si6xAS6vhSQVw4qyIUgyz4bvBhK5dW5NI8xrQ4Dn9qq38P8lLCV+gwqDbYQMs7RvhmQ+pJcRgdIfUKDPKGK6CGCTZtpmCwAS6Tx+g8xFIzjkhEMlUwqb4dI8xB4gSStg7Uj1jXjpQnCArPBmQzCilMsDCV7lFmQjlJhAooQ7A3yJy2E8SxAkTpQeTJTFLna5T1EdKNhbZNJ8bNLELr4dTPBNlEgHROSxSCSJTwVzL+oubvg77RLB7vawCMN+hEgYboi-h0ajTfSI4xTP7KHzB4JkByzvJjiR1vBQQtxPBQg4cZQ8BTpo9ccHiYDxZAlQhS5hEiByzKjFgtHdDdGQ9ZCoByAjGTQEhMCMxtGHQLH0xQgBiIB5AiRtBQgFA7D3HyzqFngXQdJTHfHG7LHTCNGHGBhtHvIYa6zMggA */
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
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isAoiNew: ({ currentAoi }) => !currentAoi || !currentAoi.id,
      isAuthenticated: (c) => c.isAuthenticated,
      isAoiTooTiny: (c) => c.currentAoi.area < config.minimumAoiArea,
      hasAois: (c) => c.aoisList?.length > 0,
    },
    actions: { ...actions },
    services: { ...services },
  }
);
