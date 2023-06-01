import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+5NjJ3Q5MZHMmkHQ8kwirYY+D4Q2CuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfCWcQKQnn8CsRwxZNIxDZN8PCcIzLGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsbLjZBaSF3S7ARQdNaYayxXApCGJNNlqUOVRqqTGt8yAQJswoEGFoNA8Akq6UEPolJNI5l+AMMtUUZhOCcEZU8ZbjxOEzsaxs-AVQ2tNVU3geoFU2K6HvFwmYjzLH6cOxA4bMJuleDuFxp4vCX29Oylic7IyLu5ZUFdiYM3rsQJuncQw7C7uzPuhAkIMhYVwuhf4lJXgZlnU2BdNyzVPrxC+hJG7zlbs-dmbSe73abq+OXb4dFvC4WNSKOyU8P490gf3QeJSOWEeqEDXaECoGqGXnoTtrVsyFlUiyOInJBrYV-dCJYWEeqMjwlyBEVbprCjfJUiQjGHI0AlXDJ8xV71IoEF+agCmpXnF4GPEMLGsbHjtBaF25Ey2EU1Rhk8XsKQbg1RhHwxqpNqBk7R+TVDFMLQsUujQamNPua01iXl+mtkK3EcraRvxoRRHdikZwsQHC-GGOyXcjnpOydDH5yV0hPMqYeL5zT0gyDOcY-M7FHBZRZTEN5V1a95wYTBUFJY0JdyZnlhpYafrCJRDdOcsTV9q0sSEDplsuX2gCGo6oaGbmsssDbGAaCsBF4Dw7TVuBrUqW43QthJYF66IQvdkB8RkwQQ5k5JpI14nh7HCG9QXTMpRs+a4GmyqEq8CKn0eVSgUgXVroQweqE5pTLQj8H8DSO4D48g44MYYWH4jGpu3drz3KHmfe+yVcUEo218GC-96EMQ1YaWMjYWEKwMNwkWOFaEsJEh+FZf1iT13hsOQe9QFHYAvsxwx1jkcYh2Ard++6v9onVLZjXIWMKRY9KwlwhTG0UQYSaS2JdthCORvQbGyIVH0M1B9llMJPsOOhenhcMuYnlpPDRal-4MRfxEgbldsTuE8Omf3fVz5zX7O0cs9HOgKA-FDdUucL1XDaChgBql+nFwH7kE-HZEo53t21e2ry2+GeqARxrPmTaiJP34OC8hOTpYsQCIRUen4d2bJzSn0CFCN0oIxgJ8RyzqO3nzFlafJV6rAvvl-vosk5rLJzMbAvc9IIXtt2PShNpE8l6-6lNV8zt3rPa13N4LNkgao086gDxk-oPgNzlxA6O-OHUOQ7y5KCHwF36dXfoAv13yexsr+RWvtsG-7WOqq9v1bmatn78oqCD8EEDuBsOkANMZM4D8GZpSH4KrLPpRixBNrRkPCRl-GRj-HPlRkRovkxPRovCVoIj-q+rMOWEeuyMRJpE7CClLoPqpHaLhLdAOgRMaoSmBEBAwvwOJJBKunnj3t6vuMdoWB4MeHhNuOyJhGyJsMMJsB4HDsrqUqweBBwY0rtPUGjHJGtrYkMMNLbjaLaMuLnNuFCGIvgvhN1JuMwfIRyooewZNlwbxJoHBhob-j8uTNkskGWuSARLCNuNulhMdqqtCGWuyMagAGrPyUBgL8DxzmLcGG52xOALCsi-C7i8aJDg56SDD-A6FOzaQRTy5hERFRHSD7SxEOHqHNR-ZtSPQnKQgjDERl6-pRCQ7eDLiSIsjLh05XoDYMzsAgQkBhAthRJsFxxPbPwCB4ogRsHQwya85AQIwPhVbxHHjzClgsjDAyIFIj40HZjiKDRob9p+LGo3h9EMKDEOTDExKSRjGVQiigRKjATRLzHXHoBgJiDLEGFewyIyLoS0i9RgE0HJCqSZhDAdEeBsiODHGnEDFDFTFXFQQ3Hjb3HSCXHPEImvHPzPrOHEG2C0GrATBRBUh4buzcYfCaQEQH6sh4Tw73j-gNwIyEp848HYlVEEDC5cj+DlwpIna-onZiIHLzAjArBqw0l65wD0mSSMmvhqHd6pxcjOC9p0QDD2Z4QAkjonyLBvC7iZy7jnI-TdEM70D1gWBzQfbuZQBVZxz7Spr9jxFoLvDfBQjKx2D4S4Tuw14cZ-CCmob-DwHwpUYaAPhQDCotgrLcEuRGBZQ4BRhKhVb4Bd68HrxlqA67hchl4Zh5HFjkoX5951HGR+nXo2QiiBmUDBmoChlgAdjcFfikAwCoBsyLbCoBYsCxkFAJksmC4ECbCYTYQGEnjKwpC6QzADCTAxC0irgz6D4EYlllkVlVm8QRnPYxktLxm54dk95dnJmCY5gFw+CbgbgOieBgh4TnLDBUnHzTnUBBkhkORhm8SorPJoktlxrkB2mFixTYQOKbGnnh7DkjDOC9AnyO54RK435sLFlXmlk3kyh3k-gPn2HNJf7prrnrzhaLDKz4TdnHZFq-CliRZjDeCgjeCXnXnlm3mVmqFGImKZ7mLZ6AR2nS7iKYU5iUigh-BHIljE6BBUg-GQgkVQVkUwUUXcEbQ56PEjGxJmLLEXrmgXqJATCnmaS7hZLsiAapFLDHwMRWGIEznQWtjCW8T8ofINw4DCqiojjTaKYypyp2lmZYQ7inh5hsjcYOjoR9B4SnicYaqVpgWlINpNothgAmmvjEbdxoF9wYEIE2T+ViDnEyhBV85Tx4ECIrxEGsky4uKwgZKciEQbAOg5gqq-DuLQgTpyG+Ucp3hf6BXBW0bcFhV0DfwUb+ksSVXDjVWJUtxfjJUEGpWynwJjC4ztQXol4mRwjaqbz-BvRwjn5dGYGDaPJoo6hWktL8DMmVGdlRD0QhS7mFioaghFp7gjAggYQKVvSwrlXzVPLopPnPatIymJnwIennJUlUnkQJbjUAUWFAH4RfoEbYEyivLYq4oEqEqoENXoFNWFnChIFTwtlA3SAg3dUPC9UPVKraRZiMgZhDCJBQi-ker+AOx6klz-AZBlUGm362Q0aw1Yo4oI1EoCA0J5T0KMJ5TMJzVFn-Vxw03A1EpI1Ma6CG7LBHqFhCHhqBBqkeqMiYRcW4QyIi2BA0lKgjilGqHxH5luFBSSJRDZh0g0F-KUwA5AZ-D4RQmwD9FswIy00kCpoUI6LPy+4PISrp7xwtg0UWI55q3-BB7cZdbQ4EQhCZGsiYS7iAEG12BRCm3m1xxW022gI8IO1-iLxgDQxu10XtnrUbnbZOgEWrAaSeA2i+F4R0GcmjATD9nGoDhULp5J6t5rUdLEEjDXSDB2jnJSKBD5ysj7glXhbY3QgV1V3IFL73UoXzjHgeKx4ZBIJ4SFjgFbWMgBC06vAbizVRXCjwUZ5WoNzN71WNUsLNU2Tr0wSb1I5Ip80wJpWC4aoLB4RCl4JqzjDaqn6MGaRwipA0lJpZQ8phJGWCoJq5Y2mC1OkWgS64TNZ5VuJSKLBmYArHieDv3Jpf04hDgjhVAf0pqkA8xPbIUZ0mjLjsYX4+CEQUn-DFjYQhROC6lJDHjwOf0LJ1BvgQBASoMIMtm9hOqG7LhQjDS4SOhEM2h5x6Q7nB1cWEMQing0Mpr3LIOJosNFYc4lQMIAQcNmTgrlyEnTVOD5WbjDQxTdIETAF9bk0q7DgsP3KTHFEyO0M4CKMcCwBsNVawDKObzYTILoR6mxAB3Dlcn-JBSUiPS3QSOIN8ovlCoiqajir+bSDWXYP11VEGFkiUoFJCkJCgrmgpGwGbgUGBN0MPJoM8pXXf59WtR0RGagOK4pDILZhZIOAUzliuk6SAGBNcwe4c5MMmOf0CB5B+6bSG74QshbqE44R9J40IAVpB5-Hz0yWMhNMmwtNo7MMdM4AOpOr8C9NZz9CjoDqpEpCuXaOfqv2fT4IzORxYMvZUJvaBZa5rk4PzhQo9J1PaT9p0TxAOivDkwsjhYjAjLjDHNs6tPo6troDtprOBDggZK6mk263DlkxexugDBuCTDgbaUH3tPNyRxzOc6AvtosC86vhrMTBbw7pEz9L0idFgjPUsjZjjCnhO7Itr2ot3Z-No4660mThrPaNBB4M-BOwnjao5hQN0SEQnjaQEJ0vXYMvNO4Ce7Qze5dP+4X18G52qTiw4aLgkyCOghgjlibCx4ETAq-Op55QoO8C9MghHwYU1EZIOCBpiL4ndQjSUu-MiB5MsDt6M3lKG4aWKw7i-CBB96S5ePeCeKZiUrnZ2hOsMuPrmJv4cBLOf7OqeuhQxDAbcVugTAvOCMeiwu0jAHG3nIGszxyCmLHTu30UKsmjAr8mMj1PGFyL43ZFESUiWhvVBCpbFauaZZwz5aRNRioAu7xEFWanLAg76GeORDYZHabhl0PN-BttfbpYRNZbjZc5AtioxsyCNq87p2xOdmUuLB+CEWSIZgDDbj1H9DJAFyfB6sr372SZpYdsFbdszbnBBbluoR44Fosr1bnJrAjMOCETiJRAaRBC4SnqQliv0BObzsPuRMCBQcuYhJusip5Tbtuobmwi4xhTQggjy4bzbgrDvMcgXtOA6ohEQd0AxVxUAuSjc5MuYs0ert4CdMYDdNKNvtKqMU2hlrqL52k5uLKTiK+nUhDDJn6ns2SabtUctoMftrLtYtrvv5OQgSUCoe1ZKq0h9Dmbo3E4Xq7YDTJBiI6dFU8iFLnVGPz6RsooLWPlc3w34pEqC13Q27Y0yLjB2jE4DQeALDLhxA+DIJJaehejUCvFwAGir20Co1Yx2wJDHmg7Sw6TZz0gJHBr0RxABA17+zkcYhRg1RNgQCRfPDh19C4S0gbjaTaRvBjujPkxQrjB4QbjUSDCRqnC9u8oFeBSDAOzkQSLGFQuRA2jkzfCwNjSyw3tQ3HCBiSgthhgKhKgqgVDqixhaiTb5cj22wulHqg5JNCPgGA4Xzz0MEDcQbzpzk+4Cg9h9jtcLj9O9bDBUgsgPfbgVrgp-CFgwjcugXmccoiA6JVD4DSroBnfdh5CLHSDICnBXdsnGRYTqyER9IjAjCkOCa40bCMp9THFNwcRiRNKQ8Fo1egfnYVMP2ZHlpeywhEynZLDX5feIGc0YO48Vd74-oUMpDU70isiyWgmch+pjAObkezS0aeagxFTgxZZiCQ8lXOAv3N08g7YCMjo425rArAa2affidBy6ydUwRhxLQRyQ8UkLAETkEExSL4T5w3fMWvAegXzGqjzjxpqTxa+FvtzwBrdRc8hDRTpKXqQZgV4gjiJ2jKnCagi28kIPxtC21vwM9jp-EEQnhkrNGktDRKLwvxZOfU-q-XKP53Jtdu9dCjp9AwrSLdLnJjUasdSeHalcdvXHd3pL5RtXci1GSZjeBSLjQjOT6DU+90S3TG1-VU2dVXdUt9DcWqyOnN3um7H6q-Aic4bhvkfwcLuWVSo5ZL5D-ZIuBAaDrMry8HofQB9sXeGqyN413cpXcYWyWEQZLOWrA-AxYAenKTN26GOZ+U0LtDxXf7+asgHmRw91t-osh3gj0D5vCGUQh9yONhHFnYRx558fkNofoEkDOyPRwoEtWYDIj6CvA4WOkeiMZBf7hd6A4ROYpNhiK7R9eu4LVhQ0dBOANg1rTIhkCrzfBTM26HwKsEjpnFYSTxUYhiXF6wDTQX0YaAOiLz4Rt0u-P9Lfy9h6k3gVBdCKKTpJxwpSeASHljXPYsgvOajKphqyMxMEuQyRTSBelnQmlaMf3c0paQRjWksGEvEOuhXGBQpzMBed0v03dD1ZyIaZMzq-wgqkVTukECXkeX3B+IvSOYIvJ53JzYQggclSLHYDG49EJOAVByAlRCqD9eBXZRkGCDuge9Vg8fIIMWHYzTV86SsWiBjyqpxCaqU8XHsrHNB3QdBXtJtuhG1TDB+g6RTwEvRtA0kCmGKRCq0ki7wRkAHqBrtYNPSgZBg4eKrLKEUHYwCKwJTwEQ1wzjJQgM8ROEQA9TE5zQxhAYWV08ChByyUAcgGMNsAJAFSLfaYeRFmEgB3kEAeQJEHLChAFApZHYR6hIjPBywRdDcFMOFLHDfeGrXCqsMIrrDwOF1DmgPwBqYo7OINK7slkM5BBB8jIewYIxSC4w6m58YnNrTE74C6AIgJWiQO8FJDZatrUTOXHIHglRBU6EwqSHGAKVBWbAgYtHQuCx1BI8dKAPr0mpk84gcI7SCdVQFKxEE+YBIORH4bGR+6OKQetn3OhocTQw-ZNi-VAZ+dRB7UMROSU9Spl2QBZaIeKwKZH1BULOdfgSyaGRDZCL1UmNdHLgH5CwFJMYCiNvbisXW1SRvo6C9h4M1YcuVWNU3JiLhJgx8GSm4NRHOsEG0oK7urHNAYQcww1GArEAGgz8oGK4RIKdhgJzsEOcmTtuVH17wCVYXILKjpFayZFp02CHVKGk-bKjDSFHSTi2Gk6Y5GOYI-VIsGZQhpciriEdHg3BBHkBkjpKsNkEyBAA */
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
            target: 'Prediction ready',
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
          'Activation has errored': {
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
