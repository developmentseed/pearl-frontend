import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADo0tc86AFEmAAktk6PQCu1PJADEAJTjoANgDcwnEgLzkwwyjhJ5K6agG0ADAF1EKdLErbdpkAA9EAJgAsANjoB2AJwGXBvwFZ-B0DggBoQAE9EfwAOAEZPDxcY91c4hwdPFIBfbPDGbHxiMipaBgxClnYuHk5UMBIICNFDEyQQZHNLHWobewQHPzcAZmH3A09PJ2G4-xcHOPCohF8DGLpvYf84p3dh3acY3PyK5mKKGnoC5jYOBVr6xua9OLazCyte9v7BnzpR8aTaazeaLSKIfYJOgxVxOQbuFzuHYxFzHDqnIqkC5la74W41XiPJotBxvDpdT59RxDf5jCZTGZzBZLaIo-z-OLuZyeGYxQJo3GELGlK4YlgAYVUOAA1jQoNwAGacASwMCobi8JQqNTaTQiCAtYw2TofHpUhAI9ZZdwxW1xGKTG0OFkIWLbOjpe0OdzbRkGfwCsXnEXlJh4yW4WXUeWUJUqtUaxTKVTqPViF5kk3dazfRCWjYpW3xB2eJ0uwbrFGpb2cgxezmBsNCkqXUOVOgAUWEarlnFoAHdOIK+yQiGBRABlMB4Idikdj1rGilm3MDJz+RI26YuHn+z3DF0bmLDDYuDdxNYwuLDByNyrB1uCugAETACsunHfqFgM4AggB5ABJURWHqWBVQgZVkGkdBGk4ADAM4AAjZQ8F0Rd2izSlVx5Fw4joOFfBRf0XEOFwXWGHc3C5MZkmmSiEQDPJ0SbB8cTFF83w-L8f3goCQLAiDOAgVASEHHi-yA5DUPQo1MOXHNQH6HknHw1Tq1SWIxjBZYnDWBx-kdFxSPGHcpjvM5hUfDjxUebRoz4EhkFEABZJzExwOzIAw95sy+JTEFmTx2U8PDjNmRkgkPGEDH+LxSP8VwvH2CzMRbdimzoAB1EhugchV0HVESOE4QrOE0agcDAaRXPc-h4wgdB+30OTfOwgKLTWdkb1mHY9PXb0KM8ZwCIWdc7X6gxhlS5tsVFTKcry+UCqK0T5TKiqqpq0C4CEzbqr4xDisHFC8DQlrMwU-y7DzLl8M2EI4lrAxnXBV0L0Sbx-C5b6eRCGa2Pm9tFvs5ayuK9b1X27bBMgcqSEqg6EOE0STpk-RXiXU1FJui07o2KbHue17lmGUL7oSe0zz2OFPABqyMvbZ9Ud7ZGkIiFGOCgOVauQPhBFVfh5B88lseu-pdg3OgHGM+Igg3OsDze-xRgMrIYjWH0DARBwjmYwVAbbG5mbE1mpPZzmoG56Nef5+MBGQEWsJXDqnEmAzhm1zk-qyUL-EPVS1am5LUn2Yz6fSoHjZZhy2Y5iHragATdrh6HDs5tGztky6xfNN3hv+L3kqPP3D0CdlEvpYaDCSpiTlYhmo7xAAxGgeHIYSuOoM3EKQwRqAgWBREasoaFkdBpSb2aQyfVvu9gDuIC7nvkP7weEDH9A9R6Vonau81krceYvF65FpkPcZYoWGvjxmS1pv1oNG6Nlvpwobhu+0EhpGErQSGH3Q9BN6TxftPaymVm5vw7m3L+P8IB-w3tQce29s571zquJ6tpTzzH9FsZw6R-bKxiLrOgKs8JrG8EiCYEc5qgLoJAvA78YGUG-r-PA-81QYFQAwaQWgVpEFAYbWeUCP7dFYfA9hiDkFaB3sYNBflzSYKtMZQYKsgiB0IaTb0dB6S-CenEM830aEzw4jtCAGhPh1AaMSUClAxzSSztQWcKcIDyParjY+bhiELF9jeBwMxyyBHWEiPS3oHSMSmsY8B7YzEWJ6FYp4ydwJwwdjBOCbN0ZuJdh44K+EdhcjwocHq7gKL7BPIEPSF4yZZGSFExmNxYn4HiUSZokgACOAg4CSSOtVacYAsk436Dud0+SZbImKeWQ46xSIwhRIMFwZNImPwbpHOhjTLEtKSUJAc6dTrnQGeLRAwy8m7DGUUhYJS3plMrMNBEZMYrricHUqebB6jmKaboBJxJ2mdJ-HDZGsB+yWAoAc80xyPSnMKceC5LoqbrA3MkG8XhdiUVvMs+8z8nzrOadY1pYAOldP+VJBeJB6icAAKriAADKgtXOC0ZUKJlvQWO6P62k9jjARE89FllVlYreXEz5myJxAsYR3HAAhUD1GEB-H8CMqqcDwBEZA-TWqiwUXS2IwS9KxCekEBYJNHCqTUlyuYaxSLrjrixDFfLTECo+U4zZAAhLQ780CQEFU4nA6AiDQT6a4tVztBlHI3AZIswRiHxH8TpRwMw3DXncOMYIL0ZYwmeWs+1GzcWTlFe-NCVi8CiRoPzJetKOr0sheMmFzLbTsgyBrQIiJ9gogfvXG1tD+UeodV85ov5kDQQ5hQSMnQaB4DLTkkZlbzmckCVg76ax-ReESjublbbeUdrtV2rNiS+0Ds4GAWwPBQaKrsW+USC5A37zpbkiFBSq0zrejsKY-xtj2lUmTAxut02dvedu4kr5pB9JPWOBU57VU5w1eWm9DL72XOWNeQ4dBEVwjGJMG8Wxv2bt-TixJLlzC5RwJwfsJBeCqkA-gbyl70Hlrwu4f4DoE0pHuU4csBi6NwmmHsD9T13CYcytioV2aJwkHkOVKU0oR3CHHUM6DU7oUPuWKmk83hgoblQyZPj7YuwiHVO67DQqhCGgg+4iWsx1gpv8d6SiWQY0DHSCeTIvgya61LE9TTNxtMJj056uohmMxY0g7jVSsQdEZEs3sHc8Rywy3ZLafxNdxgKzpjytKG7Mqed05m5pfnSQBZM4gYL5mwtIus1F5lqlEjXwvMkOst9eMpbAfU8Mdke4ANHkgieU8hE2Ra7HICUit4yNQVRwLEt3aFyRMXX2Z5ot+A8LrRiVm0PubxL+JpsgZEORoHKxGn4yreYdaIQC1AdsKoeEIbu0ZpPRCmG4OsOtQ6wkNQMOsTgCI7ipn40irbrXrpMZlNb2gNvHu2+w3bK1nH6eoEdk7YOzuElxdd10eFNy61e4EWrtneqxThF4PwgwLzTCtQbTFHFAeUGB72UH8qFAQ4O58GHp2FBkCB0Npx5ASOflyoBgNxnslDMGGre06QURngWZo6kxDoTbnSEuqaMsVssHEBd3s9OeiiFsg0fUsq4cKH7GAJCsAt6TzHSN-LrpPb4RVi9eI6QfDpFhaRWKqntZOgWIrugyvqCXflGr3Qoh+BLxqnKvAKorFVQp5RvnwaLcZFCwNQ4zgxgS4QLMdcSGDE3hQ14DIxOn62syl7n3kPPUSFwGASPkEh0ykk6b6PhzY+JFcDLYZkxthwcCuuK+ib51njGOuD3RfVdZf95ICP8gq-idr5waQR6kcqwMfNsmR4751lhVsN7PI7SmWCnRQfKuHJ++h2PivE-gNntHOBvL-Poiq2hLEKYG4bM+FhcERIqwfDNpVt4PWa7Uv-fbCH0PxH2P3L0rxL27UYCgEEnn0yESAmDM2PB8B1lhQMTezGU9kmDrAWFGH3292Hy3XV1-D7lQBnD2U+XdWSV52vxjxVm0S2C5XhAfyVngx8CtFzzmFXwYLwOLyP2Tih04A514AVG5yjxoIb0CGCg8D5F3HtA3G+kdxvAIm-2C0OHGF-1+3-2iRuCAN9xAP4J81QCECI05xIBIP1Hn3kOkLU1q3kI71Tx9De12EmEjVCjGH8R4IIKhwMO7SMKcWI14G9V9UAwsLNxv1dCsJtBsLkOCnsPtARFIR8Beg4z0kog0JJwL3bE102z0KbDayAQ6xAQyLSyyN61yMqAGxQQuiR3XDwlIX8AmDrE5AMWMnLHpHvz5Fx1WB2A9ypVgkgl4REF4gQiM3EPNE9kSmlkwJtF8ETTMwvn2CQ2cK8BhD2HSPzxKJuD6LgkGK6UOhaExnkmo1xgmPQOmOIjmNiGikqzdhrjSOTwwwa260ym2IGK0D2JGL0FyyONGwhH9DOImBmNd3mKuVcBGHdj0gdG2CCFRCeNJ0ygADVv5KAJEFBjonFPiwjaDIiZDLcZCFDlYnAiTpY5gYpUgEgsg88VlNi8QkTZ9USM4MT+J-MfjzdJD2QojZD8T7CggURoRPAEgfpbRQkPdnweBoISAIhexUl+j05A9v5RByVoJ+i4YNt6T053xAMkdE0FgCYtgggeN8cKJjxEgHQZgBpghFtRTxTeEpSHIZT0kpJ5SapxQYJVQoI0lIJkZnTtT8YHoDTiYKJvo3Ak97Q+RKI9JERrTYAJS7T5QHSvSnT0B4EXS3SFAEy5Tkzv4WS2pwidwfRoQzwRcZhnAUgKILwDJQ0+Qki6DjxB8z04AO5kYqUj1RjWTwiVI1JORcdxptJywxgrQGjyZ5gphE16zQNGz04WyfwDj69zROyCJuzvReykRJlQoCJkUXpSxERxhV1NDGsXkOxD1j16h8AEYoBAN05joS1xwkcK071p0eSONb0YtUhkgGw4TMibhxRdB3woBJVewdkRi8NYACMTDSNekKNqD2yY9VZ2QFl0hEQm1Sw+RSlBh6NPYqEFl1w4gPcfzqA-yAKHIgL+JAJSAYBUAOYjdJV4dOAyNmAxCYKG9VY3tL5iFcksDyIrkEh1gGCtykRvochPyaSJRfzKB-zUBAKwBBxgLkyDpah6KoKkc4KkMSykK9gUKU9MKRhMDbQ0j0hvQ8KxKJKpKZL+IflCVEzEJAVgVyBlLSIPYJgs8n0nMU9OUCINZ4gVF9V6s-8Dy6F8LCLJLiLpL9iLLhipIg8+l7K4RC4eR8E3ZXKXQph1giTBTSJ0qzwjKCLxKiL5QSLgJbF7FyCnFKCIIYrHL4rVJErCZJknoCIiSa4kLvRSw9ziiADvzjK8q+xQqRidoqCPTZSMlHEKq4rnKaqtgKJdykM9hLSZY-AbxsqgrTL9iRVbLypJVpUZxqddslUVVlK74kNa15hbREQYTywshndhp-FdgTTailrcrgr8rer+Jd1pBB0p90BR1RrMDxrQpaqrlfBEhRgu8GI3RXAPc3q4z91D0fxWsR4Cjx4iiNiOrVt+13rewD0j0e5Ki2dd4sSG8pgdhaQphgpMCXosdvpHLnBj5l1UhfL9znimZelj0sa4a+tgIEa6BgEut4TmaQjMbYbj0EJcbPh8a5zVwHRSINge9gRH9dhJlfBSFGRgoHRRdHi-KmadD8VfltdkYoqRA2zcyY8YRpa3zIyZg-AHR+yoQ8ILxKZkDfAqT21UalcdbLKryWbbzDjjaG9TbWLYRP8LwKE1y6MSyItLaqk2qUbtDmstcV4SUyVKUqV8jubCjeavy46cj05E6FBk7RbZEjBtSpg1ZSIzJKY7bosuRFz5DM9pgIbhLXa6BsjhbiUOck7qVRBOFCoeE+FCoBF2rY6JQyic72687qUC7hsJaOpi4Zadg8EmNhgYhYVfYdFE1A4dxfhYTNa+btbVQZx0T9i7zZMHz5N7DVJ-QPRZCMh-qNxozYz05SUGgS1xEWEYIk5JA5VSCM5ewSrnEqC7zBcNhhddZjJOCU8L6TxN6SxOQUgsh77bTH7HgX64E370Ak5QIt4wA4Y-6yrGLfawUgGBSo1RdwHDxvR403ZiJdFH8PcJx2FSCvDS9LCpDOS8S7DWNL7dZPRjJaiik6GGHj0+Ccz1U2ScTojuS6reKERE0w5qyXp6yCVeIkJXUO4+CuaebBFd68RwqyDVGIDPhJ7qiCbCGXpgGSGwHxd+z4hSFd9RhF0ki0Ud7M63bC1cpHUhNc0O5816cbztSJg3tPYmqgb2LZgLqNZSFZYJhLTeH6y3Hi1hVpwC0i0nFSA+ZA8r8mKD4iTPpiEERSwvY1hDx9FSECltZVEEU4mUme1RBfwIBIJ6h4mnFQLgjMmCHVxNJUcyYuRhSwhlY6wQzRhwzQRVJ1jqSm7JAmmampwZxGnqmWdI9ypeFwJtSiSOTXMn1cdVy3o3Z0KoTg7g58Eqn3GamlSGS5mTmcBlnSNRw-VYBVn-Er7X0kQgo+ndJiEK5ODYRrcFljmEnPH1qJUpUdQdcadFVlU2nRHwjqwTwZC7oJgPtPAXQUUr5OQqzkhbQGbB6mtXHqnNlJm8X3a-loL2mZ7rwhcNZiGEDrxkXjwj4mq3ZoTEpcLG6h7PdpxCXEldGiVrKx6KVqVfTdT-SFhAzlYgpCyMWglKXZg-mPHElhNRNq8JMvqpMTGOm-TCYAzL5nsggJhoQ0d1wl6ZYZhZWam6mGmOXLnrnVnEQPQxhJtaJDhkXsLoQbQTTdZdhqFWWcX2WmmeYT9wCLmaBRAoCYC1Xy1YhncfRMgpoNZLRkWBTEgGjBS40wsnHGbtHcX3H-WwCz8g3ocgi-URA7zfopj+9DX5rz6vB2MfQeRhdLUxmXa2WCXs2bYMng92FQ8Edx98GoWY8zweRoRBSHpvR5ZkWk07XJtiFPYl6WXnGRLfWUmc2e3J9h0VW68xi6VfB8JLS-pZcoSIHfBqIsgOMy7Bho7xnm3LW24bYA2z8lXp9Z8fwS250Ehc9KI-AvBkXX1lDQosLBdt6M2XHF3W2P7c24ZtAQMwM7zfA3szw4Q9UZZDgWMdnVJ41BgBT6atxkt52Jnr2fcy8V2DH4lQ3doS3xhoQURwzjxtgUPdJMg3sAmUg8I8SL2m2fWW2b2k5iDCpZmhAYPYqkVjxg63ZNJkWeKPA5gDLl1P3ZWc2pmhD90pVCpe2g0G97yzkz7aW+S5hI262ra5Pb38PfN-DOdC2QjVOr0oNJ1T6mVlgGi1hbG5CfBvpUgB9vWXlOOCOePlAHFzp-7yrw2J0TlbPq17Pr4ZrSwQhVasWY6fXydKcttYcadGdddEw-Cfckcws7tnNEpLd0MuLSYAQpjLwa4gg3PYvL34v1ts6dqqoNdPrR1wLFB0bKBLPjifh4QNgVYZDBgxgWCIR8F+SDVkhkg5hKv2OXkEvavkvEZUuwWHhEcgufh1xNwYRrMJj9xSksFNZ7d29ODIaauQdZv6vjsmdFAjv4lFORDKAecsvVvpDtxdxtgcDkXXA17QpZYBTeGJu-s2WobewH313CPT9U5GvhAQ2MBoCyPlu8xgtpYaxPYiktgBuBg8m16zTaNORuCPO6EAeHIgfR0Gu12muAiWvoI2uSW+31OT7NO7PHAeukMEXXA-AnLIb0bobCeIeIwa913munIKfvIfbqewVWrlb-Qa5SzuyKIpl79nN7W+Q+R2eB1exIOL8xxRAAAVU9UDS-fn1r9r34hAf2jwQOhCq2pFx9WYOjBZDWKiSLQ4UUlm1XnXsDVOzR7Fl5ADacF3qDy-Ix8WzdmejV-UkV7V9fObONoksuhIBiD3bXv3+xMng29MWH432EU3p3c3kOt6Y8dYTIfxLy8JAxZ2v7n1hP9XvXTnFPg0ERtTg+UKXixZdinJhEF0JA6WCsqaW6zIH7T3uhBVwH8HvAd39OrR4Dwfgn4fgPuRNPxNGx-YFTIGhFWza3dkFolYz7zy0vrQn1yf+ULnkfjRsf-vp8ffsTEn4QGfou4X+vjpylj0H0W3oUiYCiDIN7b6DfSiHitTXIZiagOSvAEwhxcwAQfXGAQGcAy9Ei1VbWJ-1naNsy+U8MASt1fz4QxubsZfD9A+we5qg9wXgPVG7AQBkBeYHVjCAMgfYdwW5b7HOyA4LtcB6XXFMQIcJnh-gF9bApkEcLRQyYp4UdnRCNbudcObLHnlGBjBxhVQ6oWoFqBTC6h3iRArJquElhIZjW+wQ4GQnUjRRYqFA7wI5mBAe4MsK1YcNQEvxMCfEdGe2irCXqNp1BysLIOUluLZd8cffEAXQkkDmJTyM4HxnOEYCakFAyAO4EwPg5uBb60weKmMGRaUQliIQbYOt1mA79-KT4V8O+FoCfhKA34bpEwL-Z0ZmOefPBGhkPDDQ3AUySiLXVrRxCtaWdY9GkyYF9RAmKIa8HbVrRwhooCyQuBGlCjvobQHuEGL2AhwQxSoUMGnNICYHkk3sKQWRlQnwRvMCs-oSrFMAXS5I5iopGOPKDjiWxE4TAyWGGmriL8akASQkqMH+CpoL6VLMoZm3oRtwF4ncJISvD7hCBB4TA4hHNjCgLIW8T0PYfZ26Y6JqqiIJ6D4EMq49hEYqURLAjYQkAMh0tMbkRCfxchQo0UYIEkC4wNEl6hEHASAR7QBCrCSHTgtoN3KBJ6qcsDDoiD+FOCquh5bsJlkIIGZrod-DqEvSyBJBP2FqchJb0UxL0m+dLdINMBRA4daBTdFuj3A2EyMmexDcXNsFf7Mpc8BELAvOmGgDRDurOY7udzpwgEmBWqJwnb3yTf9EsbRHcARBnZpBmixCQDqfw4i6FiOOMGkbjF5J0Z4Q3-OEIX2ezdkd2W+c0n8MTTGjnBT4fkcASbAbD9gNvQ4CexXSpBl6zKQEhsFULvkqGpEXorKV2IRVAIJgrjBGLKQCl4siUGXqpC+EHAyBkvVIB7jpIol3ijJQ6KqI3zQhum3Tb7IiADhbB9WdED6PaBrgINJS0pZUo6UQjOlhhROWkD8IMqC4KIVEQuMkBWITBxubHRAS4IbKXDmyR6DIc0T1EClKIowQIFyEmQ7c3YqRG8NTF+YAiOIR5JaOHjBwXkFA+tVGDeQxEqx+SI5BZJ7HmCFdb8OnLvA6BIinUHqJlEKmZUTHyDaRDHOKOaQSAmRgomY9jNS3wT6J+Qe4gHBz0FrY0Oa4IxNK60RQ0c4CqPfxC0Nc7W8FkXIT-E7wFoOQ2ardb8aS1xhMYr40JJPL30GjlYkQ3XYhFyJR42hfuu-TzkSz1qRUvaDwnxJJwHK2530oYxTLLziwRYB2ApPCiPQBR8tk6XEp4S0W3F213hEIZEfUVmRPpUMCAliVOP3oliEIl41injljbBBggqPSMnRgVg0cj26QHkSaMyhikYyiDZGE-RIAoNhIaDKAKqJLBIYzw2sVwJwRvDkM6iKsLkCEkNbQkBGpKIRiqJ-FWihmp4bYPB3xKTI9Wt2BzvFluyKNdayEfRkflVGbAEex8OYmyBZGxpB2KaVQS9AaJfooJgBYzi0m7FL1lCiycmLWnIb1UBS9Q7WOEj2CGd3J0UoZIlHZDbgpOwuQsIeDrCmk9IBSc2vKIpwzcmcJg+IkhmDJhIgmuwewqMALhvsa4yRHpnCGV4Y0p+l-PAN2PhH1Cggt9AEBdW0TqRkgUXc8CSMm548YJDkNXrrzHAPDTIHoTyskFLJlZ4MhrCFAOyprYUNavItlt72PSvSwMJ00YSxR6Z7AVY6+eEa5xLozA0CdZaqTcAr5vSq+vAGvlxPSAQpGqaxEJu3wiHegEQFJUKIm1OET8RMQ-I6TJNijPD5Jbw2zEvTNoLBa0tg2IvVlyBAA */
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
