import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsZ7MLhvQisRxhy0DVEXGmYhjFoGMgn63p2UsSjVUmNb5kAgTZhQIMLQaB4BJfOHMwUUhxHdLCU8ec3GZlGcXFk5c9mOEjTc6NYSXJGCyjgFgbYSAcCVGIAo3lXVry6YNfoQQPCfA0j8Z6lJ9zHvQkFS5bLUocrrXchtTaxBszUH2WUwk+xdtagRJYFogjLiolaANMxcKPV1akX4-hkgbmNY2fgKobWmqqbwPUCqbFdD3i4Uddhlj9KijMOEdhFgbmGN4DYp4vCX2rXeli8HIxIe5ZUVDiYM0YcQFhncZbszaXw+7O0YjfnoX+JSV4GY4NNkQ7OlD1BcToYSZh852HuN4ezARxA0IlNfHLt8Oi3hcLGpFHZKeH8e6QP7oPEpHKjPVCBrtCBUDVDLz0N+rG2ZCyqQnUkQa2F1MIGhH+tIZY8JcgRLe6awo3yVIkE5hyNAJVwyfMVRjSKBBfmoAlqV5xeBjxDK5rox47QWhdj6j6OY6R6WhCeL2FINzGRej4Y1UW1Axbs-FqhiWFoWOQxoNLGWOtZaxLy-LGmFbiOVtI340Iojuz7RTBwvxhjsl3E16LsXQz9cldILrKWHh9cy9IMgLWnPzOxRwWUWVN0uvk+62Y-b9xQgyNpZSw7COqvEd8KIBEggrGneF4exwhA5ZbLt9oAgbOqGhu1rbK6wDQVgIvAenad1wNalS3G6FsJLCo3RCF7tcILDhKyOKnJNI2GNUD6guWZSg961wNNlUJV4EVPo8qlApDXbYwpjTUJzSmU01CFk9FHAHx5J5wYwxtPxAp8DhytPZMiDZxzkq4oJTtr4CN-zUJnBUUCCeDCsIVju1+E6cK0JYSJD8Kyq+tGbKU+p917lDylcx1V+rkcYh2DI5u98rXgxVLZjXIWMKRZKvbwpjaKIMJNJbH+2w+3IPpO9cV2Adn0M333k-emuSqOsaQlPC4ZcNg4Rsk8DNyr-gxF-ESBuV2xe4Qy6p4n21e2U9p6AvL0c6AoD8U11S5wvU9NoKGCLyr6cXBceQT8dkSjG8O-lwIN8M9UAjjWfMm1ETOc58zVsx7zJYgEQio9Pw7s2TmlPoEKEbpQRjDn83nrsmH3mLO0+S726fcmkSNmC0vyyf3WUaTP7lRuRMZDuNpBMFWn-KUgnnLkno-nAcxuYqumqMvjqH3hkgenmuXCJk4H5u1LjByDvFyKCD4OTnHtAbLjTnAVHA-ogSumuvao6pumgSjjvhpj4OfoUj8EEDuBsOkANMZM4D8IaoRDaDBkUjbhFscBDnZkPKZl-OZj-FAdZsZrAUxA5ovCdoIqwexrMOWJhMCsRJpE7CCpViyPYnaLhLdL8OyNbjRlIfQISmBEBAwvwOJJBGhlzrdnEGIiCJMOMDIsuJpKPjMGpphGyJsMMJsB4NLuQRyk4eBK4Y0rtPUGjNvroRyOaMJldLaMuLnNuILosIythOLA4HYcoSxAkS4ZDu4bxJoHiF4b7qsMNFCoaoahfOhPENuKOlhP4cZAkHEJpNRhUTZAAGrPyUBgL8DxzmIeGa52xOALCsi-C7i+Zf4hGRAZB9DoROzPagE-DGrjGe5THSD7SzF1FpHNTc5tSPQnKQgjDETH5+ZRBi7eBBHHgsjLjlFWYsQ3jsAgQkBhAthRLOFxz07PwCB4ogTOHQwxbHFxwPibrzHHjzClgsjDAyIFJUan7f7byHhLDcF2jGp-GwAAlAkOQgkxKSTgmVQiigRKjATRJAQIw0nIl5FewyIyLoS0i9T8FmHJCqSlpjCHqWh-aSEA63j-EMLkkyiUnMnUnoBgK0n0nSBylgmKnPysbpHXG2DmFYQcjLjnyeDYlj7RBEy2EbjeBshin2ESl0AiAfpwANwIyEpe6eHam3YEChYxA+BKJ0R4QgYepjC+EJDzAjArCMgSG2nx6Z5OlxyumvipEf6oRcjOCUi3QDChp4R8mgYnwkbT6Zy7jnKQE-E2T1gWBzSs4dZQCbpxz7Spr9jzFoLvDfBQgao7i-L8bXRjB-Bhk8b-DDGlnCgigaAPhQDCotgrIeELqwBLr0HrotL4Dv6NHrxRBgggh+K9k5hLAbEIADDkQWh3S4RRD+CPRkHilsIjnUBjkTkORTm8RfikAwCoBswI7CqDYsAbpbpb5XGembCYTYR5H64nq6QzADCTAxC0irgngE7fHwrWajmUDjmoCTlgAdjTmKk7QVBflLk-kdK6EECRFYS7hcjH4ZjaS7njDkp4TnLDCsgFqx4XmlJXk3koV3loUpGorPLylQRvIfLkBNmFixTYQOKYm0WUUjDOC9Anz154SMXRnMWIXIWoXoW8RcW1HNLMHZ6-m+6EUTaLDKz4T-n+EOgbh9D+BTZjDkbGmGZKW3kyj3k-hGImJr7mIb6ARNmDriJGU9qUiMg5kep9QuCQguKFjzCQi2XXlIX2WtgcUeEbSb6MmgmxJmLIlUZZH9ETC0XBEBX6SsjkyrCrFLDHwMRxEsQsXRVsUOVxW8T8r8VCoiqajioDbSAypypNkiFYQdk7jkSl7+AOidH9D4RmQ+WTRlU2SNrNothgAVmvgmbdwKF9xKFDnHCTUvrTWzV2aQQaECIrw6E6lEYLC+zHi-BODGG5UBFpnX5Xq0gFJhZMUcp3jMEbVe7zWfx0DfyWbwW-EtJ2YzWvUtxfg7VaF7XJm2zaTIJdWTCrBUYmRwgOiwg5pvQl4siBAU6PJoo6h1m-WNn7WenFqYQ8bH6Fg8agimV7gjAggYRZVvSwoPUsTqVY0IwM6tJJkrnwKX7DSU0shEybhOAI06pgHKLZK4aGaqEyivLYq4oEqEryEfWKFfU1o2QyFTyflS3SAy3A0PCg3s1KrPZYSw3Fp+CW4Oi-BHwolUYPEeBi22aq1Yo4oa1EoCA0J5T0KMJ5TMIjHDni1xz23S1Epa3Oa6Ca4giGrDRUakFXQcivYepcgtnY4gE+rlzo1KgjhnEpHzHGTNHnLaSSJRDZgVaEZaQxDR3eIsh-D4TElSmAlxwO0kCpoUI6LPzd4PISor7xwtiuUWKb6Z3-AD6cgERHhDAESBmzCsiYS7igg-DR12BRBV2knSm10XAN2gI8It1-iLxgDQxd3uXLkem6VY5OhWUw0eBibdF4SqTfCLFuiqrGTGoDhUIr735O6a4jDXSDB2jnJSKBD5ysj7jQjGRfQOI2le3HAP04qyHUFak6UmjHgeLT4ZBIIBl4GYnFYBBW6vAbhwVK3CiM0wRWoNwL4LXy1LWK2264MY3JHQQEOO5IqB0wJ41NF-BHWbguJvBqzjAI0dSBE+r-Ck6DnfV27DjJo8phJ1WCoJq7YNma5Pa+FCUqJ3T0R+YegGELZuibhvCaQlmCMUNJpZSiM4hDgjhVB6MpqkA8z07aX4XXH+nrlaOnivDF6FgOjsi4ygjlwJAPGrHo2mMGN1BvgQBAQmMiOfm9hOoyNHrYJ5jGHMpyIeqLYGXrj9K0T3UKUcoiC+MLJ8rDiJohNHZp4lQMIAQRMggxD0SDApA+BLCF0eqTBZGaOWibDJ3jW6MhP3JQknG5P6OFNrrrphObqwARMjAuAjSQh4RxAZgDW7jiITBkaAM2gCM4OA7CPdP3LiP3w4DCqiojjQ6JZtVWNuq+50TDM-aZgR00zKObDMg7gZiUiESlX01COZMoorMppVBPLop4WHMmg-CeDjbVO3HnLw1uJSKLCHqqwxGLPkPLPPMxqM0Yq8Xq34pEoyOkguCFWW0nU8imU-C6pwPGnF4-AgMrX0AZMiNcxt7K7BP6MCB5A96bSa7FmxSC67jaQUU1MIDLg5jjbGSkisuxA+PksmyUvQzUs0ACA4AOpOr8CMtlFYQSL50BA2jDKET9CDAdkcjhVQsOH2mvPU4CCWOM5ULM5DYu5fO7qtTnKMjgp8MDAlFjADXF5YR9piWbjJCCv6MUu4Cp7K6tqSju6ytuj-J-BF6o0DAOjfDbGrHKwTpREevNyRwitAR+tq7oAdosCe6viysX3xSf29BfSj2MiaQl08jFHArEs6MwtCuJvevt7SrGKZ6TiBvkz4S3M9kiaj2OhH3UqdGG7YPQukt6tetmu0N6J0u96MMmhAu4zkQOBsu7gLudtngT7JCB5WGNYtNVuesmxL55TGO8CMv6FquwiDGMiwidvD3iLIJ+U7jripOgODu+NeuZMv4u3lKa42FiKUjF6FIZDFUDUZjiJLasiTCMgaTxv6tkurO8DzmMHSt70wPziLYLCtlHinXlzKPskZjXvD6qwQdcy7tyCmLHTd0eWTtIeI36na6Uqk6gXxNDAcntHQgbnsirbHZtabZwz7YtVRioCUHzE5jkxujLDG25Gj23vvBwibiqrlibh-Bsfs7rbNVbbg5u5ptirIEyDPqUAIfWOeksgGF+DkaSLYd0ezAPH9CruPSfC-r9s6vNaKcccHbccw7nDDbketSxTuahbzBBDMffa5XuZOhWjGTD08jfAKetYti7PlQueJb5NRenYMEXaUBXbzEMdHhk7FUBBhTbgSIfZlw-C51nVNbPoykq5trqd4DO4+uu6Vcdq0sYD0vFMedYzjC4voTLGZi2Gh6gamRYQbBBBpBqIN6bv0BrXlcpvu6qf1cacMFOQgQ6fmu55dBC59CfA7wnh9oeADQ9FuDMOTpqrGpVEthcCznKBy2fUsKVuOHOGneLrKD0PaFg22JcjmXU26ageDf5z0TysTMbAnw2ildTUOQZ4fqTgCAAAqDb4PJimnC3nuun3z3auSXshWWJKwPgpMHg2CPXsQ0GYWXo1AmF8ASEJLutWMdsCQ65zD0sOk2c9ICxHwbZZ5QLFd2jSzpQpwUYNUTYEAFPzws9fQuEtIG4bLQe9IHmUKBarwvwYB97JLJw5QQ2lwAvgUgwDs5EEiguHL2kVGiwXIp9MbZ4dndpgYko0X4YSoKoFQ6osYWokO-P+9qcdgm4BlBneE2YXIZnaw8rjo0i17VGEmCGKlXeAoPYfYavC4LIXNZaVIPNrI24l7d0IbZ1Hs7rY3urOiVQ+A0q6AYf3YeQiJ0gyApwUfXpxkWE6seafgIwIwxYBVky+YjKfUxJTcHEYkTS5fdgzR+E+5+52c4nKQYIUi5pdoSw55aT5VPt5j3f2k5oHvhVcQbZXRekxOw0Qw7X-gMsG7jzAMlZXWoMRU4MW2Yg5fADzgmkH34XqN8sYKweth+M+E8lD7rEwcEt+sYcS0Ec5fg9CwBE7IeKAcgAb5wY+2SCuusHqzas7So8ceGmkniA0YIs8Unoh1tg8ghox4GRAGRtCTMzCpTSEE9gVh+FjUHCIBNwkbpvw5+TgVSDBQ0gi83Wq-eRENCUQDAdwm4O6AMBnQt560qvZ3l0iMpexIQ0ibpEC07aggZ2hqXcG9EkGT9X+9GKTNwLuS8Ao+hYMEL9mNJSJxou5R6AKUyIjRDUdECujbSU6QQo+2Yf4GC1F6chPstKQjP0gDw0coK4-BXjdzoAOcoucWTjlKh2xwEzB2SdFjzUKyJAY6-mD6B9lBA8h0IeHTPjASoKKDzoyPNHLcwMq3NbQmYN4rNlVZ91T6tIMvC-0V4q01CAoKPmENBCAYbQziLBqfmujWcC2weQpMd1BJJENKUfEojM3QTshi84wevnpDmB9BXgwnHSEo1G579jgRxSYpDhmK7Rf+u4MEDyHzQcgnAGwBwEn1KbWCk66kKjNALYQkkySwJaElSSgg0lu+X0FomknGZpAhklWVYGSCZbrgTw6EdGo6SxTxkvc5fDMEuAyB+dhBjsHFmCCvRGdHETgHkHBgrJ2Yc+1ZWsszSRgNlz+k9d3ikkCA9koQ-GGPgOhRLlwC4kVViqH1MF8C0BngdcmIX8oxM8IA0angNyCCw0psdgU3mwgm4vU5qgNc-pGXBToDVgJ4T4sWA8wl5PAZGAEC4M56sRfqjIrat+G77KxzQd0LkF4kwYQgEawwfoF-k8CYMgeMQyhp82xpaUKe8EZAEGV+Du8bmomQYKPk3Syg8Al0KyoKWNIRlyI4yUIDPEThEBAq5YQ0eRjF6eBQgKFKAOQAtGmgBi1o8jJqzOaj53kEAeQJEHLChAFASFX0R6hIjPBywF9DcDaODH2jA0ZlN0aIWk4VshRhQj-oiwdrItCUUfZbGIhGBfDvhKIwNCkFxiydz4xefOhzwHa6tU6UwvEagMp5gZBMoWcuLMKPQhDMBYib4CkHGBZU6IdI0pLsMXoIw66K9QSGvSgC-8DUggwYqu2WFapehp1SiADxLhiE76mfcBk-VgLxCzBERH0lf1wjKxWQIQ9qGIiGJnx80wKbYdAQ1Gr4aG8uPwRMEoibgRgMReinE30iTB3g5cS0oWEHrBkIOWTKPm2WcA44oK02KmuSNhB4wPAGwbwEMVvzqin2IYKPtgT6C0hOipIDchy0PzDib8LiAICZEi5KcYuYAX-jaGGiGo3ukogYJmG3BnVsEPIE8qwM5LA91qDkKblV1LEqiS6eadotZx96o0t4IBG+gohfHxE7uDkM7kulaGJBhxIyInNHRGjywNgMzAFC9C0iTiOUDI0HjDyzyliFmYkpEecg5B+dnoJYF0CMGPJ3RvG2QTIEAA */
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

          'Apply timeframe': {
            target: 'Applying timeframe',
            actions: 'setCurrentTimeframe',
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

      'Loading mosaic': {
        invoke: {
          src: 'fetchLatestMosaicTimeframe',
          onDone: {
            target: 'Prediction ready',
            actions: ['setCurrentTimeframe', 'setCurrentShare'],
          },
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
