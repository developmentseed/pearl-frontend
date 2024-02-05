import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsZ7MLhvQisRxhy0DVEXGmYhjFoGMgn63p2UsSjVUmNb5kAgTZhQIMLQaB4BJfOHMwUUhxHdLCU8ec3GZlGcXFk5c9mOEjTc6NYSXJGCyjgFgbYSAcCVGIAo3lXVry6YNfoQQPCfA0j8Z6lJ9zHvQkFS5bLUocsbPwFUNrTVVN4HqBVNiuh7xcKOuwyx+lRRmHCOwiwNzDG8BsU8XhL7VrvSxB9kZn3csqG+xMGbP2IG-TuMt2ZtIAfdnaMRvz0L-EpK8DMxqENPtna+6guIP0JK-ecn9OH-3ZkA4gaEzGvjl2+HRbwuFjUijslPD+PdIH90HiUjlwnqhA12hAqBqhl56C7a1bMhZVITqSINbCHGEDQiWFhHqjI8JcgRLe6awo3yVIkMphyNAJVwyfMVJDSKBBfmoE5qV5xeBjxDGprGx47QWhdj6j6OY6R6WhCeL2FINzGRej4Y1Nm1B2fk45qhzmFoWJfRoDzXmss+axLywLWyFbiOVtI340Iojuz7RTBwvxhjsl3Cl2z9nQyFcldIHLbmHgFe89IMgaXlPzOxRwWUWVN0uoY+62Y-b9xQgyNpZSw6gOqvEd8KIBEggrGnZZ4exwhB+ZbP19oAhZOqGhplnrK6wDQVgIvAenad1wNalS3G6FsJLGg3RCF7tcILDhKyOKnJNI2GNSd6g-mZTnfy1wNNlUJV4EVPo8qlApCzfQ4xzjUJzSmS41CFk9FHAHx5FpwYwwePxCh6dhy8O6MiAx1jkq4oJTtr4GVvHOqqKBBPBhWEKx3a-CdOFaEsJEh+FZVfODNloew9y9yh5LOY7s85yOMQ7BXtze+QZ8zqlsxrkLGFIs0Xt4UxtFEGEmktiHbYQrs7NH8vM7AJj6Gag+yymEn2bn+vTwuGXDYOEbJPB1ei-4MRfxEgbldsHuEdOYdO9tQN137ugKM9HOgKA-E-dUucL1fjaChhk+i+nFw2HkE-HZEoxPivGcCDfDPVAI41nzJtRE7Hcl3tY0hHCZksQCIRUen4d2bJzSn0CFCN0oIxh1+T3lujdbxtrqfNN7duuTSJGzBaX5EP7rKNJoMYakLjI7m0hMKtf9SmO4Z87pf9+UPmNXWqZvOo88ZIPXm8upGnD6farjByDvFyKCD4JDvbjfvTnDvflHIvk-iuqvjgA6k6u-m9pmlsj4BPoUj8EEDuBsOkANMZM4D8IaoRDaMkKCDBtfjJiJnfkxGJl-BJj-NQSxFdvJkPIpovGNoImgRhrMOWJhMCsRJpE7CCtFiyPYnaLhLdL8OyDLrBlZscISmBEBAwvwOJJBO+jjvNnEGIiCJMOMDIsuJpKXjMOxphGyJsMMJsB4LThARysoeBGoY0rtPUGjN3ugT8kMMNNHjaLaMuLnNuMTosIythOLA4PISwTZI4aoddhobxJoHiNoXrqsMNFCoaoahfOhPENuKOlhAYcZAkHEJpFQdJixAAGrPyUBgL8DxzmKaF+52xOALCsi-C7h6bb6mGRAZB9DoROyrZn4-DGqVFa41HSD7T1EJHuHNS45tSPQnKQgjDEQj76ZRAU7eDGHHgsjLiRFlEMzsAgQkBhAthRIqFxyI7PwCB4ogQqHQx2ajFxwPibqNHHjzClgsjDAyIFLQZj477byHhLA4F2jGo3gHEMLHEOSnExKSQXGVQiigRKjATRJAQIywkvEBFewyIyLoS0i9QEHiHJCqSlpjCHqWgHay6KG3hglHEnE3HQlQSwmXYInSBQkokwnoBgJiBoYeF8G2ASFYQcjLjnyeA-Fl7RBExyEbjeBsjkkKFHb0AiDe5wANwIyEra5aE8mzEEAG7eBXocgmEBozAghsj9AJDzAjArCMhFIUnyl0CKn-gqmSRqmvhuGb6oRcjOCUi3QDChp4T4kzBfFOhvC7iZy7jnJX57HCj1gWBzTo5ZZQCbpxz7Spr9iNFoLvDfBQgao7i-IEbXRjB-Dmm4b-ClHwoyYaAPhQDCotgrKaELqwBLoIHrotL4Ab7JHrxRBgggh+KFk5hLBdEIADDkQWh3S4RRD+CPTgE2lsIigVmUBVmoA1lgAdiaFfikAwCoBsxPbCrFYsAbpbpd4zHzYECbCYTYQBEC4nq6RGmDALDeqrgnhA67FlmsFzkLlLkrm8QLpI5Rj7mtmHkdK8lWHGY5gFw+CbgbgOieBdl7zDCsgFp27TmlKznUCVnVkOS1m8SorPJslQRvIfLkBpmFixTYQOJfHnKQVFoZgV7b4BF-BxBCZvnoUyiYU-jYXxHNKbr8BplVaLDKz4SnkGEOgbh9D+A1ZjAQYimMWoXznMWtjLmuFGImJt7mId6AQ8UU7QiJYz6gh-BHIljB6BBUjYmQjSVoWLkYUKWaEbSd5IlnGxJmIvHQbmjQaJATAUUmH+k-KsjkyrDtFLDHwMT2GvkyXvmWWfk-j8oEVCoiqajipFbSAypyppmkFYQ5k7jkSh7+AOjZH9D4RmQCWtYpZNpiAQkyhgAxmviibdyMF9zMGRnHCNrNotgVXa5TycECIry8FanAYLC+zHi-BOAiFeWDmFiekz5Xq0gFIWZIUcp3hcUtWVXyaaE1V0DfxSYvkMwtLyatVVUtxfgdXcFdVum2zaTIJpWTCrCuWFhwgOiwg5pvQh4siBBQ6PJoo6hJnbWpndXHnFqYS4Yj6Fi4agjCV7gjAggYTuVvSwqzUsTsUfUIxI6tKuntnwJT7DTg0shEybhOB3U6rn7KLZJ-pCa0EyivLYq4oEqEoMFrVMEbU1o2RsFTx7kU3SBU2HUPDHWo1KqrZYSuXFp+BS4Oi-BHyvHQZLEeAk1ybM1Yo4ps1EoCA0J5T0KMJ5TMJRHChM37Us1y34pEoc0qa6B+4giGrDTQZgFXQcjrYepcgZm-bkSQrkQw1ykO5wDDh1GuGNHGSpHnLaSSJRDZhRZAZaQxBW3eIsj0WlkM3CigmwCHFswIxy0kCpoUI6LPzZ4PISot7xwtgqUWKd5e3-AF6cgERHhDAESGmRCsiYS7igg-BW12BRAgnUkJ2SRJ0p2gI8IZ1-iLxgDQx51qVtmanHk-ZBl4RXUeDka5F4SqTfDNFuiqrGTGoDhUIt4L7K5+4jDXSDB2jnJSKBD5ysj7haVVZDCwiyka3HAr04rsEwHclHl67HgeLV4ZBIJ4SFiEH0ShYBDS6vAbjPnR3HZvUuHQRWoNwN6rXrUsKbXCjw0wRgNK5IoG0wI-UpF-B9WbguJvBqzjB3UdRGE+r-Dg5R1y6wPDjJo8phJRWCoJr9Ypl+4rZ6HEUqJ3T0T6YeiCFNZugQXJD+zBXy7kNZSUM4hDgjhVBJpCOOQ8yI7prD1650R7iVrsh4HB4f2Brsi4ygjlwJBLHtGvUSMpr3JvgQBATiMUN7m9hOoMNHrYJ5giHMpyIerNZ8Xrj9K0QzUu036COGMxqiOJrmMjbu4lQMIATWMggxD0SDApA+BLBB0eqTAuVvBHoGpO36PmP3LXFjH+OSM4AhPrqWObqwDWMjAuAjSQh4RxAZg5W7jiITDgbGSETQZpOSP3LUP3w4DCqioji3bOZJWyMP0mh0QlN7aZjm00zsObDMg7gZiUiERBWw0CMGPCM1LeM8pPLooAVup64-CeCVaxPzHnK3VuJSKLCHqqy2EkOUl2mrMLIrPrMI2Yqs163EqoODOkguB+Xi0DU8jCU-C6pP0imGWxDNPNyRxp6s5mNCMCB5A56bR+7hmxTE67jaTaRxD0jLg5iVbGSkjIvAv8NkNLNczgvQyQs0ACBIGOpcX9OAWzHnI7LGRTVcgBA2jDKET9CDA5n6nfYguw4CAyPI5UKo4laq6bO7qtTnKMjgpEMDBhFjA5XB5YR9rkWbjJA8tEu4Bu6s6tqSga7wtRAE6SxB7PUDAOjfC9HtHKwTrWFqsmzEtATasc7oAdosBa6vh6sz3xS729BfSV0ICMiaSh08ihHAoX0NUKmrPqsivSrGL3g+7UtbMmhhrkz4QzMFmka+uOhBnUrZFC4AOkNAOEu2savp6IN6Iwu56vPziHO4zkQOAou7gNsZtngV7JBG7SHJb4sFsUNcxN55RiO8DwsCHsvn2GqMiwgZvl3iLIKUjLi8agg2tgs3MTYsBK3lJ+6yFiKUjB6FIZABU5XUUCFY2TCMgaQLsPJLPwEv72qUvOrrtXSLDUxKz2xQUKsZjTvF6qxnu9tyCmLHT53qWVutQ1bvCrBQjlyi6tvC3eEniZHQjdnsjtajYZbdZwyDYJVRioBQGNE5jkxujLCC3+G+s7jfC1Obiqrlibh-CIeY6dbxU9aXbq5OtipXtOQgSUBD0DOoQsiCF+AQaSJvvXmRBLH9CtuPSfAEQvWdv0CpY0fIdDZod3bnClaAdYwnnOB2DkUYTmlrADkRHBpRAaRBBjneChswONUdZycJUKfOaBPpYhLLtTaUAzaNHeFHgQ4BUBBhTbgSJbZlw-B+1DXFXNUOQOsa4q6atq5tpMd4DQsYCwuhMqddDjB-PoStGZhyFm4BmmRYQbBGeZhqIJ5Sd0BNWlUtihfRcMdRfOssclXseis95Jd+rgiaQk4+JxC+tpBjrkgZh2hqrGoxEthcANnKA01QOX30ADcORDdLrIM8EnW2JciiWQ18bHu5f5xf1EEfS0U2gzop71phIldsye6xuTh+4SfJJBCzumYzvPSPS6qpC-D+AUGmeAPSclVlXRte5xsCAAAqMb3uk4TZMgtXHHNL82JtNbwW3xKwPgpMHg2CGXsQT3FmXo1AHJcABoYb3NqnMi-eks4tMsZ4I1TR4INokNJ4fgOjHj43Jw5QHANUTYEA2PzwjdfQuEtIG4KLxu6LybYnGQrwvw5+1PYbtPmItzzPgUgwDs5EEixOcTswNouHXIk9lrZ4ebVzgYkoLYYYCoSoKoFQ6osYWo12TPcjqcdgm4fF3HeE2YXIgn+k2EWEF8jIe+ivlGTYFlLFClQ8PYfYEvC4LIGNZaVIWNrI24k7d0fwY1MK2jr1OiVQ+A0q6AWeAoWeTx0gyApw-v2pxkWE6seafgIwIwxYvlky+YjKfUIJTcHEYkTS2fGnvPQ5Q52cRHKQYIUiEpdoSwU5njNB0tU3Tk9f2k5o1vflcQWZORekoOw0QwyX-gMsHbCzAMsZOWoMRU4MPWYg2fWlzgmky3PIv21t+kiQ7wJuch+M+EiFvfLEOs7y2tBs4c0o2fpdCwBE7I8UByWl+cgf2S9F6wiWlzW0qPHHhppJ49-WePADN6oQeQQ0Y8DInfp+EByfwcJpCBWwKx9CxqDhEAm4Sp034Q-JwKpEfIaR2eKrSfvIiGhKIBgO4TcHdAGC7c4C1Sf3n-j6AwppE3SQ5hm1BA1tDUIZG0DwJ7408qMpbWjP70LBgh9sIpKRONAHKPRCSHIPwnRFuj0UpatHSCP72zD-BTmHPTkNtlpRAZ+khuSlEMBSBd9heZnaThZ214ocpUfWe-OoOyQfMsawWE-vVjZanIXe6ET9kV1vzQE9umMBNvOH4rmgoQMzW0JmA2KuCR+MWTwLSDDxX8aeWtaAkxH94fRVIEwPAuZAL5j5roYnH1ibkKT9czizhDikwJtC1N0EyjKPsXz0hzA+grwPDjpDYaFcl+xwEYtUWuwe01BUA22E4D3A8h80HIJwBsAcDh9wmOgn1KOh8CrBm6cdcErSWRLnEOSz8evl9DSJpIKmnXI-tIjJAIt1wFPOwi0PDZKksUccZ0ngGz4ZglwGQIIIOlWCOxfmYIK9Lx0cROAeQlGGMvJgT7xlEyiNJGCmW3610reKSIyv8ChAEZA+A6V4uXALhmVZKnveShFW37QV9wPZStN8DwgDQEgYIMIpdQlwYQRgQXUrg5F2rLVvwSI-vJH0GFYltixYTTCHhiFKxaIVfBasSKWpTx6+ysc0HdC5BeI-6EIO6sMH6C0UVEszV6vcwxScVWk2PeCMgA9QiUre0zMjIMFLybpZQ5w7GBJSJIilLS5EcZKEBniJwiAHqYPMELQQQZOengUIIuSgDkB1RtgIolqIgz6lRmped5BAHkCRBywoQBQPOVtEeoSIzwcsDPQ3DajnReowNPKOJyKiLRL3fNgGFJpxxZalNIlP71axiIRg1wm4X3mGSEkKO58YPAHQjLmDrmSoEcBMV2jP8AUefZUS-SPRH84BYib4CkHGDuU6I6vW0rHXjpxx26sJQSF3SgCVimQRRQ1K22GFaoahg1SiBsDNLkZ-ABw6-jZGvpr078fg86AEPUyWEYgoibeMrFZBH92oYiEomfHzTApABrte5vA0FSM57BEwSiJuBGC2F4KjjfSJMHeDlwpShYUumMCLGvdrmF7Rgd0KxhZlnAf2WkGByNxkCfkJzacWfW8AlE583giNiGH94-4+gtIbIqSG7Ly8h8jY2fC4gCAmRqOdnBzNYLADP8yhKsRbpyIGCZhtwQ1bBDyHHJUCsShIj7uVw7SpjPAzgFNhuEyJid7eQON8SXEeiggFEZ40pJNxlDTdlATAxII2JGQg4raI0eWBsFqYAoXoWkdsWwkO4thjuAPP3oBKS6K9Q60uK3ByBuG3clwAhaDEOQ3AIdsgmQIAA */
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
