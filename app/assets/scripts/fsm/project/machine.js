import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsbLjZBaSF3S7ARQdNaYayxDWrkmmy1KHKo1VJjW+ZAIE2YUCDC0GgeASVdKCH0Skmkcy-AGIaqKMwnBOCMqeQ1x4nCZ0jTc6NYSXJGCyjgFgbYSAcCVGIAo3lXVry6RMc0xMvDYWohpZ6lJ-mfENfuxkxrGz8BVDa01VTeB6gVTYroe8XCZiPMsfpQ7EBwjsIsDcwxvAbFPEe29TYH2zufdQeoaM5JwNap+ncQw7C-uzP+hAkIMhYVwuhf4lJXgZig-eixT67kvs0HiDN77ECoe-Rh7Sf73afq+OXb4dFvC4WNSKOyU8P490gf3QeJSOX8eqEDXaECoGqGXnoDtrVsyFlUiyOInJBrYWw9CJYWEeqMjwlyBElbprCjfJUiQ8mHI0AlXDJ8xVH3coEF+agdmpXnF4GPEMSmsbHjtBaF2PqPo5jpHpaEJ4vYUg3MZF6PhjUWbUFZ6TtmqH2YWhR5zrn3OYgWWEXzWyFbiOVtI340IojuxSM4WIDhfjDHZLuBLlnrOhjc2lqVGWnNIpc21yV0gyBJfk-M7FHBZRZU3S6t9CSug7juvuKEGRtLKTzuF1V4jvhRAIkEFYjhjVCC8y2LrDwBCSdUNDVLfWV1gGgrAReA9207uQ1jKluN0LYSWEeuiEL3YEfEZMEEOZOSaRsHtg7DkjvtAEFwNNlUJV4EVPo8qlApCTbo9NgDUJzSmWhH4P4GkdwHx5GpwYwwOPxFB9QbzMoIcaAeUjlHJVxQSlbXwArGOdVUUCCeDCsIVhsbhIscK0JYSJD8Kyq+VaWL7cp4d2DtORD05jkzlnI4xDsAe1N91OHjOqWzGuQsYUizhe3hTG0UQYSaS2KZ4exxpdU8y91hXYBkfQzUH2WUwk+xs+16eFwy4bBwjZJ4Cr4X-BiL+IkDcrsA9wgp-bmn8Gncu6Agn0c6AoD8W91S5wvVuNoKGI4d26cXBoeQT8dkSi4+y9tcdt8M9UAjjWfMm1ETUdIczVshbzJYgEQio9Pw7s2TmlPoEKEbpQRjCr+DuX8Ga3DbXU+cb27NffJw-RZJvzgf3WUaTQYw083UW0hMH63p2VS7B9TmfUdKPIt4CuhfJB686izxk-oPgNzlyIyO-OHUOQ7y5KCD4CDtbmwnbtXjftftypUHfquhwDgA6k6s-o9h3gBu-pRKCD8EEDuBsOkANMZM4D8IaoRDaMkKCJfKfpLjZKdtJkPEJl-CJj-H-KUtQbLkxLJovENoIsgfRrMOWJhMCsRJpE7CCuFiyPYnaLhLdP2gRMaoSmBEBAwvwOJJBK+mjlrnEGIiCP9oWB4MeHhNuOyJhGyJsMMJsB4OTiAaUnIeBIoY0rtAhiviaByOaIRldLaMuLnNuFCGIvgvhN1JuDIZYRytYQoWdsobxDRo4V0uTNkskIauSARLCNuN+lhP9sZAkHEJpOQUwRygAGrPyUBgL8DxzmIqHe52xOALCsi-C7jaaJAE56SDD-DDSnL0QrDGTm7Gr5Fq5FHSD7SlERGIbNTo5tSPQnKQgjDET97YZRBE7eDLiSIsjLji4UFmbazsAgQkBhAthRLyFxzQ7PwCB4ogTyHQxWY9FxwPibrlHHjzClgsjDAyIFJHqD7ZjiKDQsZ9p+LGo3gbEMLbEOS7ExKSQHGVQiigRKjATRJAQIygk3EeFewyIyLoS0i9S4GiHJCqSZhDBLEeBsi7ZBEsS-GwCbEAkyhAkwkgnoBgJgkQnSAUn7HUnPyJhqGr62BiH4YTBRBUg8ZF7RBEzsiESlz4l7b3j-gNwIyErq6qHt48EEA65cj+DlwpIA7YYA6aEJDzAjArBqyike5wASmSRSmvgOGsmpxcjOA9p0QDChp4TonDonzAbl6Zy7jnIn45EsT1gWBzSI5pZQCbpxz7Spr9jlFoLvDfBQgao7i-Luyj5qZ-BanZjHLZHiYsQigaAPhQDCotgrIqELqwBLr37rotL4DL5mmoQuxgggh+IJk5hLCF6BrHjOBfa4RRD+CPTAES5rEBgZmUBZmoA5lgAdgqFfikAwCoBsy3bCoebFmbqllt7DFa4ECbCYTYQeHc4aRchHKTAxC0irgngEYrEelUG9n9mDnDm8QLow5RgbpboLkdJykmH6Y5gFw+CbgbgOieBVl7zDCsjjDIJ8annZkOS5m8SorPKUlQRvIfLkChmFixTYQOJPHnIfmNkZgl71EeF-BxCAXUCZnAUyigU-jgXhHNKbr8ChklaLDKz4Qrn-ZFq-ClhlZjBgaeBHmpknl4V9kEWthDn2FGImJN7mIt6ASUVE7Qixbj6gh-BHIlgB6BBUjImQi4X4UDkgV8UqEbSt5Ql7GxJmI3FHouHpETAoWaS7hZLsj4a1FLDHwMSEmcWqXnn2H8owVCoiqajirtbSAypyqhlEFYTRmza7jjD+AOjoR9B4SnjqaxYVpdk270D1qNothgDemviCbdz0F9yMEcXmYNpiBkksApXq5TzsECIrzcEjHLnLH9BQhNk8gaFLCfmjrWg2gYS0gFImZxVsJ3jkXJWpXSYqEZV0Dfxibwoco9XDh9XFUtxfilWcHlVRG2zaTIIBWTCrBHomRwgOiwiFyR5fT-7sVjVS6PJoo6iBktL8AymLlslRD0QhSvmFhJmghFp7gjAggYQmVvSwpdWlIkVnUIww6tKmmymVVRDXTnJ-l-nkS1bbU6o7gFzeD4QYZ8YCYzUsBYo4rSAEqEp0HDUMGjVn5UGo0yivLYq4rY1zUPALXllKpLZYQbW3W47zAOi-BHy3FHqTEeAo1SZTzo1k1Y1EoCA0J5T0KMJ5TMLHnCgsFo0Y3k1EqU0Ka6De4giGrDRHpAFXQcgrYzAvnhkfbkSQrkTfWrHxV0AiBKgjj9H2HlHGSrDDRBSSJRDZhhYzB-B-KUyY4EbYUplHUMx-FbFxyY0kCpoUI6LPzp4PISoN7xwthCUWKt423-A56aaESLgrBBDbisiYS7gYEe12BRA-H+1swIxB0h2gI8IR1-iLxgDQxx0iVlkg1LnvZOgsXrUeAkbJF4SqTfCVFuiqrGTGoDhUIN7gHObe4jDXSDB2jnJSKBD5ysj7gSUlZDCwgEk-UcpD04o0FX4smN2r7HgeLl4ZBIJ4SFh4F3WMgBBi6vAbiHWE3Ch-UwRWoNwJ640jUsK+0P0nV2HQTP0O4PAK0wIVVa6xYLB4Tal4JqzjDbW-5SGaRwipCilJpZQ8phIuWCoJpHbBnK2RkWiG64TQj5gDRSKLBEEArHgRr2Vf3IMpr3JDgjhVA0PmKkA8zQ7pp70mjLiqYAE+CEQERjDxDFjYQhROCulJDHhIPJqoM4hvgQBASMNSPo29hOre7LhQj76AqTArAkEOhcjZ3yW8MQiniSMoN5aDjDiJqKMDYu4lQMIASqNmTgrlzcmB5OAOjgPDQxTdJbZcMmO0MxrHG9GWOmM4B2PrrKObqwAOObzYTILoRumxABo63Kn-JBSUiPRGpUO27DiKN0NxoNw4DCqiojgXb2Y+XsPXWcPyVeyUoFLakJCgrmg1F+DQ2CF+PSM1I5OmNVBPLor3luqr50QBYEOW4pDILZhZIOAUzlj4SxNH7G2S3ZNMNmN-UYpQX834pErK13Th4r0yIhUeHEM7nLhxA+DIL1Y+331LNSNcxJ4M4KMoMCB5AZ6bTe74QshfoaSxO90NnyI7ZYSomX2GU3pZP0AiBMO3O4DO73NdM0ACDwGOrkUVMPkjHvOFwjr9q1EpBhWbgWimGcifT4LtNcxsOw5ULw5YhQvJ5vMdl4wbjLU-B0SCOBqvDkwsglYjAjLjDEsmx3NK4troBto0uBDggZKukZCJCfmqZcv50eBvk8uRx8tATNqSgq4sBq6vg0sTBbw-pEz9L0jLFggQ0sjZjjCnix6gtm2wtU507Quu7GJimTg0u4tBBcM-BOwnjbU5ikN0SEQnjaQEKWvgs3O8tUsM6p7POZ7AOr6zP2LixcaLgkyBqghgjlibDl4ETAoKsCB155QMO8BvMq2BaxHKx3QODFiaScndQjQmvZvBumMjaFUip5QN2VPzg2WKw7i-Bc5YZqmlyeKZiUrA52h1vWvQHmKwH2qIvOre5LAqTeBpKER92MjuMrA1O0hYHYXnLZu5tyCmLHTx2iXRsmjAqaGMizNvB466PNFESUiWjQ1BBNaDYpa9Zww9Y5ZRioAX7lE5jkxujLC47uFJORCcZ-abiqozMB7uk5XHCJbI4taeV9YnbK6CtiqTtOQgSUCtsotLkmuLB+BgaSIZgDDbiTE1X0SPSfCZt32UHmbNYvs5bvteWfu8qhnOAFosoYRalrC-ORD8PiJg3zCnw7ikaWtwfJYtilPlRMeXbWMSfz6jZL79O7q2xDC656FniFicYeDbgSLrZlw-DaRqpW7r0sSJX5UtgqvM6od4C2vJ6M4CttpPMYAvP2PHvzj-BE42iGrqKeDpN4HDDiL-DOH7k7MJZ5UFVWcq7IeOdocP55VYfKdPZdBEbOBCGvl3QchyI-L4SWmrBPFToDCdkm1sIhEthcAFnKBv340f1XP0BlcOQVdLqANcGLW2IaFezQihRHpuh-lnqvRjBCeZhismZejUDUlwAGgwdgA01Yx2wJBVl47Sw6TZz0gVExBJ0jBlZ4Q2iRqnBRg1RNgQCzfPD519C4S0j0vDD64GvkxQr-mvC-Dw2dUlcIr7fnC8oneBSDAOzkQSLeEu2RA2h-tcjt3Kyyw0fdmihM6SfhhKgqgVDqixhahnbHccPwLw3UUmvgMvm6TDrCMxWX2SHA9kbNjqUdhDw9h9hfcLgfPnLoZUgshM-bhDAOw4FacwrlwmevccoiA6JVD4DSroBp4Chp5XHSDICnA0-ynGRYTqxCl+AjAjBCP6ZQj5iMp9Q-FNwcRiRNLS8Fp3etnA5jPQONEpBghSICl2hzvc0IcsP6-aTmjY+rA0SRnMszCsguE4mcj+AyzxaWuzTSYZagxFTgx9ZiDS8SVpcvScg8gfba0-KJDvAG6Cn4z4Tc+LO3jBwk36xhxLQRzS-8MLAETsjxQHISX5x0+0U7cegXzGqjzjxpqTxo0zy8AdyR9a2dT7PfpvmD4gjraLYKxaH18kIPxtCh1vwO-NUHlfNkqzEGtDRKJFc1Y7PFeZ8mpQHVI08jp9AwrSLdLnJbXJsdTxG7hvQ+dr-Td0B3qRip5fvnQDOcMlg7ZsVSLjS8f6TfC4zOEjRXrkhr0880yxNXaDT1NZ9AFKqsCMlPVjJvFhglKIYCkGt4vd1+4nBDlJ2kCdYZ8oA7JC4AIwDpmUCfNfIRHWzSVEiqsKfJfhrwJJH+84Gii4UIgZIg8qwH4JVmIGnIgWkeZAVf2lqX4mINPD6KpC5IkZnEt9QfNdEo5fQyYNILgZ-WOAhF1WYRPXuj1ajYQwGSQIHI9HCj2k+OCQXcv+x0gUcLWpnGyN0UKJnYSiIA5QXNycB7h6qtRLThsHLaNEMgw+L-nmHUhHpLmtHdYiSX+I7ETiwJKCKCX15fRho-aesrl2pA-ZHoXsN0m8GELoQ9S4pOOMaTwDS8MwVZfWuMj0baCEAnqLeKXzeoaFIMlrL0j6QF5+kAyANJGMGUj450seKSBSv8ChCxkPm7oLjkbQLgqVuKalQihpW-CR8vy+4GssgjrL6E3EC3AFkEA2plY7AkPU2uZwKpFU0qM1QYQLjug8hCwSJJYsWFUyB4-OSsWiFr16oORlhA1AYVYNO7KwD0bwN6tCDvboRtqgXA1IMBUSUh5hoBb+n03OpItZu8EZAB6g3DgC0EYGelp4FCCbpZQaQ7GCxSxJsUdS5EcZKEBniJwiAHqAPOaG8IidiMrw0IAOSgDkBoRtgDInCLAwchERGYUIO8ggDyBIg5YUIAoD7KEiPUJEZ4OWC7obh4R5I4bh-zJTAiBgoI8DgAPX48C44stAWoShp4NYxEIwDICNB2ru8PUKQXGDM3PgB4na0HWQWCzgAWMrakEQvgCjl6vCj6eJQgZOh8KkhxgJlX1oXV8EB0S6FwMuoJArpQADRTIDImWjaIfVchSsRBOrxLgkEB6lrTeiPWnxUDMYNA5TMYRiCiJt4ysVkIQPahiIsiZ8WIITFWCilemjeP+gnmwHatPAm4TloyEhqkxro5cD-FsOIL+wg2Y7LfpcMQAZASwuhCYKchnrPU3E5ycmIuEmDHxDKCzK-vW2biuj6xCAdWMGmzCBA1g-hAaL8AZQrhEggOd4U+3g4McvKhfG0J4xSAx5CIAo4DrMCnTYIeQbZIrkiXC5JUHIUXGzlKLgGLBmUbIdcPRFcTDouG4IL8gMgjJVhLWDXGUE12UB-D0AAI-SIkAioHI8IhqS7rEAhH3hoRGTAgrhF-bNChOUUFEfBDRH6QLuHwf-uBLuiQSQA+I5kfpHORwT7xBDfBGfRADUjaRvBbQAyOdwEjoRLIUIF0Fgn3EEJkIJCfLF0FExsK2Ej-NkGyBAA */
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
