import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+5NjJ3Q5MZHMmkHQ8kwirYY+D4Q2CuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfCWcQKQnn8CsRwxZNIxDZN8PCcIzLGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsbLjZBaSF3S7ARQdNaYayxXApCGJNNlqUOVRqqTGt8yAQJswoEGFoNA8Akq6UEPolJNI5l+AMMtUUZhOCcEZU8ZbjxOEzsaxs-AVQ2tNVU3geoFU2K6HvFwmYjzLH6cOxA4bMJuleDuFxp4vCX29Oylic7IyLu5ZUFdiYM3rsQJuncQw7C7uzPuhAkIMhYVwuhf4lJXgZlnU2BdNyzVPrxC+hJG7zlbs-dmbSe73abq+OXb4dFvC4WNSKOyU8P490gf3QeJSOWEeqEDXaECoGqGXnoTtrVsyFlUiyOInJBrYV-dCJYWEeqMjwlyBEVbprCjfJUiQjGHI0AlXDJ8xV71IoEF+agCmpXnF4GPEMLGsbHjtBaF25Ey2EU1Rhk8XsKQbg1RhHwxqpNqBk7R+TVDFMLQsUujQamNPua01iXl+mtkK3EcraRvxoRRHdikZwsQHC-GGOyXcjnpOydDH5yV0hPMqYeL5zT0gyDOcY-M7FHBZRZTEN5V1a95w7juvuKEGRtLKTznpOEHVc5RAIkEf1xqhA6ZbLl9oAhqOqGhm5rLLA2xgGgrAReA8O01bga1KluN0LYSWBeuiEL3ZAfEZMEEOZOSaSNeJ4exwBvUF0zKYbPmuBpsqhKvAip9HlUoFIF1a6EMHqhOaUy0I-B-A0juA+PIOODGGFh+I-XBsOTu9QB573PslXFBKNtfBgu-ehDENWGljI2FhCsDDcJFjhWhLCRIfhWVX2rSxK7N2vPcqR2AD7Mc0cY5HGIdgS3vvur-aJ1S2Y1yFjCkWdr28KY2iiDCTSWxztsIZ0N6DI2RDI+hmoPssphJ9ixwL08LhlyE8tJ4aL7X-BiL+IkDcrtCdwlh9d5Xtq8tq9ZyjhHo50BQH4nrqlzheq4bQUMAN7X04uA-cgn47IlEO8ZwjgQb4Z6oBHGs+ZNqIlffg-zyEpOlixAIhFR6fh3ZsnNKfQIUI3SgjGLHp33nEe1tKyQcrlXqt8++X++iyToS7h8OsbZz0ghe23Y9KE2kTyXr-qUpX8OVc+cb8i3g03m8yCTzqX3GT+h99iEsbx+F84dQ5DvLkoIfBndpxJy7cPbtz4b7fx95i2wr5wA6p16-luZq2X3yioIfhBB3BsOkANMZM4D8GZpSH4KrJPpRixGNrRkPCRl-GRj-FPlRkRrPkxPRovCVoIh-q+rMOWEeuyMRJpE7CCu1iyPYnaLhLdAOgRMaoSmBEBAwvwOJJBKulnh3t6vuIdoWB4MeHhNuOyJhGyJsMMJsB4DDgrqUoweBCwY0rtPUGjHJCtrYkMMNFbjaLaMuLnNuFCGIvgvhN1JuPQdIRyrIcweNmwbxJoHBioZ-j8uTNkskGWuSARLCNuNulhIdqqtCGWuyMagAGrPyUBgL8DxzmLsF652xOALCsi-C7i8aJCg56SDD-AaFOwtYE4-BBEhFhHSD7SRE2HKHNQ-ZtSPQnKQgjDERF6-pRDg7eDLiSIsjLg05Xp04MzsAgQkBhAthRJMFxwPbPwCB4ogRMHQwybc5AQIwPhVbRHHjzClgsjDAyIFIXol7ZjiKDRob9p+LGo3hdEMK9EOT9ExKSRDGVQiigRKjATRLTHnHoBgJiDzE6FewyIyLoS0i9RAEUHJCqSZhDAtEeBsiOD7GHE9F9FjFnFQQXGjbXHSCnH3EwmPHPzPr2H4G2CUGAYTBRBUh4buzcYfCaQEQbjeAgn9b3j-gNwIyEo84cHollEECC5cj+DlwpJHa-pHZiIHLzAjArBqwUna5wDUmSS0mvhKHt6pxcjOC9p0QDD2Z4Q-EjonyLBvC7iZy96XJmE3oWBzRvbuZQBVZxz7Spr9jRFoLvDfBQjKx2D4S4TuwV4cZ-C8mob-DQHwpUYaAPhQDCotgrLsEuRGBZQ4BRhKhVb4Bt6cHrxlr-a7hchF4ZgtbFjkon5d5VHGTunXo2QihemUA+moB+lgAdjsFfikAwCoBszzbCoBYsBhkFCRkMn84ECbCYTYQ6EnjKwpC6QzADCTAxC0irgT6UEEa5n5mFnFm8SBmPahktIRmZ6Nkd7NkxmCY5gFw+CbgbgOieBgh4TnLDCsjjDIIjnUDem+kOT+m8SorPJIm1lxrkDmmFixTYQOKrF7kh49kjDOC9Anx254Ty4X4XYBijlnkygXk-hXnWHNJVb8DmnhaLDKz4QtmHZFq-CliRZjDeCgjeDHmnkFnnlFmKFGImKp7mLp6ASwXg7QgapV6gh-BHIliE6BBUgfGQg4V5kgWtgEXsEbQZ63EDGxJmLzEXrmgXqJATB7maS7hZLsiAaJFLDHwMTanZnAV4WgVcW8T8ofINw4DCqiojiTaKYypyrmlmZYQ7inh5hsjcYOjoR9B4SnicYaqVoAVsINpNothgC6mvjEbdxIF9woEwE2RuViDHEyieU85TxYECIrx4GMm4TDQOKdm-6EQbAOg5gqq-DuJUXFz7EtK0bhXeUtw-i+V0DfwUYeksR3jQUeVeW0aQRRU4ExWSnwJjC4ztQXoF4mRwjaqbz-BvRwjH5tGoH06PJoo6jGl5VmmxVNlRD0QhRrmFioaghFp7gjAggYTiVvSwouXT6jXXkTXQVmklEdIYlRDXTnIHkHnkQJY9VfkmF-74RfoEboEyivLYq4oEqEqIGlXIHlVZnChwFTy1nvXSCfUNUPBNVRnzjLBZiMgZhDCJBQjvker+AOznJ9W7gDVSE7VoE0ZA1Yo4qg1EoCA0J5T0KMJ5TMLDXZkvVxwE0fVErg1Ma6B67LBHqFh8HhqBBKkeqMiYSMW4QyIc2BAUlKgjiFGKHREZlOFBSSJRDZh0gUF-KUx-ZAZ-D4RgmwDdFswIyE0kCpoUI6LPxe4PISrJ7xwtgkUWIZ5S3-D+7caESLgrBBDbisiYS7i-4q12BRCa3a1xx60G2gI8Im1-iLxgDQxW1kUNmlFNmbZOgYWrAaSeA2ieF4SqTfCxFugTAdnGoDhULJ517M564jDXSDB2jnJSKBD5ysj7hUXhYI3Qi5353wG34SlQ2sZ3S4xR4ZBIJ4SFjAFzWMgBDU6vAbhDWBXCgQUp5WoNzx4lVlUsIVU2RT0wQz1M5IpM0wLTUd4aoLB4R8l4JqzjDaqH60GaRwipAUlJpZQ8phKaWCoJq5amms3WkWhi64Q96pVuJSKLBmYArHieBX3Jq304hDgjhVDX0pqkA8wPbpoLkmjLjsYn4+CEQkn-DFjYQhROC95JDHhAM30LJ1BvgQBAQQPAO1m9hOp67LhQjDS4SOioM2htY9lcju2MUoMQinj4Mpr3JgOJrkNFZs4lQMIATUNmTgrly4kDVOBpWbjDQxTdI9aIPcMgN1CjH5H8MEM4AiMcCwCUNVawBiObzYTILoTo2xAhB6QiZgi4RBSUiPS3QqOEOxpaVCoiqajir+bSBGVwMx0d46FkiUoFJ8kJCgrmgJGQGbgkFOMorDjkNVBPLorzl+MIPlr-KJDIIpDILZhZIOAUzlh2k6S-4xMxpT0YpQT01E3Erb2kp3SW4I0yLjB2iE4DQeALDLhxA+DIJJaZkdGT1xM31cyu5s6kMDM0ACB5De6bR674Qshbr444R9LI0IAVr+5fFD3CWMgqNDO4Bu7QxkM30CAv6OqHUzNZz9CjoDqJEpA2VyOfoX2fT4LbMmywNPZUIvaBbq7JMnVlFQo9IFPaT9p0TxAOivDkwsjhYjAjLjDPORzDMo4tqSic5nOBDggZK94ZCJBbnsbQve1tPgZKX9OQM3Ys4jOo6troDtosDc6vhnMTBbw7pEz9L0itFggXUsjZjjCnj26EuXZjMkvwsa7GKUmThnNyNBCIM-BOwnjao5i-10SEQnjaQEK8v0AiDEs7NfPr16KTM+41Pzh2n2Liw4aLgkxWOghgjlibBR4ETAqwsJ5r4P4zMghHwIUVEZIOCBpiKrDqTeBBAcv2vqvkNlYsCk3lJ67yWKw7i-CBBd7i49mlyeKZiUqnZ2iBv8sP7L4cDHNv7R0-P85LAqTeBpKERZ2MhpUrBexOz-7q3nL2uJ48Ap4ozW3kX6utTArcmMiFP6FyIo3pFESUiWjXVBCpbFauaZZwz5ZeNRioDX7RHpWqnLBA7aGWMzA7jfAHabjZ0At-CjsfbpaeNZajYc6UtipP5qiNrc55tuqLkcuLB+CYWSIZgDDbjVH9DJAFyfC2vj1L2SZpbjsFZTtTbnBBZttYzNlflzAjAYS8lrDLMOCETiJnXzCnynqgmqt0BOb7sAdeMJ7-shIhthvXu1a2ywhd2SEe0y4bzbgrDgscgftOA6oBEYfBWhXktIunt4CksIsnvtoTMYBTOiNgddD-Dg42hlrqLJ3E5uLKTiJunUhDAxk-TtGX70CsctiIvo6cfHsUtUvnsyCXuUDEeqEie0h9DmbaQ6EXrbYDTJBiKE4ZgbxODFOIjUCPFwAGgT20Dt3gcyKk6SwXraQ6TZz0gxHBoIWIOPSAHlyRqnBRg1RNgQA+fPDe19C4S0gbjaRBd2gsvkxQqHmvC-A7iDCxflCBaXDJeBSDAOzkQSL6GK1rs2jkzfAANjSyw-v-XHCBiSgthhgKhKgqgVDqixhajjZJfwPwLFfwUcv72rndmOH-YXxD00FNcQbzrjme4Cg9h9iVcLhzPnKfpUgsjHfbgVrgp-CFgwhSv-kqeAV0AiA6JVD4DSroCbfdh5CzHSDICnC7dMnGRYTqyER9IjAjAYOCZI0bCMp9S5XsTZZcSQW-cFp5e2OnZZPH2pFpNSJEzHaFvPV40OTQOI9Bdb4-rYMpCU70isgiWAmch+pjAOYYezS0aeagxFTgxZZiC-dUXODn1l08hbbMM-KI25rArAa2Y3fU3Cg6zvJFUwRhxLQRy-ckkLAETEEExSL75uLiPZLq3rBOXGqjzjxpqTyy8zy8Adxc-0edSNPbrrkl4gjiJ2jynCaggG8kIPxtCG1vxE9jpfEEQnhkr1EstDRKIDDRvHg6SRr37VK7ejp9AwrSLdLnLdXmsdSuHqnifXVrd3rR+8C7cc1GSZjeBSLjTLOj5tXqRBBlrAt4R48HuQS7ect9BMWqxWll0OmbH6q-CKc4Zpssf4dyYTtSo5a36N-ZIuBAaDrMqC+d6IenIbPW5iY4307X7asJI3smgIUiWEQZJWWrA-AxZz9Z08joSqx18t1MS7cfSqQ4lgbOJj0l7XSPQQvwjKKu8YcWHUtWFNKx82j9BJAnZHo4UHmrMD879k3QR2Y8NyCX63c2EwRKYuNgiK7Qleu4S1tg0dDOclEp3B3rT1My28OqvtI4pCTuKDEUSnPCbrbGg5ssB0eefCNuhn7SIyQ6NN4GQXQiCkqSccMUngF+7w132LINppIxybmsjMdBLkPEU0gXpZ0upWjE9wNJGkEYJpWBlzw9rTcUkTFf4FCAdJzN3QMHciPGW2qwDSkOZE8uxVUqcUJyX4LntuX3B+JnSOYPPK01JzYQggolSLHYA659Njg6nByAVTqrfgrBpOO6DyELDvEWixYdjANWTpKxaIuVaqj4NqpTxEeysc0HdDEF21B26EbVMMH6DJFPAo9G0BSUSbjUFBk1HzvBGQAeoNwzfNBJhUy6eBQgVWWUNwOxgYV-ingVBrhnGShAZ4icIgB6kJzmh9Cp6UDIMBDwFkoA5AZobYASAyki+HQ8iF0JADvIIA8gSIOWFCAKA8ykwj1CRGeDlg06G4dofyQWEZgUK1QgYLUK3bodl+NNfHq9UxQg18URKXbslns7+sRosITQVYxSC4wCm58QnPLWU6S8+WYtJAQ3woG+cAUAPUYd3WBIz8p0BhUkOMHEoKtCBPRf2hcEDqCRg6UAJXn1S9h+Efh2kDaiAKViIJ8wCQciEw2MhN0cULdZ3OvxI4GZRCMQURNvGVisgZ+7UMRMSU9Rxl2QvTVTvdz2riRoIa9BHGP3pZ5D3BkhS6qTGujlxSSIQlKv7Aw5BsCGMfCEV0AyAlh+CEwU5BXWWpuJzk5MRcJMGPjCUDBwItVvy2lC7d1Y5oDCDmA6oQFYgA0bvr-RXAZNVwBQ-vmO165D8wASvP-irC5CwgLOmYbcNOmwQ6pQ0BaE8I5kvZsdNOnOF4fqkWDMoQ0mRVxCOkQbghtyAyK0lWGyCZAgAA */
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
        drawFirstAoi: true,
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
              'setCurrentTimeframeTilejson',
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
        entry: ['refreshSessionStatusMessage'],

        on: {
          'Mosaic is selected': {
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
              'updateAoiLayer',
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
              'setCurrentInstanceWebsocket',
            ],
          },
          'Instance activation has failed': {
            target: 'Redirect to project profile page',
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
