import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEgutjWr4dATFudLxD4dKeAy0LpG8Sw4Rm2iOPYYyOF6tYCledC3vetCPpQz5vl+P5-gBLAQKgJCdk+L7gV+0GwfBeqIXOKagM8lFRHQwxDP8RFfAMDKrLuCn2FyJ5Zv8GY0fyyJ+iKFxqMGnAkMgAgALJWZGOBmZACF3MmjwydYdjkS4AzJCuqwUu49gMh8YJjG6aTWhMcLnuOxlCgA6iQbQWTK6DKrxzAsOlLAqNQOBgGItn2Vw4YQOg7ZaBJrnIR53Qnu4rguAkfwFl4DjWup4zoT41qODhSwDE4hlIr6iXJeZ0ppRlfHSjleUFUVv5wNxC2FcJkGZZ2MF4HBVWJlJ7mWNYLp+CWHjUvY7JXb4XXEu8fzpPM3x4XuI2XiZSUpVNOWZXNyprUtXGQLlJD5etEE8Xx21iVoNyzoa0nHd08SrE1ubsk9fjpH4BGBMyWNQjpNpVjstHxcc17Q62kNQWEUPMFAUrFcgnA8IqXBSC5eKI0dsnps45I4yeoK+UR6lcn0u44QC7pskEZ5k0ZY2U9TFm0-Tf1M8GLNs+G3DINzSHznVBCfE1oJRDhNgJO1hbhIg8tgt47J7uMovxO9dEmVT-E0yJdMM1A2tQJxK0g4DG0MzDu3iQdvPGmbQULPMZKDSRG7qQ46HjK4NuJLEQSwl7FP0AAYjQ7DkDxd6V+rAc8NQECwAI5XHDQEjoOK9AXt7QoV9QVc10x-uQVBjfNwgHfoFq7QNEbh2J8SIIxL4diUSCRHJARPjOBuy-cldefUbF5Mq+XI4UGwg9qCQYg8aoJCtxo9DT93dC96XdBl5f1eV7f98ICPyntQTus844LwTihXo9gMJLGpKCaEgw2QMjzH0LcgxrplnmIrGsyt6wXzwFff+lA74PzwE-JUGBUAfzEKoaaRAP5xXPt-X+182hkKARQkBYDVBzz0JAtyidlJ0BdHnTkaNToMkmCSYkV1YgrFcLEQIJcWHLQgMoB4lRqhYl-JQfsolY7UDHOHCAgjarIwpIkd4NhiSwntPYBI9oCKSzoF4IiTgARMipKoghjAqgaPwO0bRlxhBgAAI7cDgOxTahURzTmqjzIRC5PgKU3H4LMHh1x2hSGCQYkxcywkSL4+i6jNHBMxHUZa-4QYdijjtPa5iTbIwCs7NkLptKKPNARBwCw-AAhtGWcY0ISkmTKUEjQISsQiEidEkGkNYDthMBQJpSMuirH6qIpw-U3TY0cEWQYbigiNWpFhLYp98GlICeUyZlSwmzJfPMkSsByAkCqCwAAqkIAAMqsvmiAQTJH6NbJRngBkUjtLuJqG5qRZm8B8FRFzRp+KbPwZUaBIA3OMagXgup47JLqjaBYXxoRblhXEHCBEyLNX0v4bST13SjKFKiiMGLAlaJxdQeo8NJJQMJZMFwGx0hkuGBSqYDsEAyz6AkXw3gKSUR8DYJljZmzouuRM7FuLNA4gRgS5GRLBWkptqK226kNhmm8P1Fc-wPATGVf6Myo9n7t1AV3HuzC-HCkdfXT8PCZ58IgYk42azIhuj6Ay7Sir0zOh3hkUkVIoj+HtHELw9q6AzKiS+VsNAXxgwKs61+rr36fxYRm6J2bqC5vBn68B+0-nGjkWCeRrwvAOl+NmYKErNjoQ6YEVG0JXjDSRR9IUZas0WRzRQ8GAgqHpVofQ9KjCS1+LHZNa+VaCo1oDXWoNi8FyNtJLKltbbwqdpmKjCiGFYSZO+GyUmeDkX0SELwQeFk2VYoEFwCAhUBC5rwAqbRBVKBSDMbuvlljlhuN3KueFG4gg7wBG4oKAwiIofImm591BX3SnfRqsJQGQO5TFOKFoNA8D1v3QMBYXIggnjTrEVwO8VgxGpFk8isQUMYZfa2XDDx8NgGAyDNQ-YZR8X7BRuq0J7o2mSLCV4jUMhnsdnmZw-V3ErEtH4Ayw6+7HEw9hkx7L2j8cE4BXjwS8hQC4hJyx9h0xHL3PnDw0IQhdrXiSDcjU7OyZdIMLjWGePqr46+ceqBRycps10FzTVtKY2GA4YkSiCIrkdCsYVDiHRXX8wZ8zGgw5GdubwFg7YSCqlC9qSLymqQxHakokmad3E70CIejIyc87jFwcup93G31BeM+MjlRWSscBwOgIgwF4mgfxRYqLMK3FknY8SGRKCJWUW0osdqzoPBEWOWmr11Q129wLXQN+7qz6eu9Th8cW6HjzzA3qroXxvBXrsE9ZNVj6Rdp2YsTwCrbGOd8Gm75oFAJ0P4EJCCeLdUzeU1uZqUIj7-AyOKmYVtw0jD8Ikdx9o7BpoAGp30oFw6QW1jGQ8q-VHG1H-iWw3ERDILicIxC5O6YVOZ2348J8T6OZOOIJmh802SNsST9S+KsZIravEuKImkiiXk3Q4852IInqgSfQ159+bV03BcnVlSSeYbJrSrBPJjgipYatZiGFSdxDg00suVJimJbNv0CFfBAQCpBWZgCkHwFgrym5iCVLACnZtXhvCUo4qENJ2oETe3AvOqMPhyVlWm687BgIkHpuZemkMSuoAM1+u+YTc1hejq2BpkyMU1KmwLkN9U0KHs6Vda23wzebKGENcinwSV240WuyHkNRv54jMNoOMAa+8oe9YRxMu5b+Dk3EOz+yu0+DBDhb4a8cKG6CL376G1XciQKqqyMWtnL3Zh-VD4mZjccaJu6Zf566RNXahguDVEKK7-7xxap3FB95vWhXvtLXv8vXnZu8K2tmFvOSJnF2gCOjN8L9lEJljvjpl-A2H3k6j-k8pBKNtQE+EQIYo0ufjrqASnBAenNAbdF2p4M4ANAMJai5kqqgSwmnrABnmEK2AbCBGBJDIXkVB8sBCDiDBIFzlHPeIHiHkguhBuOyNbLuKsOkFSqsOCNhMTEFBhneH+NXJDN8uwHgFDpPhfgQGvI6EgbCL9pvEpggJvG8E9FjiMCsM6IDswSupoXANoSJLoS+NytrnXsYZpDSI1AMMSO4nuOpHnKlrKljE4DjFmHbhYHvlUPgGDFAIHlHFtM7gOJIb5IsPvHIRRGSHjGdGMAOu1FmFmKjHthoPeFANwKgK2HUpDjZEYMlDgJGIqIHvgGfr4SAQQOvs7DdAysfIFHaH8PruRKRKePLFUXgZQLUfURZI0RxJ+KQDAKgPTLADwKgAVO0XEl0RPjVCQX0U-qIrTrLEohROpHmHkiSmMOSHSOMCfErI+iZMKNUXMXUQ0WAJ2E0egN+vfBUB0QUN0cAUvNslspbrYsMOWIoattcS4CSopgniMDMTUZ8Ysd8fvqutgSwIsssuQJIUFGFJRBsIniME9pCvZr0BEbYqSucs8SOscG8bMfMV8T8RxKuukXEvwJIVvosKRNpACIMI1hKjCH0PPlHsKr8J4Kmi4fRMyWiQsdKEsd+HogYoASYtXryajKIhRNCG6KCM6LCTMENJmE7DpAbs4Qybpv6O8ayRieyaqcDIBFwSDvUrDCHiMJRPNokBMO1FSOlupO4rAhsvaEsBkHnPel1iZK+MgMBBwRZGAAkeOtKJDm3IWp3MWh6vRLGfGa2EmXoaPDdvwroCHmSG4qSTLO6IEIgnaB2qSP1I4vmCeAkKntyfmcmV-t+OmSdkWmdpcj7O2YmZ2UWdPLWndj0YnKpDFsKasK2jpFyHaFCDnIkH8FyDtoitaV-NiYBJDP8fEgYYcX4VEHnD5NnLRuUe6KMfuCMCCEtpMLSFaQ+oyfQDuVyYHvwD4aCdAoED1LeTjEREog4A-gClCM4NBvIumLpJ1tmT7OnnQvTHQqgKwIPu8agKQFonwcXhQqXltDQIQZXs6WWThLYY4tdM9IMOMGbvdL8CkEyPYk4J7HKa8ZdlHC8m8tIF8t8sdqdkwudvKaxQsq8u8lxcWYGpOQuGGehJREsJRf1AGeESvLuMKjgo1ORDBfxSxQdqPLicJZxT8jOqgNQvOngAwnxQOUKPtnwj6rpRxZ8j8mJTuhJXVMmk1MiffmvHOUWJeh4O4tCOmC6CMsxaOnACODzvvmWYMCSLFokOyGpVmDvFCCoe7CMCkEsCfNWNQH8XAPqLBSUN+abNAcyKjFdBkGvAGYxhKmbLAnuGyO6GufYq2cFaiKcJGKVM2BAAVcjD0LYqSCCKckeOuK5jMEFDEFdB1ipnYn5s1aUK1ecDojMEeb0UuLAgCPJSkAOjuH8LAhuDbJ4CRaeLKVuSwgGBKNmmGIqMqBUGqDGJqKrp1YYUcXYHDpjO1MKlmO5upN6fSqWAobSFGXlSqmimyWOLRL2P2F1c8K9n0oMMMBsMjgBTuEMKtUKkFBSrKskBoRokkaOHBH7mNtIMgKcJDdYP4H0FdEEL8C7OSSjgCsoQEBSBsPMFuA6G2UxNIIJDEiTYuMoRRAMK8DbINMNZECkMyJyIBdmNaAMHtqxZ7tzT0KCP0G9RsnELIZ9jMOpkhmMGhCSVTmml9GutNEHNlADP-mIPLfKs4K8EttdEsLjKtrFRhONXZtCF3vSc+TaQxGrKmQHJrLNCHPLXZn8KSMGRFHYfKlnDjG4nqcKusD9WmgPEPN+iPDZePLwM3BbXpBhB8Ink4TEcacpp4P0FbKSf4NbQnWwiQpwo-PLevM4FSHOR8DCFbNItaKIg4AMLuCKtLTNf4pihqlMotUkhfgELAnSO6EgcMNjiBdYbuCnPCkMLmFfnbsfrlpqkdMGiAXZn0ieJ5V8PML+QRCkAsMkAbqsE4UxcdRdtpT6tzQ4DbIsNtbtb9mnLGuKX8IEM3n2umBoQ8mupOv-nfVBS4GSDbhtSkEfb8KIhWKjE-oyr3fpoFv3RYpvQ2gEKIkFBpHuIMlQTMCSWCBESkJbnSHbDLTfVdrRNzUEOhJaXRj4AfVYVYm8EkN4CCK2n5U+dGUKMDmBGDtEhtJnfrokE4H4EML5QlRKoMPMDEOlnFRSPjJfR7V-ATsrtzqTgI49X4U4IrdpJ0u5lyOGYzjnDaCkBSnuCuCvWiiwI7lHF+mAPLeSJpCVTaNmPvU9LHjo35cSEeJLO4KnvBZniwNnlHHngXn8XfIHdaOGo4cpGSq1gRBpiWKSU3c6L6Z-qPIHSIl5usOyP8INEfcWG7C6JMO4u4v42wQhZwYITwSJHwRbVSOhIXPJWvOMHbLHrKsCh8EgSuPFhoaJu4VHF4XgPLdGv0Hbb5dehIyaQgczmGbeXEMLPEYkQUCkWkXudDJkRbXLv0HmNjIKckFRW5lHRkAokfHqVEKiR8UqW2JiRBBbZ4ATB-Uaa8HTjPZHsyAqpMNpP1N40dUoywrmWIAmdKAWSmRo0tUvM6GLRsJlo4qA8LdYZlhg48aKsI3473beB+R2YWbfZo8tevg9GvH5dcayEucMJ04MAoqCH81w3phEpmtqO+fEl1XBMgAChMfyfQb8ORJS6EIHjKMMyjFRApBmN4I4aCumKEOPLHEQAClCZy3PaCFuPhCAPUVAOQIKy8BSCKzKeKxmJKyAEshAPIESNoKEAoHMRqwCuKs8C6MKjq2Kw6BKzPWKQq2Kzy54OU+wSwEhShYfmhRhcEnU3i4nPSsyL8AqrRhgh4Ak8ofLCcjhM6KrWQ9ZT7ZBOxSJT8tzfaPuL+axi41dJCjaOAfzc9QCI4hoYqKOOo3cyGyhNpEXZROIiI+RN8DPfqT1DTsnKEU1dkEAA */
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
          'Restart drawing button pressed': 'Reset drawn AOI',
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
          'Restart drawing button pressed': 'Reset drawn AOI',
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

      'Reset drawn AOI': {
        entry: ['closeAoiModalDialog', 'setupNewRectangleAoiDraw'],

        always: 'Waiting for drag or cancel',
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
