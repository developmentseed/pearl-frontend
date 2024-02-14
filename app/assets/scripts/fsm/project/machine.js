import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsZ7MLhvQisRxhy0DVEXGmYhjFoGMgn63p2UsSjVUmNb5kAgTZhQIMLQaB4BJfOHMwUUhxHdLCU8ec3GZlGcXFk5c9mOEjTc6NYSBxUNQOOMAHY1B9llMJPsXbWq-LJEEQiHg8wgnSKTLkXttKGrGNCfw8QZ22rnTiRtzaWBgAsOwIG0rjH3k3emuScClW0nJsrIIy4EiFkhCetx9ExGHtOZuKENhb1stShyutdyY13jEK0z966f3btsYRFVAywOeHLrpGYBFvhYVpOhQ+lNp3IemsKRs-AVQ2tNVU3geoFU2K6HvFwo67DLH6VFGYcI7CLA3MMbwGxTxeEvtWlDLEWORnY9yyoXHEwZt44gfjO4y3Zm0iJ92doxG-PQv8SkrwMzGpU2x2dnHqC4h4wkvj5yBMGeE9mUTiBoTua+OXb4dFvC4WNSKOyU8P490gf3QeJSOXheqB+yCECoGqGXnofDXRsyFlUhOpIg1sI+YQNeszPVGR4S5AiRjw9jhvkqRIdLDkaASrhk+YqamkUCC-NQVrUrzi8DHiGLLZE7QWhdj6j6OY6R6WhCeL2FINzGRej4Y19W1CNY-S1qhbWFoWI4xobrvWdv9axLykbJWFbiOVtI340Iojuz7RTBwvxhjsl3GthrTXQzHcldIPbnWHhHb69IMgG30vzOxRwWUWUsMupc+62Y-b9xQgyNpZSw6xOqvEd8KIBEggrAY1fJTNkhCDZbID9oAhEuqGhttv7LA2xgGgrAReA9O2urXvOKluN0LYSWPJuiEL3a4QWHCVkcVOSaRsMasn1Ahsykp4drgabKoSrwIqfR5VKBSHh9p1zvmoTmlMn5qELJ6KOAPjyPLgxhgBaQ8Tpjxw5cK-29yh52vdclXFBKdtfALuQh1VRQIJ4MKwhWO7X4TpwrQlhIkPwrLHe1foC7inDnDsiE9zHH3fuRxiHfQHqrqlsxrkLGFIss3t4UxtFEGEmktg1bYanhySunOZ7ADr6Ga7v2TkL6eFwy5EOWk8A92b-gxF-ESBuV2iG4Sy-Jy39PbfcAd69630c6AoD8QD8FrC5zgtoKGJb2b6cXD6eQT8dkSj5-y7T-eqnb4Z5LtMcdCxES9d-szVs1HzJYgEQio9H4O7GyOaKfIEFCG6KCGMDfq7q3lHAduYlDk+LDt5Jzv+ljIkNmBaL8tLvdMoqTIMMNJCsZDuNpBMFWn-KUs3orkvvAepqgLwIziQGqE-jqAHhkv0D4BuOXJZk4MVu1LjByDvFyKCD4DLo3lQQvjQffodmhsiowW2Mwfao6lhmwWgV-r5lwZRKCD8EEDuBsJBhRsZM4D8IaoRDaMkKCAppQQlhFovkxFFl-DFj-DYSxDTh+kPKlovBDoIuoTprMOWJhMCsRJpE7CCrNiyPYnaLhLdL8OyInopk7vQISmBEBAwvwOJJBNxvrojnEGIiCJMOMDIqBnhNuOyJhGyJsMMJsB4A7okcnnQCkeBOkY0rtPUGjJ-v4RyOaBZldLaMuLnNuGbosIythOLA4Aka4TZE0WkbTpkbxJoHiDkd8vpOTNkskIauSARLCNuKOlhIUcZAkHEJpNYfFixAAGrPyUBgL8DxzmJZEXZ2xOALCsi-C7hFaYHH4zCDD-DDSnL0QrAkE-DGqXH543HSD7T3ELEdHNQG5tSPQnKQgjDESAHFZRDW7eCgbHgsjLiTFnEMzsAgQkBhAthRKpFxwq7PwCB4ogSpHQyNZglxwPhYaPHHjzClgsjDAyIFLybAFYHbyHhLC6F2jGo3iEkMIkkORkkxKSSUmVQiigRKjATRJAQIxymskDFewyIyLoSAbnKGG+bTaqSlpjBBAeBshE71FsJimwBEmSkyjSmqmynoBgLymKnSCOkUkunPxaadFwm2CRFYQcjLjnyeC8kn7RBEzxHcGsh4Sy7fpwANwIyErvrZF+mI4EBF7eDoR9SaSZgOhjD5EJDzAjArCMhFJJ5N4JlYpxwpmvjtEI4rGZmGSUi3QDChp4QGn6QnySaX6Zy7j6m2ZvofpVD4CwxQBYZxz7Spr9iPFoLvDfBQgao7i-ImbXRXrILnKGb-CnHwoJYaAPhQDCotgrJZEuRGBZQ4BMEcBKhYb4CoGNnrxRBgggh+J-ChFLBfEerHjOBC64RRD+CPTiGVmlIigHmUBHmoAnkrptFfikAwCoBsys7CqnYsC3kFAPnLHryGqYTYQDGh4aRchHKTAxC0irgnii54l7luHgWQXQUdhnkuk7QVDoX3kf6wkZlVFYS7hciAEZjaRfkIDjDkp4TnLDCxnHxha0XHkOSnm8SorPJOlQRvIfLkBzmFixTYQOLcliWCUDAZhn6YEDF-BxBSXUCHkyUyhyU-gKXzHNKqG-ocVNmwjoSLDKz4SbCDCsgFm-Clh3ZjAyZhlmUWVQWyUwVZFGImJrLzI2rv5zmDriIeU9qUgVZHIliIaBBUg6mQjBUQWWWtjhW8QbTv7KnkmxJmKsnyY9GHETBiV5ldkETshBnvFLDHwMQSH7nmV5WhVWWFU-j8qqVCoiqajionbSAypypzlmFYQrk7jkRsicjFYsiwj9D4RmRJWTQdUsRPpiD2kvpvqviRbdxOF9wuH4nCg7V7WvrvpTxeECIrx+H+niYLC+w-k8h5FLAOiFjODWg2gYS0gFLVYgUcqYbDgtjXWHUtw-jHV0DfxxbUUMwtIfoQ3Jbfh3U+EPWPnwJjCCFeWrDyYmRwgOiwg5pvRwjCFUU1qk6PJoo6hTlI2zmPUZnFqYSGaAGFiGaggFl7gjAggYS1VvSwrA0sS2V00Iyq6tINlYXwLgHDS80shEybhODE06qkHKLZJCZhZ2EyivLYq4oEqEqOGw3OHw1U3CjuFTxoV63SAG3o0PCY3S1Kro575AlfDx4Oi-BHxsnybIkeBa1JaW1Yo4o21EoCA0J5T0KMJ5TMJTHm3a1xxB361Ep20Za6AXYgiGrDTyZiFXQciY4epcgLkC7kSQrkRC1WlUFwDDh3FtGPHGSrBy0XrHhRDZgzZiZaQxB53eLLV4S7lm3azinElxzB0kCpoUI6LPyb4PISrP77QtjRXmKxWAR13-DOB50ERHhDAEQBrfGsiYS7g6GUxcgriimD1swIwj1j2gI8JT1-iLxgDQwL1v7L1M1Nn85OgBX42Ho2i7F4SqTfDPFuiqrGTGoLo4oeG0EXYjDXSDB2jnJSKBD5ysj7jQjGRfQOKWmx3HBgNLp34IFS3pkrHHgeKX4ZBIJ4SFgDTcnjYBAJ6vAbiU0k7Cii0wRWoNxwEw1w0sII3MM02tHQRsNu5Iop0wKv0mjLYvWbguJvBqzjDE0dTFE+r-BS591MPO7DjJo8rzpxoNwJqA4zkXZo75EaUqJ3T0RLUrBBEvZuibhvCaQUHnXqNJpZRaM4hDgjhVDOMpqkA8wq6OUdL+F0R7iVrlGvBD5LXsi4ygjlwJDInvHxleOuN1BvgQBASeOaNoW9hOqGPmnYJ5gfnu2BqvZuXrj9K0RA0V0coiCJMLJ8rV3pMuMyANbSA4AMIAQ5MggxD0SDApA+BLBt0eqTA9F2OWibDlwJMZP3I0ngmJoZOtPME3lZNYawA5MjAuAjQQY0QZgOgZgT4TDSZoM2iqNJF0DVOTMxoDWCo4DCqiojj05tYTX+NuorF0RrME6ZjZ00xLWbDMg7gZiUiEbHMNFnONMooaOgt8PorsUBNwk-CeDXb9MInnJE1QYrXqyXp0SMhAtVk1NgtPJQsJ3W34pEqGOkguCrAhZuC-AWM-C6rENhkZWxATMuNczt6d5pPgs0ACB5Bb6bQXb6mxRm67jaQCUDMIDLg5jXbGSkjCtMtbXU2JOssr7suzMuMCA4AOpOr8D8sTFYQSIt0BA-2BofT9CDArkcjzA8jMvNyRx+Nq5UIa5nZZ7QvPMmj759B3TKMDBjFjA7OIZYR9o6XwYN7C0KuaNKvOve5troAdo6tuj-J-CD4shLDkYF1QjDTvHKwTrVHWsK4e6r7Z7RsdosD56vg6t-3xRwO9BfQ72ICMiaSd08ijHAqYOOMp6ct5tste7d4bq95iPzhhrkz4T-Mbnli1tCXBmSbUroRx42i5sRsFtATr48vb79utTIu4zkQOAiu7i7vjuyxn7JAl4xGrbyu8OKsmyP55QeO8D8uBGmuwjHGMiwj7tb3iLIIpU7jrgVNYPtsXuRwgsppIHh3lIXZxFiKUiIaFIZCtU7MGWBEK2TCMgaTzsmyAfyHmKKEcAasqHOpgdXSLDUxKz2xfX+u7N3SH6qyoeRxXtyAv4xVLL4ebyrBQjlxR5Hse1DBamGqPuvnsifbg5ba-ZwzA5jVRgMG37DZrtYwEA5jkxujLB+COJ2jjtfvvBwibiqrlibh-ACc67fajV-bU454xtipYcyBNr56YWEOpwshBF+AyaSK7OpuzDIn9BHuPSfCUaMMnPrb6dCcg6icM7nDnbSddCxQ5ZVbzBBDQjxHeV6Q5ZOhWjGRb08jfB6ebYtj3PlRBdtZg7+chJIEw6UBw6PFcdHjS6tUBBhTbgSI45lw-AXpOAhuVPbWWd7WtqSi575squde+6md4DcsYC8vtNheDO0u0Z4SZjxEV5GESbYSOJpBqJz5nt1btcth9fdeBhdcDfXkWcgSUDWdOWkp+rgj2MaQ+JxDjtpBjrkgZh2hqprbrcOQ9s-oCAAAqX6vbJi5nTkB3R3MLiOBq9ioUlj5chxA0XICwSbmVkw5yrbPD2sSNLYr3k4RtXDv7rEyPL3X3P6IjvhWNO6cQ8nsIIwqSfaQybiSUFMnJIhG4yCop2PMoqPfY6PJt3D-dt4TPOGPefY+PK8MJgPKxTg+EiwPg0Ie8xMDVvdiwIWz7GQhGDGXo1ATF8ASEbbjtMnMicI-QfwPtMsZ4XZTx4INoUmngevDPq3pQpwUYNUTYEAmvzwdg-ruEtIG4Irpe9IuWUKBarwvwpBP7bbJw5QZ2lwjvgUgwDs5EEiZuYr2k8mhHx45ve9AuYWPuWX4YSoKoFQ6osYWotODvNn8CpBbldneE2Yx9VDxuF8WLMRRztmTYPVBVHYQ8PYfY4fC4LIctZaVICt8X3xb7FHRRMIPwyQ8ZOio5I4ejY4G+zJ0gyApwHfmZxkWE6seafgIwIwxY5MAQ0IGwjKfUjP7E-2XEdlS-dgDd+EAw0uKQC124KQYIUiUZdoKb-tBnPj5-2k5oZfFLcQS58Q9ICXMNCGDjAAGMsU9qGwBhzR2si0QqCtD+xiAl+qDZwJpH5oPQBc+dfSIkHeBl54i+MfCC10x46x3kUNGCGHCWgRwl+G9BYI1UegEwpE+EfOF32yQmV1gy2bFqUlHjjw00k8UgTPF4AdwkBedTqDIgoY2htmERTppCDRwKwCixqDhEAm4Tj034n-JwKpAooXcyU6JL3kNCUQDAdwm4T1sBVa5aIl8tTDvnwQ9aB5Vg3SZFvu1BCbtDUu4N6E4OMGY87MQjM1LwA76FgwQhOMMlInGiCVHoyQfYuILoi3QTKb-VGl+A77ZhfimVVWIuVgYmYsCwwSlEMBSAv9A+iPegH50y7NZhOUqAHEvjiHZJyWCtY8MykwHx5g0QDHkOhCo5W9TmUhTwQkldbc5-mblf5raEzCYlHshEXXld29Qj5CBQfC2vYQFAd8TWoIZcNZmcQMNgC10TzjWzLyFJjUMxEtnMSaQWCbQ4iZcBVlPCJst+CXbXqRQU46RzGK3SAccFBLXFacNdSCFQN3Bgh3q7xb6hsAcDbgMgoBb4D6lHQ+BVgp9W0hKVJK0kZSUEOUufy+gZs0kU3G7jUJY5ewBW64E8OhHjIbpEytZd9EvwzBLgFez7GwY7ALJjYcyDnRbtSyHLQDJ+45ScuLSRgzkkBB9Uvikkyr-AoQJmLvgOjZJkZHouVOimFQYrfgkBngF8hYQqwflSiqLMEGMUmDGFSeIwJ7s2nBoHUYhIonXhRw5CrATwOJYsLlnJqeBpMAIHIZzyx6qEVRN1KGuf2Vjmg7oUPVeilXQjE1hguvE+CogBbxl8WYtSSBLX4Ca94IyAD1BuD6Bm4-mVmQYMfiwyyg8Al0AKsaTDJllyI4yUIDPEThEBvy5YUvmGPd6eBQgUFKAOQBjGmgji8YmTBaw+bH53kEAeQJEHLChAFAEFQsR6hIjPBywf9DcAmPLHJjA0wYrMTJhzEI9TREwnWpiiJYG0O+72MRCMAV4xdA8wyUIdp3PiIYW6DjXIacyrojhISu0KgQClX4RjSG5pTAceFwiEdb+8IM0j5waI2k7Sw9C4FfUEg30oAO4pkEcUNRHtPhWqBLtS20KJAS4FhEBs0JwYQMZC50Doa1HiF9BvAqA3CMBhzD5wMgC2V3j8B4rsgOBVTSFiOAEaCpW8ZQiYJRE3AjBaisZORD8kmDvBy43BQsBvULK5tzBRfVqEuWcCC4yK92PmgNCkR4wPAGwKCeyGgLND0O0oDvjwT6A0YSat-G0GK3-xiIgGpvd6qjjQnbUvsAXMalQL2EqwuQLlHSPmVOEUQdOQ6FNnMAUk2RLqG3Ezh2gnGkZO6eaHjp5xc6i5yJJcOgbVXao3C8hz3Znrj0nATiNUw0N0H8IkRqxnoJFU8L8GQlqQIMjPc0Tj1wxeT6JtiP-i4EnxISCI+EYIa7H+T-lCycLT0NkCAA */
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

          'Apply existing timeframe': {
            target: 'Applying timeframe',
            actions: 'setCurrentTimeframe',
          },

          'Delete timeframe': 'Deleting timeframe',

          'Start new timeframe': {
            target: 'Prediction ready',
            actions: [
              'setCurrentMosaic',
              'clearCurrentPrediction',
              'clearCurrentTimeframe',
            ],
            internal: true,
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
              'setCurrentCheckpoint',
              'setCurrentTimeframe',
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

      'Applying timeframe': {
        entry: 'enterApplyTimeframe',

        on: {
          'Timeframe was applied': {
            target: 'Prediction ready',
            actions: 'hideGlobalLoading',
          },
        },

        invoke: {
          src: 'applyTimeframe',
        },
      },

      'Deleting timeframe': {
        invoke: {
          src: 'deleteCurrentTimeframe',

          onDone: [
            {
              target: 'Applying timeframe',
              cond: 'hasTimeframe',
            },
            'Configuring new AOI',
          ],
        },

        exit: ['setCurrentTimeframe', 'setTimeframesList'],
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
