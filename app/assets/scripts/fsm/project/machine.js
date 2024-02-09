import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsZ7MLhvQisRxhy0DVEXGmYhjFoGMgn63p2UsSjVUmNb5kAgTZhQIMLQaB4BJfOHMwUUhxHdLCU8ec3GZlGcXFk5c9mOEjTc6NYSXJGCyjgFgbYSAcCVGIAo3lXVry6YNfoQQPCfA0j8Z6lJ9zHvQkFS5bLUocrrXchtTaxBszUH2WUwk+xdqVaCXG3jIQZGtLhLJ56MiwgmO9JYBDb3TUCbO+tYS7ybv4NK4x95P3prknA1qBFhgWgGQkCYsQuRZO+FhWk6FD6U2nTB4eDYmwqhtaaqpvA9QKpsV0PeLhR12GWP0qKMw4R2EWBuYY3gNini8Jfatd6WKNn4Ix+DdzWOJgzRxxAXGdxluzNpfj7s7RiN+ehf4lJXgZmNfJyMTHuWVBU3iNTCTOPnO49pvj2YBOIGhM5r45dvh0W8LhY1Io7JTw-j3SB-dB4lI5cF6oQNdoQKgaoZeehv1Y2zIWVSE6kiDWwh5hA0IlhYR6oyPCXIES0bYW+SpEhksORoBKuGT5irWaRQIL81BGtSvOLwMeIY0tdGPHaC0LsfUfRzHSPS0ITxewpBuYyL0fDGuq2oWr8WGtUKawtCxzGNDtc65t7rWJeUDc8wrcRytpG-GhFEd2faKYOF+MMdku5ls1bq6GA7krpDbdaw8fbXXpBkFW8l+Z2KOCyiypul17HHORH7fuKEGRtLKWHYJ1V4jvhRAIkEFYNGr6yZskIXrLY-vtAELF1Q0MNvfZXWAaCsBF4D07Tu7DWMqW43QthKDHI7r+HdrhBYcJWRxU5JpGwxrifUD6zKMne2uBpsqhKvAip9HlUoFIGHDn3UFahOaUyXmoQsnoo4A+PIsuDGGD5+IkuScOTl9QB56vNclXFBKdtfBTu651VRQIJ4MKwhWO7X4TpwrQlhIkPwrKCeweOFLmXO3uVO7ABrmObuPcjjEOwFnsOdeQkGKpbMa5CxhSLFN7eFMbRRBhJpLYlXSnx9J0px3IhnfQzfehycXvISnhcMuGwcI2SeFu1N-wYi-iJA3K7AfcJbfS6b7a-7reU8u4d6OdAUB+Ld-81hc5-m0FDFN1N9OLgtPIJ+OyJRc+E8O4EG+GeqARxrPmTaiJWusOZq2Uj5ksQCIRUen4O7GyOaKfIEFCG6KCGMNfgvrto7g+uYuDk+FDturnt8gVvRMkr8uLvdMoqTAXlJuRMZDuNpBMFWn-A3nbrLs3lHLAbZuYqumqA-jqN3hkgenmuXCZk4Plu1LjByDvFyKCD4BLvXhyo3vbtQfAXQSumuvao6shigdrmgcrIRJRKCD8EEDuBsOkANMZM4D8IaoRDaMkKCNJuQTFiFuIUxGFl-BFj-GYSxJTvFkPIlovKDoIqzp-pEOWJhMCsRJpE7CClNiyPYnaLhLdL8OyNHjJrHvQISmBEBAwvwOJJBGxooSaHEGIiCJMOMDIsuJpEfjMO5phGyJsMMJsB4DbiISxHEeBIkY0rtPUGjB-upvpEMMNBPjaLaMuLnNuEbosIythOLA4FEfYTZDUQkVTskbxJoPZs0XDvpOTNkskIauSARLCNuKOlhNkcZAkHEJpKYdFixAAGrPyUBgIob7TmIpFe52xOALCsi-C7h5aJA7jbhgbtFOwo5EE-DGonFZ7nHSCXENGqZzE663FQgXZchR5SaBD5ZRDm7eB5HHgsjLgjGHEMzsAgQkBhAthRLxFxwK7PwCB4ogTxHQy1b-FxwPibo3HHjzClgsjDAyIFJSZAHZjiKDS6Y5h9IVYx50a3iYkMI4kOR4kxKSSEmVQiigRKjATRJAQIwSm0ndFewyIyLoS0i9TaFBHJCqSlpjCHqWj47RH8msSCnYm4mklilQQSkU7SnSCinyninoBgJiAgnNTzG2DBFYQcjLjnyeCsnH7RBEyREbjeBshGmjHCgiAfpwANwIyErZ6pGgloEEDlYxA+BKJ0R4QBozAghsj9AJDzAjArCMhFJ8lsLRn-hxmSQJmviNGoGpxcjOCUi3QDChp4RakzDMlOhvC7iZy7jnJkHonCj1gWBzRq6bZQCbpxz7Spr9g3FoLvDfBQgao7i-L6bXRjB-BFk6b-AHHwoxYaAPhQDCotgrIpELqwBLrSHrotL4AKHJnrxRBgggh+Lbk5hLAFEerHjOB0QExRD+CPTCHlmlIihHmUAnmoBnlgAdgpFfikAwCoBsyM7CpHYsAbpbrv7ulgmbCYTYTdH+4nq6S5mDALDeqrgniC5okHkOHgWQXQWwW8QLqK5RgYX3lYUdItEEClHFY5gFw+CbgbgOieAvl7zDCsgFp14gWHnUDHmnkOTnm8SorPKOlQRvIfLkALmFixTYQOLMnnJCVFoZin4vHdF-BxBBZ0XyUyiKU-jKVTHNLyELmXaLDKz4S4XZEOgbh9D+DXZjDib+mWWyUQXWWtgwUNFGImLP7mKv6ATOXm7QgLYQGgh-BHIlgD6BBUhqmQhBVyVQUKXhUpEbRv6yn4mxJmK0lSbmhSaJAQbaT5Gdk-KsjkyrBPFLDHwMRVE2RgXBX0UFWMU-j8oaVCoiqajiqHbSAypyoLkGFYRrk7jkRD786BroR9B4SngToLaTRdXCiNrNothgBjmvihbdw2F9x2HDnHB7UvoHVHXxaQQuECIrweFcVCYLC+w-k8gZFLDCVOCqQQFXq0gFK8nGlsJIbDi3XZ4nWfx0DfxRY0UMwtLxaHVQ0txfiPVuHPUNnwJjC8GkWrA1WFhwgOiwg5pvSD4siBCS6PJoo6gzlI3zkvUenFqYQ6YAGFg6agheV7gjAggYQQZvSwrSUsT2V00IyK6tL1lpHwJgHDS80shEybhOAk06rEHKLZK8ZBYWEyivLYq4oEqErWGw22Hw01rdXa1xxYo4rSAG0Y0PBY3S1Koo677fFfCR4Oi-BHx0lSYjBhRa1xZTzoV6021EoCA0J5T0KMJ5TMKRnHCOGB1W361Ep20pa6Be4giGrDRSZCFXQcho4epchLlQaEE+rlzU1KgjhAnXFM1gnGSrBy31XHhRDZiTaCZaQxB53eIsjmX7lm3Cg3hmlswIzW0kCpoUI6LPwb4PISqP7xwtjRUWJv43G4Q6p524aLgrBBDbisiYS7hqGUxcgrjGoD2wBYlD2SQj1j2gI8JT1-iLxgDQwL2xUPnYUpnc49nrUEQeBmYbF4T-W+WjCqrGTGoDhUKP4wFJ5e4jDXSDB2jnJSKBD5ysj7iJWXZDCwgRmXX0CgM4pOHUFumcXzHHgeIX4ZBILZncHMkjYBBR6vAbjUV91x4031HQRWoNy36nXG3nWm2E5RnMPiSsOCoO4p0wI11oELbvWbguJvBqzjAk0dS5E+r-Bi6928NMNJpZQ8phJDWCoJp-Zzle7I6ZHaUqJ3T0T5Yeg+GPZuiCXJD+w7XqPJpaM4hDgjhVAaMpqkA8wK6Yav0mhZkvmaTsiaED6FgOjsi4ygjlwJC+1PHU0ePON1BvgQBATuNOPoW9hOqGNHrYJ5j+HMpyIepPauXrj9K0Qg2x30AiAJMLJ8rDiJrpPA6p4lQMIATZMggxD0SDApA+BLCt0eqTDVVvBHoGrkRC2g0N7DjpP3IkkAkNOaMtNrrrqZObqwDZMjAuAjSQh4RxAZgOgZjj4TBibGSERSbxPTMxo6P3w4DCqiojg05NZTW+OEM650QbO46ZjZ00wWObDMg7gZiUiESdXC1E5TMLMopgsppVBPLoocVupoE-CeCQnIKPQarE1uJSKLCHqqwVGqMxF0DVMXNhKi0YpqXB34pEqGOkguCtU+2fUWO9m6rEP+kZWxDnOaNczL6p6pOQuO55Cb6bRe6DmxRG67jaTaRxD0jLg5gXbGSkhitssONVO8ucu4Ar7QxpOaMCA4AOpOr8BCvDFYQSLN0BA2jDIqEDDLj4S85c7svNyRw+NK5UIq7HZt5wu7qtR759B3TKMDCDFjD7MD5YR9r6WbjJB2sy7J7cuu5troAdoGtuj-J-D96U0DAOjfB9AHMnMTplERuqtusxuSgZ4sBZ6vgGt-3xRwO9BfQ5mICMiaQd08gDHAqYMI18MJP5vqtAQd4fpd5iMmhhrkz4QAtbkma1sICOg9nUqrWB4MNqPKsdsmxcur7N7r4CttP9vzjnJMjkQODiu7gHvjuyyn7JBF5hFLZKsEsqsmz355RuO8BCveH9Az57GMjgbCUrDiLIKUhWvrgVNYNXuLuRyEsLOIHh3lJe4RFiKUgD6FIZDtX7PGXeEK2TCMgaR5tLu8tSEMGyF6sv0vNoFPYLDLlHi-D2zCVBsHN3QH6qwYeRy3tyCmLHSL1xWbutTXbvCrBQjlwh6nse1tEniGoYOvnshvYg7rZfZwwA4TVRioCUE3E5jkxujLB+COJ2jjs7hkZwibiqrlibh-Bica4fbjXfYU7p5xtio4dOQgSUD4fwupwsg+F+DiaSIHPEWRC+39CnuPSfAERU2XsrZGcSeA7Se07nAnZsdYyxQZblbzBBDQiRGsjbjjBOhWjGRDB13fCGdrYtgPPlShdNZNM5dg4yGQ6UDQ43FtFHji7tUBBhTbgSKY5lw-D1VOBSUTMcrXXCkyitpFsWd4BRsu69fu79cCD8tb6RddDjA-DtEPGZiRFl5dmmTkaOJpBqKz4BfPrdeFsjcdpmexsdo3kyDPq2futs5Td+rghBMaQ+JxDjtpBjrkgZh2hqrGrjEthcBXnKBG1w0sJtvHDvcOSfdLoiPuHY04Zcg+X81+aocbCFP6RN1Gu7MbAnw2jLZbctg9sYYCAAAqaGvbJiVnJ3dnHrWMBq9ioUKwmnOxA0UJFovGmVkw5yrbjDt4SNmP+P2PnDv3lTrE7PDkWPk4oPDtj5XScQSnsIIwqSfaQybiSUFMjJAhG4yCx9-PMogvfYP3Jtf3rPfPyGHP76GGwvqWTRfjYv+EWL6EpcxcwGbi61iwAWb7GQQLNGXo1AzpcABoWDjtWMdshG-QfwPtMsZ4jVbU5MQ+in5WAwZjQ5-3pQpwUYNUTYEAPvzwdgQbuEtIG44rxeUrQ7PnGQrwvwxB-7cfJw5Qx2lwqfgUgwDs5EEiRu-TswNoSnXI39ysssc7+LgYkouX4YSoKoFQ6osYWoVOKfovtsdgm4rljneE2Yh9Oh+uF8jIWBLfFmDGDF6+AoPYfY1fC4LIctZaVICtSXekluDsWhhYMIPw4bl7IgOiVQ+A0q6AW-3YeQ1J0gyApwe-qZxkWE6seaPwCMBGDFgWqkyfMIyj6iq92IP2LiA5R-52B66+EaPtH2zgacUgYIKRMGTtBLBgKHXBwhbS8YIDtI5oWfq1TiArl4g9IEXMNCGDTd-AMsC9iCwBjjltsoMIqODG+xiAf+iVZwJpGh48goM+dfSIkHeAl5Ii+MfCO11546x3kaNGCGHCWgRwf+uGBYARHZDxQDkiVfOAf2yTmV1gW1Y1KPHHhppJ48gmeLwA7g8C86nUGRNmU6JfkCswBTHMjgVhZEjBJCB+G0HHpvxiBf1DUl-Uz5hsqBdKIaEogGA7hNwPrPAbz0kLVI9+XBb1pCGkTdJt2R7X9F7ENR9kbQWQmIQB0syKZF8LGc6PZ3nCFgwQeOf0lInGiODHoOpDkJ0Toi3RzK-tYzpBD37Zh-gWLLPpyCxy0pBM-SQvJSiGApAcBpfXXoFxy71ZJOUqX7M3g6HZIaWCtIbKILuwqFTkK-dCLRzv6UFE8SKPfm5XNBQgAWtoTMIiTWGkDpsngWkMPmkEAd46lhAUHvw+iqQJgmhcyIAKALXQfONbEvIUje74k6i8AifrYhtDiJlwpWU8MmxAFn8ZEfQV4Mpx0jmMNuzA44H8TOJU544Vxb8CoN3BggvqTxK-hsAcBvEOmvQ0uupCkx4sTSJ9M+haTlIElnSz8BAV9GGgRFPy+EUdMIOkRkhhW64E8OhGpoxksUccWsngB-4ZglwzvN9qsGZLCDPU7RWJqtzI4WYxy8WR-pOWnLi0kYc5HgXvRn4pJMq-wKEPpgP4Do6S5cAuLlRCr5UbKhVHESCOeDacXyRhUrPkzwgDR-egxSYLoUl4jB0e+1ByCjWOpo0eBpZcFDyELCqkUSxYTLIPmuFKxaIqvfXkGLupTwEBysc0Hzl5rQgf26EEmnhgNSDAVEgLamjCzFqSQJa-AH3vBGQAepvKM-f5qZmLGhBN0socUdjH8q6l-SJZciOMlCAzxE4RAb8uWEbHiZs+ngUIFBSgDkAOxtgXYt2PEy85PmR+d5BAHkBeFtAoQBQBBVnEeoSITorsRuB7HLj+xgaBsUbibETiWe87WyAHXkGJ0Q6hKPfi9jEQjBne8XZIcMh1J6dz4A+ZurH114iAK6WI3aCoIBT-9ixpDI9MIOPC4RFgpIFLqh3mDH1B6ccS+hKUEg30oA4EndtNhSD0RiRWqM-mR1UKJAS4RhYBpexwbgNxCRQzGKUNaidD4RoibeMoRzD5wMgs2TPj8F3DApqRFZfhk-jYZ7CbEjE9LEECXCxA7AGkNDjvFJjXRy4oZKMYYXsaoiF2RLWoHvxXLOApMIw7jkXhCFdlMWKPdBt4H2JQE7+17HCY6I0xLA+gFGUmikFfJN8-8YiN0OpAkyTIyy+AmyJMOM55cwAKgsESrEh6ZiBgmYbcG12wQ8gAKEQ1UgGJuoORhuGeF8Z4GcDDsNwQnHzu530iU0t4hBDyQogEmlJAeMoYHsoASGJB3JIyYXHnRGjywNg4IgFC9C0hd8TSXXA3p3l362SJ2GqYaG6G+BdQKiwguxHNV+C8S1I2zZMRDQF6c9JwCQigS4Anw8SCInI2noyH+S4RtIbIRFp6GyBAA */
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

          'Delete timeframe': 'Deleting timeframe',
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
