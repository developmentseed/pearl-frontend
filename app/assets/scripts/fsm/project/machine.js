import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsbLjZBaSF3S7ARQdNaYayxDWrkmmy1KHKo1VJjW+ZAIE2YUCDC0GgeASVdKCH0Skmkcy-AGIaqKMwnBOCMqeQ1x4nCZ0jTc6NYSXJGCyjgFgbYSAcCVGIAo3lXVry6RMc0xMvDYWohpZ6lJ-mfENfuxkxrGz8BVDa01VTeB6gVTYroe8XCZiPMsfpQ7EBwjsIsDcwxvAbFPEe29TYH2zufdQeoaM5JwNap+ncQw7C-uzP+hAkIMhYVwuhf4lJXgZig-eixT67kvs0HiDN77ECoe-Rh7Sf73afq+OXb4dFvC4WNSKOyU8P490gf3QeJSOX8eqEDXaECoGqGXnoDtrVsyFlUiyOInJBrYWw9CJYWEeqMjwlyBElbprCjfJUiQ8mHI0AlXDJ8xVH3coEF+agdmpXnF4GPEMSmsbHjtBaF2PqPo5jpHpaEJ4vYUg3MZF6PhjUWbUFZ6TtmqH2YWhR5zrn3OYgWWEXzWyFbiOVtI340IojuxSM4WIDhfjDHZLuBLlnrOhjc2lqVGWnNIpc21yV0gyBJfk-M7FHBZRZU3S6t9CSug7juvuKEGRtLKTzuF1V4jvhRAIkEFYjhjVCC8y2LrDwBCSdUNDVLfWV1gGgrAReA9207uQ1jKluN0LYSWEeuiEL3YEfEZMEEOZOSaRsHtg7DkjvtAEFwNNlUJV4EVPo8qlApCTbo9NgDUJzSmWhH4P4GkdwHx5GpwYwwOPxFB9QbzMoIcaAeUjlHJVxQSlbXwArGOdVUUCCeDCsIVhsbhIscK0JYSJD8Kyq+VaWL7cp4d2DtORD05jkzlnI4xDsAe1N91OHjOqWzGuQsYUizhe3hTG0UQYSaS2KZ4exxpdU8y91hXYBkfQzUH2WUwk+xs+16eFwy4bBwjZJ4Cr4X-BiL+IkDcrsA9wgp-bmn8Gncu6Agn0c6AoD8W91S5wvVuNoKGI4d26cXBoeQT8dkSi4+y9tcdt8M9UAjjWfMm1ETUdIczVshbzJYgEQio9Pw7s2TmlPoEKEbpQRjCr+DuX8Ga3DbXU+cb27NffJw-RZJvzgf3WUaTQYw083UW0hMH63p2VS7B9TmfUdKPIt4CuhfJB686izxk-oPgNzlyIyO-OHUOQ7y5KCD4CDtbmwnbtXjftftypUHfquhwDgA6k6s-o9h3gBu-pRKCD8EEDuBsOkANMZM4D8IaoRDaMkKCJfKfpLjZKdtJkPEJl-CJj-H-KUtQbLkxLJovENoIsgfRrMOWJhMCsRJpE7CCuFiyPYnaLhLdP2gRMaoSmBEBAwvwOJJBK+mjlrnEGIiCP9oWB4MeHhNuOyJhGyJsMMJsB4OTiAaUnIeBIoY0rtAhiviaByOaIRldLaMuLnNuFCGIvgvhN1JuDIZYRytYQoWdsobxDRo4V0uTNkskIauSARLCNuN+lhP9sZAkHEJpOQUwRygAGrPyUBgL8DxzmIqHe52xOALCsi-C7jaaJAE56SDD-DDSnL0QrDGTm7Gr5Fq5FHSD7SlERGIbNTo5tSPQnKQgjDET97YZRBE7eDLiSIsjLji4UFmbazsAgQkBhAthRLyFxzQ7PwCB4ogTyHQxWY9FxwPibrlHHjzClgsjDAyIFJHqD7ZjiKDQsZ9p+LGo3gbEMLbEOS7ExKSQHGVQiigRKjATRJAQIygk3EeFewyIyLoS0i9S4GiHJCqSZhDBLEeBsi7ZBEsS-GwCbEAkyhAkwkgnoBgJgkQnSAUn7HUnPyJhqGr62BiH4YTBRBUg8ZF7RBEzsiESlz4l7b3j-gNwIyErq6qHt48EEA67eDoR9SaSZhFo5oHLzAjArCMhFIS5rH0AiAe5wASmSRSmvgOGsmpxcjOA9p0QDChp4TonDonzAbl6Zy7jnIn45EsT1gWBzSI5pZQCbpxz7Spr9jlFoLvDfBQgao7i-Luyj5qZ-CanZjHLZHiYsQigaAPhQDCotgrIqELqwBLr37rotL4DL6WmoQuxgggh+LJk5hLCF6BrHjOBfa4RRD+CPTAF6k24BjZmUC5moD5lgAdgqFfikAwCoBsy3bCoeZlmboVlt7DFa4ECbCYTYQeHc4aRchHKTAxC0irgngEYrHelUEDlDkjljm8QLow5RgbpbrLkdJykmH6Y5gFw+CbgbgOieC1l7zDCsjjDIJ8YXl5kOQFm8SorPKUlQRvIfLkARmFixTYQOJPHnLfktkZgl71EeF-BxAgXUA5lgUygQU-hQXhHNKbr8ARklaLDKz4Trn-ZFq-ClhlZjBgaeCnkZnnmEWDnEWtijn2FGImJN7mIt6AQ0VE7Qixbj6gh-BHIlgB6BBUjImQgEVEXDngWCUqEbSt5Ql7GxJmI3FHouHpETDoUqlOk-KsjkyrC1FLDHwMSEk8UaVXn2H8rwVCoiqajirtbSAypyoRlEFYRxmza7jjD+AOjoR9B4SnjqaxYVq9lsL1qNothgB+mviCbdz0F9yMHcXmYNpiBkksDpXq5TzsECIrzcEjFrnLH9BQitk8gaFLA-mjrWg2gYS0gFImZJWlJ3hUVpUZXSYqHZV0Dfxibwocr9XDiDVlUtxfgVWcFVVRG2zaTIIhWTCrBHomRwgOiwiFyR5fT-5cWTVS6PJoo6ghktL8AykrlslRD0QhQfmFipmghqlZisgbBjIZJ+CilPLoowWNxUXhlDHPk1VRDXTnKAWAXkS1Z7U6o7gFzeD4QYZ8YCbzUsBYo4rSAEqEp0FjUMETVn5UHo0yivLYq4q42LUPDLVVlKpLZYTbUPW47zAOi-BHy3FHqTEeBo1SZTyY0U041EoCA0J5T0KMJ5TMJnnCgsEY1Y2U1ErU0Ka6De4giGrDRHpAFXQcgrYzDvlRkfbkSQrkSwq9UcoiBKgjj9H2HlHGSrDDRBSSJRDZhhYzB-B-KUyY4EZ4XpmnUMx-FbFxzY0kCpoUI6LPzp4PISoN7xwtiiUWKt623-A56aaESLgrBBDbisiYS7gYGe12BRA-EB1swIzB2h2gI8KR1-iLxgDQzx3iWVmyk1XvZOjsVbUeAkbJF4SqTfCVFuiqrGTGoDhUIN7gHObe4jDXSDB2jnJSKBD5ysj7jSUlZDCwgElm0sTD04o0FX4slN1a7HgeLl4ZBIJ4SFh4GPWMgBBi6vAbgnXE3CjkWN5WoNwJ743jUsJ+2P3nV2HQQv0O4PBK0wLVVa6xYLB4Ral4JqzjB7W-5SGaRwipCilJpZQ8phIeWCoJpHZhmq0xkWiG64TQj5gDRSKLBEEArHgRrOXf0oMpr3JDgjhVC0PmKkA8zQ7pr72r7LiqYAE+CEQERjDxDFjYQhROAelJDHjIPJpoM4hvgQBARMPSOY29hOre7LhQj76AqTArAkEOhcg51KV8MQinhSOoN5aDjDiJpKMDYu4lQMIARqNmTgrlzcmB5OAOgQPDQxTdJbbcOmN0MxrHG9FWNmM4D2ProqObqwCOObzYTILoSemxABp63lxggdnaSUiPRGrUO27DhKP0NxoNw4DCqiojgXb2YBUcN3UmgeFkiUoFJakJCgrmg1F+Cw2CH+MyM1J5NmNVD-VIErVZopBpMGrIIpDILZhZIOAUzlj4RxNH6m2rF9l0AiDMPmNP0YqwWC34pEqq13Th6r0yIRUeEkP7nLhxA+DIL1a+0P25PMNcxJ4M6KOoMCB5AZ6bTe74QshfoaRxN93NnyI7ZYSolX0mU3o5MGk9PNyRyPPQzPM0ACDwGOrA2fNZy6r4T9q1EpBRWbgWimGcifT4KdNczsOw5ULw5Yi4DO4o6otch4wbhrU-B0RCOBqvDkwsglYjAjLjDEsmywtATNqSgq60vgOTB3QekZCJA-mqbcsF0eCfm8swtUvJ6M4troBtosBq6viosTBbw-pEz9L0jLFghQ0sjZjjCnix4QsrNQtU507Uuu7GJimTiou4tBDcM-BOwnh7U5hkN0SEQnjaQELWurPSMPPKsM6p5vOZ4gOr5zP2LixcaLgkyBqghgjlibDl4ETAqKsCB155SMO8CfNq2BaxHKx3QODFiaScndQjRmu5uhtmMjYlUip5SN3VPzgOWKw7i-Bc5YbYZ4TeCeKZiUrA52gNu2vQHmKwH2rIvOre5LAqTeBpKET92MgeMrBexOxYF4XnK5v5tyCmLHQJ0SWxsmjAqaGMhzNvB456PNFESUiWiw1BBNaDYpa9Zww9Y5ZRioAX7lE5jkxujLC47uHJORCcZ-abiqqzMB5en5XHCJbI4ta+V9YnbK7qtioztOQgSUDttg2rlmuLB+BgaSIZgDDbiTH1X0SPSfDZv32UHmbNbvs5Zft+U-u8oRnOAFosoYSalrAAuRACPiIQ3zCnw7ikbWuIfJYtjlPlSseXY2PSfz6jZL5PlupslDC656FniFicYeDbgSLrZlw-DaRqpW4b02QpVFUtiCvM4Yd4D2squ2cq6vMYDvMONnvzj-BE42iGrqKeCZN4HDDiL-DOFHn7MJaFXFXOf2dodqsatYeFW4dqe7pKqzNRZcj953QchyI-IYtjpPFToDA9lLNsIhEthcDFnKDv2E2f23P0DlcOSVdLpANcGDNdBFdezQihRHpuiAVnqvRjCieZgZIWSIjUDUlwAGjwdgB01Yx2wJC1l47Sw6TZz0gVHgg2jIJshdkTCRqnBRg1RNgQBzfPAF19C4S0gMvDD65GvkxQpAWvC-CI09WlcIoHfnC8qneBSDAOzkQSLeGu2RA2iAdcgd3Kyyz0f6mihM4yfhhKgqgVDqixhahnYnecOpx2C4veGJPZj6NBdYQXxX2SEg9kbNhaUdhDw9h9jfcLjfPnLoZUgsjM-bhDAOw4G6cwrlzmdvfm1cpVD4DSroBp4Chp5XHSDICnC0-ynGRYTqxCl+AjAjDCP6ZQj5iMp9Q-FNwcRiRNLS8Fr3cdnA7jMwONHDNdfu1CFIIlfS3HCy0yisP68ZNv79s0QxksszCfXDQ4mcj+AyzxbWuzTSYZagxFTgx9ZiDS-SXOAIPT08gfa60-KJDvAG6Cn4z4Q8+2+3jBxk36xhxLQRzS8CMLAETsjxQHLSX5z08MV4TrAJXGqjzjxpqTwY0zy8AdxR862dRHPfqfmD4gjraLYKxaEN8kIPxtBh1vxO9tXHm-NkqzFGtDRKLFc1b7M28zcmpQHVK08jp9AwrSLdLnK7WpsdTxG7hvR+fr9f0NjQYANwa0+Fhgg7acVSLjQCf6TfC4zOEjRXrkjr28+ZlSau0Wnuaz6DKVVY0ZaegmTeLDBKUQwFIHaHHaScmOMnD9h1kcwz4QB2SFwARgHTMpE+a+QiOtjkqJFVYU+S-DXgSTqcTQ9Fc0FCAzAHgmW8xSrEQOTod1aQweTPhv3t4i8CgtPD6KpC5IkZnEd9QfNdBo5fQyYNIV7lnzoAhFNWYRPXhjy6Q2g-s6CQwn8GWLbgZEfQV4EBx0jUcrWFnYUN0UKJnYSiwA5QbbCcB7gmqtRXTl9RmIZBh8n-PMOpCPQ3MGO6xEkv8R2InFgSUEUEvry+jDR+0TZDFtSB+yPQvYnpN4MIXQiikjSWKOOGaTwDS8MwS4DIF2gP6Owi0AWJUsR0cROAeQt6P0tJgF6BlgyCMUMuwyj6506K4wKFIRH+BQgEy3zd0LxxNoFx1KfFTSiRW0rfgo+v5fcPWW27fB9CbiRbsCyCDbUysdgKHssys7FVSqmVeakMIFx3QeQhYJEksWLCqZA8AXJWLRC14DUHIKw4aoMKsHzcA8RAu6FyC8S30IQe1YLgakGAqJKQCw0Aj-QBpXVgac3eCMgA9QbgwBaCMDAy08ChBN0soNIdjHYpYlOK2pciOMlCAzxE4RAD1AHjoGgjiCUHZssOSgDkAYRtgDIvCLAwcgkRGYUIO8ggDyBIg5YUIAoEHKEiPUJEZ4OWG7obgER5Ikbu-zJQgiBgYI3EbzWQ7k1saOzQlLTwaxiIRgWQ7Ia0MDQpBcYszc+AHmdpwdr+kLS2hYMghF8AUcvN4cfTxIEDJ0PhUkOMHMr+si6PgwOqXQuDl1BIldKALqKZAZEy0bRDCFqkaK-BEE6vEuCQUHrWst6o9afJQMxjUD5woAmIKIm3jKxWQBA9qGIiyJnxYghMVYH9QuowR-6CeLAbq08CbguWjIaGqTGujlwP82w4gv7BDaTtt+VwroBkBLC6EJgpyWem9TcTnJyYi4SYMfBMqLNZBjbaFrT3VjBo8eHgj4bEAGi-AGUK4RIIDg+GvskOzHPykX1UEqwuQsIZoWhm0EURNwPITssVyRKRdUqDkGLm2klGwDFgzKHbk7ADzv8OQe+c0ZmAGTRkqw1rRrg70XTKB-h6AQEfpESAxUDkeEQ1Fd3HEgAoRMIrJgQVwgAcWhonKKKiPgjoj9Il3D4H-yAnis8RTI8Ceckgk7dCG+Cc+iAGpG0jeC2gBkc7gJEwiWQoQDrskBwnQTIQsE+WAkBQl4U0JH+bINkCAA */
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

          'Mosaic was selected': {
            target: 'Loading mosaic',
            actions: ['setCurrentMosaic', 'clearCurrentPrediction'],
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
              'setTimeframesList',
              'setCurrentTimeframeTilejson',
              'onPredictionComplete',
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
            target: 'Applying existing AOI',
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
          'Mosaic was selected': {
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
              'setTimeframesList',
              'updateAoiLayer',
            ],
          },
        },
      },

      'Deleting existing AOI': {
        invoke: {
          src: 'deleteAoi',
          onDone: {
            target: 'Refresh AOI List',
            actions: ['clearCurrentAoi', 'onAoiDeletedSuccess'],
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
            actions: 'updateRetrainMapMode',
          },

          'Add retrain sample': {
            target: 'Retrain ready',
            internal: true,
            actions: 'addRetrainSample',
          },

          'Set retrain active class': {
            target: 'Retrain ready',
            internal: true,
            actions: 'updateRetrainMapMode',
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
            actions: 'displayInstanceActivationError',
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

      'Loading mosaic': {
        invoke: {
          src: 'fetchLatestMosaicTimeframe',
          onDone: {
            target: 'Prediction ready',
            actions: ['setCurrentTimeframe', 'setCurrentShare'],
          },
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
