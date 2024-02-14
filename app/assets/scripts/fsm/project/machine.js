import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsZ7MLhvQisRxhy0DVEXGmYhjFoGMgn63p2UsSjVUmNb5kAgTZhQIMLQaB4BJfOHMwUUhxHdLCU8ec3GZlGcXFk5c9mOEjTc6NYTG3NpYGACw7AgbSuMfeYSfYu1KtpOTZWQRlwJELJCdIA16JiI8L8N0m4oQ2HiDO21c6cR3jEK09dfZZRbvTXJOBrUCLDAtAM49nhy66RmARb4WFaToUPpTadbLUocrrXcmNLkjBZRwCwNsJAOBKjffgbyrq15dOMgsWEx5dy-HLMc0mFFNx3TPuWA1xrGz8BVDa01VTeB6gVTYroe8XCjrsMsfpUUZhwjsIsDcwxvAbFPF4S+1akMsTY5GTj3LKg8cTBm-jiBBM7jLdmbSYn3Z2jEb89C-xKSvAzKxpsHHZ3ceoLiPjCSBPnKE0Z0T2ZxOIGhJ5r45dvh0W8LhY1Io7JTw-j3SB-dB4lI5ZF6oa7IIQKgaoZeegd1Y2zIWVSE6kiDWwn5hA0IlhYR6oyPCXIESIemsKN8lSJCZYcjQCVcMnzFQ00igQX5qAdalecXgY8Qw5a6MeO0FoXY+o+jmOkeloQni9hSDcxkXo+GNU1tQLW13taoZ1haFiuMaD6wNg7Q2sS8vG-5hW4jlbSOo7e92faKYOF+MMdku4tvNda6Gc7krpBHZ6w8M7g3pBkB25l+Z2KOCyiym+l1bn3WzH7fuKEGRtLKWHRJ1V4jvhRAIkEFYCGr4qZskIEbLYQftAEMl1Q0N9uA+w2AaCsBF4D07cRv9WMqW43QthJYim6IQvdrhcjkwQQ5k5JpGwxrKfUFGzKGnp2uBpsqhKvAip9HlUoFIJHun3P+ahOaUyAWoQsnoo4A+PICuDGGEFh99Xh7HAV0r473KHm6-1yVcUEp218Bu2VqEzgqKBBPBhWEKx3a-CdOFaEsJEh+FZWThrruqcORVy5kQ3uY5+4DyOMQq6g+QkGKpbMa5CxhSLIt7eFMbRRBhJpLYzu2Fu+p0507OewB6+hmoT936S-+EwoMXolpPBRDM7hcRBqNyu3vXCeXGfled+z7gHvPus+jnQFAfiJfQtYXOaFtBQxreLfTi4QzyCfjsiUUvxXHen207fDPVAI41nzJtREg3v7M1bIx8yLEARBFI9H4O7GyOaKfIEFCG6KCGMPfu7lnlHCduYrDk+AjkRsjt8mVhehaL8rLvdMoqTGXopuRMZDuNpBMFWn-KUu3pnqvsgZpqgLwNhrhjIK-jqCXhkv0D4BuOXNZk4KVu1LjByDvFyKCD4HLq3rQcvh7r1ihsiiwThhwDgA6k6pwdzn-v5rwZRKCD8EEDuBsGem4sZM4D8IaoRDaMkKCEpjQUllFvQUxDFl-HFj-HYSxPTmukPOlovNDoIpoXprMDRsyKAaIk7CCotiyPYnaLhLdL8OyCnspmnvQISmBEBAwvwOJJBLxobijnEGIiCJLoWB4MeHhNuOyJhGyJsMMJsB4E7qni7ikWkSwBkY0rtPUGjL-oERyOaFZldLaMuLnNuBbosIythOLA4Ike4TZKkeBK0VkbxJoHiLkdgasMNFCoaoahfOhPENuKOlhJLsZAkHEJpLYYlixAAGrPyUBgL8DxzmLZFB52xOALCsi-C7glaJA7jbgZB9DoROxY7kE-DGpXFF63HSD7QPGLGdHNRG5tSPQnKl7J6KaBClZRC27eBHqlEGFTHnEMzsAgQkBhAthRLNEIxq7PwCB4ogRpHQwtZglxwPhvpPHHjzClgsjDAyIFKKbgHZjiKDQmY5h9J1YNFsI3gEkMLEkOSkkxKSQUmVQiigRKjATRJATknoBgJiAsmDFewyIyLoR7rnLGESbzaqSlpjBBAeBsik5JGNGsQSlEkkk0mylQTyl05KnSAylqlykanPw6ZdFwm2BRFYQcjLjnyeA8nn7RBEwJF8Gsh4Ty6bpwANwIyEqro5EBko4EC1YxA+BKJ0R4QBozBS4FEJDzAjArCMhFKim0FJlYpxxpmvgdFYGpxcjOCUi3QDChp4TGk-InzSY36Zy7hGmsYrprpVD4CwxQBvpxz7Spr9hPFoLvDfBQgao7i-JmbXRjB-DlnGb-BnHwpJYaAPhQDCotgrLZHoawCYasF4YtKEY-6wlZkuxgggh+I7k5hLBn7FmUYWh3S4RRD+CPRSE1lHnUAnlnkOQXm8RfikAwCoBszs7CqXYsD4YFCYErHryGqYTYSDER4aRchHKTAxC0irgnji64mHkeHHmUCnmoDnlgAdiXkak7QVBoUPmLmGqm67hcihGbgbgOieCvl7zDDxnHwRY0V0UMVMW8SorPLelQRvIfLkCLmFixTYQOJcnnICVFoZiX5fGDF-BxASXgW0WQUyjQU-hyULHNJvr8CLkPaLDKz4SbCDCsgOgbh9D+DUZjByYRkmUQX0VQWMXtFGImIf7mJf6AQOW27QjrawGgh-BHIlj3qBBUj6mQgBVmVBUWUhXZEbTf4qlkn6xxIBGBkjDYTDRHETDaWaS7hZLsghkfFLDHwMTSFgWBXSXtH8rKVCoiqajioXbSAypyqcVsmnj4Q7jkRsicilYsiwj9CTUTrraTTtUsQLpiBSkyjLqrrRbdwuF9xuF4mNZNqbUtg7WvhTw+ECIrxlXPnLgLC+yUY8j5FLCCVOCqSwHoTaQXoWRrUMwtJroXWpa8T7V0DfwJZUUA12XnUrqXUtxfjXV+G3UtnwJjAiFuWrCKYmRwgOiwg5pvRwhiGUU1oU6PJoo6izmA0Ll3XYG2DJAj4DCgGFjGaggeV7gjAggYQ1VvSwqgUsTWWU0Izq6tLNmYXwLQHDSc0shEybhOB406oUHKLZIiYRYOEyivLYq4oEqErOHg2uGQ2k3CieFTyoVa3SA61I0PAo3i1KpY6H5AlfBJ4Oi-BHysmKYjBhRq0pam1Yo4oW1EoCA0J5T0KMJ5TMLTHG3q1xx+3a1EpW1Za6BB4giGrDSKaSFXQcg44epcjLlC5kE+rlyJlKgjiQntFPHGRrHnI-XHhRDZgLYml-KUwm7i5GUHlG3awOlswIz+0kCpoUI6LPw74PISpv7xwtgRUWLf4V3-DOBZ0AaLgrBBDbisiYS7h6HN12BRDGrimwCEnd2SS9392gI8LD1-iLxgDQyT1RUYWZl02C5Oi+VY1Xo2h7F4SfXeWjCqrGTGoDhUJv6P4oEZlPnYEjDXSDB2jnJSKBD5ysj7hxUPZDCwg2mR3HB-04peEMH+kgMmjHgeI34ZBIKFlCFcnTYBDJ6vAbgk3k7CiC0wRWoNxIFg0Q0sJQ20Pk1tHQQMNyEPAJ0wK00mjraPWbguJvBqzjB40dQyKhaaRwipCJlJpZQ8phI9WCoJog7zlB6Y4FFqUqJ3T0RzUrCYS8XlwbgmaaTUHHWu7DjJrKM4hDgjhVCKMpqkA8xq4-o4PzgFmvkWMTU1GFgOjsi4ygjlwJCe0fEKO2MLJ1BvgQBARONRPXmOrMkCNeNWnYJ5iaTfDO2BofZOXrj9K0Qim2lt42NKPRODjDiJpROQ694lQMIARaOaTmhxCLgpA+BLAN0eqTC9FvBWkGrkR80lO1nON2N1DUngnVPlM4ANN4a9hOqwBNMjAuAjSno0QZgOgZhiJwhlouWESKaRPlP3KqP3w4DCqiojhM6dYjUeMdKBF0TLPE6Zjp00xzWbDMg7gZiUiERtX81k2jMVMiAAtVBPLoqPl3Nwk-CeD3adMInnK41uJSKLCWmqx1Ht00PWPAsxqC0YqKXm34pEpaOkguCrBhZuC-CGM-C6p4MRmpWxCHPNyRzd697xNlM0ACB5C76bRB5GmxQW67jaTaRxD0jLg5j3bGSkgCv0v-XsOjNczMs+4JNKMCCqHJOtI8uTFYQSJ10BCv2BofT9Cj74QcjzA8gMtK4CDuMa5UJa5Xa57gturYFH59CMZE00yES9kIAsj3pYR9paW3ot5-Oyu2Pyvr4su+5troAdoatuj-J-DLhmRLDgY51QjrG36shfP3rmuhv2sRuSgF4tHF6pOtRGlmH3QKL3pfRFmICMiaQxCV1jHAooNWP0BAshsmwKt94bpfqTgxvkz4RfPbnWbVteuhnSbUo7FR7UPJF0BttKM5sb7Qxb6ct77FtYzwu4zkQOCCtUaFlHIVYrgXoEzzDTt2lzuMsCAv55SOO8A8vBFdlLZ1GwgjsUj7rIKUjLjBagjZsdtsuoFsHB3lJB7xFiKUj3qFIZAtWbN6U0Yy2TCMgaQ-tMt-tabmLKH2pqsaGo2tQfYLArlHgUvlxzU6lbN3Qn6qxIeXszxyCmLHRT3RVrsCb40hkh6Uoy7Jtev7EnhbHQhvnsg-ZQ57YA5wxg5DVRjMEP5jaMfWA5jkxujLB+COJ2gjs7hQZwibiqrlibh-ACd65-aDWA50755RtirodOQgSUC32eO2zevIv6G0jHhbMcd2DXTzYFyfCQantsLbZ6dCfg6ifM7nDXbScICxR5a1YnuMgfE+Cet5ZOhWjGRDCV3fC6e7YthXPlQBeda1Npcw5sHw6UCI5PFDDl6lFniFjBYeDbgSL45lw-A-VOCBvDMcobVbV5v+4md4Be6LtAStr5udccsYBcuNMhfjBUuwZ4SZgJE14QamTQaOJpBqKL4yvHCtcth9cdcdpGeRsdq3kyCnWWcOskZKp+rggWMaQ+JxAjtpBjrkgZh2hqpbanVtf96bqTgCAAAq3b36e35nReVnELKOBq9ioURjRHiQA0XICwCbOYhEkw5yzbbD2sgNLYr3PbfYetLDqDt4KPDkaP36fD-h2HticQcnFG2NiQNI2d+kSUFMHJ4hG4yCO9uPMo+P73zDBtrDHdOPMNeP33k4hPK8MJgPqxQByL6EpcxcuEz0+EiwYWjIRNPzCGXo1ALF8ASELbttWMdsx6-QfwHtMsZ4nrzx4ItINRTg16GEkapwUYNUTYEAWvzwW9fQuEZv-F2kYjIr-bj0BarwvwFBxT2PJw5QV2lwjvgUgwDs5EEiFuXTswNocnXIV6ysssXnpSgYko6X4YSoKoFQ6osYWoDODvd9qcdgm4Tl3reE2YXIHHawWrjo0i77BzK39AamOVrYIVQ8PYfY4fC4LIUtZaVIMt7lek9uDsRhFXMKoTiZOiE5I46jY42+TJ0gyApwvf2ZxkWE6seafgIwIwxY5MAQ0IGwjKfUzP7EQOXENl6-dgax+EAwsuKQM124KQYIUiMZdoSb3t+nrjN-HvPBvmC3ikETz0hWQvRIYGN38AyxNsLfOgLNDXRHZQYRUcGIDjEDr84qzgWRhAx5BC5qeRxd4FXgSL4x8ITXIPjrHeQI0YIYcJaBHHX4AYFgBEdkPFAORxV84-fbJEZXWArVjUo8ceGmkniUDqO7cdXtZ2148ghox4GRIWRtAbNIiIIfHJjgViFEeBJCB+G0AHpvw-+H1PdARBPBkp0SIrIaEogGA7gGMOkR9CgWia99BCLrSENIm6TwsX2oITdoal3BvRXBIFZrqpgcw8NnMvfQsGCBJwRkpE40b8j8m+AiF1IKLOiEZW-4g0vwvfbMP8GRZm9OQBOWlBJn6Tl42OpFT-oHxbZ0AfOaXNrMJylTA5V8iQ7JCSxlqTZKeL2QiPjkSoEREg37WAXQRXxP5MYjrE0M5XNBQgvmtoTMJiXqHmhZ6L9K9MeDiEd4mIvfA1qCE-Y2hnEVDcAtdB95Vsq8hSY1LMXSIM5r+JfLpDaHETLhqsp4eNvv1H4yI+grweTjpAMbLcg2xwUEjcQZz3FdodA3cGCBeofEKuGwBwD8XkFpDC6UQ1YDvS7pOlVScceUjfy+jrE0kk3G7tT2kRkheW64E8OhETJfpkyDZVdOvwzBLgMgQQQdKsEdgeUps31PwGNAq5mtYB9YMci2Dn5TkZywtJGPOXQHr0K+KSNKv8ChBmZ++A6VkmBkehZUpKwVGSgkP2G2x1Or5KwtViyZflz0cIaDEEGxrUYXOT3ZtLDV2oI10BVZcFOIOJHi4X2HIfdIQ1eBKxaIzPXnttThrxCb+ysc0HdCh6z0P26EPGoBgNSDAVE3zRMqCyFqSQRa-ALXvBGQAepPKFfT5jZk9GhA30soPAJdF8pmkIylZciOMlCAzxE4RAD1Pej6FoI5MZjTwKEHopQByAcY00McUTFyYTWzzM-O8ggDyBIg5YUIAoFooliPUJEZ4MxnbJDDCIVY1MYGjDEW4Ix+YxHtz1sg+1KBsdAOoSl75fYxEIwAkYSLsHDJkg4iOfL8JdiXI2hcAKpmXUgh0CAUW-T0QQytLU9JBYiCIS1Rqp0Q0+HKXevvTjhH15SgkU+lAH3FMhjihqBmr8K1Sj8KWuhRICXCsI-1YB6DABvQU6HnRuh84JIVcNETbwD0OYfOBkBWyu8fgPFdkOixnZ0MuGgqLPJUImCURNwIwOovGTkQ-JJg7wUxrEELAAYxgljJHq2xQ7VJe+q5ZwMLlIrQgK8uxRFgtRP5INvApxeAluLlYhhe+-BPoDBnxpP9FhWSafG6HUjyZJk1ZLwTZCKH6cMuYAOgYcJVhchYQHrQzNuEa7YIeQgFEwXqXVFnUHIG3AvDONAz1s80WxH3rXxZCUSS4j0eYeckwl2k1ufPAfJOBnEaphoboCIRIjVjPRiKE1D2GaPEaWjhwqPfnj3wlEk8wU96fcmfAIj4Qwh+kV2P8gAp0SoWnobIEAA */
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

          'Mosaic was selected': {
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
          src: 'activatePredictionRunInstance',
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
