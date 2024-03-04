import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsZ0T+SMcsx4PDeC8FFGYAxfjDR5E7HcnJaKRpudGsJb5kAgTZhQIMLQaB4BJfOHMwUUhxHdLCU8ec3GZlGcXFk5c9mOFrba+tOJG3NpYGACw7AgbSuMfeYSfYu1KtpOTZWQRlwJELJCdIA16JiILaczcUIbDxBnaaqpMa7xiFaeuvssot3prknA1qBFhgWgGcezw5ddIzAIt8LCtJ0KH0ptOtlqUOVRqfWElyRgso4BYG2EgHAlSvvwN5V1a8unGQWLCY8u5fh5v+KTCim47pn3LAah93KFl8pIFIEq4oJTtr4DurNzKXDGQ8He745ZHADTiLjHc2kjxUY9Maxs-AVQ2sfXc3geoFU2K6HvFwo67DLH6cWxAcI7CLA3MMbwGxTxFsU02FTdaqkacTBm7TiBdNVqPIZ7MxmECQgyFhXC6F-iUleBmOzymLFqeRc5vErmEk6fOXpoYBntJGfdrpr45dvh0W8LhY1Io7JTw-j3SB-dB4lI5YV6oa7IIQKgaoZeeh+NdGzIWVSE6kiDWwr56ESwsI9UZHhLkCIEPTWFG+SpEhGsORoBKuGT5iqqe5QIL81B5tSvOLwMeIYWtkTtBaF2PqPo5jpHpaEJ4vYUg3MZF6PhjWTbUNNtdc2qELYWlFlba2NuYjY3tvzCtxHK2kVRm97s+0UwcL8YY7JdwPamzN0M623tSo+8tpFq3keSukGQJ7jX5nYo4LKLKr6XVaYS5Eft+4oQZG0spYdMw4QdVzlEAiQQVjwavohliQhtstnRw8AQ1XVDQ1e9jrDYBoKwEXgPTtRHf1YypbjdC2ElhFrohC92QXxGTBBDmatAxjW8+oDtmUAv2gCC4GmyqEq8CKn0eVSgUgyfxfdX5qE5pTLQj8H8DSO4D48g64MYYWX71jeHscY3pvPsY5EI753XG23oA7f9yEOqqKBBPBhWEKwMtwkWOFaEsJEh+FZVz8bke+cOXNxoB58eY7cd4yOMQq7U8jdUtmNchYwpFnO9vCmNoogwk0lscPbCo-88c7XuPYAnfQzUB+r9bfTwuGXHey0ngoju38GIv4iQNyuzvXCI3VezdT+oHX2fCea-mLyFAfiqfctYXObltBQwJPnfTi4KtyCfjsiUSfibpPrOhbm+DPKgCOGsvMjahEi7j+pmlsjTsyLEARBFI9H4O7GyOaKfIEFCG6KCGMIAdHjflHNFiwITk+CToRuTm7okNmBaL8ppHTv4D8KTIMMNJCsZDJqCBrGPqUhPtXufqQaxqgLwFhjhjIOATqKnhkv0D4BuOXCFk4L5u1LjByDvFyKCD4DYEQcAdFsIXaqIeYthhwDgA6k6tIfLggSZvIZRKCD8EEDuBsGem4sZM4D8IaoRDaMkKCJfN6OyixMLmukPCVl-GVj-H-KUkEZPkxPVovPjoIlYW5rMHmsyOgaIk7CCudiyPYnaLhLdL8OyGXv4dzjZISmBEBAwvwOJJBJpq7t8ggN6uIqXEWigTlr5oMPhC4GpNvMeDSGHuXhHvQOUeBFUY0rtPUGjPAckRyOaMFjyEWneoROctuDev0L6h4FLMDsaiMZUSLjUbxJoHFtMRTvpOTNkskIauSARLCKsUMFhLrsJhdppH4ZERygAGrPyUBgL8DxzmK1H-Z2xOALCsi-C7g9Z0Ef4zCDD-DlqVorBcE-DGqfEt4-HSD7T-GHFTHNSnFAlQhA5cil5FqBAdEPQxCOGSIsjLjFFvEsQ3jsAgQkBhAthRIVFxxW7PwCB4ogQVHQzTaolxwPivqAn5oLA76ERzAFJFqYH0HbyHhLAOF2jGr0mwCMnMkOSskxKSQcmVQiigRKjATRJAQIw6kinLh9AniWnoR7rnIuGM6naqSZhDBUmbF4TKkMkMLqkyianGnanoBgK6n6nSA+nsn+nPwuYnFu62A5GBYTBRBUh5buycjkxExFEKGshul8EcoiCfpwANwIyEqrp1GRkNEEDt6FpKLZqZgOhjBiIHLzAjArCMhFKDHj6bp5lxyFmviTE0GllcjOCUi3QDChp4R2k-InzmZ-6Zy7i2mKYrprpVD4CwxQCvpxz7Spr9iAloLvDfBQgao7i-Lb7XRjB-ANnZjHKvGVaBEaAPhQDCotgrK1FoawAYbiG4YtIEZwE4lRkuxgggh+Knk5hLBQkeoUYWh3S4RRD+CPQ6FZnXnUC3n3kOSPm8RfikAwCoBszS7Cqbbvn4aWG9nryGqYTYTmlZ4aRchHKTAxC0irgnhBY0lXk2Qig3mUB3moAPlgAdhPn+k7QVB4YFDUH1FEV3QDY5gFw+CbgbgOieB-l7zDAZnHwFasXsWcXcW8SorPK+lQRvIfLkBbmFixTYQOIyIjDaQgUIADAZjf50Hml-BxDKUIVsVIUygoU-iaUHHNKvr8BbnA6LDKz4SbCDCsg1llr+BUZjBWaeCMXwpVYqUuWthcUTFGImJQG35LK+WB7Qi3b4Ggh-BHIliiYuKFjzCQiOWIUcXIVJW1EbSwGGlsmxJmIilFpzHCYTDnK0ijlZLsiBbglLDHwMRwXMXxWVWuXVW8T8p6VCoiqajioo7SAypypbmeFYQHk7jkRsjJkOjoR9B4SngTq3aTRDXCgsVOWqVVXqU-gLpiAtqN7J58ZJG4nKywl5G5aGrtQ8iSaezoEeAbjZjsiwqtmlLXVelLorqvjFbdxhF9wRFMUTZNo3UtjLqrpTxxECIryPU-nUn9C3rkQ8hxCEwyVOCqT4HoTaQXoWTHXawtJrrI0Q0tw-hQ10DfwVaxV0k01I3g21bfho0JEY2EXwJjBqHBWrBFomRwgOiwiFz75fQaExUBE2QeU6hrk02bmY2llRD0QhQSWFjnmgg1l7gjAggYTtVvSA0lEV70BK0YpeWtI9nCXwK4HDRG0shEybhOCS06oybKLZIGYFZFYM0sBYo4rSAEqEqhHM3hGs0K0nUB0yivLYq4ph280PD80O1Kp07P6IlfAl4Oi-BHyik2ZhT+01ZTxB2J2h1EoCA0J5T0KMJ5TMK0nMVx1xzB1J1Eop1Na6D-YgiGrDRFraFXQcgM4epcg7lq7kSQrkTm1N3CgiBKgjgYkTGAnGSrDO3k3HhRDZhnb2l-KUwe5Bb2WXls0MwelMlxwh0kCpoUI6LPzoCRzz1UIQHxwthpUWKwEr3-DODD3-qLgrBBDbisiYS7j2H712BRDumqmekX0XDX2gI8L318SLxgDQxv0wGAQr1vBOiRWi0Fo2irF4Qk3hWjCqrGTGoDhP3BFCH-YjDXSDB2jnJSKBD5ysj7jZXA5DCwic4W1DF0AUM4pUMgG14RnfkNHHgeJ-4ZBIJ4SFgDSmWHYBCl6vAbjy2lFz2PJoqQFWoNwkFM0s0sIn3qNPLiTQTaMx4PCd0wLq0mi3YLB4SNl4JqzjCS0dQyJvX-DVrH0x2R7DjJo8phKTWCoJoC4bn-a051mGUqJ3T0S+YeiYRcgBB-VvCaQ-Q8NtlJpZT+M4hDgjhVAZMpqkA8xW7fqiMmjZqXrqLZYmQZgOhFGLBxBODILQawVA3Zm+OZNsYCBvgQBAR5N+NB29hOphObHYJ5iaRibzB53lj+Xrj9K0SjatM87tMpr3I5OJr9O45z4lQMIATDMggxD0SDApA+BLA70eqTBzHJOWibDlxG7LNZN1DclonrMdM4A7O4aDOvqwDDMjAuAjSno0Q1OBoZi74TCWakY2heNqM+P5MPOxpTU4DCqiojhi4LaLUlMdLJF0S-NBCoEv7SxjmWUl4uCwhDCFjRX-B3OwudMiDUtVDGMEXp1Yw-CeAEnIKPQaoS1uJSKLBBCGqggeA8hUv9MooaNaWt0V34pEphOkhCbAmmR42xNvASyniqx7wezcOz0wsisxoDgcbSCtqShN5hMqJexcjiYAi04DTJB1kD3PXkRQ7CsdP3LdO9P3PbM4bfPWPzh0T4kOBVqqsBryJHhQYbhIIjCZipNatW33Ncwz5z5uuwsCB34P7eutS2mxRQijnaTmVnMIDLg5hA7GSki7g7iatw3auZNxu4BX7Qx9OZMCBmGOreUYtuoNHnI7LGS0hb2JNyIeofT9CDAHkcilVQuW10C0t+NczFM25UJ25Yg1sJv-Yv4Wknm07YSESEssh3pYR9qmUZia1OvNwP2LsJ6Gs8b3Vy4C3pvxn-J-Br4shLBgaj34kgukYTrDADFpP8Gxsmzxtnt3UdosAt6vjLsFLmaPQKJLFM70iMiaQxCr2MqPSw5Hum6X4JvvqbqThgfRD4QZgyx7762BocjYPUo7U56qPjuTtVt-unvQw36jj32pvXtYznJMgOvSxJKUZBugX9YrgXoEzzCUe8PUfHtdNSGVC8DLupHDnPGMiksyUrDiJNOgg7jrgLPfttOwvVvUsUE13lL-aFFiKUh3qFIZD9XbXWXUasiTCMgaSoc6citiEmH2rNvOqGdXSLDUxKz2wyU7sgt3Rv6qwOcmxgE8CQEozv0YNptYxUbvCrBQjly-DVrPuWWjpewyJSIgOshju8OPZO6I5zXY6Y4-ZRhGGm6Ak5jkxujLA+62j2h6RqfvBwibiqriZ3pRsVv0D5fPYtiovlRC6AdioudOQgSUBCUlmpzbu8sOHduMoDDbgjCFzJAFyfAQbCdsI9eFf9f9jfbzVle8r-axRtYjZCeMjgk+CEttZOhWjGRDCr3fDw544vZY5wwlf7ebO9cE4SHE6UCk6An3FHhMH9UBBhTbgSLiLqxJfk1OCj6LM2Qg0tjntN7ocAdJ4drJsYD36bQ92jTlqgmRuoEqGmRQaOJpBqLH5U3dcI2g3I+XuDfo-DcSGjct4TelPdp+rggpMaQ+JxA8f6TpduC+6TpqoPY09I9Dd4AM9GuXtvkyAI3jdWLYmYunE5jkrqspCnkVpZL3HQqcjeHjDeAafRt0CI8OQL5Yd9gCAAAqG6n6k4cvLPivPdxLOk8Uanwm1rvzD7gQWh5y5bhj1N3lLYFv9vVvejUdBj3jt4HN5vdvX6ljiRLHXQv9Fo3wByG+Ywz0-Wm43g0IhmdonXgf9Atvi+DvLn1uzqxZ7Pf6A9h2TBcIRRyQcjSnmv-zo6Swxqpflv0gFfqtuoIjKvbuQWzXDiClPqiQI9+kZ4afGZ-5VK-sVPfDHGEvjPUvEfMN0d0L9AerEgq-MvHaifadk3PrysuMjsSX27lo1rRajpGSxE5Lfw5DK-DkdPGPG-5WUf2-y-e-r-kvR-zWZXm2zKb2F-kXiQIJOjliBolizRPMEbTtATBsgXoagLxXgBIQuuTLJSMen6C+5pYbvKATMCBIfA1YtIX4A4XuxL8MQUYGqE2AgCYDAovQf5LSCSayY7QsHcmFCnGB4QNw1EQYJGlOAHdLg9AhcO1kNTQ5NeyCbcJCy87HhPAz1M8BtyiLcY+u4YJUCqAqDqhYwWoEXHQJP62w7Am4fytu3sbiVUuawLCBfEZCMFIWEWZsBdUY4CgewfYYQT0BZDO0UsVIV2iFUa73dwU97WHh7GSB3MdEi5EcMEzHCMchS0gZAKcBcH+A+g6BC5n0jMp9tLKa9AINCA2CMo+oypJuBxDEhNIXBdgNevhAGBMEUgm1bcCkDBBSJUydoJ9iXUK6FMihsmOQj5icBxA9y8QekKyDmLOlOQ-gGWBQPh4Aw5oi2RaIVBWjY4xALg7Ks4E0gm0HoauKfsJneDd4ii+MfCHD0050lg48dfWGHCWgRwXB-6BYARABqCcuGKhMyMNECrcCPQF8Y1KPHHhppJ4gdGeLwA7izDh6nUGRDIxtBAtd6waQvuvnxjG8uu7CEhA-DaA3034LQ4mnugIgngyUUQboXSiGhKIBgZbcRobkoHn42Mwg5QhaTTyrBukbHfniCA6hXFdwb0MQS0x2E2QlMkYBjkYWEHksjImYbwFInGgWVHoyQB4gCLoi3R7KjQ7ml+GEH-U+gvvVWLuXobb56CwwSlEMBSD1DwRxfU3gjhe6lc0c5+CUdkiEyu0+ik-cHIREh55UbiwXJfgITPxCNzowA+cAFXNBQh8OtoTkQA3OwDsv6eDAtMeFFExEBQwggdjwScLmRCI3gTAtdGQ5fQyYNINUdHzoC7FgO+xQoXoNsQ2gdc6CdkB12pLbgZEfQV4DVx0gxNKeIw44CiW+Ii4-iu0E4buDBD41wShYfMA4G3AZBsC3wH1KOh8CrBIGapFkjyS1JQQdSRQr6LcLSR4R8IHfLXI9C9gZt1wJ4dCHc1zJYpOyq6FwRmCXAZAggg6VYI7BrIHYyafgMaI2KFZL96w85FsKEOXKrkEY65YprMJAZGCUkvvf4FCG3xuCB0+aUDI9HKrOVRqiVS6rMNkr7gAKyCICnhHPT54N2kwNwuRhGBi9m0nNFGgzUAn55AuHIHcUFgpHoSdchvSzJa1yHB8HIdNMUUUOVjmg7ohJL+pSAhCS0AMBqTosoxtB3MGWNtRuC2yZbwRkAHqHgUYJ3BeFWuH+V9LKDwCXRIqjpaKk2XIjjJQgM8ROEQFArTMs2fE0LJ0VCAcUoA5AESaaASADk3RkkzMEC3eQQB5AkQcsKEAUBsVNJHqEiM8CYy6SJJI7AyRZTJRSi0EVmP6hGiX7RFA6bdSuoSmEGw4xEIwTcVuLTzDJ+R4mc+Hei3pF94x89YcFWMggnCAUWEEbJfzojmcqhuELzhUPhB8tFBHKFUmqRgbVA4GgkBBlAGSnsdniK3DYDCVWKB5PAWQkuN4TIZL9+GEBPQtyglFsh8xoibeAehzD5wAsLxM+LEEJjdirRYrExmYxvx6iJglETcCMEFYZlUhHIa6OXAUKFh-0tZVDgSNTFdA9yzgdXLRWhCd40R4GHllkM4Zcj2QhBKadpxDDCDFCfQaDFLQqE2g82qBMRG6HUjWZJkLZBkRNk1F9dXu5UE4emJVjmsyJpafnlDlxibgeQUFLETIly6bdxef-NfgFJAwIcwxhqCtAtzcSPst4k9X6QojRnA0MZMoUPl+gCkaphobodsRIjVjPRqKp4MgSonQSd8l+L6YcCH3j6ThCRnQklv8FwgQpskvI12P8kgq1kWWFMjlN3zD698JClfHUISLDTiJTwiQC7OtTWlOA+gjDAsM4gzBfsTeu-ffhew7RsifgDsdWLZ20ggZno5KLAsZUJiIykBmQIAA */
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

          'Apply checkpoint': {
            target: 'Applying checkpoint',
            actions: 'setCurrentCheckpoint',
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
          'Checkpoint was applied': [
            {
              target: 'Prediction ready',
              cond: 'hasTimeframe',
            },
            'Configuring new AOI',
          ],
        },

        exit: [
          'hideGlobalLoading',
          'setCurrentCheckpoint',
          'setCurrentTimeframe',
          'setCurrentMosaic',
        ],

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

          onDone: {
            target: 'Timeframe was deleted',
            actions: [
              'setCurrentTimeframe',
              'setTimeframesList',
              'setCurrentMosaic',
            ],
          },
        },
      },
      'Timeframe was deleted': {
        always: [
          {
            target: 'Applying timeframe',
            cond: 'hasTimeframe',
          },
          'Configuring new AOI',
        ],
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
