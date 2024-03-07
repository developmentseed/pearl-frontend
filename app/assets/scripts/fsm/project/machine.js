import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAjEvCugBRJgAJLYuj0AV2p5IAYgBKcdABsAbmC4lBecmBGUczSumoBtAAwBdRCnSxKeHdVMgAHogBMADgDsdZwBZPjgMwBWRz9fA08ANgAaEABPREDHOgN-f09-AE4DMINM108AXzyotCxcQlIKGnomFnI6ADEwGpooLlRhamauaoouGV48MQhdeho5dABremLsfGIyKlpGZlYGpuoWtuoO9a7l8l7+hFH0LStdQyML22RzS2tbBwRXXLog1N8wx1zPD4BGKNiCH8SUSLjSv08aV8aUcoU8rgKRQwMzK80qSxq9UaFR2m22LW6+z6sAGQ0Wx0mdGmpTmOKqeyxaw27U6hIOJKO1DGp2sFz0vxMSBANwsZxsQsez08r0c70+3z+ALi-l+ry8-iyvxyUP8iOFyJp5QW9MxqxxzK2rL27IGYFQGFQVJkzAAZuhUEQqQbZkb0YTGebWiydmziXhOdztOdjFchSK7roHogDEqEAY9dSfWjFv6AELW3hBy3rSS4MCUBQQXY1LjFKCoOCwWNmUX3CWIX5BNJ0X5hXthXKuD7BVPQgx0PueXtan6OLJhXWFfUlLN0jGsfM1wt45piTc9cgkPgumi8NQQZvC25ipMICHgujeAfOLXpWVhNKp1LSzueF-+XxfHhDUESXTNUTXPMCz4HcSwAVVoOxkFKSAuDtB1L3jG92zvSFVSfVwXySGFwk-GI4gMXw6F8VxAlce8-FcPsM29CDjXXWoADl0GrHo0EgTQxRg4MoDETiwAAd14-YGwAR0EOBRAvYxrmvNtQEee98PCQjXxIj9U1+YFqLCGjQmcZwNSnICWJXNi-QZABlPASFQKwdloKTCT3a1Dz4ElXKUzC1MTHCpRlOUvm8RVyIQbx-DoZ51Tcf9LN+WyUVpdj-WcwLOk86SfJrF0SEoGRULwHiArc4LW1CjTEHCt4APlaK+1TL5xz-ZxwVyD8mNCDLDWzKZWPYThFELARhCU0tYFkBQlBUNQNB5aNBRbBNxQau80jCajZR8D9fiYvtXFTMIwjcR8wh8TIXAAmEhtXdjwPG7htzAEgIGiMRaq229fjSFU6A1Xw-BVTIIQ+C63H26E0hhRwAIMZ5QKROysvRN6OA+mCvp+v6BVUurtvsDtgdVMGIa1ScYdin4QQMRwoWspIXEcZ77MWHGJp4fHvt+vRHA2q9ScBynQdMmmoZ+SJYoHcGPEcX4euZhc0lyLmsZ5saAGE1BwcZOkoF0uEEWA7X5pbVHUKxTnEf7sJ2+j3EI1mgaHIzfH+BX6O7cHh38V3oU5sDWJ10a7LoA3cGNnZTfNy3UGt5RbdW5hHeJuMQrJyUTsSnqgM9n2AN9wFfkr6UNUrkDe38LxfG131dejgBREQ7XyyTa1YrhqBIIgwDERzGl7uz+8HsAnfU8mEFlUJXgHFJcg+F8gNhkHbrSbqWZ+YPm5Gr1o4AETAE9aC4E9UBJLgAEEAHkAEkxDYBtYEtqtBGQGR0G++-n5dBUJVfQKkc7ixwjCa6RkoQ7zHJdZwX4G7jg5qZLUQ4hxpEPmuN6Z8L6KGvrfR+L836NlQhAVAJApKELwAAp+QC8AgJnvVOeMIBw9mBD1VWGQer+C-HtKinwDCe3Mn4dK4dMYtyjiiGODZtA7FIMgMQABZEgyBrY4DkUFMBm1nZzyMlOOg4J4QflCBCII50-YGGcIkeiqQsgs2SIuDGmUpHHxkQAdVKu5FoboU4UM4Fwd0XAtDUBwGAGQKi1H8CEJ-dAElQGiywrPSUzMqJ7TnL8AIt0Fy+C-M4EEzhwa0RCMDKETcJGuKPm9Lxdwdh+K4AElowTQnhMiaQj+qFWkRLoY0yhXlgHrRJgDMK28PDQmeC4ZwnwyKAnSC+aiKp3bfnCM4bBr0xq1J8VfYJTSgkp26e09+n8QkkDCT04hfSqEMKYdnXRKTGpjKKZrVwUyZn5J+I+YGwirqfC1OIlxw0cFjRPv0zolyGDRCuVAKAu5VHqOmpbAQChmF50QPCbIN00rTIMMY8uiAhEJBCIRcGA5shDnWdjEFYKdgQqhU02FJZ4UxItmAb+qLbyQkAhw1G1jaK9lSBdFwqorq4tCKHBGlLW4yNBVQ8FgDIXQsZaJDpJzDm9ICQMxhQzwEjJ2lyqiRleVuBVLdPhCsfDSlKbRJIfYd4AuXFU4F0c6inlgPsCA59Ty0oVUIagEBYCDGGHQCk0igUbJdW6j1Xr8S9IYH6gNEYThRkSRysK0zq4qyMq4VGYjHAXQ1DYuW0yjLJFCLRKVYb8ABn2KeKwJAZCNOYCQIN5IuQTCrdzTtNaeAdHrY2iAzak1rVTTosWer9FZISrdXFqQTrTKRhdD8+1PCZDYVkvaA5K3uNKD2utlAG1NpcmIdC7onSundJ6cCkcd3VrNLWvtB6B1DuOCOvkY7kksM0lOicq6d5LIXUEQyYjEqpGcLCEO2R8iVPDVS6OpCICCWsK0Amv036UCHjc3QvcyHKSSbnW8fz9pBHA1DcDq9RzeG7J2eIiMVQWQ1NunGDZEP4GQ3IwmqrULf1-v-CFgzEnDL0Y8K6PVxk5sIszaxlcvx+HHCqdI2RKKmUGjBl6cGZEIaQ9hjjv0pDyUUhqiJjRp4foIzhUT3YikSYKbCF8+KECAVcN2KUoRkhXXohUwF6npW7q02xnTqHX7HNQgVfj2rBO6uEwSiyVmzKSbszJhm4NpTPBVJXYRwjVZMbGv5sUKHBalgMySVClzYASUsBQNNO1LPidRrZ6TDmvifFBmkApldexJEojl+DLHtPUAK4TfTCkStVjK4eBsXA4ISAADLVbnrV6z9WpP2dHHCDwnws2diBr2Hrmm+sBYG7pkeFWaw4EEPaO2vaArnK4HgaIyF5sibokY26ryd49TeKOEICRPg-Da1dWE8IvOOtg756teX2NBf3PsfirH8s4HQEQH+Jm8NCYeQgXJCRa4nQHAuECo47MmXo88axfhoPea7bevA7ADv5eO45U7PRKoobwJQmgMTPVPZi2JpbCXGujjS4+PwLMmIamBMDPbfm6dQ8K3fZAP8oUUDjjcGgeBueY9i3V-nq3YpAUIq8G1J03OQjWWpqnzGBKHcG79eXiu0J2H6J0KwQ8XSUKHhrxb8WGu68BH4DIoMgjgwsk5wCUuIcy8C4Vs+5VRB3Yw+fd3pn8MQJq1rvnPukt+9lAlYOqMhyBBolOcPNPIdR8Jso8wpUcBcAkkeLgltyr4EgJ79zE4YGpCSL2Wia2+yPgboBS6EIsgBBL7Tq39OguORIItZXRtVciE9+n73K2s+IACK80GgE2uZaOg669bi3od1ECnOH-Wix-TM6nueU5MUpdXilHea2ITt4zdCYEwcvhj+P1bM-1vNhEwp4TqPC37jj34-CP6eCjjZo9h7RlpeAkQg4H7VJjQ-6n6R5HbCB-Qizo5fropahgGygP7LLfa4oThzgpBZI5ILhhBj56xaLyovxkgjDtqUjIHOoyL0FfTbLELDoprvpAHRZxTlI8o5omoCrmqAilIJDpA0SBC2ZBB+Bj53xsZyDyItA0A3bhI7LoET7WBiBPzUBaGTTCTFhQAa4NyWSFyWrd4FLtSxQswghtarrBwLhTh-joyg4+bdoqFWBqHbKaEuS3YNJ-5igGFGFBHaGfSCwWHJBWaQg7z1aUHyx+6ro2IFKURtZmQfBQjKGqHqHXaREELBKhH6GGHGFKD5H5Z+RXylTlRo5RYY6ThEr+6WTAzvizJOCaw-hMSWTCKrqmSS7m43pvQSAiQ4bw76FcGZxViBFnLaESRgAMDzRGyNAWGygJDCKFq+Drz0QdQtQeCdh9g5FLIU5eEW5jRjFmETH9ZiACCeqRIBR4AWwobhIVgt5X7AFxBzgyG5pyGwiZApFODeAyEASrpfAqx-C0HDGH6XHjGlG6ClhvGVghKGzjAL7q6fFCGBAfhGIrKro+AQiWJ+5AQ2J7w7aDgrxIERywnRxXGxoInUBInlgolz7onoBq42jrHByvCAlBAnSpCIwdTIzSiUSQzA40ZYIwkoF0nwkYHMnvFVgu6J5TzrFDjURTjSylxJQdQwKJQDQnR2KazdbSkcG7r0mdCMkKkomMnjz1iNjrHQigy5DpDAyrqvgdSZC569hQhrrTLgZj4Wk7BWl3zxpuRYYDb8SdINH3J4FAhzjuBeBmJtYWRuaGSayqjIyETFr+5h6mkRoyJBktBWll4DY1ElRlQfGCEY7JABBGJZIBBunsxAnzyBABxFJHQNweapCBlyl6GImllFi1714kBhnaLVlxm1kJTgiATpApDNkdRjKbqwiiZFLUmSIymFl9mTEDkYFDl158CI7I6x5Vm4FopAgATTkNlzkuFzgdSk6gyQgyx-ij75kaa7rTHbLgStosFjBsE0mbkfkMHBmsR8FigCFnmcrAiGrZoqyxYekOGIyqgfApALg9SXTtFj4zZ-xVjOiiBELPyX4TnnksyaxGJtbcJnR2pLrMwTg9TObMyWQJlYU4W9CZwEUvz8jEW3ikXuCIwvjoW45AyGRcqJCURAw4nWIWRm6U4jFjTYX-x4WGbELYHcU4S8XkUCV7RCWdFxQBBUxDiURF6yg+xj4ABqDalAg6cemqA2KlsRdZM5jZ85OJF0PsCQ6o4IuKKoNEUpsltJMiFlfQ1ligtldCgBkFOEU59Zs5TZrlCsRk+0aSnwBSPgbg++AFZp1aJ8vAP8JA0QnQPGrFly9xDaYgcEP8OFqEahwVvSJ45UGuTEkI4yLybyLMX4ryCQ4IQeNBmQPZb54ONOOVsAeVBVOwRVfGgCpVkSesv8ls5slVk19C01jVTyEyryFk7yDM4Q442aneFkA0fl5xclp8uVzoY1LQE1Y2U16Ag6M1c1igV1vSK1dy46Qhx01cKQ7RXwaWiCeuiMKCC4UyUIhpRSgZiecA+wlyM2-QRFkVO0bC7gRqXCasvChO9EoMr4PsmQxcnY4NbukNvSMNJIEVjRcZiNPKKNPCwM3210moLMQEOoYNA13abcju2yDY+AZyUA5UGq-SnOw8S+vOK+iWDmMyCQmCZquOOxMlx1AVH5ugJ4UAF23cUkKllesA1ew5-kxmzeMZb1GOpK3YmWLUlMcIeSDMK5E4K8g4O1zN-lgF1aesitlAytqAqt4VT8pAMAqAUK80F2UROtTe458Nc8pKNiUlRB0lDcDmaRSVrs4QbZwcnh7BBZCt1AStKtHkPc6tt1PShYjeKE+tn655RtiQWNH44pPwo4cBj4sWl0JG220JDtWVNOztGdrtWdLQYWhFw2ikpWgC5WlW5AGuAQVhgEweOxMISFUBsU0444Fkcm7lq6SQZxqd75TtLtbtHtKlfdHFjSxmogo9DcCUE9LgU9pFEIhkaUPYpKpkkInwt065Tqadm9Hd292dathF6GmGDAAmOG0Zx949gE59n2M9pBqoGav1qslqz9YO3a7dmd7tn94VXGX8i1119Cf9EWQDp9IDRSYDxiSCFkj4uK0yIpYiR169g1McW9Xd-cOdhFjOw9ISF2DYIghR8xig92j2WJhtmSti4MKQvCZis9Uh6VMomsyQIpxKKdmVr9bddDyD3djDL8duMgSuaJGJuD1E+DF94D21O8PKC4iVfRcjG5rddA6jF1DuTuPqTBwaoa1OJ1Mi1jnQYAjuJIjBYFvIMYfD5NQE44gJe0kmj9HUqyLV0lc4nlzdctjtQ1h97jnjPBhFzBIarBnaLju6MejQSTdjLQvBr6-BfjalO08Fj44MQQfYwikJ32gQ5dy5OaUM4NxWSkRmJ5cNZN55zyqoMI2SWoyMHwxJ6+WaE4fw09C80ysT1D3ae9bTlyDxJmpNsZ3T0IvTEM1TgzA4tNRaQEj94Gx0t0dBwFBTg9E2ig02M2P56Tf5mT8tTtJzvS7qrkFzs2Pj60jVbgC9ydT9NEMt0Bt0RibgazIQqVyQxz3BjBDe5zU2s2J69oZ6eVeAfiV68jG9bdjz42LzsLM27zo6pTc8hEpkHgim+85DYjTgi9iUlDWS4Q0s0zaLNDUglstCYV9l-j55XuNmq+sdAOpDOSUIaCBeY+w1o1vSLzJAnOh6iGDa6AokzLLk4ZmqrI-9UZn8nu5iB00IbRgQpE-CXgRiuKkJqsONYcLdCjdAor514rciUrA6T6crwWJwYAqE2DICAD6rHLhGmrgcbWc5HRF0EICUidQikIwc0yY+uUbklp8pDlV5sVLld5iFe0wuG1PwpOXZkbirX5sbr1Jdt40VTlN5C5euoLiUUIdm4lIDLTI2tCbIVpaTTjMz1OdAcz0kNxh2eLEFXT3rPgWrfr7RereuEJ1EhEGxD9U4WsLNLbUgbOpUR2U+TO+wLOoRAtjVlEXVrhOayMBSMIo4C6dFyM1iKmgc4Nc7HODOY8DY57A2iia7XrYUNENinYiRAzfg9hcybW2O7wmClc9mZ77OC7cuEAVY17gHDeg8KOjVOxiZ2ZomlE4QqYlhiZJaMyvlbWAH87NuI8V7jQ4HZAfhigOAzoH80H6plM28oDulwcUI5BldQMt0MDmHF7QWFVIVrO4HxHR4-kkH5UTYD7Ls+lGpX7wiPsRDsUGoiMJkrmANORzHQHhMzDZ2bDV2cxt2PDyeodkoAQmxlcA40Uq6wzQIWQCUWolkIQPyyQ5jL96LrbeHWHx2s74Hcktbp5PbYUqMBlAEFnyMc4Ftcy9E+EGSryYJWSstzbox9nLHhWczA99Czzk2lzq1zVzykym17VCslE44Di94BzG18n2H0+s+WjHJi+AnhLa1rV6XulWQzmJLyM-ybWAOBXx2d8IHHHWHXHpH5X2nwMaobWzwGSvlSHkMHgXKQMoQUUyM8nu4UgyJqEYH87YgdYxyresIoIwcXKBe1dEnzmmxV0ZaryvYD0M3JYc3LJC3UXTJR5KOR9PXBK9Gaos4t08IyM1HA4+ETFpk4MnYmQp3ok9xESYgTxLxnNF3xd5mNWAEHl+n9FOokII3zwMoJn5OmCcD3hM7V3s3ZYipqJKupXmJBLz2q61ExEpuJjWSSHf4XVCC1kBezm-31pXSJXnJYYa37gdcPVPsQjSHMtiUqMJ7iMp0zicTljTn872P83SpCebuqp93mOKQVEOaqsyUbC+aEne8j4f4U4O8b3gQjP53uPtpK3Dp8vC4ZBrMI+PU5nRnSyVE0yYM3VVG4XjLszWPJYoZ7otCmwreCychOaY97skhFEdX84aVRqV06PFxdJ7v8rV3XANRp6LGQtcW3LotSHA0oGl04MGQgxDLFjFr4v3qcfN7+59eN3J5EP1+Imy+afAuEnFkyF5J4MSRUfWT1aRf+IYgnvKgEZHrbnKzhGtfy26fmXBSHgHZzMwMeO1n8DLbvhFYBRan4S4RFR24IkGuKsOaE-Ps6VdhzMFLcUihhcBBM4V0e0eRfhS-ERXDYgsc8+BP2tSgCufQA-BtcZKs9TGRf6GQMIKQwfcUTsDYniCURnMjfcGJf0X4BEb+5yVfkUWti6ZN+BJJeLRHhDFpaWsmF4AKSKSR9XkzwSAf4RNgwCV+5ReAQRygHIZyydRN-vm3UrICEyK8dARvDnoBAwCQ4ExrRCihr1Xe8-F-jYzZIYkmeVYAQQT2W4YB7S3XIno1CAiGoVMHZXyszEFxGQewpkE+ukD074Dp2b0NxjsBEFq47+LPDhgeWf4-xKANAyHgtmH46418jmHwMbUOhk9cUryZQnwM6B6CRABg-HpyWMFqJTBLePNhYJEwzkZQzMCxEEE25fgi8G3eEGF0Yj58bONDHQS0GVKy8h4YgAACoy8k8T-Xwa-yr5fEEAPTIxBswGYtQjOsIZIO3lCBwIF0HwEVokx2ApCk81zJtjwNwQNDkhWQqeF2xKZadHkKXdam1V0oqw2srwFevxSHBeAzWovC1pkNdzZDjBizWaBriKF9Ma4zMMoYZFyDIV9cO8TbP7zHxzCVSmGRYYfSzhSCng6FV4G+H9JFIYGWw7lIMycTfciSs-DHm9CK5uDDBpIRxhk2cb3Macnw3Qd8J6GXB5epObsC4HVheB2sryQNlgMrhHcToUIjKgX1s5AiWg7gn4W2lub-D4mdADEXjwf5q5QRXFPoU8AwQ9hROBJEJm1i-AdYJ+REDdAxgKBLhqAedeAHGFd7kiCAe0VMAQCBhURhUl5N8KrEzbTtCQPIv8PyNpiJBEYisTUAN3BYSiGQuMEwiyk7gQByRlcKiGuiRi0Rk6OopDirCMQ5Evm3wcEC7zRE5gGQ96ToLBAJDWgww5IhTK9igQxCcBnwfJNOiko7EWYv4BmtuighbhTC+IbUbCCV6agqMXwcjEZ28DSgM0Z0AEqmSSBBiGQ3EdtoyVDHNBtR9EGxM5hzSyFhU5DJBPtGBD0t4oi9VEQkJNCsApAiGTmrQhXZ9xig9VRQMgAmjkisyGpbVgmRIw01YoAomxL1BfCvcGOVTNMZiCjbbICoko9zjtBAg9h0Eg4HYpU384dgG47eQsdb3UH20Zh6LHkXOC14plkgpuV2E-jnrMx3AvlUXDgLiJj41R1saaJqK7FUxgQVcTvEAJXIXQc0VmYELOlSp9gReEXXLHzGiI-RcxWoZ0rZnhA4oxaEmHsHJhZgNcFwFaLQfrDRImwzYrKFOIWDTgrR7YMxckZamPEmIpwEJFLD+LIJ9EAJoQICd-k7jKMGGUkcCJPCHivjDE8yEYZMhzwtkDu44ZXlDFNThBqxc-SLg2NKB3YeIrE1sZWVrCdj5xC2P8KfSSCTDFChEAAbSy6gASVYvyWdPUPwRXxKAN8WhMQnJF7RaKPUEJm4G6I0QfxtHExq9yugzgqGbQ-WI80UTaixwJkLUB8CAluAXAP4kIP3iHDxQPCmg81rZy2SdAGkeyFpFwxkDkjQpHlHbNCB+whN+EJPbvEBAfrAxGM6E0+DSlOZYN6UlCGFDmMUkgEPwSvJZPpxViowABKmKmJdBSBb8dQwEtyZGg6DuoD6F8KFvGmEABpyRL4L4B4HFR3DLorydcZjgoL9dTaRkZEWPnvS9o7g0rZtOZMrjE4jc8QGDkuhhCmixSqsCzg3AfF7ldM5I3JD+BlonQfSzhSjMIh35-Bcg0mVTJFJoZoEO29OYQOSJ2KGJUYIDSiF4D2LDsDcU4E6EL3AwTiCpnBTFs-GIliEbo85H0k03V5SE9Oj4eiD5QKQ59pu0M3dAv0IEJxiBxRXQjuTJi0CFx4Ge3prDSlATUBAAlmFkFeB7MPMXZPqL2WuKMkXRFiXRn+Be4lJEODhUyPHWzTLw0pEU-cTQ0-Ixs7IxEsEBFBmRuZROHUFMvWTgK0RleEMFiopXYqmS4ZlUpwAODdgwJaIk0uQgANnAJRgWfTAkqkDeHR9Aqlldjmy31mD8oqmvTWERC+BC8pwblReICVangyAgHU60d2itb5VCqGDZ6rdQbRJSPgQonAfCC9iVxUZ6KGjrzKByOIph+Nd+FDUATE08A5kpwbAW15B5BRDmJzOkX5L0y-RIcmsS2zZp1INgpQbmrzQWb81AeF0p8hjMujHF6sFkIVCkHLbhsxEGWbgaHJbaINO6TEnuk-B+mMRSGhEUceEBjGRClYjEJxOWgAj2z2+NOJIbYy8b2NzJDiDwPKMIgFj02hOSoYzHIaVNngu2PGdlQ6EHyUmc8g2YUJoLUs3MvCQyn9SkLDhEoG+NCkcXJQ1t+6mDA+ieWGnD48S6QPqJagy7-zQ+m8lKJjK8AQsCiWLRLrNmgWjTUqq4-sFNNkxXRb6qZXXrOniFiTLicAMeC7LfluyasolNAY4gJIFI4xH2G6BDEsjgZnkIrM6vlRtZfQ7WjSB1lABdHPJbE4GXVsHB9h8SskhBOdDMhSqWQs2eUECv2XJmBDvidXXyXRCnCbVdKgETFKJz2gryUgxeR+TTjbb1sMC4ivtrdCzl-pJkhOIpHKKcXVSx6LXVDHHMujXDSUeY1qRdGkykM0iQEeqeCH+5dyDWWSeuKvVhBJs5kXCA6M8D7CV1vAok94WNAJnX9jCr4pWAtPCDv4syAETAe4CraTgdsyot6T4VcHAivBIgOOfU06pdlskwOfdi-h8AikM0iMUypYqsa1LOh8wqeMNOli-oJKGZZTNNPJz5jEioqIiNFHqGx5ncXQ9ie-ILwS1BwiMCMdkFTnzxj+iInFG4DwiyhDhKyxQKcMr7QKnSs5EaQmSNYPDhxyvSyABjJyRsZ8Xw+pYXPfkjTEy402RQOD8AdVUg7eOwVsv9EVICgQAA */
    predictableActionArguments: true,

    id: 'project-machine',

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
      batch: {
        initial: 'Page is mounted',
        states: {
          'Page is mounted': {
            on: {
              'Resolve authentication': 'Fetching running batch list',
            },
          },

          'Fetching running batch list': {
            invoke: {
              src: 'fetchRunningBatch',
              onDone: [
                {
                  target: 'Batch is running',
                  cond: 'isRunningBatchPrediction',
                },
                {
                  target: 'No batch predictions running',
                },
              ],
              onError: {
                target: 'Redirect to project profile page',
              },
            },

            exit: ['setRunningBatch'],
          },

          'Batch is running': {
            invoke: {
              src: 'fetchRunningBatchStatus',
            },

            on: {
              'Received batch progress': {
                target: 'Batch is running',
                internal: true,
              },

              'Batch has finished': 'No batch predictions running',
              'Unexpected error': 'No batch predictions running',
            },
          },

          'No batch predictions running': {
            on: {
              'New batch requested': 'Starting new batch',
            },
          },

          'Redirect to project profile page': {
            entry: 'redirectToProjectProfilePage',
          },

          'Starting new batch': {
            on: {
              'Batch has started': 'Batch is running',
              'Batch failed to start': 'No batch predictions running',
            },
          },
        },
      },
      project: {
        initial: 'Page is mounted',
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
            entry: ['refreshSessionStatusMessage', 'enterConfiguringNewAoi'],

            on: {
              'Mosaic was selected': {
                target: 'Configuring new AOI',
                internal: true,
                actions: ['setCurrentMosaic', 'refreshSessionStatusMessage'],
              },

              'Imagery source is selected': {
                target: 'Configuring new AOI',
                internal: true,
                actions: [
                  'setCurrentImagerySource',
                  'refreshSessionStatusMessage',
                ],
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
                actions: [
                  'setCurrentShare',
                  'setSharesList',
                  'hideGlobalLoading',
                ],
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
                actions: ['setRunningBatch', 'hideGlobalLoading'],
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
                  'clearCurrentPrediction',
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

            exit: ['setCheckpointList', 'setCurrentCheckpoint'],
          },
        },
      },
    },

    type: 'parallel',
  },
  {
    guards: {
      ...guards,
    },
    actions: { ...actions },
    services: { ...services },
  }
);
