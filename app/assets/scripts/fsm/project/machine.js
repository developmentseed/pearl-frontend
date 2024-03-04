import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsZ0T+SMcsx4PDeC8FFGYAxfjDR5E7HcnJaKRpudGsJb5kAgTZhQIMLQaB4BJfOHMwUUhxHdLCU8ec3GZlGcXFk5c9mOFrba+tOJG3NpYGACw7AgbSuMfeYSfYu1KtpOTZWQRlwJELJCdIA16JiILaczcUIbDxBnaaqpMa7xiFaeuvssot3prknA1qBFhgWgGcezw5ddIzAIt8LCtJ0KH0ptOtlqUOVRqfWElyRgso4BYG2EgHAlSvvwN5V1a8unGQWLCY8u5fh5v+KTCim47pn3LAah93KFl8pIFIEq4oJTtr4DurNzKXDGQ8He745ZHADTiLjHc2kjxUY9Maxs-AVQ2sfXc3geoFU2K6HvFwo67DLH6cWxAcI7CLA3MMbwGxTxFsU02FTdaqkacTBm7TiBdNVqPIZ7MxmECQgyFhXC6F-iUleBmOzymLFqeRc5vErmEk6fOXpoYBntJGfdrpr45dvh0W8LhY1Io7JTw-j3SB-dB4lI5YV6oa7IIQKgaoZeeh+NdGzIWVSE6kiDWwr56ESwsI9UZHhLkCIEPTWFG+SpEhGsORoBKuGT5iqqe5QIL81B5tSvOLwMeIYWtkTtBaF2PqPo5jpHpaEJ4vYUg3MZF6PhjWTbUNNtdc2qELYWlFlba2NuYjY3tvzCtxHK2kVRm97s+0UwcL8YY7JdwPamzN0M623tSo+8tpFq3keSukGQJ7jX5nYo4LKLKr6XVaYS5Eft+4oQZG0spYdMw4QdVzlEAiQQVjwavohliQhtstnRw8AQ1XVDQ1e9jrDYBoKwEXgPTtRHf1YypbjdC2ElhFrohC92QXxGTBBDmatAxjW8+oDtmUAv2gCC4GmyqEq8CKn0eVSgUgyfxfdX5qE5pTLQj8H8DSO4D48g64MYYWX71jeHscY3pvPsY5EI753XG23oA7f9yEOqqKBBPBhWEKwMtwkWOFaEsJEh+FZVz8bke+cOXNxoB58eY7cd4yOMQq7U8jdUtmNchYwpFnO9vCmNoogwk0lscPbCo-88c7XuPYAnfQzUB+r9bfTwuGXHey0ngoju38GIv4iQNyuzvXCI3VezdT+oHX2fCea-mLyFAfiqfctYXObltBQwJPnfTi4KtyCfjsiUSfibpPrOhbm+DPKgCOGsvMjahEi7j+pmlsjTsyLEARBFI9H4O7GyOaKfIEFCG6KCGMIAdHjflHNFiwITk+CToRuTm7okNmBaL8ppHTv4D8KTIMMNJCsZDJqCBrGPqUhPtXufqQaxqgLwFhjhjIOATqKnhkv0D4BuOXCFk4L5u1LjByDvFyKCD4DYEQcAdFsIXaqIeYthhwDgA6k6tIfLggSZvIZRKCD8EEDuBsGem4sZM4D8IaoRDaMkKCJfN6OyixMLmukPCVl-GVj-H-KUkEZPkxPVovPjoIlYW5rMHmsyOgaIk7CCudiyPYnaLhLdL8OyGXv4dzjZISmBEBAwvwOJJBJpq7t8ggN6uIqXEWigTlr5oMPhC4GpNvMeDSGHuXhHvQOUeBFUY0rtPUGjPAckRyOaMFjyEWneoROctuDev0L6h4FLMDsaiMZUSLjUbxJoHFtMRTvpOTNkskIauSARLCKsUMFhLrsJhdppH4ZERygAGrPyUBgL8DxzmK1H-Z2xOALCsi-C7g9Z0Ef4zCDD-DlqVorBcE-DGqfEt4-HSD7T-GHFTHNSnFAlQhA5cil5FqBAdEPQxCOGSIsjLjFFvEsQ3jsAgQkBhAthRIVFxxW7PwCB4ogQVHQzTaolxwPivqAn5oLA76ERzAFJFqYH0HbyHhLAOF2jGr0mwCMnMkOSskxKSQcmVQiigRKjATRJAQIw6kinLh9AniWnoR7rnIuGM6naqSZhDBUmbF4TKkMkMLqkyianGnanoBgK6n6nSA+nsn+nPwuYnFu62A5GBYTBRBUh5buycjkxExFEKGshul8EcoiCfpwANwIyEqrp1GRkNEEDt6FpKLZqZgOhjBiIHLzAjArCMhFKDHj6bp5lxyFmviTE0GllcjOCUi3QDChp4R2k-InzmZ-6Zy7i2mKYrprpVD4CwxQCvpxz7Spr9iAloLvDfBQgao7i-Lb7XRjB-ANnZjHKvGVaBEaAPhQDCotgrK1FoawAYbiG4YtIEZwE4lRkuxgggh+Knk5hLBQkeoUYWh3S4RRD+CPQ6FZnXnUC3n3kOSPm8RfikAwCoBszS7Cqbbvn4aWG9nryGqYTYTmlZ4aRchHKTAxC0irgnhBY0lXk2Qig3mUB3moAPlgAdhPn+k7QVB4YFDUH1FEV3QDY5gFw+CbgbgOieB-l7zDAZnHwFasXsWcXcW8SorPK+lQRvIfLkBbmFixTYQOIyIjDaQgUIADAZjf50Hml-BxDKUIVsVIUygoU-iaUHHNKvr8BbnA6LDKz4SbCDCsg1llr+BUZjBWaeCMXwpVYqUuWthcUTFGImJQG35LK+WB7Qi3b4Ggh-BHIliiYuKFjzCQiOWIUcXIVJW1EbSwGGlsmxJmIilFpzHCYTDnK0ijlZLsiBbglLDHwMRwXMXxWVWuXVW8T8p6VCoiqajioo7SAypypbmeFYQHk7jkRsjJkOjoR9B4SngTq3aTRDUTZNpiBelLorqvjFbdxhF9wRFMUnXNotjLqrpTxxECIrxJG4mmYLC+wUY8hxCEwyVOCqT4HoTaQXoWTHXawtJrovVXUtw-g3V0DfwVaxV0mw3PWXW1bfjvUJGfWEXwJjBqHBWrBFomRwgOiwiFz75fQaExUBE2QeU6hrmw2blfVRlRD0QhQSWFjnmgg1l7gjAggYTtVvSwqtn8GPJoos0IzW6tI9nCXwK4HDTC0shEybhOBU06oybKLZIGYFZFaI0sBYo4rSAEqEqhEo3hFo2M3CjRHG2m24oW140PAE1K1Kp07P6IlfAl4Oi-BHyik2ZhSG01ZTwm3YrO1EoCA0J5T0KMJ5TMK0nMVG0yivKR3m1Equ1Na6D-YgiGrDRFraFXQcgM4epcg7lq7kSQrkQS0lEV70AiBKgjgYkTGAnGSrCq0Q3HhRDZhnb2l-KUwe5Bb2WXno0MwelMlxxm0kCpoUI6LPzoCRxN1UIQHxwthpUWKwHt3-DOCl3-qLgrBBDbisiYS7j2FD12BRDumqmenT0XBz2gI8JL18SLxgDQyb0wGATt1vBOiRVk0Fo2irF4Sg3hWjCqrGTGoDir3BFCH-YjDXSDB2jnJSKBD5ysj7jZXA5DCwic711DF0DQM4qwMgG14RnfkNHHgeJ-4ZBIJ4SFgDSmWHYBCl6vAbgM2lHCjM0wRWoNwkHI2o0sLj1cPS3jHQS8Mx4PDZ0wIc0NG3a-WbguK-2noBolpUpYQFGaRwipBG7DjJo8phKTWCoJoC4bn-a051mGUqJ3T0S+YeiYRcgBAbhpaaQ-T4NtlJpZQGM4hDgjhVCeMpqkA8xW7foUMmjZqXrqLZYmQZgOhFGLBxBODILQawWS3Zl6NeNsYCBvgQBAT+P6Mm29hOrmObHYJ5iaRibzD+3lj+Xrj9K0SjZpM84ZMpr3K+OJoFO45z4lQMIAQlMggxD0SDApA+BLD90eqTBzFvCumbDly6MBPeN1DclokdOZM4C9O4ZFOvqwAlMjAuAjSno0SxOBoZi74TCWakY2hj122R4tOLOxpTU4DCqiojhi4LaLWhMdLJF0R7NBCoEv7SxjmWUl4uCwhDCFjRX-DzMFMop3P6JPLopflfOnE-CeAEnIKPQaqU1uJSKLBBCGqggeA8jQuZOwsIuy2YoZ34pErmOkhCbAmmTkQ8g1k-C6pUPRWiaxAkutMxoDgcbSCtqShN7mMqJexcjiYAi04DTJB1lF3KzIKa14PJ0iMLNZM5N5NwvrM4Y7OyPhMpCKyng9THiqOIApYkWhZIIjCZhuPKu3MLNcwz5z4asLMCB34P66vzi2mxRQijnaTmXjMIDLg5hA7GSki7g7hKsPV2v6MOu4BX7Qz5NeMCBmGOreWfNuoNHnI7LGS0i91ONyIeofT9CDAHkcilXXOcPRteNcwhM25UJ25YhxtOv-Yv4Wknm07YSERAssh3oaM-CmUZhc3cum6X5OuJ5CvJ58YeutRhqe6Sxr4shLBgbl34mnOkYTrDADHuNS32smyOsJ6Cs8aTvN6t7TtYy2nuH3QKJLFM70iMiaQxAd2MqPSw7Duxv15AQL6bqTgtus6PsZgyx74C2Boch-3Uo7U54cMN10AiC7vL1NvX7n6jhL3uuE0zt3q4zkQOB+uUb0NHL9YrgXoEzzBQcEOwcxsmxgF5R+O8AtupHDnPGMhgsyUrDiLJOgg7jriNPbvpNwcPKqsUGx3lL-aFFiKUh3qFIZD9XbXWXUasiTCMgaRvt7twtGFvn2qpvOoidXSLDUxKz2wyW9unN3Rv6qzKeRxUdyCmLHRb3f1ns6bU2BZQjly-DVrLuWWjpewyJSLn2sgVvQePZO6I5zXY6Y4-ZRhGGm6Ak5jkxujLA+62j2h6ScfvBwibiqriZ3o2tRv0CBfPYthvPlRC6N7HvqdOQgSUBCUlmpw9t4sOG5uMoDDbgjCFzJAFyfAQakdsJ5fBeFf9jfbzURe8r-axRtYjYkeMjgk+BAttZOhWjGRDAd3fDw544vZY5wxheDddP5cE4SHE6UCk6An3FHhMH9UBBhTbgSLiLqwucQ1OCj5NM2QLpnUtiHtN6jsHslcdqusYD36bR52jTlqgnWuoEqGmRQaOJpBqLH7Q25enXnVvfHvFdJ4dplenWVdIsZukp+rgiuMaQ+JxAmv6SeduC+6TpqoPbw8thfufqTgCAAAqG6tPJiJhMg6PVXYT3aILOk8UnHwm0rezC7gQWh5ykbwjMN3l1PTPX6Vtgjtrt4mNDkNPX60jiRaHtiiT-loaqSfaQybiSUFMLIbwsmu4D3PHGNkvSv0vdPAjNtQjNzCvlvMoyvk4qvK82JyLbuTgXRxE0Ie8xMQLuEPveWTHGQEpYvDvhDHGr3X3fAsvdv8vUfEgMfKPfAbvzW9nprysmHQ+f+L+csbiJJjpGSxEELfwUD0fDkiP33tvd1ttlb9AfLyfVfsfeA6fudHvWP844L7wQW-wgQk6BfJaSxzReYwtdoEw2QXo1AvF8ASEOXHtWMdsx6-Qvu0sPPQ-1gndFIGYJHEGItddifGIUYNUTYEAi-zwV9fQuEtIzjwwXed75MUK4weEG41EgwkapwQ3lwF-gUgwDsTLWiqeW3BXNdOxrMaLLC65RFuMBXcMEqBVAVB1QsYLUCLnP7Vd4EMmfyj2zwjZguQ7nNYFhAviMhGCVzCLM2Cqodgh4PYPsL-wXAshVaKWKkOrRCrJdFu4KP4IWBhA-BkgujHRIuRHAmMxwyHIUtIGQCnBaBZZYyFhHViEQ+kZlAtpZU7oBBoQGwRlH1GVJNwOIYkJpBILsCd18IAwJgikE2rbgUgYIKRKmTtBLtQ6wXIJroNkxyEfM3vfVrcT0isg5izpTkP4Blj3ZYedAWaGug+ygwio4MbHGIAkHZVnAWjJBhWkXbywwU3eIovjHwhm9E+Osd5MbQNjhxpQEg-9AsAIjsh4oBybKvnHoHZJ7K6wQ6salHjjw00k8TIbPDn6c9bYPIIaMeBkT0MbQxzAesGjtDDkhsoIaoSQgfhtB56b8ewSDT3QEQTwZKKIPEDvZDQlEAwCNlQ0Nx+DkMdyXlLQOUIWk08qwbpOcmxYlpCWXsQ1KbxtBnDUm5vGyEpkjA35KgvAWgRCyMiZhvAUicaBZUejJAHiXQuiLdHso2CcaX4WgdmFhLC9VYu5JBtvnoLDBKUQwFIFYO46J8eua3cLmjnPwgjskQmdWn0USBl0-MRbU5MQPQhmc-BAhM-KQ3Ohd9WoAVc0FCAA62hXhx9c7EW13qAMC0x4QETEQFC0Ci2PBJwuZFkEKDfcvfNXEzm7yFIdibJMYp5W2E2gdc6CdkFl2pLbgZEfQV4HFx0i2MYej3YUCiW+Ii4-iu0XIbuDBAA1wSnAjYA4G3AZBsC3wH1KOh8CrAb6apFkjyS1JQQdSugr6MNEKLAV8Io6fEdIjJBet1wJ4dCLo1zJYpOyq6CQRmCXBh8mO+wx2CyzBDg0-AY0TgcSz8H1h5yLYfgcuVXJy0kYG5CIefSwEpJhe-feYedjVyqQMgGEM4Y40P45dRQI1NSsaPQEtDZK+4ACsgiAp4Rz0+eTtpMDcLkYRglPJ6g5HhpAiIhzZdgRyFWAzDmRJaRcTrnGCvAlYNaPwS+mHBY1XqiNXQcrHNB3RCSu9SkBCCpoAYDUnRNhjaF0bksMUXlVpIv3gjIAPUb-LATuC8LpcP8r6WUHgEuiRVHS0VJsuRHGShAZ4icIgKBRqY+tvxoWToqEA4pQByAgE00AkAHJMiwJmYY5u8ggDyBIg5YUIAoDYpoSPUJEZ4ExiwmgSy2uEiymSj6DwSrMzjCNH4Idpp1KWZtaloSloGw4xEIwMPkEGpo1iS0KQXGOJnPh3pe62XcXo3TgDDgjRkEXIQCmkGdEaGmxfEe0LET2j+q7VOiFAI5Qqk1S99aoI-UEjP0oAKkpkJhMNRtcrRWqZLr8EQT5gEg5EbwpAz8FEMICehblCCLZDqjRE28A9DmHzgBYXiZ8WIITGdFkjRG4kcRoKhvyYiJglETcCMCJYZkFBHIa6OXAUKFh-0tZYdmxloF7lnA6uIAZuBFpDi+gqgnBm8PZCEFYpcHWgYoRqmlVIQxgi4VklwjmZ1I1mSZC2WuETYEcqI+arkPlEqxxWx40tETyhy4xNwPIKCssJkT+cCGz3BHq3z4kgZ-2G4Q1LEPwGLst41dN0O1UGq6jjg60qXovknB8SNUw0N0PaIkRqxno1FQ1h7E3FqxZJkfXcWuhd40CuxGvMFFl23gQpsknw12P8kgq1lUWq0thE3xT4TsO0Tw-tmK0PSOFQQsQZ6OSiwLGVCYC0qfpkCAA */
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

          'Save checkpoint': {
            target: 'Saving checkpoint',
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
              'setCurrentTimeframe',
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
              'setCurrentTimeframe',
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
          onDone: [
            {
              target: 'Retrain ready',
              cond: 'isRetrainReady',
            },

            'Prediction ready',
          ],
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
