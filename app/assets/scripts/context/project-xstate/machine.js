import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJTY1DaJDELAAggB5ACSAgYVVgioQCwECoCQnYdu+34sAARnIeAaDOTRJgSC4EPYwy+HQwxDP86TLAMDKrLuWH2FyJ5Zv8GZerWApXnQt73rQj7Pq+n4-n+cCAfKyBiOgNSQV+MFwQhepIXOKagM8UQjDEVJeF8fjZgM6QMlCFIxPYrgUekjj2JujjUfyyJ+iKFxqMGnAkMgAgALJWZGOBmZAiF3MmjySdYdjaM4WZRB4DikQWDIfGCYxumk1oTHC57jsZQoAOokG0FkyugyogcwLBpSwKjUDgYBiLZ9lcOGEDoO2Wiia5KEed0iTeFh3mDIMe5LH4qlBJhu7uCe6bxP8NhbDFNFxcc16ge2rZsTBYTAaBUBQFKRXIJwPCKlwUguXihoSZY1j2L8fQUjY0LrrCYWEWMzjyd5B27gpOmGUivpCuNYFTVB0GzRlC1LXZK0lYq3DIFtyHzrVaE9Qs8xkksSlsr4qm+HuGm7qsfixF8VY7CNL1jRNH2CV9c3MItwa-v+XG5flrFQRlnawXg8GVYm4nuXt3QOgd7xeLDeFLAjhEOJh4xaQkrixEEsJPZeJkAGI0Ow5DAXeisWdN0E8NQECwAIZXHDQEjoOK9AXrR8uK7AysQKrT7q59Ws6wghvoFq7QNKDbPGgQxIgjEvh2OhIL864HXpos7JZtyelaQZw1GXj9ByyOFDMWoL7AaoJB6xo9AuybdBm6NScp8rivp6+EBZ871BG27Im6J7O3s1JJ32HQ1rpNSoLQoMbIMnmfRboM7Kkd88xnjjCf1iXeCp+XlAZ1XeDZ0qGCoIXYiqKlqBEIXsWJ3Qydz2XT4V5nK813Xqju3oTdud7uF0C6YtQqsCR-AykwksSemxCsEtYReBlubIUHEIDKAeJUaoWI-yUH7EJJmGgxycWclVbaD8FwUkSO8E6u4ljv2hPYVSXI+heDwk4AETIqQgOLowKoED8DtGgZcYQYAACO3A4DagEirMQI5pzoLBrtZ44wSTzAzEpX45JAiETzK4UkJ4oaJDZF3Whh9wGQOYZiOoHEAKQDbGATsGthIs1nM3Y0qwXQxDZC6MemlzSqQcAsPwAIbRlnGNCdRM86BNn4MqNAkAtHINQLwXUrMLELhtAsL40ItzUl3AkKY4REAUiGC4eYEt-CkS7u6bxdE-ERkCYwqBoTqD1BuOYzBtVokuA2DpQaww4j9Q6gkd4bJvAUnQj4Gw+STKFICQw4J1BKhhM0DiKpNUOa1NiQ0hJzTkkzHQtYzwfUVz-A8BMPpQphRmUJjnA2tdjamwPj43Z1RzLSjYlfV2N8G73ymV0KIGxwQrH6vJdMzoOoZFJFSKI-h7RxGAfHZ6PiRCcO4a2GgsAV55QHPrPORyC5F0PuCrhMKoXUBhSQOFNz64sweeDDmv8wR-1eLzSYYViEpIQJsTCdjAjxBya8Jw2zjhoshRZaFsL8oCDXmlTe280p7xRWCjh6LLmPmxbil2+KPZCK9lghwpLkbkodNI-wqknDt08AHXJ7JopT1BXRIQvA7bSmKcMgQXAbaFWxXgBU0D8qUCkBAQlIjUnLDoPJYeyN-gbiCK0hRQQyRZjwlmbybL6CmuoOalBJT2hsOda6nKYpxQtBoHgd1LdPUyS5CGhw2ZYihxpf1FYMRqQeFBLEPcWYo10BjXGy1TCNBJrAC6gxah+wylAv2bNxpoTEkWNaLJrx3AeHtKpPMzhHD9RBOhN0GN3D1sba2ZtDw20dqAuu5heQoCU37Vgg6110wDHFs6cYSM7AR3HQdZIs7sIrrNWuoZLbylvk1qgUcZTD21WhOO0ktiQSB2JBLVSK5HQrB0vaVYPVfBPtjS+oJb6KbIdKbwFg7YSCqk-dqX9xKNzBrJN5Wdgx5L91LR8TCAdqQ2hGHYXCCGm2vo3Zot9oyRlYY4DgdARAeICLdQqyJf7CPeuI7EYk38KNLLeYseSzoJ3pCCMukFssdl7IsmbA5iKjbItOXRc5N9NPjjxXcglQnqkcy+A1Twdgu6AuwfSUts7qOeG6SdWt8HVOgOOAAGT4kBLe-AYUCXCZMolXQKRbgyW-ZI-wMiLMiOyPoAwfDsgnvaOw9aABqL5KDL2kPTEZbEwtiWExzNCGEsKDD+K8fC25S3ZhJGFXmgw9ILsnjWaedFctiHy6oQrE1ivfgqREyzzx0JRGqzhOrXwCLOe+DFpl-gq1snrQMlgQTRzTRtQON8EAgKkBWmAKQfAWDkBxRAfhqBYD4eeEy8OvMgV4QpDBrVgwsKzvTN1IYUJ63XnYDxEgs1zKzWmlh1AcabUvgEAAaTAGAY7EDJWM2Zig-RgmxuPOsL3ajG4oTyTRmSVS9pMKghOuO8dCQ9zreR-s6aPHIcRi4yTBaaCscRf2odUkURdLOhGEQxGlHVjet1V8fMdiVNGrU42On9sfwM41BGCoP0YCY-Cx6zmcR26aT3HuV4XIvhC5mO8nXrxvgZC5BsJltPkpXJG3oriDOcU00QczO7+0oY8z5vDDcqkAQKLzDmE8ToDpS668a-pcv7fsUpgYhnGh7y7zdw3DXObOZe5hkpX3xvUmeGcP1JYu4+piP+4DreYRWzA14vxHb6Aq6FQAKo8QCwYiQeWgLTXvPwj3dUBh4+S4T3SxPnMi67nSKEcGer-YKiOfZCK6D5xObjHxt5+GSuubKsz8qOea4ICuBRbpxbeBg5Omlx6wT9SrcMUigQbQrrvP+ZW01fPsDwKV6qnPuhdy6idCWV1YQKQlg7Q24O4hgWUVxkg1tvM6ERAe04Bn8oJX8YVRs09vYw0DwDd3Fzc7EQDsxSQhhNJ2QfUA51sLA7cnVYUoB+FeF6ZVobYP8MFsc+8psNxB87Bh8VJS078sJyRx87MswbcYDD5hRE9KAoBuBUBWwIISsbIjAkocBIxFR+F8B2c0DUJC9lwwpAgtIBhdw7R3QwRZ1dJZ0TxqQL161RDqB7wJCpCLIZCRsvxSAYBUBZpYAeBUB8olDZ9VD1cytxscdFJ+hyRhgNh5g5guClkEh25Wp-gTxB0lxLCxDbDpCjFQs5DbVvCVC8MLNmCfYgVFhKQJgb8A1IjEA7pMxNIb8uZSckjrDxDJDUjjERsOUYV486ZZ9+Be8ehSJFExgUgr8PgGsoilNvUwpPAuQ+c-hshqxqB684B9R9M-R1CIYw9MIDpScoNORdIGQ0IYjyRfhA4yRJihppcfNShThIwSpmwIAViKs7ATpSQQRqQtxQiLcv4Yi9JxgdJvJiQtxw9RU6I0RIwdE7jW4ep3gJYX52Qu4dw-h24NxBoJjyFTxgUzi6EAwJQoUwxFRlQKg1QYxNQBtbj-C8iOCSQYT5IGkmthjyj0JAN7RnRVhcleZ1tmw7DpQIIzZex+wwTPIKJvUatYkEslMyjZhCD3h6kepmlkZkgH8IEqh8AWB4JzteNpBkBTg+Tuh-A+g9IghfhvAA4PkiwddADB4JEHAASljXpbYzgz5F5aYvwtSejPiz0z04YQgaVBobR2loR7MbQi9LCNNpQjtnSvIwQlMsxVhi1ksnMZhyEwQggxhrR-BQQlM0SI8Zd6BEoKCd5WcsplRqYCpnSulnADcR5lslNc8EBSIUgO4viDpTpdJTjMzzj6ICZ5cZpWcyYoBnSDo-hSRyE9ItioQdjz8BT0wck8x50iF60FYnwrYVZGJCYYJHZ4BSSv8fYBTb0mUPA2QnA8Ip1PB+gogXQoQVtyQ5zS404HSL4SAwyHBnAqR0YPgYRTyv5rRn5C0OD4kxhelhCfE2NSkYEZhP9NcAh246R3QohJtyEdIQCGoJZ4tvIJYPgrSV8Cl2T41hkOMtSDoXEQ8HAvh5g79-dAhFgAQ6RYNbEgyLlCYtSiLD94TES3NYZvk+hF1Ag9I2Q6R0wH8IUMUuUsUeUwAGLJyXAyQUSBiUh-dfhn4KwHtEg8kAKTVn1jM0MiVhF08mVYRn4eoiJWpnRqz0JQRcFx09VWR5JsZWyMTgyxwaItTOoeZ9znF-g-BqUTdZ03gkgT94TyFoD0TD5-N+IgtuEBISzr1xYnA-BwDv4xTBh5gYhoN2RnQgFnQcsO8BsSYKpwqNy99SI80kzlMaQ6QkZErhh5J5kHRlI2T-FNtkdeFdsIrRidyHF9y9wxT-0Yjvg8E6QtwvEVKTIAdYAgcQcaAwcoIIcod68XwSyTD3hyQKyvj2pGtiwNVxglgJgoTbcN9vw+yMwyFbM7ou42QPhZKFECrBhsxEgw8y8RqK8q8W9a8oJocxA5qvgCDrNSIeoUhHAp1eZSQAQ2Q5g8xrQZ9196K8r08CBvBILdxrcoMo5jLkgSQ24u5x0mUnBI1BqhQ4Cn9eFkC8BnSJSA5azxgtqDqxT51QpqQmsUKUhOtAT+lyDJVFSqCaDpo6CmqobvYukSQfjFJazkhL1uCWqdI8wY5dJiQvNAqzlkjGj7C0i2ISzPBmQQQYroRXgNx4Lz8EhmRulJhAooQGMZjMggA */
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
          'Requested AOI delete': 'Deleting AOI',
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

          'Requested AOI delete': 'Define initial AOI',
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
      hasAois: (c) => c.aoisList.length > 0,
    },
    actions: { ...actions },
    services: { ...services },
  }
);
