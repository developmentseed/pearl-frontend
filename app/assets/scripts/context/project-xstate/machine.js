import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJTY1DaJDELAAggB5ACSAgYVVgioQCwECoCQnYdu+34sAARnIeAaDOTRJgSC4EPYwy+HQwxDP86TLAMDKrLuWH2FyJ5Zv8GZerWApXnQt73rQj7Pq+n4-n+cCAfKyBiOgNSQV+MFwQhepIXOKagM8UQjDEVJeF8fjZgM6QMlCFIxPYrgUekjj2JujjUfyyJ+iKFxqMGnAkMgAgALJWZGOBmZAiF3MmjySdYdjaM4WZRB4DikQWDIfGCYxumk1oTHC57jsZQoAOokG0FkyugyogcwLBpSwKjUDgYBiLZ9lcOGEDoO2Wiia5KEed0iTeFh3mDIMe5LH4qlBJhu7uCe6bxP8NhbDFNFxcc16ge2rZsTBYTAaBUBQFKRXIJwPCKlwUguXihoSZY1j2L8fQUjY0LrrCYWEWMzjyd5B27gpOmGUivpCuNYFTVB0GzRlC1LXZK0lYq3DIFtyHzrVaE9Qs8xkksSlsr4qm+HuGm7qsfixF8VY7CNL1jRNH2CV9c3MItwa-v+XG5flrFQRlnawXg8GVYm4nuXt3QOgd7xeLDeFLAjhEOJh4xaQkrixEEsJPZeJkAGI0Ow5DAXeisWdN0E8NQECwAIZXHDQEjoOK9AXrR8uK7AysQKrT7q59Ws6wghvoFq7QNKDbPGgQxIgjEvh2OhIL864HXpos7JZtyelaQZw1GXj9ByyOFDMWoL7AaoJB6xo9AuybdBm6NScp8rivp6+EBZ871BG27Im6J7O3s1JJ32HQ1rpNSoLQoMbIMnmfRboM7Kkd88xnjjCf1iXeCp+XlAZ1XeDZ0qGCoIXYiqKlqBEIXsWJ3Qydz2XT4V5nK813Xqju3oTdud7uF0C6YtQqsCR-AykwksSemxCsEtYReBlubIUHEIDKAeJUaoWI-yUH7EJJmGgxycWclVbaD8FwUkSO8E6u4ljv2hPYVSXI+heDwk4AETIqQgOLowKoED8DtGgZcYQYAACO3A4CjmmjbMQI5pzoLBrtLonwsKbj8FmDw647QpDBIMSYuZYSJFoYfcBkDmGYjqBxACkA2xgE7BrYSLNZzN2NKsF0MQ2QujHppc0qkHALD8ACG0ZZxjQlUTPOgTZ+DKjQJADRyDUC8F1KzMxC4bQLC+NCLc1JdwJCmOERAFIhguHmBLfwpEu7uk8XRHxEZ-GMKgcE6g9QbimMwbVSJLgNg6UGsMOI-UOoJHeGybwFJ0I+BsLkky+S-EMMCdQSoITNA4gqTVDm1Tol1LiY0xJMx0KWM8H1Fc-wPATB6UKYUZlCY5wNrXY2psD5eO2dUcy0o2JX1djfBu98JldCiBscEKx+ryXTM6DqGRSRUiiP4e0cRgHx2el4kQnDuGthoLAFeeUBz6zzgcguRdD6gq4VCiF1AoUkBhVc+uLM7ngw5r-MEf9Xi80mGFYhSSECbEwjYwI8QsmvCcJs44KLwUWUhdC-KAg15pU3tvNKe8kUgo4ai85j5MXYpdrij2QivZYIcMS5GpKHS-GzJSmYDLdId1hFI74bJsY1mnnRIQvA7bSkKYMgQXA+ECExXgBU0D8qUCkBAfFIjknLDoPJYeyN-gbiCM01w3qerKTwlmbyLL6CmuoOalBRT2hsOda6nKYpxQtBoHgd1LdPUyS5EEE8sNYihypf1FYMRqTSO8rEZSUa6AxrjZaphGgk1gBdXotQ-YZSgX7Nm400JiSLGtBk147gPD2lUnmZwjh+ognQm6DG7g60NtbE2h4rb21ATXcwvIUBKZ9qwQda66YBji2dOMJGdgI5joOskGd2Fl1mtXQM5tpS3ya1QKOEpB7arQjHaSaxIJA7EglqpFcjoVg6XtKsHqvhH2xufQE19FMkPFN4CwdsJBVQfu1D+wlG5g28xhDOwY8l+6lo+JhAO1IbQjDsLheDjaX3rvUa+4ZQzMMcBwOgIgPEBFurleE39BHvVkmrcSb+5GFkvMWPJZ0470hBCXUC2WWydkWTNns+FRtEXHLoqcm+Gnxw4puXiwTlSOZfAap4OwXd-nYPpKWmdVHPCdJOnuKIdaAAyfEgJb34FCgSoTxkEq6BSLcaS37JH+BkeZkR2R9AGD4dkE97R2DrQANRfJQZe0h6ZDLYsFsSQmOZoQwlhQYfxXj4W3KW7MJIwq80GHpedk8jXArollsQOXVB5YmgV78ZSwkWeeOhKIFWcLVa+ARJz3xIsMv8NItkda+ksACTwqCNqBxvggEBUgK0wBSD4CwcgWKID8NQLAPDzwGXh15gCvCFJoOqRPMyby-UtwZiGFCOt152A8RILNcys1pqYdQHGm1L4BAAGkwBgAOxA8VjNmYoN0QJ4b9zrC9yoxuKE8k0ZklUvaTCoITpjrHQkPcK3Ee7Omtx8HEZOMkwWmgjHoX9qHVJFEXSzoRhEMRhR1YIbdU93vQ6anyULmDbpxqCMFQfowHRyFj1nM4jt00nuPcrwuRfAF5qnw6vXjfAyFyDYDKJfisKzoridOsU00Qcza7+0oY8z5vDDcqkATBrzDmE8ToDrKanh13pNP7bsUpnounGh7y7wdw3ZXObOYu5hkpd3evkmeGcP1JYu4+rjG6Sp0BY1-tbzCK2YGvF+LTUh4VAAqjxXzeiJDZaAtNe8-Cnd1QGDjhL+PdKE6c0LrudIoSwZ6suu8-5lbTS8+wPARXqrs+6AHR0UQAiueDhqxAwc3hd0SG8lYzo4OF7oSIbtcBp9QVn1CobCfvYB2cDSMdAxiTkL3IRLSEHkbD6cIprMK2LBJcnVoUoB+EBISZOwtsF8MFMcu9xsNxe87B+8VJS1AgSdyRh9bMsxzcT9D5hRo9KAoBuBUBWwIJCsbIjAkocBIxFR+F8BWc79UIy0wRdINxslY4Uk7Q-gSRqQZ10xTw2RAUg9VNjh8DqB7wiCSCLIyDBsvxSAYBUBZpYAeBUB8oaCCoCgGDisRssc6Rg0XQMIAQqRYgt8EAnBQQXBokxhyQ6Rxg45hCi9-QCDJDSCDEgsKC+F1C6DcNzNYCfYnAs8Tx88XRHklhCI8x5FokMhNI8EhD2sRCnDxDCDiDXDDFBs2UoVI8oJYBJoT5O8fYepQp0IzcYibpHA7QRgfITpP8ToYkhoHC6ExCJCUjpC3DCsMiNtBI+EBF8i8c+h2R0xSIARSMUCZgYR+inAoQrpfhlk603xkAeIy8LIwBAC0Uw8tM6B84jlcYvF5jFjWwVi59CYTMHhZU2cVd241IbQlgV9QRPgiw4hn550hjyxxhfsNDxVDi1ipcfw4VNiEVtjjUTJbx+FPjVjLdvwTjb5G5fCl9bAxhg1XteYDpSIeouQ7QoQRZEg-guQ8I-A4jhUTVRVuEsiuiPiBx8i-ISRfI9IC1fJ3QuD9wRgQQJNJhaRj8GjkViTMjW86ZyTb9tC-Cog-BvVmTFM8IJYHByiqVyR1J7o-5BjbNshqxqB0AbZ4AkI9M-RGCIYA9MIDpidINORdIGQ0J249xANuCxgyQC9OSvE0RIwSpmwIAdTSs7ATpSQQReCjx1wQgqUeoNIlgMgp1iQtxA94jHCThygMQYEZhF8VcegAyAR70UhoQS0ZgFJ24NxBpPBZ1TwCStStk00IUwxFRlQKg1QYxNResXTBS4SkCSR2Q-86l6tasFl0IAN7RnRVhsleYVtmwpDpQIIzZex+xXTW5FNRShgojxTyEdwhh25qQ-1KE2lkgJ8IEqh8AWB4ITseNpBkBThxzrB-A+haTyVvAA43kix1dlFB55gtxxdcCvEGIHwF4M42IjzFwhddJT1T04Y-SMyUhmROQJTsxO5bSIzGj1NpR9tPyegLDmzVhi0EtHMZhyEwQggxhrR-BQRFMCydi6JEogCd5mcsplRqYCo4KOlnBtcR4FtFN08zDEhMJYN7RbDbp6jILD43pJow8ZpmcyYoA4KDo-hSRyE9IjSoQTSqUginFdIYl1gslDVCSLYnwrYVZGJCYYJHYNT4zE8fYKIO4PgGUPADU9xRjkkMxnBu8XRMTNJyQ61j554z5F5K4s44LA5H8PgDoPgYQohULEAopn4HABhdxYkxgIKVKwFmNNFYzPyAh246R3Q19hhyEdIKiGoJYYtvIJYPhwyorGwBz41Bl2N4qfBRNpITw5I0DPdAhFgAQ6QYNrE60DMISvxPyHBBpFg-g9IV9kDGL+pnRur8S9JBCPsJ8wVviJUuUwAOrBiXAyRyFBoUsBr5gwQ2R3RbtsT8rCzWUn0jNUMCVhFE8tVaUeoiJWoj9LoLDP8Ugo46R5JlLdr-RoKxwaJPzOoeYDVHF-g-BTDsE3gkhvAQReZyFlsny6IfN+J-NuEBIqKr1xYnA-AhgPB5ILLZgx0FhNdsxSEgFnRMsW9esICBt2q6yEzSI81MKlMaQ6QkZ5gKt5JZkHRa0Ibekir1twCtt4bJyb0TKj9f90blzZIA5X9joPFWbXoS9AdtyaAQcoIwcIc1SXwqLdIaLyQ6K9IGKidiw1Ugygyx0Z0LdCZhKMwyEbM7o99UhPd-gAMlwcaIQdqCLgSpaljpQK9fNOalaxAVavhSQVxboyIUhpTNVvBDcEgA4Nd3QOSuKRVz91KZ8584L3l+g2pUbdUswuCbQrFidmS4hFMnqnahQGxADxVNyQCwDeEJpVobYVaTx+g8xFIXjR0kYeadI8wY55LPMJbRDnCWihy2jvwqLPBmQQbXE7M2Dg7EBNIuRvkgheYHN6M5iFixBXa1twTjayb9LSFgKNguZNJFqALt8uZn4MhPAGlEhHy7S6IQSRwDj16w8PKy13hvhmSKRQRWQMThh+hEgWoIi-gJqxVSSVZQTZrN7zB4JkBt93tFhe5vBQQwzpT+EZQ8AscrosIrLfgHQJZFFQhNYkEiBt8TowQmzc94GWpQgSCoByAUGTRKd0HllD9sH0xQhJoIB5AiRtBQgFBCDqHt9Ekbs0HvIGGsGMxmGZToGSG4GmpPBlTMggA */
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
      isAoiNew: (c) => !c.currentAoi.id,
      isAuthenticated: (c) => c.isAuthenticated,
      isAoiTooTiny: (c) => c.currentAoi.area < config.minimumAoiArea,
      hasAois: (c) => c.aoisList.length > 0,
    },
    actions: { ...actions },
    services: { ...services },
  }
);
