import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdgCcADm0AWbQGYArNZO1j5BADQgAJ6IPp7Wzi72Pr7Wbm72Ltb2AL5Z4WhYuISkFDT0TKzsLKhgJBARAjr6SCDIRibq1OZWCMG2LnSeMS5OXj5urrae4VEIPj5xLp72voPWAfb2nn45eRjY+MRkVLSMzNKV1bX1mrZNhsamnc3dvf2DnsOj4y6T04iDbgGgVcW206Vsth8Oxae0KhxKJwAwgocABrGhQNgAMxY3FgYFQbA4snkijUKn4EAaenMrQeHS6iCcHzofj6sU8EMhTnsfj+s3stgGPhcLjmnjckz8fmG0Py+yKR1KdGRuHR1ExlBxeIJRJkcgUSgpghudxabUejIQzP6bMW1k5EJCvP5fh8jicPkm2icqXsgUycthB2Kx3oAFE+ASMSxaAB3FjywqxkhEMACADKYDwieDOeoqbAjVpFoZzxsHltAUhwXcgUW-KSTjoqWZ3j8bjsbgCQYKIaVJwAImAsaU2NR2iQxCwAIIAeQAkgIGNVYPiICwIKgSAn47PFywAEZyPAaYvNOntMzl2bWFzaAYQpYZLa8vz2flOGV0XluDK2OwxnsNJewVeEwzoYdR1ocdJ2neclxXOB11xZAxHQWp9wXI8TzPGkL1La9QG6eZ70fSZ0gdd9pQ-SJEG7PxnGWJZOSA90nFAuFQ2VRFLjUDVOBIZABAAWSEvUcD4yBz3uK8nmIxBbFcOJmV6GVln9axG2sOJIU8ds1l9IJPE4-sEXoAB1Eh2gErF0EJLdmBYeyWBUagcDAMRRPErgdQgdA4y0fDZMtG85hSR8MiCYC5i8KY6IQRIHwcD5PRSbQ3E5FxTMVczIO3OMYwQo8Ik3bcoCgDFvOQTgeHxLgpBk816SIyxED8ME6DsN0XDdWw3R0txXWWZxOU7CZ-TBDjchhPtcogwcCqKg9D1KxyKqqsSat8-FuGQJrL1ChTrRZO0OS5Z0+QS0V+jvTZFliTL3W2GakzMhaloE4rVrK5hKo1ZdVxQtyPPgg9HITY88FPIKzUOstjptVl2QdC6eSumYnE9Oh7w7btUl66Vpt2ObwOVAAxGh2HIVy+OWpd-JOGgJHQVF6De+aKap2Aackmp+MxBCEGZ9AKQ6RoDsI+S2oQWIyIdcZkmldxaJmWwvEYkY2TsFIPBSYnZrA7iTkjEhDzEaQF1IGBUFKjMeFQDyWCzC38HsgQrbOW3nYdp3KnxV3KUllrpe6TxXEcLYEiAu9RQxxS4q6uL7C16wfUGHKyZOcnswoWC1CnTdVBIARGfoEW2boDms-oHO8DzqmC+nCBi+F6gWbFvDdGDuSrQA9IusyTSvS9bQXG0nwf38bQZQ+MZMmy168xrug64bicm6LvAS4JDBUCrsRVDs1AiCr5fjdr3OacbyhC5b7e2471Rxb0Hujpl-vbqHnSR-V8eEs5B6fwd4RRLGAoKTOF86Cm3NtIESRhrI4Gdp5Qo7t4GwEQXqAOhRpLBWar3G8AQ0g-iyhsfSIoYj8nVvpJO+kU4zzTsyKES9SZQJgRbFg8CICeWQYHNB6BuHTn9ig-AuC4ZSytB2TIdA9I6Tiv4aUVDE5pzoandOzCSZGwHGUaoEBlCPCqDUOogNKBphwtDDQuZkJiJLCHSRfouoATGh1DwnJ+SSgGN2dIwxeraDBC9TRXFtHQKjISNAkB9EdCqLwak4i7FhUyv0QUYJcZ-gdE4fkOlmzhx+ETLGIIliQOCZGfgYTdGRMsagGJppbEEOOmMFkyT0gzzSeHRsIxB5+MGKKDwf4vxFLyiU3U4S9H4CiVU6gDRrBxLqTLBpST1bNI7C+DJACHC0NYiEEBWwBkQV4vzempcNDl3bqzdm59gn7Ofl9Rcj9RbPy7m-BGMscmR3UjHG68ceh9DoH4-qY90n9Wirs5UIgACO3A4AC3HLAbe7l0xlzoBXc5rDgngshbCmMNBYUkHhXczusMnmtW6EQxwmw+hkO6ZQhKmU4gbDSMsO6+lJggpOOiqFWLqA4vhQIXe9kD5H3sqfauUD2WYoEtiuFHl8UPMJXg+GxL2opDJaQzYVL4ozDsP0NwMROxpH0msSYJkWFaLykIXgE4BIjIqZMrggiBA4rwHiQxHlKBSAgES0O7V3zNmoTrPwEo-xDQSsyRwd4AIjDSDq7sGjDZBLNRamM1qxkaGELgMAbrICuRRKiVoNA8CeskX4ZkrJYgijkRlFIXzeTJT6WPd0FKJSsvoOa6glrMTJseGm117qWBqDTFibcaZC2EOLc2RYPpUmQm7K6ANvzUgOE2CERtza6CtvbVY0ZXaRA9qzZ2qJ+QoBAxHcdaUNClIAUWEZX0th+RbHHWkDsiQPgARCKu9dSbykpsmTOQ89kcwTJPTLd8-UfyQn8CPUUAFGyChbIk30YxuxBHfO+xNVqv1dqQlu8ZvAWBxhIMSP9qAg7yokYQzsjhZEqMGNKL5tLfnaHA+HCU3gnC2FQ22z9ETv2A24wYiZeGCOuXQEQNC2YbEEXiaeijMiYhyPIbR-kYpATqzvDPAN1ExirqudCjmRymanMriKy5dN0NzRlY8CWpGpMvLU11CUIx5jKzSJk3wOMdYj2ApkPxBtjN5QAGpTkoPfaQENqBYVibU9+3RP6Dw2D-SEf8lFKRxt4RdkpHNulXYFsQwXVChYKuFhCDRbhReeTFhecXh6JbHlQvoD4fNPX0toNYKGTXxogkMwkESczFTtemGcEANykBqmAKQfAWDkFxRAC2qBYBAZeF6N4QwRgAgmBqhOoHgJfnWF0iEi9AnvWVIOdgaESClX4qVYq+HUAbrtVOAQABpMAYBRt6OhVDGGVi1wSZCuVxSylRpqQSGCHSSmMhwaBU2EUPVV3hne4c4qOB7K0EJPhjg60YAeus7Ml475ATeMyAuqKXglMp1S5pII4xpSxr851hHNylxI7JLqSomPfv4OizYMdYGGISgyu4QYSmUuvl5J6O0Io3Bw4Z4LRcvGfsbiR7i0G5iYYLYrGPVk1Z5iS-rBthA6t1kBAF2p2w+rfMXMGTLiLSEFdYWE9QUcJ9VddzK4qnolYteAVrONBsCVFnNkY14f0OrmS+lXSd2AZ2Igxj2uhTCfWBEPYAKpoQwtwjcEgguK4PKOC26vZiJLAyklpKz3HSiYl4caacUiLxmtQARcBaSW7DG7r1CACCq0QAQRiN0oPpCxh1Fr2R2tHZOOUc4HBfJRggG3q0sQYOUZa4EJYXisYj8O5zcfZw9SXDqHPm8acRp6uCN4PxHgwgJXmEKB6KQF5LY+NpnNWLtT4kJJUEkhpyT5dn5J3H-wlgZE3Q8ZOxi0JR-4Zh3Ql8slV8fUeQ4dQkYw9wOYUw0wD9jpWsCdRQ1gxQWtgFGwfQfxhgvQPAlIOosZ30Ilqh8A+10BJsRNpBkAzh0CP5w4hQo57wPAYhfw70dIcZOx7xEgoN3AI8Rwxwb5C4EIWCSIfQ4gdU5gMhBQeoEhPxsY2Ni1Eh5gHMdVtNTNMQRtpDFIacWxDd1YQhHQQhGwtgBhvBnReQJQwDV0rIbJMRj5fpMQXIQZPJDDZh8cBhhgz8vwdJBgfB+QNghRpRDJxRn0Z4I9PpZdsIfpMcMQfCh9fl3AL8L9HQZ4wjYMnoQgMpvAAiDs40x9a5uZeY9CsIfDWNmxAgXFAheQmwlEaFGNBgU42M6EdIECzYOFPYbY7ZfZpAXZUFUAaiWNK80sEgA0F9-dE42j2JOilhujR8t9L565r4N5b5m5i4fDqFPAcZ3QdIuRdYUhGx3QZEfh0l3RUhOx2NViV52E4EEFlBeFRjUiZ5HAQcEh-RlYwc5jyc2QNYn0xQOxacW9lQnjOFG9pwRi3Yxi-8ucEAz1AQsp-AzcvxfB-AWiDiFiOijVNJV0sMbVDErgfDBRQNuClgWs+gL93EaEvRX0A11ZXAAlSi1iQlSlN0SSJkfD-APA6A5g5hJRVMRhVkZhOwp5HR6iAJJ0LdUU8odN6YaiAhJ53x7wWsBoMjMkUtR4dsU5-B7x4CHjRUwAIUOUJUuUpUwAPiK8eQkgOodJAhMl5hBSfh1NehK01gOMN191WoFV28ac4gA1fBUgUhw4dV6Tmxy0dVghmQPBi1dCDkzMFQaifRHA5Nw5vNCifRXM4hghg9uxQyDT5TTUIIRArgWA3Dqg8BtwaBolpYAyrRMCiCMgZQkhggAg71IQZEJgwQfQHAkgSi6dlQcs8t+BfpApqjET-sDcwQDiRhNDfEU5BQtI5i+DGUJQtDi0VEECuSet7d+sfC05Ugk5+5UgwRH1Qi5j1kMTIjlgvB9sI9TtD4LsaArsDwbs7sk8xA9i2CBgZROCVgeDroIdwQtg2QA1gJeppcXDpy-t3dMgzcZF-QlJR41gRQlFghhQOwuRZ4Z5jVN8V5I9o9Y808E8Dx7tfyZz3d-BgJ-DmQfMAgHQ5h3FXBfkyFKJJgGVjUcggA */
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

      'Displaying upload AOI modal': {
        on: {
          'Uploaded valid AOI file': {
            target: 'Finish creating AOI',
            actions: ['toggleUploadAoiModal', 'setCurrentAoi'],
          },
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
