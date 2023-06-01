import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0CK5pfhQhWN4jwcs9JKIWH4VwKQXRLEZD9b018q5lMgHM8x1ThBgHqY06GCNYBthMBQDZotECrAGFhdkbJ2pLAIg6Y8ZI3gyPwv4BIFdil-VKUEyp8yXl1Iaa+T5klYDkBIFUFgABVIQAAZf5JoQSZhcD8OE8xbr9T0oMp08wxpQnoho5FdyWJor0S8gcPzOElW4KgKofAH6vlhuVFgeAwjIDacnTprUz7k2MndDkxkcyaQdDyTCKthj4PhDYaZpRZnoueQYuoAAhVQ980CPItSVdARAQKtKse062mzEBnwlnECkJ5-ArEcMWTSMQ2TfDwnCMypqHkVP5VawcQr77wX0XgYSNBeYQEVejZVWNlxsgtHC7pdgIoOmtMNZY5zVyTW5ale5fKqmJrfMgECbMKBBhaDQPAlKulBD6JSTSOZfgDHOVFGYTgnBGVPOc48ThM6xsbPwFUDr41VN4HqJVNiuh7xcJmI8yx+njsQNGzCbpXg7hcaeLwl9bn1pYkuyMq6nmVA3YmXN27EC7p3EMOwh7szHoQJCDIWFcLoX+JSV4GZF1NhXea-lb68QfoSTurwmEf0Hu0ke92u6vjl2+HRbwuFY0ijslPD+PdIH90HiU+5pHqhA12hAqBqhl56F7a1bMhZVIsjiJyQa2FAPQiWFhHq1zy6DFjW+SpEhWMORoFKuGT5irPotQIL81BFMyvOLwMeIYONY2hUuF25FzmEW1Thk8XsKQbi1RhHwUmZNydDJpqhSmFoWLXRodTrnpWYgWWEAzXRYSMnEcraRvxoRRHdikZwsQHC-GGOyXcjm1CycYwptzMqPOqYeD5rT0gyBpdY-MglHBZRZTEN5T1a95wYRSC4LD-xYh4RCG45WuM-DYUIlEN0aGER1umsKIQumWy5faAIejqhoaZb8ywNsYBoKwEXgPHtNW4GtXpZ1nkbwpZ0Vhe7MD4jJgghzJyTSJrBvD2OCN6gemZTje81wbNlUpV4EVPo8qlApAeq3Shk9eysK9D6X8DSO4D48h44MYYeH4ixtu-dzzTzXlfZ+yVcUEou18CCwD6EMQ1YaWMjYWEKwcNwkWOFaEsJEh+C5Vfe9NkEdjfgxNkQqOY4Y6xyOMQ7A1t-e9fpSEOT52aRPFRdI7taTmjORcvB4w-jw9Gw5R71AUdgG+9DNQfZZTCT7DjoD-h0PLmJ5aTw0Xjn+DEX8RIG5XbE7hIru7zPHV5bZ+rtHKvRzoCgPxfX9LnC9UI2goYIbjnp0a5mZBPx2RKMd4jlXAg3wz1QCONZ8yHURN+8hgXkJydLFiARCKj0-DuzZOaU+gQoRulBGMOPzuvOq8baVkg5XKvVf5wCoD9FknQl3D4dYytANgbBORIYj0oTaRPLev+pSmfK5Z95pvzzeDzZbzIZPOo-cZP6P32ISxvH4Xzh1DkO8uSgh8Jd+nQ2btK4ewvxv9-X3mLbGvnALq3Wb-W3m4L-fKKgh+EEDuBsBLm4sZM4D8GZpSGcqCNPrRixFNoxkPBRl-FRj-DPnRmRvPkxMxovCVoIl-p+rMOWGeuyMRJpE7JCsciyPYnaLhLdCOgRLGmSmBEBAwvwOJJBJutnp3v6vuCdoWB4MeHhNuOyJhGyJsMMJsB4HDldmwsweBGwY0rtPUGjHJBtrYkMMNNbjaLaMuLnNuFCGIvgvhN1JuIwbIaUvIawdNhwbxJoEhmod-oCuTNkskOcuSARLCNuPulhCduqtCOcuyLGgAGrPyUBgL8DxzmKcH652xOCnJRq7iCaJDg56SDD-BaFOzaQRRRCOAhFhERHSD7TRF2GqHNT-ZtSPR9Cwhci043qBCAZRCQ7eDLiSIsjLh053rX63jsAgQkBhAthRIsFxzPbPwCDEogQsHQyyY85AQIwPhVaxHHjzClgsjDAyIFI3ql7ZjiKDRNYAF2ixo3i9EMIDEORDExKSSjGVQiigRKjATRJzFXHoBgJiBLF6FewyIyLoS0i9QgEzBpK4wbgTBjBBCHJ4RHEnH9GDGTGXFQTXGTZ3HSAXFPHwkvHPzvqOGEG2DUGgYTBRBUhEbuz8YfCaQEQbjeBsh5EWH3IiA65wANwIxkq85cFYkVEEBchOhRABApKnaAanZiLII04jArBqzw73j-iMmSTMmvgqEd6pxcjOCDp0QDD2Z4T-GAonyLBvC7iZx97ZiLoWBzSfZuZQBVZxz7RZr9ixFoLvDfBQjKx2D4S4TuyV48Z-DzB-rZg8gkYaAPhQCiotgrKcEuRGBZQ4BRhKhVb4Dt7cHrznLmhOA5gFw+Cbik56TJZcm0jelcjGSwEop0Z+mUABmoBBlgAdicFfikAwCoBszLairaYcBRkFCxlskC4ECbCYTYR6EngdZchQqTAxC0irhT7UG+nUD+mBkOTBm8ShkvaRktIxlZ5tmd4dkJmibJnF4ZjaSh4zDjA0p4RobDCsjjDILjmTmlnTnlnKFYofKoksDfK-LkA2mFixTYQOIbFHm7k+ojDOC9Anz254RbA0nwFFklllkVm8S3m2HNJVb8A2nhaLDKz4Sdknblq-CliRZjDeCgjeDnnFlTkygzk-hGImJp7mIZ6AQIWQ7QharV6gh-BQoljE6BBUjfGQj4XgVXmQUkVLIPHDGxJmJLE3rS7qoTBHmaS7hZLsigZJFXLIIMQgU2QihgWEWtjXmcGCpPkipiqaiSpZbSByoKo2lmZA74Q7jkRsj8YOjoR9B4Sni8Zaq1pX7Xb0AtptothgBGmvjkbdwoF9xoFwE2TuViBnEyheW85Tw4ECIrwEHsm4TDQOIdb-6EQbAOg5hqq-DuK0XFxHEtKMYRU+Utw-h+V0Dfw0YFksR3hwWeXeWMaQTRV4GxXynwJjC4ztQ3qF4mRwi6qbz-BvRwin6dHoEsTQU6gWn5XWlxXtlRD0QhQpmFjZjaRtZ7ljBZisgbBjIZJ+DinvI4r3kvatJylxnwJuloYnknnkQJa9V-lmEAHmUGlKXCgIFTwPkEpEqkpkrIFlWoEVU8rKWYEyhfLvXSCfWNUPDNUnUqrLUuCMgZhDCJBQjfkIAZUOxob9W7iDUyEuVsIvXFVvWEqg3koCA0J5T0KMJ5TMIjUA0MavX4qE0krkrg1sa6D67LBnqFgCHRqBAako2MjoZC7sgeAciBDilKgjjFHKGxF5kuFBSSJRDZh0hUHAqUx7JgZ-D4SQmwB9FswIyE0kBZoUI6LPze6vJSop7xwtjkUWKZ7S3Na+HpJHhj5BDbisiYS7j-6q12BRBa061xz62G2gI8Km1-iLxgDQzW2UWtnlHtnYR2jan2UEQeBQbeF4SqTfDxFugTC9mxoDhUIp717I764jDXSDB2hoZSKBD5ysj7i0XhYI3Qi5352IH37HUrkmjHgeLR4ZBIKtZD4bEWg8jqKBCvAbjDVBXDZvLYqp52oNwJ6lXlUsKVWM5T1KHQSz1I4WrM0wLTWd5aoLB4Qil4JqzjC6rH70GaRwipDinppZSWphJaXCqpq5ZWls0OkWhhRAq95pVuJSKLBmagrHieA30Zr304hDgjhVC32ZqkA8zPY5rt3zjLjcZn4+CETkn-DFjYQhROB95JDHggN30BaJ4QBARQOgMPm9hur67LhQjDS4SOjoM2h5wZlcju0sVoMQiniEOZoCrDhpoUNFYa4lQMIAQ0NmRey24EmDVODpWbjDQxTdIESAEDY42z7DgUMvITGFECNEM4CiNNlUNVawDiObzYTILoTo2xArU+rlxgi4RBSUiPS3Q8NgN1CP33w4CiriojizZKZGUIMx2d56Fkh0oFIikJBQp3Rbx9JXVkGuPEMiDQOWp7Wf4tWtR0Tx24SJDIIpAKW829TkyxDljOk6T-6uNcxu4a5kMaN30CB5A+6bT674Qsh7qE44R9LI1j4B6-GMiF4MUVMmxVNo7kN1Nv6upwWBMdKEEtOFyTojpJEpA2XyO-pX2fT4KDORzwOvZULvZYi4Du7R3TMVHwo9IlPaTDp0TxAOivDkwsjhYjAjLjCbNq7VPo6droDdrNPF7ggZJ94ZCJAOhkxexugDBuCTDQZPU3a1PNyRzDMc4fPdosA86vjfMTBbwHpEz9L0gdFgjnUsjZjjCngO5Qv0BJOgOVMHNvNa4SmTjfPyNBDIM-BOwni6o5j-10SEQnjaQEKkt0Dkt32Uvs5ASe4NO+670mjOn2LiwEaLgkwZmghgjlibDR4EQQovNJ55SQO8DNMghHzIVVEZIOChpiKrDqTeBBAEsvMCuZplYsCk3lL65XKKw7i7Jg7sj8mlyeKZh0oXaHF8s2v3avLJNP6r4cDjMf5HNeqd777JIcgjBQjnYZhAsYQuBC6RRKySYBswtBuatyCmLHQ21UUSvzgQqCmMilOGFyI+r754zV6WhXVBCpbfbOb6V+b5YGVRioC36xEZUJ08tQi6E2OzD4bHabjZ3nMK58vSbFYZa+ZwyTac6fMSov5qito85Ru1a2wEuLB+A4WSIZgDDbgJv9DJAFyfBqvj3L3CgzsttzsFYdtzbnBWo2l-lzAjD1ZoZrDI0OCETiJRAaRBAOPeDUlqP3K3vpYth+PlSJ5OZ6J2sOubvqHPCwi4xhTQggi5EbzbgrB3Mi30ROB6pBHTvrthXvOShc6vNo4doUfLt4D1MYCNNiMlsqqwg5IqzqKeBOMDTKTiL-AchvBDAJk3LU03ukctg0eY50eLuIsrtr5OQgSUBIdOEo20h9DmbLXE43o3rDvONiJadZVD3lOIjUAvFwAGgT20BQ1Yx2wJBgiSw3raQ6TZz0hxH46H3YUDCzMieWelCnBRg1RNgQDWfPDe19C4RS5plOd2g4tFOPSnmvC-A7hZtge8r+fPuXAheBSDAOzkQSKGFK0zA8vkzfBANjSyxXv-XPUY5QfhhKgqgVDqixhajTbBeIO2xOlnqg7hPJm6QTrYNOV9N0E2j5lVcNiwYQVe4Cg9h9hZcLitP9bDBUgsgrfbhj6SN-CFgwjMvAWpcr06JVD4CyroBTfdh5ALHSDICnBzccnGRYTqyER9IjAjBYOiZI0bBsp9R5XsTSBiRNI3elpxejqjrZzDtGZeywhExnZLCX5dGuW2S00OSwMA9Oc74Aa4MpDU70gbXDRDDjAZ0ywOZ8uzSMYeagxFTgx+ZiA3e0XOCX1l08hLAl7tYNaFgQrga2a7dw9sI6w-L40GzhzSg3fkkLAESkEExSKH5uISPZIa3rBOWxqjzjzZqTz8+zzwDtc2c8hDRzqSXqTJvK3mjAaqnXKgiK8kIPxtBG1vwo9Tq-FJ0RebhQg4tDRKJgvxZ3QDCxpL4BZzeTp9CIrSLdJoY9UKsdTuG6k2jnKbgwbLqb0IbnTRsmic1GSZjeBSLjTI3j7tX690S3Qa0kaA27RzeEt9CsWqz2ll2uk7GGq-BCcEb+t7c3twdQfzvZYqb34l-ZIuBgYg+I0xZ-uQgMWeGqx17z4u4JJJ91YZjS6EQZJWWrA-AD9G9Z08joSj98t4135MRzcfSqT4lQbOJj2l7XTxdfRkw0iqPc+WHDGKEwV+82j9BJDnaPThS81zB9CvCgs6QEcktN-HChFZi02KIsX015KRdwSrXBo6CcCbVGiGQcvN8FMz7ofAqwX2qcRhKPERi6JanmAMChfRhoI6fPPhH3QsMASi-L2OjTeAUF0I4pekvijjgyk8AN3eGqexZAeAMwbDXmmfDBAMFaiQFKWIaWNKHdTS5pBGJaXgY09zK-QKDBCkRqaRh2kIVphkBUTOMUKPtTfqpUvJEUNK34Gnp4Hs7MNrk5BfPANDs5YQDwN6KnBhBGBSZxODkQqvVV0G4DsYjIEfBsE1RfF2ixYbjINS45KxaIeVGqvYLqpTwAeysc0HdD4HQhKQEIXVMMH6ApFPAo9G0LtWnq4pYKrSazvBGQA+oNwZfNBDhQ3CDBQ8VWWUEwOxjYVVIafdBoRnGShAZ4icIgD+XLBIUvOqVcdqHlLJQByA5Q2wAkCVLVDRSo+A3j8ggDyBIg5YUIAoGLI9CfUJEFDpUOBI4UOQww5GtSnyFtDIMxQwvojyBp4oQajNMlHN2Sz6dLWI0GotcwzIpBcYJTc+MTgVo+dr20LcWiAMgjC9QU93Yod3UOSkCyICVRAVcnEqcs0B-Rf2hcEDqCRg6UAd4UyH6HVp6Im1DIN4UhxcdEgJcZhsZCbqEoW6E-TGFP04ziEYgoibeMrFZC-D9I6RazBFx+C7gIUo3BnJPVSYwQN6KuLvuiySF2ANIcNHeKTGujlwKShYckmMEeFjcyWObX3s4IyAlhBCEwIfhXVBBZIHAjWIERYzjqbM5u6sI3tmAaLvlxYA0Ovv-RXA5NVwKQ6di33kxt8wAwvR-irC5CwgNOmYbcPOmwR6pI0paE8LYI8oORJOXOY4YakWAcoI0WRVxBOmQbgh9BAye0lWGyCZAgAA */
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
            actions: ['hideGlobalLoading', 'clearRetrainSamples'],
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
