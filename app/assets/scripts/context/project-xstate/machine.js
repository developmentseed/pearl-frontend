import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEgutjWr4dATFudLxD4dKeAy0LpG8Sw4Rm2iOPYYyOF6tYCledC3vetCPpQz5vl+P5-gBLAQKgJCdk+L7gV+0GwfBeqIXOKagM8lFRHQwxDP8RFfAMDKrLuCn2FyJ5Zv8GY0fyyJ+iKFxqMGnAkMgAgALJWZGOBmZACF3MmjwydYdjkS4AzJCuqwUu49gMh8YJjG6aTWhMcLnuOxlCgA6iQbQWTK6DKrxzAsOlLAqNQOBgGItn2Vw4YQOg7ZaBJrnIR53Qnu4rguAkfwFl4DjWup4zoT41qODhSwDE4hlIr6iXJeZ0ppRlfHSjleUFUVv5wNxC2FcJkGZZ2MF4HBVWJlJ7mWNYLp+CWHjUvY7JXb4XXEu8fzpPM3x4XuI2XiZSUpVNOWZXNyprUtXGQLlJD5etEE8Xx21iVoNyzoa0nHd08SrE1ubsk9fjpH4BGBMyWNQjpNpVjstHxcc17Q62kNQWEUPMFAUrFcgnA8IqXBSC5eKI0dsnps45I4yeoK+UR6lcn0u44QC7pskEZ5k0ZY2U9TFm0-Tf1M8GLNs+G3DINzSHznVBCfE1oJRDhNgJO1hbhIg8tgt47J7uMovxO9dEmVT-E0yJdMM1A2tQJxK0g4DG0MzDu3iQdvPGmbQULPMZKDSRG7qQ46HjK4NuJLEQSwl7FP0AAYjQ7DkDxd6V+rAc8NQECwAI5XHDQEjoOK9AXt7QoV9QVc10x-uQVBjfNwgHfoFq7QNEbh2J8SIIxL4diUSCRHJARPjOBuy-cldefUbF5Mq+XI4UGwg9qCQYg8aoJCtxo9DT93dC96XdBl5f1eV7f98ICPyntQTus844LwTihXo9gMJLGpKCaEgw2QMjzH0LcgxrplnmIrGsyt6wXzwFff+lA74PzwE-JUGBUAfzEKoaaRAP5xXPt-X+182hkKARQkBYDVBzz0JAtyidlJ0BdHnTkaNToMkmCSYkV1YgrFcLEQIJcWHLQgMoB4lRqhYl-JQfsolY7UDHOHCAgjarIwpIkd4NhiSwntPYBI9oCKSzoF4IiTgARMipKoghjAqgaPwO0bRlxhBgAAI7cDgOxTahURzTmqjzIRC5PgKU3H4LMHh1x2hSGCQYkxcywkSL4+i6jNHBMxHUZa-4QYdijjtPa5iTbIwCs7NkLptKKPNARBwCw-AAhtGWcY0ISkmTKUEjQISsQiEidEkGkNYDthMBQJpSMuirH6qIpw-U3TY0cEWQYbigiNWpFhLYp98GlICeUyZlSwmzJfPMkSsByAkCqCwAAqkIAAMqsvmiAQTJH6NbJRngBkUjtLuJqG5qRZm8B8FRFzRp+KbPwZUaBIA3OMagXgup47JLqjaBYXxoRblhXEHCBEyLNX0v4bST13SjKFKiiMGLAlaJxdQeo8NJJQMJZMFwGx0hkuGBSqYDsEAyz6AkXw3gKSUR8DYJljZmzouuRM7FuLNA4gRgS5GRLBWkptqK226kNhmm8P1Fc-wPATGVf6Myo9n7t1AV3HuzC-HCkdfXT8PCZ58IgYk42azIhuj6Ay7Sir0zOh3hkUkVIoj+HtHELw9q6AzKiS+VsNAXxgwKs61+rr36fxYRm6J2bqC5vBn68B+0-nGjkWCeRrwvAOl+NmYKErNjoQ6YEVG0JXjDSRR9IUZas0WRzRQ8GAgqHpVofQ9KjCS1+LHZNa+VaCo1oDXWoNi8FyNtJLKltbbwqdpmKjCiGFYSZO+GyUmeDkX0SELwQeFk2VYoEFwCAhUBC5rwAqbRBVKBSDMbuvlljlhuN3KueFG4gg7wBG4oKAwiIofImm591BX3SnfRqsJQGQO5TFOKFoNA8D1v3QMBYXIggnjTrEVwO8VgxGpFk8isQUMYZfa2XDDx8NgGAyDNQ-YZR8X7BRuq0J7o2mSLCV4jUMhnsdnmZw-V3ErEtH4Ayw6+7HEw9hkx7L2j8cE4BXjwS8hQC4hJyx9h0xHL3PnDw0IQhdrXiSDcjU7OyZdIMLjWGePqr46+ceqBRycps10FzTVtKY2GA4YkSiCIrkdCsYVDiHRXX8wZ8zGgw5GdubwFg7YSCqlC9qSLymqQxHakokmad3E70CIejIyc87jFwcup93G31BeM+MjlRWSscBwOgIgwF4mgfxRYqLMK3FknY8SGRKCJWUW0osdqzoPBEWOWmr11Q129wLXQN+7qz6eu9Th8cW6HjzzA3qroXxvBXrsE9ZNVj6Rdp2YsTwCrbGOd8Gm75oFAJ0P4EJCCeLdUzeU1uZqUIj7-AyOKmYVtw0jD8Ikdx9o7BpoAGp30oFw6QW1jGQ8q-VHG1H-iWw3ERDILicIxC5O6YVOZ2348J8T6OZOOIJmh802SNsST9S+KsZIravEuKImkiiXk3Q4852IInqgSfQ159+bV03BcnVlSSeYbJrSrBPJjgipYatZiGFSdxDg00suVJimJbNv0CFfBAQCpBWZgCkHwFgrym5iCVLACnZtXhvCUo4qENJ2oETe3AvOqMPhyVlWm687BgIkHpuZemkMSuoAM1+u+AgADSYAwBe40WuhpkyMU1KmwLkN3QBgUiQ2sBIEJGsSox3vQIjiliOKGDFJWj6TINkr06yGo388RmG0HGA9feUPesI4mXct-BybiHZ-ZXafBghwt8NeOFDdBDt+Pn1ruRIFVVZGLWzl7sw-qh8TMxuONE3dNv89dImrtQwXBqiFFT9voNow468o5I5q99oG9-l6pk53hW1swt5yRM4u0AR0ZvhfsohMsT8dMv4x8gDIdqluJJ8NAnwiBDFGl78dcYC7M4C05EC2Rbou1PBnABoBhLUXMlUcCWE09YAM8whWwDYQIwJIZC8ioPlgIQcQYJAuco57xA8Q8kF0INx2RrZdxVh0gqVVhwRsJiYgoMM7w-xq5IZvl2A8AodF8H8CA15HRMDYRftN4lMEBN43gnoscRgVhnRAcuCV0DC4AjCRITCXxuVtdG8rDNIaRGpm8Rh0t1I85UtZUsYnAcYsw7cLAgCqh8AwYoBA8o4tpncBwFDfJFh95VCKIyQ8YzoxgB12oswsxUY9sSDKAoBuBUBWw6lIcbIjBkocBIxFRA98A78QjoCCB99nYboGVj5Ao7Q-h9dyJSJTx5YGjqB7xmjWiLJ2iOJPxSAYBUB6ZYAeBUACpei4kBiF8aoqCRiv9RFadZYlEKJ1I8w8kSUxhyQ6RxgT5h8R1jhhRGjVi2iwBOwOj0Bv174Kg+iChBioCl5tktlLdbFhhywNDVtHiXASVFME8RgliViWj-jASOJV0nlIJFlllyAFCgowpKINhE8RgntIV7Neg4jbFSVzlPjdN-RficT1iATgDV1ci4l+AFCj9FhSJtIARBhO8ZgYQ+h18o9hVfhPBU1vD6IfjlimjOTpQNjvw9EDEICTE69BTUZREKJoQ3RQRnQkTJSOoXAnYdIDcvDWSv5XxkBgJ+CLIwA0jx1pRIc25C1O5i0PV6InSXTWx3TTDR4bt+FdAQ8yQ3EqSZZ3RAhEE7QO1SR+pHF8wTwEhU9+SQyPS11vSX4Tsi0ztLkfYcy3S8zwzp5a07shjE5VIYtxTVhW0dIuQ7QoQc5Eg-guQdtEUHTS0IlM1tQ+TA9+BzDzjQiog84fJs5aNaj3Rpj9xoiNh8kac-B9CHlhzIYQT4lgioToFAgepoicYiIlEHAP8AUoRnBoN5F0xdJOsAyfZ086F6Y6FUBWBiDVTUBSAtFRCS8y8K8gDdTa8AIQ8qNmRW1rQkdRgrodw5N+g8x0wv8HQxh3BU9nzM8WA3yPzL9Gjvzt1nci9fwZ4y9AIwYwgSt6ZgLgYziklLCRY+hHF5F-AJc4KEgjSVhNxVwh1+yLsDtR4WAXk3lpAvlvljtTsmFztlTLso4hL3lRKIzA06yFx7QNx40lhBhhUxELTEAV88k9wU1c5yIHypKTJ9s+EfVBLXl5KfkZ1UBqF508AGFJLSyhRzL8znlrKRKflFKd1lK6pk0moMT3815myixL0PB3FoR0wXQRklSzKOS1iNTuSCCaKgIhDAJaZYYQ8RhKJ5tEgJh2oqQYjVt3FYENlVKOs84qxqxqBgS4B9RHySh9zTYkDmRUYroMg15irGMJUzZYE9wKRbFsw7Ej0000RIxSpmwIAWrkYehbFSQQRTkjx1xXMZggoYgroOsVM7E-N4qhQJrzgdEZgJzhilxYEAR+oqRMZerUc-hYENwbZPAcIxZFTeLlTiNs0wxFRlQKg1QYxNRVcZqLCLi7A4dMZ2phUsx3N1I8r6VSx1DaR70utR9VVcSxxaJex+xZrnhXs+lBhhgNhkcTydwhgLqhUgoKVZVkh9CNEMjRw4I-cxtpBkBTgcbrB-BGL8ZfgXYaSUcAUtCAgKQNh5gtwHRsymJpBBIYl2bFwtCKIBhXgbZBo1rIgUhmRORTzsxrQBg9sZLPdZaehQR+hIaNk4gVDPsZh1MkNUKNxKSqc00vo11pog5soAY81CpDb5VnBXgltrolhcZVtEh0Igp+83jyJHFU81YvSA5NZZoQ5Da7M-hSQyqIpXD5Us4cY3FjThV1h4a00B4h5v0R5LLx5eBm4va9IMIPhE9PCkidLJUMxBYrYqT-BfaC62ESFOFH5Db15nAqRmyPgYQrZpFrRREHABhdwRVdb9rUQ+tbljrZaAhYE6R3RMDhhscLynDdwU54Uhhcwn87dr9ctNUjpg1oC7M+kTxQqvh5hDyCIUgFhkgDdVhPDPZZ6HV+KfVZaHAbZFh7rHrfs05Y1pS-he92Q+10wNyhyK0N0wAf67yXAyQbcUhg6H7fhREKxUYv9GUP700esrtMUNVZaL0e0goNI9xBlGCZhKSwQ4iUhLc6Q7Y9av6rtaJZagh0I7S6MfA77HCrE3gkhvAQRW0or7SH0vj6BgcwIwdokNpK79dEgnA-AhhIqsxSb5gYh0t2RnRYQgh373qTICdldudSd5GQbQinBjbtJOl3MuQlhVbJUOz+gbQUgKU9wVwj60UWBHco4v14GLHhjyRNIOqbRsxb6npY9rGoriQjxJY0K8GeC+CWBs8o488C9gS75E7rRw0PDlIyVWsCINMSwqSh7nQCrACPLPxE6REvN1h2R-hBoH7iw3YXRJh3F3F0LeCXyBCJDhCRJRCvbrqYh2DvhGGHBY9ZVgUPhMCVx4t9DRM-Co5Ai8BDbo0XGcZIrr11GJVAVmR+pVLoi4hhZUj0iCgsicjtzoZ8iva5cEKwH7Rg75M8Ys6MgFEj5jSogsS1Skq2wUqvwvbPACYwHzTXg6ct7I9mQFVJhtJ+pYm3qJG2S6AgyxBXTpRQzPTzHTql5nQNaNhMsmKcZHH7QNqezPBRUlGEnDGhRbxRzcywzv7An6z98Ho14orHjWR2zhhpnBgFFQQEWUbR1By5lMqRIdz+BZq4JkAAU5jhS2DfhyJeXQhA8ZRVmUYqIFIm7fgHRQV0xQhx5Y4iAAV4S5Wd7QQtx8IQBWioByA1WXgW9yIFSPDdXt8lkIB5AiRtBQgFAmjbWAVxVngXRhVNWnWdWMw9XdnZXMYzXFXPAunknsLpBPzSCCLBmmWUJ6UIKNNepPgnqimtD5YTkcJdGUgWGLKY6iSvLPkflZb7R9xDzWMwnYLdmogNaUGwaARI7shMggA */
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
