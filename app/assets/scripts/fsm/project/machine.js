import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAjEvCugBRJgAJLYuj0AV2p5IAYgCyJZDz45UYZpADaABgC6iFOliU8ldNS0gAHogCMAJgBsdAMzXHl83dUBOa3ctu3AGhAAnogE5m4ALHQAHGEeAOyWAKwJ1pHxVgC+6f5oWLiEpBQ09Ews5HQAQswUslyowtQ0UGIASrhglABukFwl1TlQCrCwappIIMg6egZGY2YIbql01qrO3paRqqphlv5BCCHmtqpekdYJ6zHmoZnZGNj4xGRUtIxVZZWlNXXUDdRNH9VyCQ+AAzGi8cgqDTGCa6fSGYxzMKbOiWWKqBKqcwJU6xRxhMK7CwJNx0EnrOynBKxJKWFY3cZ3PKPQovXplABy6B6by4aEglHw0z431+-15-Iggvh1C4AHdgVxYHgSKhRBARjDJjLEYhthE3HZzKdzKprKtqXYiQhKaTMaEsTEnOZYrEGTl7vknkVXqU6K0cO0uhBavVGjzPsrmIJYGJNWNYVMEbMLOYItiUoaXOdNgkrYFEJ4ludceawqEwrFzO6mQ8Cs9im9-W1Ot1ReH2UqVXgY3HzKNtHDprqEFZSW4XQlQpFs1c3LFrVcEnRtptVDS6bECWFIjXcnXvS8PXl2JwwDUBMJ1S04OgADZdLgkQR4SEiQXMabxwdJmagOZeJYqKhHYO5hNYO6ROs1ronidBbNYabGtiJIJHunosg2dDHvgp7cLwtSKBAARxtCCbasOKYIHSM50HiOImoakR2HiME2MuxruIk87GpS6HMvWPo4XgeHngRCgkMRfYDuMFHJv+iA0eYdFnJEjGUix1jWuBcFWGEOIrHmyx2PxB6svQwmiV8REkcolgyYmOpUUpKkMYhTGaTBVjKSSYR2B4yKukapleuZ2G1iJADCkI4AA1uGlAglwMZgKgNTPq+YDvjgSgQKRDlyX+piINEETlmc4RVmmsR2AkXnrvYPiJKkdJGmhWSMvuoVYZZ0W4PFfw8ElKVpQRGVvvoOXXso-ZakO8nFQgpUrocvlVZWtWLuBdhLASU4OOciTriFmFCRFdAAKIiKl4a0HKfIRVw1AkEQYBiAAymAeAPV1T0vWA36yfNRVzIktXAa4mIODVlh+WxyKon5zjuDiLrWCdglHudAAiYBgrQXBgqgypcAAggA8gAkmIbCDLA3SCMgd7oJJZNUz0L54IYgOOZRCnzH5tiRAk4GeDuLiIdpbh5vBWJVpYgFQejHXCadWNdXQuP4+eRMkxT1O03A9MhhAqAkPduvffrHN4Fz1A84VI7hIcUT6fEqgzj4lLWnmlJLK65p0qEiRuirEVqxZ52RRJ+iDaQyCSNINTyIo6oO8DI6HFWjVbHmvFbMLMHuLYZzWB4GKhHmlgY4ekcawA6iQUyDSC6BpabnBcG3XA5dQgZ3onMiXsb6ByvbZE-k5-NVssdGYssxxYqBC4FggU4bEsPjF8kwuujXYWWY3zdQIT3cdyf3e9-3NN090V9gHebOU1wHf3QwnPcxPQO-iOrrzvYXgqw7nXlpVenhHB0F4uBU01JhbK1uF1CO4UG5N1jifVu7czYXzSvfAehshh3xIH3B+T8X5mzfh-e2s1yIZyon-WIAC0RpmFsaUBexzjGkgfOdwWwZ4i3aggjCmM66ek1uQ8M1sGABDIZwKAjRB78CEPTAQXR04-yojuUCm9khbkCixFeexVKknYl4F04sBGdSEbXZBojsbiMGpI6R585F-AUcPMAjM1FT0WvPBhNVljuWlqBSI1pHBl0gTObEGxzTJDcPvHqON7En0cTIqALimj4ONj3Ih-dSGvxtnbLxfMfFmj8Q4M0oQgk7lCZEqIvFkguCrLEXcYdEHCJsSeAAYuCWA5AX543BA49mDAhDUAgLGCAhh6A0A6OgWKIiBLWMst0hovT+n4wkcM0Z4yEAzPQFNL8GgikLTmBsKw8EdEeBdLDQ4oTpa2B3M0s0rhnAzgsardpyyvrVHBPoEgj8IDMBIGISZLw9nzI6WZBJGtOnfL6b8yg-yX5At2dQWZBzP7qGOSDCwNgIj+RiMXPyE5mlF2iHU0CuYtgh3iWdGFcKeAND+QCoFYhUoYFQNhO8zAMFEEhd1OlojYWfARUiwFKpUXos-Ji7Fmc8WNUJQFfyLoQmryicpVI5pIg8SrBid54dPnnUNlKIUhhCKSRIrTSgr0Clmv5AQjUX9eYnMLLVICiQrBeEAnSQkq9KRpjoD4ValJTiGkNLS9WojjXSmmOaqSmSGZMxZiGSRlDZV0JWLYaknhqTGlSDObSJJSTMUnOEZimJ9VtKWUahQJqZRxpIq0AAjoIOAVt2YQAfl9AGTrHYZpsGSPEtUqxqWaeYa0LECSBpsM4JI0sYjRAjQs3C0bTWygkvG2+IY7qkPfrbTFc11HT0zYOnNI783jtXuBaWkD0TgQ9ZiZpS7+XsFrTGs1G7G1gBbW27o1tYByj0BQdNx6B3ZuHXmsdE69JRC3EkMuM6qTPssqu+tn6bw-uVH+9mvTVTngAKrNAADIgcWuiMDQ7c2joLX65EkQIZmnYuEBWlarEHxrQKNdDaPqAc+DgQQqAFAiEZVGYhXA8ABGQD2gqtD+ZhPTGXKGaYMQ0b2A4awfiRamg0-pTYlZkMcbrbG9DAI+mSnfbKHA6AiBM27Y6mTR7FphPo0aIBe0sShAndSIC5YRbHCrKBLwBmNaoeMzZHjQG+lc0IngM2NBFGdtI3McjWbKPnqg1epCZIMQeA0wrFI8DLGLPYyFt9XH0Ok2QEzaRFB+oTBoHgJLiAUunog9Ry9anlrRGYuWZpJJ3Ch0EcV6FUaytofC5V6rXAwAmF4Gg8T1q8Zm1ek1hALXwNUYvdaNEmIljrGYt4DYsQFiseG4Kk8oWP3hdxnebtC3XogmW9Jw93jksno2+l1TillgGkQuuCCGxwinahedldY2wsWskDoJuOB5SKnprd-AUIHOvcLAhupzFNgeGpBiCd2wdrkZyzSZT+nWlsZGxd8HV3IfvRII+WrcV6siFW+ttLkGvs2nCKoCJd7xZbigiZMnZ3I0niuqINK5nyvCHyi94pSIFY7X0qaSubhYaoQnSxO0NUkhQRWGpUnQ2Qci9wmL1KD1ONoelzNFHcu9QK5XFOLE0tVf6Wll5ywQFDibFSHiMuqvgcCuNyJU3Euqfrqt-ZWXLqED48V47lXau3d+o08uR5br0SHHAsF0R0dU6bOpqC6ZaK5nLsD6XugufPxDMppK-Z0rx5Yt7bJkpGm6LlMCXmaptHqSy0cMdicpcWmG7Ly+0mQoOhV5PjQUTgZT6h4t9MMQlNqAz7EiKMMfxVvLGcCua9+I0Swz8H6mwxjoE8Q2HmQbRWjfl7H-oCf83p8qjExg83RnDBL5X8-2f4kbKrdiRxDjpjlOJottvRKiBiKBJuFEgbtfiPpZHfp0JPiJt-jrN3JLjKJ-qvk+OPvXlwECKCE3LdvZlHjiggOaM0vYJWOBCLPODSBrixHtuuASohK6GENnieM0BvifBgYvpXuqCgTkueHKGAAwLAPsvMo1k3o5nMJfrYM7ixlsHELjqvOsDejDA4P5M0miEPnAUgpZFwT8OGLwR-gIJ2gPFGD2CKC2MGP-loQ7pSCppSOYtthsNzv5HYCxKcMLGuNXELjfi+oYWKG-hZjeIGK2CGAzrFEzlITbtHn5hENqtiEFPOPpHVKoeiMuBiDpMkJ3miBwbhEEcYWHmEUGHfDFNEegA1lwHeHNnYarpAnnASOsKaPpNtssKSFWCSPEOaMaEkAUSJEUYNCYdQKUREfdktv9P-nRqiGpJXNSNLCsNtiAfYK6Cfv1i0Vfh8tWhrEMTwSUQGGUSGCMT9AMEbHYVuGSD6mGpOMdttuWKSMcFBNEN4OiBiAMf6NwSEWumIKTCMmqLarKPasbNMSsHRN4WmDiBoekXsArArJvNLDOOxEjH4cPvoedHsd8ZgZdrKAQYTEQcjqQSODospLOmmFAT9mwopKOqiEaFxF0ciILmiYarsV8SMTfAvh+sIHDnwCQP8WnNIajmvBpqSdiOSdsJSROljqiLmiBGBASIVtsSVqIpieyTiaGLKAqHINZrZgKXEWQSScBCARSQhNBkaLMUaK7jODuIqQajsTnjHMUV1CClMnQOCqXuiRrPwU6Z6LXhig3qtttPIcdgVqkISjsH6rVLYBLB7sXP5McB8URsmjUUoHrFTDLjQjIYgEaN4MWAsB4M7NofmIYlvNOsaVpocEyXoSyaIkmazNyqIGmdTNbkSVRDmaSBVNqmXL1gLouMtJmuuIkJ4MkYmcmQ2W2k-HGJHpmUKe2XmV2YWb2VevEEBBpniMhD6h7B8QAGr-KUDirnivyyj6wZmTy27CnZxkl+QSmmlgJvFkiBYpBY5XDVj+HwHnS7m1EHkyJjyTktkznnmGlXkmngShIiw7SHDO4eAbDbgfHYy8BMwkABDhiMzMyszWxmH-JiD4ZJqSTdAT5fmkJgi3Ys7HYMKeFMLAKsI+zFy3raYaQmhVlKkU64TwWwCIXIWDSoXJkYXoCAoDyRTMz0zJS4UprsyYV3ikX-wUVAIsKnDaQHZXFXBHYbiwxwUIXcqcUnzcXoXiV8VYWCU6Dng6ViXPwSX-lnnR6ZGknhCMkkhwIGJ6i1T0apBmgeAhpMV2nKmcFLZwB9LWxEZzannfxCnOxCxuxKReyqpqY5qogXBsGVggEfGtCPZ+WkKBXKjSStn8xhWuzeYeyVLex+obhzzxArnIjnCeVVreUm6zbzYKD4BEJQC3Z5LkIJZvQs7vZs7tahJPkriwxpB-atEfGRSGBghQACa3RgD3QnkSDQ6Cg8lKhdpI4kEAXR6UrKRmgrCuj2gVqFpwSODYiwzRA7W6HMWg5RRjWUATWoBTUzXpmUykAwCoDSLiECY-58AI55CElrVkGUrc5jhNJXCrAqF7B7QRA5oLrOCVgugjVXU3V3WTlzXmE1BfUrWrYbXwTb47VYh7VXoUVLDuAw2owp5w3UDjWTWDQ7onnNqtpYamVKi8bAaCnnksQuht6ex0hMKLgeDuqwI2nrAeZbFeUsWXXk3XWU0nzU3pm00TnWzmHdoY1NIc3BzbUdaKStTARuBKFNJQRxJvmek57w2S1PTTWTlWo2p7p2zm4OpK3s01Sc1q0Tp950TQ2nBlzxmvnMn2knijXi0I1U1m0nkJohgmW7ppos3rXK0O2q3c1XrlyBr7TYiuDlhZ4G01m+3G23WB33XUzvRM19L8aCZZTfRP5CHiaSbPa-UjieGGiQJmKIkEjxBJDaQKwMJoj-bCz2gJnp0+24R+0U3Z1S1B3pmTZ3g1YVExF21lKO1x1g1UhLBWCIQe7N1bgfFj1aXTazbKj54ulgrF4QrnVB50Ab3hgzZzb55+n14jCrZlqdEaYQSBbhCeGuHrCDo+DlqYhd1wVdrzbn073V571F6zKH0i0XWay-1n3b3zb6xX0yg32R1kHa0IzIgdFQQZ4xATozxRDuCeHZGXBr2901WDHfp00CHy2-0dWIMjjCwIyTg6GOClLRXZnUjLhqSjq4PMTC3VWi3NiYbkMdqUNZXV1US0MA0bjNKMMabMM2g0g7T9ZeAQSaLhpEO8PenV5KhAgKBcCEZEZANukH0ekZ392OkaO4baO6NwOHKN76k0NYguZhqVhuGq4RlqYliby1TMbriZpnVgPH3qPJI4ZaMEbEZsqCZtxco8ptx8pH3l4BOkLmMhNEZWMyrUOiMeYri5i5GJALoTpq72BJAewnUhrzjJVwBfQ-nHnpmdUUZnrs7q1rwODKSVgezUFzqTjqXsWaWkJ4YkAJZiqIrMxNCtBRgAmvwdiUI20glpNyY6FUFbhnAxA7U+yeOBqwSVgKy7z63e3EOawaVIU9MST9MAqDPoAZIYCBjdBW12pbpb5zPLw0FLP0FgJVz9U1SOghmIQfHvQqhqjFGcmjH-4ilGnik2C3lqblIXLRAiyJV+SEM7O8M-OqjzbskWUhWAXAvAU3mgXJ6XGLOHYxD6LcPk7gOy0kydjsmmZYmxpaldjIs-WWVkEUEubUGLN0EwnZngKrFrBZyGjHZlOxZNzrrhb52RbibcgYHtUs6QWu1A4wVGQNP47hWizzi0g4gCtxbCs04VMKCCvxbxxSszNkbnCp7KWO66aOChLQyuwf3nAeS+M8OktfSavcakwQAhi6suuwAvS2Ys55iAFGjGTHaUhnChIH5kjA1QQzrsQatCvcafTfSetxtkD37ng4DcpDB+s74e7mgLDCwe7+6hIugMLXILEKxuWJCxvxboY4XflJvxbpvAifU+u3bDBGvJYLp7blRrGBwyPLC0TMSUjrlBqonVl90kN6tatSSit8YCZCal1f7l0SZSYs4xDGLaoYgex5gwU+wLAPLSwuiBs0iwGxOBHOtxvoatCTuET8MMvotWU0TzNeB5wezhChJcRRAzjogxIPpVtTtfq3sM2JM6PEZSXkWALMIgKhLlSQJ7Q3J5gVJ-vxt05puT1VHM7tvNZkWMKyVQdgKiyQJ6otQ7g2A0hIcVbusxYuuNuZuYdrYixATJCKYe4aQTg+xJGNEQQZ6eNkeqNOuTvyKHHjH1ujH9B0xb6lyZP6jLygRtFgKTh0Qhl-xzgEh-uCc2Ftjns0BiBWY2a3aiAScixLCeCbBt2wQcvkGQFzwHRWDNLINqeuJmEPxiCWExiEThG2F0dhKn5qRloYhlW7s4grQxAkcbRVUkvH1XuavqceflF1boexHZVOYP1LAtSwyITJDeDsdFj-Zq6zo0jbNju7NRdCsxdHE9xofVG1HKgSdFhloK7HVqE+x4hlLHuvLljCwOfDMachj6APZPYScbwewnD6Q6Rd7sJ5aNRqTKrnCITsF8eRdadihjHBjUs3NnPidecQS2CBvVR0YsY+yFPctIlTjSw1Rde-H8kalb7R2xL5bMTsM+xpHwSgSmhloOsRfl4leDLdfXt4nsptx3vOpkGs51M9XyfbCuwUUKmwzrgB6G0+UCeuLffh6amKi6e6lA99qgapZg9bZgLyqhq1RvcwuFensGFLfyJ-FCDfTXNAm3N0eg9tb4+GIEdndQFgup3r24GP6LvEJYGoFfDcGrblvNNPm+yoRYiFp12YiGiBRXDBQLe3488JR8+BhiB9SM4JeLXSBMyUBY-N6gwUj2BKxrmMPYi+pg2dsujPItfzgsTc-37IFl38-L7YG-4Woi-+sMZQwaZeBwxXpKP2BnDcRbB6Zk9+PK9O+8+r4C-l0ptIH1p4kggEmrWMsjhgzLjOCQzHB++wzFkWD3kOXIwbTkbr1Vbj3hhRExErdxda8NZiBifnGM+ErFgVQ5OaQF8x7DcFOeDuUUVlzl-VZV+VciAa+j-fS0u6+1EG9ZlrZdV48ZZqbHaJEtSSPa13pD+V+DTV8Jfj-xfVFT8V-68ajULp8ZoxCJ1XKGisOVjaRwaQJeAeyDlLNb+b19eTGvRiAAAqi2j2-0OvY-rPyFJiNb05wSRgElJSqFywO0CcEkFtAuBUgaYH+vp3DAf9-+X-QvAYxAZGNx2EDVAYNHQFPYUmAZRnthxkqQdqKqhJIAwi3bHAMwFcHugi3Aa-9+uAA2lgrWmh0dQB9DCAUw22y4MsazsQ9uuFNDhdhc5eVgZ-2EKKhOB4gNFsDzsZ+QVIAuSkNmmgiqFWmgaNfgdFeLzdmBx9WnB0BH4H8x+WA90vygR64QjBJg+viIBIEINbGdCOBIpzcLQtKQGgwxA0l3zbBtaaIBYP5G+Z05bBlRBvuYMMaWDjGIkGwTvwn4OCjkZ-e9iD31yE1miL5JqEfit4bwWEJwZOrD3agdRqAfFOADCEj5Jc5gBAWGFEBNabYzE4LYIOLHBJQwK43gexs+nZDlDFIEFagtsEiRQRUIlvYIASjJB0E1BiEH3BH0dZsgmwHAfCHwEvDXQIAnQ0cDvkOCmhvAfvZ9mpGtAEBXADCcsFsFFimhhYgQpXr6FYBUtxI3BZYQDkag38ZwD9VpqEhN7UogCL5ZwF7SK5YR2QdALkBGD6Bh518RhP4MsN0jdYFgyEK4E8LVRQR4I6qNGBBBJTtCmwQnVbu2EGidhXO8AERtPGUh7dehylbiBZxCBZoPcMFMGNEEzTEsJB-KZYT4H6o+4jQDgCqiLEXCaQHcfCIBLZw+40iUMZ4C8KMnVDLDqoDIoKBLBZGDD5+CwQNAhk1Q4gPhHxWYWvgbTCjKRKkVItrXxBJALO6IDwIjE2AZdcsvHAwXEwqIJRho9MUaLyRfATQPwQonET4inAXJ54vsfyFzSLjSiCy6weiFBCuAfEQ8iNYSH9FejLCV6jHVwI4XQYbM2I-kKIDYBzLHA84kwz7meylANVvo0WIMTkGIrnhkAZ4G4YHBN4Fl3YnhLvpBWaYe4dwLuTYMaB-raxCYlAYmO2kph0i5G9gSApWHAS5YvIsI+iMdjEau4RqpjE+PHGFGnc6koXOEoFkcprY5w79dBvlgKwfEj482V-OfC7g4IhCd4UEa31cApBCm7ghpnnGXC5ptaOZX0dSICKWQ7E5sfPD0CcRYJ0kywkji5hoj5pus1IXqtqlSErBKwZFBWB8RWQQh1kP3XdNsmxHn9+Y6DI4PpH6Gw8++vVGWEaA3ZHRS2gEhlKKhZQqhhRYfeun5GFi8084M49ELCMOFKNmkmufQV8PAbqlP0BY9EB4wJCq5DQWwBpppHoxcRAcAcakOdzOGWQQ8a3VHssK0Lph2G65dBrnGdpToMuLXDYOsGMhDi881eZ8dEB2hPFn+KMGARZ2CTKQA48QBwC8WpBUTye50RAg-lV7YFX8IxZYahHHCmgDRiJUjhriqGbgwWO2LcDYGSpskw8NkhwKuT8mgRtaZoMuNth8BHBdUGmLHD4VtJTC4mw4n6J6GfH454IroGkAhDNB5gNcRnZwC41rrGg0Ql498hrDrIhhxyTZUMYDm5Z0hHAJYPvNpDLjkVy2rEh7qkB3J7lvyR5J+DZL8jc4bApwMCJoWNC9UGirRX8fQg9ydMOKKFUSqQgkqgjHcrkLcP3n9QziYg5wMkO4O2BwZ3ifEjEr5TWQBU5sdI9LlEEeEliNwWDKdIAlcBXBmkq4YyZHxfQXQ6q4YdMU1Rary02qTnAsbmWfbOEC4lwXqpDyjb2UV6QUMmoPURr6xhJDgYtCsFs5jSqSMedEDtBSA0gQCGwM5G-ygYX1lJDouYKqx2iQxl4XYy1snlCDVDHkqdV5MmN5E4xIGg0f+jAypjLC1IGIVLrjQ9zljMh2ZeIPRhYxBpPANUBwGU0A55JKGrM7wBxD1qrRF4xwS6RxG3zmhZO4EVqbtK9LxT-0wTEDkRkllwRc4cE1Bv5HqkIxmIywWXqEGuDqyVS5Tb6J1Ohn4y0crgCAkiSVZrCVm8JbwgSExmCxxBV4nGPs2kTWxemxzF+KcygA2TVW8EWytqn9ba0LOZwdmtaROxbg3RfsoqaIiRZ-NhiPkx2WvFToKpUJMAl0M7QgQsdpYs3fCWrJNFnt+G-wszLnMgk+J5w9GM4MkFEEtNMpyeS-t4GgppFm6MUlMRT2vZ0S85xOHaNN2OBOMdI0HFIBEm8IHYtMXXH6dzipDE5N2oaMNrpF4iA4-I68R3onwsmoFQx8Y+CP1IWI4hL5FncCDuBXB3p1JicweXTI1in1YhpgvAPNJRC5EVyaYV4q4z1C8RtE7gQ0ADm2DYzCBf-J7KzLHSE13KTjbEGaDALuB+qqdcCjxPOAoCvoaAyBf9E-m9SYk8ZTsQ4GWIDt4BrDbVPZ2tkngpBGAmQXwDkFLC85zxBhJaDAhuVogSMukBOAuR-ioyLGPeFQusHBC35dgj+UwrRAwT5R5wI2TzLXhWBucPgBYEFF6EO9Mg6QIAA */
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
              'Map is created': 'Received running batch status',
            },
          },

          'Batch is running': {
            invoke: {
              src: 'fetchRunningBatchStatus',
            },

            on: {
              'Received batch progress': {
                target: 'Batch is running',
                internal: true,
                actions: 'setRunningBatch',
              },

              'Batch has finished': {
                target: 'No batch predictions running',
                actions: 'setRunningBatch',
              },
            },
          },

          'No batch predictions running': {
            on: {
              'Batch prediction was started': 'Batch is running',
            },
          },

          'Received running batch status': {
            always: [
              {
                target: 'Batch is running',
                cond: 'isBatchRunning',
              },
              'No batch predictions running',
            ],
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
            },

            on: {
              'Batch prediction was started': {
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
                  'setTimeframesList',
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
