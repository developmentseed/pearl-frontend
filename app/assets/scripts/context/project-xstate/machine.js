import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEguti+CMMRUl4Xx+NmAzpAyUIUjE9iuFmXjpI49ibo4Xq1gKV50Le960I+lDPm+X4-n+AEsBAqAkJ2T4vuBX7QbB8F6ohc4pqAzz2MMvh0MMQz-OkywDAyqy7kp9hcieZGuBmtH8sifoihcajBpwJDIAIACyNmRjgFmQAhdzJo8snWHY2jOFmUQeA4ukFgyHxgmMbppNaExwue46mUKADqJBtFZMroMqfHMCwGUsCo1A4GAYj2Y5XDhhA6DtloknuchXndCe7iuC4CR-AWWEOr4mnjIpPjWo48Q4QMTjGUivpJSllnSulmX8dKuX5YVxW-nAPGLUVImQVlnYwXgcHVYm0meZY1gun4JYeNSVHxFRXXhIgZLEu8fzpPM3x0p4Z47HRCXHMlqXTblWXzcq63LdxkB5SQBUbRBvH8Tt4laDcs6GjJJ3dDdJExIZ7KvThfgEYEzL44R7hUeTo2XmZ14I62cNQWE8PMFAUolcgnA8IqXBSG5eJo8dcnps45LpF4J6ggMSz4fdCC6c6LgDf81LOsTX01iZ43HLTAn06JjPM1ArPBuznPhtwyB80h871QQnzNaCUSDTYCQdfYRO-DEfgUmpQxjPEVP0TTdNWQzTPA8bUBcatkNg5tzOI3tEmHQLxp2+TCzzGS0tLGyd0zCeVEsqRCSGd4ni+IHv30AAYjQ7DkLxd716H+s8NQECwAIFXHDQEjoOK9AXkHQp19QDdN8xeuQVB7edwgffoFq7QNFbR1p8SIIxGhDjrGpyQET4zgbpv3JUaRNFxT9Wu1yOFBsOPagkGIvGqCQ3caPQi+D3Qw-V3QNc76N3rk-F+EA34L2oP3Zeyc16pxQr0ewdBrSvVBBsAYqsGR5j6FuQY7JdLfHmOrP+N8AFAIfm0Z+r88DvyVBgVAv8xCqBmkQX+8VSGALwPfEBlAqHgJoZA6BqgV56DgR5NOqk6AuhLlCVYrUpiy0mCSYkVFYgrDLoEKupCVoQGUA8So1QsS-koP2MSSdqBjhjhAMRdUMYUkSO8GwxJYT2hItCd2ssoQK3IvaOIrx3RUi0fWUoVRdH4HaAYy4wgwAAEduBwA4ltIqI5pw1X5uIhcnwlKbj8FmDw647QpDBIMSYuZYSJCCQxHReiImYjqCtf8kMOzx12vtGxNsMarBdDENkLoCEkXNARBwCw-AAhtGWcY0JKlmWqeEjQkSsQiDiQkyGcNYDthMBQdp6MuirAGlIpwA03Q4UcEWQYdA+pNWpFuf40yhRNn4MqNAkAanzNQLwXUKcMn1RtAsL40ItzUl3K7AiGZinzFxl01B7g7mNmbE80JryLHvOoPUFGUl4E-MmC4dBgLhhxEGofBI7w2TeApPJHwNhYX0AeRGZ5YT9EouxF82xXRfk4oBS7fFILZbyW6Z4dMXIRgAgmDCq+mtgnmWqFNTaH9e5QIHkPdhkrhQWWnoIpewjYFpOtjsyIbo+ioN0pS9MzpD4ZFJFSKI-hfHzGpXQJZ8SXythoC+aGhU5VfwVT-EhkrHUJJddQN1MMNUwIOtswWiAVFglUa8cWkwIoeJmJsRSfTAg3WhK8Ea4qxp+tiU6mVrqaEwwEHQjKjDmEZVYb6hi-rnVWSLe6sAoatXhp1evBc0bSS+DiGLB0vxsxJqjU4JBFc8nfDZFWb6Era28HHlZelSKBBcAgEVAQbq8AKgMYVSgUhrHtsxXY5YFzdyrm8CkYmRLmpBDJFmNSWZfL2qEHO1si65mopEDuvdeUxTihaDQPAEbjTQnQlyG9DhsyxFcIfFYOMqR+1iHuLMT6X0LsRe+6JX7IZqH7DKfi-YgOdvJCSG0yRYSvCahkIdCAKS+R6eRFYlo-BGRzdTIUz7qDzulG+h4mGwC7shjxiJeQoDcUI-VG66YLnpgGKXZ04wiZ2EWDaCEZGXSDBQ5x196HeOvlnqgUcKLxNHqaqSXpII7C6RdqczxK5HQrAoq4h0VFNNccsQy9o0cPNvN4CwdsJBVT6e1MZroedr1kl8gNQYWE2QEQ+IpNC1IbQjDsKpVz2mXkYdmYy3z-mOA4HQEQYCKT90so6aFjc4WYRRaUbF3lKw+iBEGIkc0QQxXTtzQxVV0rtN0U9XQb+Srr4qrVWhuiLaHirwPd8jGXxvDINwa9Xx9j6SeKOYsTwFKnFIcrqxkexwAAyoFAJMP4MJCCnzUYzdC7EEkLtZHJH+BkBRMwnaGpGN7Ih9o7D2oAGrP0oPw6Q20LEXZC9YMkPgpH-EdhuX2Mtk1QgWANIYGRYQCrGH9gHQOE6g84gmK7rKIcuxJFFlY59xYAgR1G6EbxviUR8m6b7WOxCA9UMDhGePvyaBxIT8rp0e0knmGya0qwTzewIqWL2WY-ZEIcPa2lyoXmJM5qugQr4ICAVIBzMAUg+AsHINDCAYglSwHBw1V4bwVJuJdJhbcnilvIOSE4kiawoiXw62x7W7BgIkCZpZJmcN-OoDcyu5+AgADSYAwA690TK1p8znmNNK3zvV3QBhERvfJUu9gfDU9mEfZTlOlgDO+FOjWnWzINjj9PdXokCsh4jHlw2MAU8YuuxDy3SlVYBEMhCGzyafBgkGt8NCg0RdBAVzX1u344aFXhZGCOrlptE4t8WIKhzyRQndAPqNdJr2nutQO2I5ea1V+n9KC7DSeJz6bS-BPB1U+Roahnd44tcK4TznFgEGEcwnidLnu1hXl7jShfrKtfqsvXhoE+EQGYm0ivvzi-rnm-tnPvOSBuARJ4M4INEsLuIKuMFSntv-NeD7kwmEK2BbCBGBHDGHsVAAKrATHaQwSDY7xz3gm7m4EAgYJYnzOy7irD57kpIKkxeIUyn7Kq1p3h-iNxwwHbsB4CXbt6r4EBoSOhRABCbYgj2h2hjBvCvSJBYS-Cli7ae77b0AiB4ZwAyGiRyEvhoplZp4qHaQ0hNQZ4jCOaaSkT2Y9r4xOBizIZEGkINgWAAzbrFpQAm7xzbSq4DicHcHKbsh8GURkgeyKT+z4x2B4Q3T2rCjQGUBQDcCoCtjNIXZ2RGApQ4CRiKgm74DL4OHP5cG-BgiURw7UgXwUghCywghYTPRKxbi5yaKBEqp5EFFFFWQlGcSfikAwCoBMywA8CoCFRVHJK1Ft61SIGNEOK24BRtEn6aR5jFL-K6Hj7jAe7AFmEigjGFHFFgCdilHoCrovwVDVEFB1FP4byHIHIy5OIKTfD55OCgguD-JUakTEheA5FXFjHSgTHfh1rajxzrKbLkBxHkzhTyQbA3SkRYS+R2gjB+ROJeFOIApbBDFdaQk3F3GcRwlRHJL8BxHj6LCDSUSbDRb54wiNZODb4US-ACoQnUD3ijEUngFFGmIP6WLJ70k3RSLMnZhoLya4nr5si-B6TC4mHnH-yvjIDATkFWRgAhH1qX6cQ9xer9w+oSFmSanamth6nyHqqLxhpTb1FpxkgXIYmDQqyBCgirYzD7xIKckkT5gngJD2q3gm4yo2kGmyrGkDbepDYzo0y0nWn6kyoQQTYiK6CcFfCvSkjRarDix6Rch2hQiKTki0hchqR+DgmklmRwmQFJJhmxEIGOEBR3bDTEwnjLCdE+ljCZgMbEgTAw5+BPr5orKARwyPEpL2HvEIKBC9TuFixqSGQOC74IBb5+RbiqLpj6TELmlCgkGwC+5MxMKoCsBz55GoCkD6K0GR7R6x6hFilJ4AScEDBBAXKdRPajBUQ7jkb9B5jpj74Og9khmkF+4sDHmnlQH8lsSXkRLXm-hLzR6ATQxhD+ZMwPkQxrHpLKESx9Cu49r+CPbfnEq0ZUS+SrjZrVjUAPFwD6i7m0DTm2zoHMhYw2jZhfCvDQayx2xIJ7itTsjeA+STD2poiRhlTNgQAMUYw9BOKkggjXJHjrhdmIDkzERLBo6+TOIabVlCgiXnCGIzDrHNmDBIIAgDRUh4ycWvZ-BIIbguyeCDRSxiw5G-ouphiKjKgVBqgxiajs4SVKEbF2BbiMn+EURZg7yaTyRmb2jOgCG0jiHDYMSK5CnDy9j9iSXPCZEjKDDDAbDPYLk7hDAmXoLkwEr4UkmmH-wiC6JVD4AsBwQG6FbSDICnDpXWD+C4XEy-DeBoSGFFh+nlLYLzAblAFn57nNwsRCSJKtWLirDESyaybSxKWzApDMiciLnZgoKEEVWkLdbCJWTa7TU9CAkhV7JxCJHemIAMYXJDA9T+CSw+D2r-QyozSGw5Sgx36HXkrOCvD9n4JLCEy8qJCKTkwl50gwgkQhkhyGkzzhxzSRyHW55-CkjkSkVkiciUSaRkQXIyl5ggi6T2j2pjwTyrpTwz7QRzzwD+WOGbwLBNS6QDKTp7iCEZgixOwYn+A-WE3kI8J8JvyHWWbOBUh5kfAwhOwMgxRSIQaBV4oDDCU6a1L6XTUBBIJ0jujqHDA+IrkDDzaGRPa+R94OgK4L5CY+bHS6rP654jL-4ODsWVn5xRopALDJDC6rCqwBzaXHC7UplfjTU23NTHK3SDDJHZjmqNZ-CBDXTprpjDnLKRmNowy+1bkuCQ4LVA1xaexsjuiSaJDujpZoaZa2Lm3AYBBSLkxaR7jjL21yxoKOJNRoTjB0gdQ5GjbcbjjTVBCKSqmFw+DzD+CgrQjvD9QMbizkRsj2pHZgSnYJKbSfVKY57dVDAeBYT56DDzAxCObsjOiwhBDu3bWSr-as444g4z1U0NEAkxoZrfC9AoJLWEQlkqY9oJB7grhG2PIsDK7xwrpgCHXEbYGrCsVoRUivQEQWjI1b4+ROLOgjV0U3ggX+40CB6iTB6h4PHPwI3WiGorCTCvCAoZC32MYlgYki3OgtZT6hEQQI2SJ03rDsj-DSxxbFhM0uiTDkTkTAUHlkEUGMHUGiS0GfVbgxori+TywkQ9qgriykgAhshzB5jWjDmWGwDWGQS2F4CHWmr9D-VL2wiZE6E2g9L2g9UURxrxXxn3IhEyo1XhGRHjkIwxH8Mni-nh32hA0UZExizIIUR5jnzMlRB8kCnXHjG3En2GUNFcgZgHh+DyavBw4rluLMgUqTDBRQipb2qWliA6nSgRne2fifVQPPQ3Rl0i1BBFgqXlmeD4qJCG0e03iJm6nJnTz80j7PSGO0buh0hFnDD9CJBB0HF-Ax0Fp1lNwNmSVwTICIDsnBV4GghbieChAm4yiqOYxjCC0s1GFNQZjpihCzxJxEDjM-GTPeDTNB2hBFFQDkCLMvBES+QY4OiGSlKhAbIQDyBEjaChAKD5HnPjMKLPAugURKSrNYN3ObNdEaUHNNEzNnGjXe4cOgXgXSBnlQUXmtqq5oOn3OnQjMhGF-A3q4IeAETk5SLExSM71nXZDZBAA */
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
