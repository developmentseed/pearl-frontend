import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862Jy7wTJuXiwj42GePSfxssy8QZkMjj2GMjjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPBRUR0MMQxeK4bI2GMW7hIgqw7vJ9hwqe2ZKZm1ECqi-qihcaghpwJDIAIACyNlRjgFmQIhdwpo80nWHYG4uAMyTLqsBaAhpCAnuaYxumknITP4xkon6woAOokG0VmyugKo8cwLCZSwKjUDgYBiPZjlcBGEDoG2Wjie5KFed0p7uK4LgJDamb2F4DicvS9jjO8Picr8fgqU48VXmZKVpTKGVZbxMp5QVRUlX+cBcUtxVCVB2UdrBeDwTVSaSZ5ljWOWfilh4rgrFC9jfL1-w2HQ12svMbx4bu420ZNqWWTNeXZQtKobStnGQPlJCFZtkHcbxu2iVoNwzkaUmnd0PL2C1eZQukXwsr4BGBGCuPYbChZ2p6Ow0aZwo3nDLYw9BYSw8wUDSqVyCcDwSpcFIbkEijJ0yRmzj-Cyp6Uv5bK9XCfQ7iRrjXYyRPnlTJmJccdN8QzwlMyzUBsyGHNcxG3DIPzyFzg1BABPYz1RLSPLxFEjKOITrz28kI1QjabJfTTmv01ZjPM4DhtQBxa3gyDW0s-D+1iUdgsmjbhYLPMfVLDm-z3aFp53eCrjHoksRBI4vj+xr9AAGI0Ow5DcfedfB7rPDUBAsACJVxw0BI6ASvQl7fcKtfUPXjeMTrUHQW3HcIL36Dau0DQW8dKfOyCMRcg46xsskBE+M43wbxMqzJDuld1jXw4UGwY9qCQYjcaoJBdxo9ALwPdBDwH194LfdcH5PwgC-ee1A+5L0TqvZOqFeh205LjSkGwBjK3pPmGIi5brli9qrb06sr50GrjfBugDKCP2fngV+yoMCoG-mIVQs0iDfzHL-QhxC75tHISAyhYCIGqGXnoaBHkU5KXSHQcsRcEgYzalMUKkwnrOzurEFYrhYiBEvnRVaEBlAPEqNUHEf5KB9hEgnago4o4QCEfVNG0ImRF2duXdkmM-ghRmGTPorJ2RxGUqCWkGizJaJ0e0PRlxhBgAAI7cDgGxbaxVhxTlqgLYR84nBPWtN4LkuMhhvAdCkc0gxJh5nLokfxwpAn4GCdiOoq0ALg3bLHPaB0rFWzRkFc0vwfa6RUZaAiDgFh+EVnabB4w-ilPRFUbRFSNAhJxCISJ0TwYw1gG2EwFBmmoy6E7O2K5hpxBBCMdIDpNzwPSJmEiGQM4IgvCwqujAJlBOmVUsJ8zXyLOErAcgJAqgsAAKpCAADLrKFppDY5oKK-EpCRTMdgHRcgWLSa6vxCw7jsGM0o9yplmKeQOFZ-8G44G4KgKofA76vkhkVFgeAwjIASUnZJDVoQJBiHmEW7J-h3VyRRfocJszLAohyNFdzIAPKxfouoAAhVQt80DCsxfldARAQLxMsYky2GyQU2D6HC5cCtviTAJqFNkQxnqslpByfw5cbCCvKbo7FuLb7wT0XgXiNAuYQFpcjelaN-gbGZX1YuG4QQGpmE4a6MQvCrFeMsCN8RBWNn4CqGVkzbW8D1HS6xXQ7QLFUn8Tc10dwJFkW4zM+T5iqP8LpRBVy1YJQIfGyMSaRWVFTYmT1GbEBZpcMgvNwwYRFsQArPoCQfjYXIjaLqcamyJoxSm6guJ00tMzZMLtubjy9sLb1UFFpvBIpGIreEgqRQWSnm-Hu4D+6DxuQQo91Q-pbV4YvfhUDVVr3nA7PoiDdI+BGGcg+GQ6AUSLt8PqoavCCrmVE18LYaBkqhqej+56v4-1uRB6J0HqCwaKg+yBh0gUmkUWCn4ykI2TEiq4gdgzxE3WwpW5SY1rnUxQxEyDd6YOULg9QzKdCGGZSYchghqGoNWTY+SsA2Gn24ZfTAhl3UMGY1BBMDwjoCL6X6HEH9TgKKsnA7wMeVlG2YoEDe1Q4MRNQxYG2MA0FYCLwHngPD85YSDHDcuZIcJTnIIIgMFqpNVKvECOXCYOnqB6ZlAZh4AguDupKmSvAio9FFUoFIFVC71UIFhAXaEqwI1jDuhmft6XRGLFBOWdk8xLQVwY-guiQhdMtnC+0MJiXkv5XFBKFoNB7NSa9ZslxGDTknl3JSM8BE8ziMGBsFIfUuoOGC6F8xybGsiGa+DNQfZZS8T7A5hluaXDckSCNHVo3QR0C8G8Lka5ManLm-VmdS3cBgCS+DBr0y8hQE4ttmxiiANeOGOuflhNaSLC6rLG0mTKs1omsKWrIXbuyoi2+GeqARyNNe2DFLbbF0Dr+E9N08x-jQrPG7UKPK+i0gjT4H4P7q14NrTVur+m7saEjotx5vALMkDVEjnUn3NmvCxl1cthZM6sgPoEADdpxidSLuMXB-H6ew8Z-DxrNrKns7bJz+ViqxDKt5wO74Pm+obl+IMEHwaQW6WB4MRIlogg0-l2ZYzd6h7wboJ-S9jHr3HsZzRcTDwV7dfbbMDcCxPB2Fxl42x8RRuQkWJ4LTmrdxREFf8sCQF6H8EEpBNNmO0uyXNKowtbpvAg5CKFOYH6TxdKp2yHwKe08sAz9Era9QkYSWk604b4jXNl1xgFArBa+hG6hMct0VYqt07Mqn8CTes-sU0HiXPwLTRcsCCyHMnV3NRQIoyLMgQVgZjGE7e3V66IADVH6UG4dIHaZjs968ak4fppzoTshWIkHc24MgeMhLSVSQUogqIJ8odjgL8xAr8TM447958286osdH8oRxFIQRhAgI1AhyNZhboXNjxjwWRlwwNgDh5NZ2AQISAwgWwzZQJwIYYotH4BAfkQI09wYJBL8gIYYHwdcH8CAcd3hvgoQSI7ByI+pRtVh+h5hYQ9IKZwN7x-wG4YZ-l2A8Ac928esSRnMuQLVcwjd2QHQxgxFcYDsRgVhlZpCNs4A5DhIFDXxW9Utl8CAuRnBKQroBhnZWRdxeoi4nQ3hdwM5dwuo5dT8zJ6wLBpoEt2MoAddY4do3V+wuCeDFhj4BCdxVhDkSdAh3gj8SZw9sweRD0NAHwoBCUWx6ls87IjBUocAowlQdd8BXJA94DuDFYwVdwuQ8sMx-9ixMxFhVIZdkDdJKZacQCAx8jKBCjUBiiwAOxs8vxSAYBUBmYbNCUKUKhqiCg6jbD15FYnoKIdUTxdV1IZgUEFh+dVwq8WQCDIciDhjqACiiirISj2Iyjosqi4laiMcVCg9Giw0nAcwHBUDNwNwHRPBiZvBVIDlZcthCDWERQRixiJipj2JBMdRY5llVlyA4jCwIoKINgeQi4upATDUf09sP8dVc1ITLjoTYS7iZQHifwkSoi4l+A4iSItUoVdItjJhUjDiNwtUnBYRKIztPALjBirjRQqTxj7jJiW9DFjFUczEZVal3i4C0tuCMtxFyI-gx8SsuTEABgSxNV989JxCIcRTKSbjRjqTWwpTs8akuJKCG9GYEYuCRguUY0PB5FaRTkdSEBOp2QAMfi7oITZsoTbkYTzS4TJSESfwcU0T8pCViURwzMKUqUaU4jFYFhTxyIC1dx+oMCWRYQ1NTwWQNSvFBU3xkAQJyCrIwAQihMZRs9u4EM+4kNAjhRyzKyWwazFCp4-cBFdAuC+pTscSFZQR98NgHQN8ANfh5Msti5BU7wdc70uy6yW9Gy3dEMPdqszIFzhxOzay71IJezn0NjYExgWomoI1OpdJCw4QHRYR3h-gXp3N8ZhSHdodmMFk2DhJot4llDlS7Cogi4-I-iggizVIy9uS9wDkNgCklIwdpCXlkSYYfz+AbCl8U4ogLoupPFPFVEHBidDjYRnAUUlEMx9IAjPc6Incp4WAPkvlpA-l-lXd3dmFKLHdvd6z3lPlvlGKjzJMTyGo2lFhXD1N8wMgILdTI1TslFGUnBhhyTTTQyOKUTuKGKAUBBONaFSC8BGFWKtzhRqKW4oI6KeKAU+KA8BLWk1gYgi5VJWRUC-ACLdTYhcdywOQ2VBkFK3zjgRAlQRxb8W8ByMZTsfJJEohsw6QScVIYhzU3L8zTkBjvLbwSD6FmYYZ6KSA3UuEyFQII5fLKFkc44Ww5TzFFSByCcANOROojwhhOoJLZhWQnohshpzU7Bk8QyCEbwUqyDY4MqsrgEcr0AI4-xF4wBwYSqFTAIBy3gvCErpdPAbRtxdxHDgMMkFM9jBUBwCrncmc50H8RgLpBgs1i5IQCtTxWR9wssWShgiLNrtq4dWc9rYCkkg810WofhZcEFTlCxepMYnpGQAg-BD8Q8EKWMYIpUG4Xs501yWKkq6B6ToIIaFsRVzLBF6i0sMtzQ-hFJlESJxgjly4dJNxVJt4oppDnVUpRVQkYy8VKV0Bkb8AYiH8iz05cY7BVhMZ91zcfSiN5JmocwzsDwd1yaXUqacQhwRwqgKbXVSBOYosPUPj4C2QgK+ohgAas5FrCTCazty4lhWQghrsOqathxRaZk6g3wIAgIpbTbYBewlUH8KRzRORRhhhEgRl6qjUMzAsS82rJgRbKazbBxhwnVTayA1ApB8p6EAIHb8ZmQdwzsOQjC8zzqLROQEh+cdw4h-bXUnkGDr8Q6A6cAo6OBbbtc4AY6lgdIZdNwBhswDjdSuQyczylIy1Kds6xa6gabb4CUiVNRSV2NkzqUFb-yTQ94xFXh8Lro2RxgCsPRnA-rMwUgvZ2qKSmNpaO6wl169FEL1j0L5xXYWo9jKQNTQ1epsIIoTxCxFI9UV7FKBMTbKb2Z5aYtKE4ssQHsnslSXr4DyIuR5JywAScxF7o9DUQct4bdaQ4gRp272ZltHsWsKAgwOs+AH9f6FgZ7-D+C3CgTFYEjEhUhsSUgT82L3z17YGP6Ws1sZDJxUHUlTsJg-gkgcweQ7y-68Jrcby4UYGjY4HP6GbdE3sPt0bl8hD4V8tmotJdDGRxFdJdwCwkFgzV776yGjZEdMpJbeBUGQQWpGQMw7RkhcYi4JzTx-Tlxro3hf8rUjazIRAVG8qH7XVPkOBNLd7Fa0slhpHBCOklJswixDVS5xFSIfg3aXZuH7Gt7UB1dNccAFUlUedhGTQlg-gLRE6-A4QvYnKEARknoDTZHkUTdiH9KfKHHQsBA1G5ATEDpSqpqEn5wlhByRkhCLGWRYV-h-6x9LQ8KggyyKkWDWMMMB7+wvwBnRMoxInFcoAuDJy3Ro0oRbR7Ry9dbu9NxFMAHNUKKin6A3xen+FhMRm4NhnMNMQza4i7YxgfBa7FMPH3Dy8PRxF5h47ORywIQenw7dnQx9mioymdndEnGWAXGv61U7DYR3qPBX8-tpyQGZh-87ZHRz4+SizPQvRqB0B3V4AkJWzaA97rZnFiY-gI1VI1Is56QbY7ZMxs5-BjxGRbrrGylTgoxyomwIBsW0YehNUftaQNwwS1x6rCwYqPGPMTcVnrV6XzgxUWXnhFw7ZFYIUUhGHtwbQ7ZvgqXhopZXzMWAw2toNwwlQVQKh1RYwtQTNmW3GAKUVhKWRswa7t5fqwUXEAa+oXpEqNW6B60JSaSpSh4ew+wJXvIDIQqhgc0Mh9bvSJtpXkFCwYQfhkhpDtEqhGbHUvW8gODpBkBThfXuh-Ah8iYda-ARgRhiw7YAhoRJt2iBVaXNYm4mIBIYkM2ehRDyJvNvMs56rjw7RnpYRlacwEErGlGqLlLZa62fJzRLWnFYg5XYR6RTV6Gxh0JsTzjBUpo71Zp9ZcpgZRMxA62stnBlJnYnnAy-AZYUgUn6nsIQRyIvKXWtYVkjKYJQ55pw463qqMzWQ7oVgDCstep-WyLc11hK1nWSHjhR5x53VJ5b2Z5eAO4t3-WJHcTlYfjvSCxRYohyx7yrtY0K2-4AF74cqKESAh38L5Iq8lIjdNwoR6RYpxt-VM610BhrVdqzaM3oRsxFh9010zUTwgTCalhx0NhMw69MPXWp1+G1cTogWTROp+lTxWieigbub8GFhkhxDVhlYMO+32Lb0p4M2HBjxis0CuR49M4-0tUwc0DTqoVQa0M9mjntOyKXBptm38GCI3pxE3QAbsIlYbsldHqmOAhu8Oadxu3IRN1KR7ZmpMkIQuoAPNnzJNOfcBQM3bQTVIR84fAvgMDbExEkhvAQQKcc568Z8TM58vwmPnMZ7yx2blIJgB8OQyXcD-BEF33ovJ9hQwCID+AoCton3dwwQeRYhHQ5LFEv9N50JC8S0fBVh5zuqqyZR7TqDhJaDN3TX15aR3hS4IUIuouvMfhuUTwohE6jxTDZDY4rC8A63SJ+g9aPA9Hw9dD23fh2Q4UBtxY40Qi7143wjIjkK4YYit2sy1Mwd2R8GqvCYWQLRTlXg7pVFdJb64awzbj3WrSoyt3gT9w-BGQI9vhTkPC4QAMDwY1fhnYRgyyKyxAZv-n9ytPlvUJZYwRroeRhcTw8Diw+X3MFr5ZL75zGS9zuyjKh2SIC83gDkS3QRsI7zhhdvBhlFKR1XAP6AkS3lYlFywAWX4JkBdSeSLX47j6pfQgddZQzv0ZKJ5JMxvBjDVFClQgZ4E4iBdTNVzQcZteuX8IQBxioByBDfbB06TehTzf+PicVkIB5BIhyxQgFBRiPfdTZFnhStHDTeE7mp-fdDfgtezfnegD1ODLlKllVLfkAUM32SMI7R7E7o11Z6qrmRG6ZqS8NmWvim-LOvIIn22UJcpePrmoMhubjxByDcPHqvmpZeYuurYBSC0rhI+rFvuJBqoBm+7FGUUgi4YKMglqeRt1JsS4wddI7qvkdrldUZxOmg1fNIHYLQAQlF90cI9f7xDeXYdHEhnY3R9uDSrf0AbfNJzpT+q8iMwWSJQg3fI-Zg47T-g-z+ynhguIAQPsH1mCh8QA4fd3obxaZoxb+wAh2E-3AEhoT+jIL-t4mpaD86+8vD8oJERq00oatnCYNumJpKRdGteXqPqi3jG5hcgtP2IJ1sam0qkGbb6k7SDQIoaQucENILn6ByUX8Z2IIGpzvrG07GGbImFjWzDoFsSIsXqEilY4rg3aq4G0K8ySzvN+6omJ9jaGkopBcIOWA8NuFDQYIeQUQJYJVyRaZAgAA */
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
      sessionMode: SESSION_MODES.PREDICT,
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

      'Requesting instance': {
        invoke: {
          src: 'activateInstance',
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
            target: 'Requesting instance',
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
            actions: 'setSessionMode',
          },

          'Set retrain map mode': {
            target: 'Retrain ready',
            internal: true,
            actions: 'setRetrainMapMode',
          },

          'Add retrain sample': {
            target: 'Retrain ready',
            internal: true,
            actions: 'addRetrainSample',
          },

          'Set retrain active class': {
            target: 'Retrain ready',
            internal: true,
            actions: 'setRetrainActiveClass',
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
        },

        entry: 'enterRetrainMode',
      },

      Retraining: {
        on: {
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

          'Received timeframe': {
            target: 'Retraining',
            internal: true,
            actions: 'setCurrentTimeframe',
          },

          'Received prediction progress': {
            target: 'Retraining',
            internal: true,
            actions: 'updateCurrentPrediction',
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
            actions: 'hideGlobalLoading',
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
          'Instance is ready': {
            target: 'Load latest AOI',
            actions: [
              'hideGlobalLoading',
              'setCurrentInstance',
              'setCurrentInstanceWebsocket',
            ],
          },
          'Activation has errored': {
            target: 'Redirect to project profile page',
          },
        },

        entry: 'enterActivatingInstance',
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
