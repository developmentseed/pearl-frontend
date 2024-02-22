import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsZ0T+SMcsx4PDeC8FFGYAxfjDR5E7HcnJaKRpudGsJb5kAgTZhQIMLQaB4BJfOHMwUUhxHdLCU8ec3GZlGcXFk5c9mOFrba+tOJG3NpYGACw7AgbSuMfeYSfYu1KtpOTZWQRlwJELJCdIA16JiILaczcUIbDxBnaaqpMa7xiFaeuvssot3prknA1qBFhgWgGcezw5ddIzAIt8LCtJ0KH0ptOtlqUOVRqfWElyRgso4BYG2EgHAlSvvwN5V1a8unGQWLCY8u5fh5v+KTCim47pn3LAa41jZ+AqhtY+u5vA9QKpsV0PeLhR12GWP04tiA4R2EWBuYY3gNiniLSxps7G61VO44mDNfHEACarUeET2YxMIEhBkLCuF0L-EpK8DMim2MWM48itTeINMJP4+cwTQxhPaVE+7ATXxy7fDot4XCxqRR2Snh-HukD+6DxKRykL1Q12QQgVA1Qy89A7qxtmQsqkJ1JEGthAz0IlhYR6oyPCXIEQIemsKN8lSJApYcjQCVcMnzFQ49ygQX5qBNalecXgY8Qzpa6MeO0FoXY+o+jmOkeloQni9hSDcxkXo+GNTVtQdW12Naoc1hatn2ude65iBZYRBviYVuI5W0iqM3vdn2imDhfjDHZLuFbtX6uhi61tqVO22tIo6x9yV0gyBrZS-M7FHBZRZVfS63jznIj9v3FCDI2llLDpmHCDqucogESCCseDV9EMsSEH1lsP2HgCDi6oaGm2AdYbANBWAi8B6dqI7+rGVLcboWwksItdEIXu1M+IyYIIczVoGMaon1B+sylJ+0AQXA02VQlXgRU+jyqUCkNDpz7rDNQnNKZaEfg-gaR3AfHk2XBjDF8-eyrw9jgS6l7t37Ig1ca5KuKCU7a+AnZ1zqqigQTwYVhCsbzcJFjhWhLCRIfhWX46q3b4nDkZcaAeS7mO7vPcjjEKu73kJBiqWzGuQsYUizTe3hTG0UQYSaS2Dbth9uScqeT87sA6voZqA-V+nP-hMKDF6JaTwUR3b+DEX8RIG5XZ3rhOLhP0vG-UBTy313SfzF5CgPxHPAWsLnIC2goYjh3bpxcFW5BPx2RKOn5Lhvs7ZdvhnqgEcaz5k2oiZrn9matmI+ZLEAiEVHp+HdmyOaKfIEFCG6KCGMBfg7svlHHZiwGDk+JDoRjDtrokNmBaL8ppMjv4D8KTHnkWuRMZDuNpBMD9N6OyoTjPo7mTshlxuYthmqHfjqDnhkv0D4BuOXOZk4AZu1LjByDvFyKCD4DYJAVfnZjAdypULwFhjhvao6q+kwSzu-uJmwZRKCD8EEDuBsGem4sZM4D8IaoRDaMkKCJfGQQTjZBTmukPOFl-JFj-H-KUpYQ3kxElovCDoIooZprMHmsyH-qIk7CCtNiyPYnaLhLdL8OyDHmYXHvQISmBEBAwvwOJJBDxlrt8ggN6uIqXEWt-v5gZoMPhC4GpNvMNvmManEeBIkY0rtPUGjG-l4RyOaGZjyEWneoROctuDev0L6h4FLBduUfESwFUckbxJoI5vUbDvpOTNkskIauSARLCJ0UMFhELsZAkHEJpKYQ4RygAGrPyUBgL8DxzmIpHe52xOALCsi-C7j5aoH756SDD-DlqVorCEE-DGp7FZ6HHSD7QnGjF1HNSTHnFQjnZcjR5FqBD5EPQxAaGSIsjLhRHbEsQ3jsAgQkBhAthRKDEIzy7PwCB4ogTxHQx1ZfFxwPivpnH5oLDD6ERzAFJFoAFoHbyHhLDqF2jGoomwBokYkORYkxKSS4mVQiigRKjATRJAQ4noBgJiCUnLh9AngKnoR7rnLaFo6TaqSZhDDwm9F4QcmokMI8kyh8kSkClSl4nClGDSDGlxyCnqYTHa62DBEmYTBRBUiBYH7RBEyRHsGsi6m16lIiCfpwANwIyEqrqpH2npEEDlYwnoR9SaSZgOhjBiIHLzAjArCMhFKx6270CBn-ghmSRhmvi1HIFRlcjOCUi3QDChp4Sqk-InxSan6Zy7gqksYrprpVD4CwxQCvpxz7Spr9hnFoLvDfBQgao7i-JD7XRjB-BpnZjHJbExYsQigaAPhQDCotgrIpFoawAYbSG4YtIEav6AkOkuxgggh+Kzk5hLD3EloUYWh3S4RRD+CPTCH+mxarmUDrmoCblgAdgpFfikAwCoBswM7Co9YHn4YKGlnryGqYTYRykB4aRchHKTAxC0irgnimaIlLkWGfnfm-n-m8RoYK5Rh4YFBIFpGwV3TFY5gFw+CbgbgOieDnl7zDC+nHzBb4UbkORbm8SorPImlQRvIfLkBDmFixTYQOIyIjDaS3keojDOC9AnyT54Q17ZlsIrnUBrk8Uyh8U-gCUjHNLyHfonlRmwjoSLDKz4SbCDCshJllr+BUZjCyaeA4XwofnaVfm6Wth-k1FGImKP4r5LJDmDpZGLZgGgh-BHIlh3qBBUgyLoSwoaWOHcU-m8V+UpEbQv5inYn6xxKeFAkjDYTDRrETDnK0i1lZLsgmY3FLDHwMTvnLlpWEU1H8qiVCoiqajiqfbSAypypDkGFYQTk7jkRsicgGYsiwj9D4RmQ2VPYrZNpiCGlLorqvhhbdy2F9z2G4XVZLUrXLqrpTyuECIryFWnkIn9C3rkQ8hxCEzMVOCqRgFxm0gFIVYpUcovrDgtiHXrUtw-ibV0DfzRYeXIktJrq-UJbfgnXuFnUwXwJjC8F2WrBFomRwgOiwiFxj5fT8HuXkE2SGU6h9ng2DnnVRlRD0QhT0WFjzmghJl7gjAggYTlVvTJXRE5l0CE0YrGWtIllUXwIgHDSM0shEybhOAY06pEHKLZLCbBahb-UsBYo4rSAEqEo2FA12Eg343ChOEK1K24qq0w0PBw381KrI5b5vFfBR4Oi-BHxUnyZhRy3xZTyK3YoG1EoCA0J5T0KMJ5TMJIkWHy0yivJu0q1EpG2pa6De4giGrDRFpCFXQcio4epcgjnc4EE+rlzi5wDDjHE1FnHGSrBC3aSSJRDZhTZql-KUy66mZ-D4R6lckGlxzK0kCpoUI6LPzoCRwiASr37xwthBUWIv4F3-DOBJ3-qLgrBBDbisiYS7hqHV12BRAN3cnN0XBt2gI8Jd18SLxgDQyD3P6AQF1vBOguUo0Fo2idF4RPVOWjCqrGTGoDhUL36iHtbe4jDXSDB2jnJSKBD5ysj7jQikZwgOJ47s1sJP04pWFz582RkmjHgeKn4ZBIJ4SFgDQyWjYBDR6vAbh43mHCiE0wRWoNzQGA3A0sKg0E2PJooP7ENUHtAR0wJk0miLYLB4Tpl4JqzjAY0dQyIBaaRwipDZ1JpZQ8phLtWCoJqk4Dne5I4pkSUqJ3T0STUrCYRcgBAbieaaSkEB0EPDjJpiM4hDgjhVAiMpqkA8zy6mUdJeHZqXrqJ+YmQZgOiRGLBxBODILQZvkfWE76OiNHYCBvgQBASmMGOK29hOqyO9HYJ5iaTfDW2BoPZWXrj9K0TvXgMBl+Mpr3LGOJphNA6t4lQMIARRMggxD0SDApA+BLAV0eqTBNFvA6mbBZ1NVUNmOGN1AEnfF5P+M4DFO4YROvqwBRMjAuAjSno0TOOBoZgj4TAyakY2iLmUN6PtMBMSP3w4DCqiojjU7Nb9XWNurpF0SjNBA-7b7Sx1kIAGoLCT5DCFhuX-DCNhMopZM8pPLorHk2OTE-CeCgnIKPQaro1uJSKLBBCGqggeA8hPP+MvPvNE0h3K34pEqyOkguCrCBZuC-AqM-C6oINuVxWxDQvZMxoDgkBSBu5troAdre7MqxRWjIKo3qSkyaSUR+CPSGo-PqUZMcoiCrP3JBMhOvNFM4bDPMPzh0QgkOBVqngeD0jubwUWZIKKUaytMrMGNczN6t6CvtMCCr7r5iutQqmxRQi1naRyW1MIDLg5jnbGSki7g7hgO6N26vMau4CL7QyhOiMCA4AOpOr8De7nI7LGSvXqPlyX2BofT9C974QcjzBQuqvOvtNcxWOK5ULK5YhutasBvoLgr-BI7YSESXMsh3pYR9oyUZgU1EtS4L5asUuSgZ7Ztuj-J-DLhmRLBgYp0gkzOkYTrDDW4+NtPqsmyauu6tr1tUtipZ6vjZvX3xTf29BfQBryKJBiI2WJVQoLUJu5kuvDuZuu7t6bqTiNvkz4QZgyyj502Bocin3UroSR42hVuuup5ATL6jhd36vw2Gt3q4zkRSsya1mJmBpnhH7JAF5hHLZbuc07uRy355QmO8ABs+HVkzaQuwhLt1MrDiKeOgg7jrjpNOvbtJu7urPwFe3lLe4RFiKUh3qFIZD1UOgMXiKPasiTCMgaSPvEfPNSH0GyF+uUVwPzgPbUnUxKz2zMUlszN3S76qwccwczxyCmLHRD1H0GtYxUbvCrBQjly-DVodtXOjpewyJSLz2shLPa3HCrbq5vY9UA5-YHZRioAz5nE5jkxujLCG62j2gPF+aC6biqrlibh-AvbA4bb-Zwzk7p4Tsjg8dOQgSUD8dmWpzFugvqGvWMoDDbgjCFygePSfAQZ4MxF0CWfrYti7PlR2e9UOe8re6xSZblbzBBDQiRH2UPHjBOhWjGRDCF3fDBdWehcHYVc04FMleg4yEQ6UBQ5nHLFHiYH1UBBhTbgSLiLqzacl1OBcsEdFf7Uthjse5Rc1ujuRcdq6sYBr6bTR2jTlpXGZiREl7gamRQaOJpBqJT6QcLrLU7dHd8AReUsdr7kyBLXxefOHOkp+rgjaMaQ+JxDof6QGduBG6TpqqLXNotgHufqTgCAAAqG66PJiMXgPCXXz2u1z5u8UuHaxA0YJFowm8Vkw5yjru12s4NqPOPX66t5Dm3X1a6aPX6jDHhn7ti7jVloaqSfaQybiSUFMLIbw2kG4yCHJzPDkPPGPZDmtFD5nt4ivMoyvfYfPK8AJRP6RTghRxE0Ie8xMlzuEJvgWjIcI0vO4j9ZLn3v333qv21Wt+DxwpLEgzv47HaevaWqnXQuYDs5Ywwtxs1WSkmCxMlgerwSw2QXo1AUpcABojPYAptWMdsx6-QRu0sOk2c9I5x4I0GxENoIIpWkapwUYNUTYEAmfzwS9fQuEtImjwwhecrJ7uXGQrwvwRB+H6fJw5QGblwDfgUgwDsN1GFs524iziwXIV6s93OwW7upX4YSoKoFQ6osYWolO9fAntsdgm4Vlxb7DdFenawWEF8jIGBiz1mzYGVHYQ8PYfYY-C4LIQt7mVIItLXMwFuDsWhQsDCB+DJBs6OiTsiOCkZjg325JaQMgFOBv9oyxkLCOrEIh9JZKciD1EXQCDQgNgjKPqAr3YjSAxITSRAXYCLr4QBgmBFIONW3ApAwQUiL0naHbZO1rOFjMgbL1YL6ZjeKQSPPSFZBNEtSnIfwDLAg4DsAYc0FrItEKgrQAcYgRAUA2cACMv6FaFkMnX0iJB3gReSIvjHwgbdB+Osd5ArQNjhxpQiA-9AsAIjsh4oByIBvnA-7ZI666wRbGZ0941w64WKCeM3GDqtxeAHcBQUnU6gyJUGNoKZpXWDR2hqypWUEMag4RAJuE7dN+BwMep7oCIJ4MlFEHiByshoSiAYA6wQZi5IONBDpm-y4LylIQ0ibpOciBYloIWXsQ1LuDegNDvG3LFiKxkjCvtHO50EHuKxLC443KUicaPJX0jfBeC6kMFrdDrqsCoaX4N-tmCeLxVVYo5L+kPjQLDBKUQwFIMwIH7LMLOr2frpV2+xz45h2SNFiLWGyaCbshEZblFQWIydIO9eRPMcIP5s4z2VlM9raEzDeAYeUec0KPQvoFpjw0w5wgKDf6RtQQy4SzM4lwYAFrouXRdkXkKQDFKilOIyqUJtCC50E7IO9OMBGDbgZEfQePusCoHcgdhGvOgJ8QOKU486kEcwbuDBC3UbiQAjYA4G3AZAgCowvMOMNWAr0DSmJQkvySgiCkyBX0YaBERvL4RR06g6RGSCNbrgTw6EbOkGU8GhlV0iAjMEuAyCNdKhjsJMiNjjJ+AxoQA+NuIIbDtkWwEA7sr2QRj9krGCg+eifxSTxV-gUIIfB-wHT5pQMj0Lil5QIqP9doCglivuEvLIJryeEc9KHgLaTBdC5GEYMjw+4ORIaU8QMaHik4chVg6Q6eleyyx29PAMmAEGSLcGsQteq1I6v9TIHKxzQd0MEqPUpAQgMaAGA1AURwYPsHh1DQSsTRMqZ94IyAD1BuD6AmsdwhhPzvcVfSyg8Al0FyhqTcoZlyI4yUIDPEThEAFK5YE-kOIswFFQgP5KAOQAnGmh1i042TLG0zBTN3kEAeQJEHLChAFAX5XcR6hIjPAmMFZL4YRGPHzjA0-YtcbJk0YRpIOutHwcJVDpItCUb-J7GIhGBajtRroiNskCY5htA8ZdHRoPx7q51fiAYl4UpABQoCCiSDXouoOPC4R5+NA+EGCwK4c1OSq9BGC3Q3qCQt6UAcwQai9godQOLIrVN5zNx5jEgJcIwg-Ug6QMX6Tw6-JjB6GtR5hhI0RNvAPQ5h84xmTYmfFiCEweRbYuFkQ0FTL4ThEwSiJuBGCQtfSmA-SJMHeBhtYghYf9MmSrZHY3+Y5ZwDzmn6bgmaEYvoHgKGAG5NiEBNsUR3okYStMSwJyXG0hA0CbQFrH-GIjdDqQ5MkyLMq0JsjFdrOZXDPt5LagYiVYXICyjpEA5-91u2CHkM+TyEyJXBhXd7itV24Z5QJIGGIP+g2KqCL+agreAQTCkKICpHNIqSzw7yThQJGqYaG6FGESI1Yz0NCqeF+A-BXg6CBPpBy56tTD2r-RKet3eA4jt4EKbJMMMeiMh-kT5ZMj8yakQMneDkEqVFysmFhcY6ZWIL5JuLLS9k8-KIAILVSDBE+mQIAA */
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

          'Save checkpoint': {
            target: 'Saving checkpoint',
            actions: 'setCurrentCheckpoint',
          },

          'Add retrain class': {
            target: 'Retrain ready',
            internal: true,
            actions: 'addRetrainClass',
          },
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
              'setCurrentMosaic',
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
            actions: [
              'hideGlobalLoading',
              'setCurrentTimeframe',
              'setCurrentMosaic',
            ],
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

        exit: ['setCurrentTimeframe', 'setTimeframesList', 'setCurrentMosaic'],
      },

      'Saving checkpoint': {
        invoke: {
          src: 'saveCheckpoint',
          onDone: {
            'Checkpoint saved': {
              target: 'Retrain ready',
              actions: 'setCurrentCheckpointList',
            },

            target: 'Retrain ready',
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
