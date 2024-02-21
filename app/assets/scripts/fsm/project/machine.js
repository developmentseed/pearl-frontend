import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsZ7MLhvQisRxhy0DVEXGmYhjFoGMgn63p2UsSjVUmNb5kAgTZhQIMLQaB4BJfOHMwUUhxHdLCU8ec3GZlGcXFk5c9mOEjTc6NYTG3NpYGACw7AgbSuMfeYSfYu1KtpOTZWQRlwJELJCdIA16JiI8L8N0m4oQ2HiDO21c6cR3jEK09dfZZRbvTXJOBrUCLDAtAM49nhy66RmARb4WFaToUPpTadbLUocrrXcmNLkjBZRwCwNsJAOBKjffgbyrq15dOMgsWEx5dy-HLMc0mFFNx3TPuWA1xrGz8BVDa01VTeB6gVTYroe8XCjrsMsfpUUZhwjsIsDcwxvAbFPF4S+1akMsTY5GTj3LKg8cTBm-jiBBM7jLdmbSYn3Z2jEb89C-xKSvAzKxpsHHZ3ceoLiPjCSBPnKE0Z0T2ZxOIGhJ5r45dvh0W8LhY1Io7JTw-j3SB-dB4lI5ZF6oa7IIQKgaoZeegd1Y2zIWVSE6kiDWwn5hA0IlhYR6oyPCXIESIemsKN8lSJCZYcjQCVcMnzFQ00igQX5qAdalecXgY8Qw5a6MeO0FoXY+o+jmOkeloQni9hSDcxkXo+GNU1tQLW13taoZ1haFiuMaD6wNg7Q2sS8vG-5hW4jlbSOo7e92faKYOF+MMdku4tvNda6Gc7krpBHZ6w8M7g3pBkB25l+Z2KOCyiym+l1bn3WzH7fuKEGRtLKWHRJ1V4jvhRAIkEFYCGr4qZskIEbLYQftAEMl1Q0N9uA+w2AaCsBF4D07cRv9WMqW43QthJYim6IQvdrhcjkwQQ5k5JpGwxrKfUFGzKGnp2uBpsqhKvAip9HlUoFIJHun3P+ahOaUyAWoQsnoo4A+PICuDGGEFh99Xh7HAV0r473KHm6-1yVcUEp218Bu2VqEzgqKBBPBhWEKx3a-CdOFaEsJEh+FZWThrruqcORVy5kQ3uY5+4DyOMQq6g+QkGKpbMa5CxhSLIt7eFMbRRBhJpLYzu2Fu+p0507OewB6+hmoT936S-+EwoMXolpPBRDM7hcRBqNyu3vXCeXGfled+z7gHvPus+jnQFAfiJfQtYXOaFtBQxreLfTi4QzyCfjsiUUvxXHen207fDPVAI41nzJtREg3v7M1bIx8yLEARBFI9H4O7GyOaKfIEFCG6KCGMPfu7lnlHCduYrDk+AjkRsjt8mVhehaL8rLvdMoqTGXopuRMZDuNpBMFWn-KUu3pnqvsgZpqgLwNhrhjIK-jqCXhkv0D4BuOXNZk4KVu1LjByDvFyKCD4HLq3rQcvh7r1ihsiiwThhwDgA6k6pwdzn-v5rwZRKCD8EEDuBsGem4sZM4D8IaoRDaMkKCEpjQUllFvQUxDFl-HFj-HYSxPTmukPOlovNDoIpoXprMDRsyKAaIk7CCotiyPYnaLhLdL8OyCnspmnvQISmBEBAwvwOJJBLxobijt6uIqXIpkASFqVoMPhC4GpNvJNvmMaqkeBBkY0rtPUGjL-oERyOaFZjyIpveoROctuLev0L6h4FLA9rUWkSwA0VkbxJoHiLkdgasMNFCoaoahfOhPEP0UMFhJLsZAkHEJpLYYlixAAGrPyUBgL8DxzmLZFB52xOALCsi-C7glaJA7jbgZB9DoROxY7kE-DGonFF7nHSD7RXHTEtHNRG5tSPQnKl7J6KaBClEPQxAGGSIsjLiJHuEMzsAgQkBhAthRLjEIxq7PwCB4ogRpHQwtYAlxwPhvo3HHjzClgsjDAyIFKKbgHZjiKDQmY5h9J1ap4u63hYkMK4kOT4kxKSREmVQiigRKjATRJASEnoBgJiB0nLh9AnganoR7rnLGESbzaqSlpjBBDDF4TGo3hCk4l4lknilQSSl04ynSBikKkSlKnPw6atEQm2BRFYQcjLjnyeBsnn7RBEwJF8GsimnSEcoiBfpwANwIyEqro5Eeko4EC1ZInoR9SaSZgOhjBiIHLzAjArCMhFL8lt6bqxlxwJmvjNFYGpxcjOCUi3QDChp4S6k-InzSY36Zy7g6msYrprpVD4CwxQBvpxz7Spr9g3FoLvDfBQgao7i-JmbXRjB-AFnGb-AHHwpJYaAPhQDCotgrLZHoawCYasF4YtKEY-7gkpkuxgggh+Krk5hLBn4zADDkQWh3S4RRD+CPRSGlmlIig7mUB7moAHlgAdjZFfikAwCoBszs7CqXYsD4YFCYFzHryGqYTYRqkR4aRchHKTAxC0irgnji7omHE2SAXUC7n7kOSHm8Tobq5RjIWXlTmGqm67hcihGbgbgOieB3l7zDDhnHwRZAUgVgUQW8SorPLOlQRvIfLkBTmFixTYQOIsnnI8VFoZiX4vFql-BxAiVUXAU0Uyh0U-hSVTHNJvr8BTkPaLDKz4SbCDCsg5m-CljUZjByYBkGXUWgW0XgVNFGImIf7mJf6AQ2W27QjrawGgh-BHIlj3qBBUgyKfHeVGW+UmX+XZEbTf5ykEn6xxIBGekjDYTDQ7ETDqVZltn6SsjkyrBPFLDHwMSRkeGiXGWtiZW8T8ryVCoiqajioXbSAypyqsUMmnj4Q7jkRsicilYsiwj9DjUTrraTTNU2QLpiAikyjLqrrRbdwuF9xuHkWNZNrrUthbWvhTw+ECIryFU3lon9B3rkQ8hxCEy8VOCqSwEZm0gFJ8lJECmsQtJrpnWpa8S7V0DfwJZbksSvrDinUrrnUtxfiXV+HXW1nwJjAiFOWrCKYmRwgOiwg5pvRwhiFkWQ0U6PJoo6hjkA2Tk3XYG2DJAj4DCgGFjGagg5l7gjAggYTlVvSwr-lRnk3SVU1WWTlgkdKBH03XTnLhnhnkTvZ406oUHKLZIiYRYOEyivLYq4oEqErOFg2uEQ01oUXq1xxYo4rSA61I0PAo1oXdpY6H4-FfBJ4Oi-BHz0ndF+AeBq0pZTxIVa0W1EoCA0J5T0KMJ5TMIYnCieG+1m3a1EpW1Za6BB4giGrDSKaSFXQcg44epcgzlC5kE+rlzy5wDDiXFNE3HGQLHnLaSSJRDZgLZ6l-KUwm7i56WblG3CjmmwDYlswIzm0kCpoUI6LPw74PISpv7xwtjBUWLf4V3-DOBZ0AaLgrBBDbisiYS7h6HN12BRBmkWm92ST92D2gI8Kj1-iLxgDQzT2hWoXJl02C5OgeVY1Xo2j9F4TvX+B9Kgh7JO780sQDhUJv6P4oFJnXnYEjDXSDB2jnJSKBD5ysj7iRUPZDCwik6-VsIAM4peEMHulgMmjHgeI34ZBIJ4SFgDQsnTYBDJ6vAbgk0d2u6C3iTQRWoNxIGg3g0sKk3CjmXv4sNyEPAJ0wK00mjrYLB4SFl4JqzjB40dQyKhaaRwipDF1JpZQ8phJdWCoJog4TlB6Y55lKUqJ3T0QzUrCYScXlwbgmaaTUGHUMMqMpr3JDgjhVD2PmKkA8xq4-p4Pzh0R7iVrsiGH3pkOBrsi4ygjlwJAjA37t3k7cPDjJpqM4hvgQBAQuMJNIW9hOq6PDHYJ5iaTfDO2BofZ2Xrj9K0Q-WR12PpOOOl1pOqMyDNbSA4AMIATZMggxD0SDApA+BLAN0eqTAdFvAmmbBF0rVxOuMLJ1CkmAmJrpPNO4Z4aZNvqwDZMjAuAjSno0QZgOgZhiJwhloOW9ExPJF0AiATOONxoNw4DCqiojhM6dZDVePi0Ql0RrPE6Zjp00wzWbDMg7gZiUiERNV-1k3nMxpnPVOMMaGo2tQ-CeD3a9NQnnK41uJSKLDGmqweA8jKMQthI8MYqyX+34pEq6OkguB1XdGUY8g5k-C6oEMBkJWxDYv1OOMkBSC+5troAdpB7EVbzqyVUrEDSjqqTwjaRvlURMvNyRzd696pPxOqMCB5C76bRB46mxQW67jaTaRxD0jLg5j3bGSkgauMtjNVOqNczSs+51M0ACCqGOoi0qsOALDGRfXmNuhyIeofT9Cj74QcjzBYsmv0DgtmsmyeMa5UJa5Xa55XnPMo5H7qkrmY7YSERVUsj3pYR9pqW3ot7AvjMJPmvr4yvsuSgF4Otuj-J-DLhmRLDgY51QiLG36sj-P3oStK5e4b554csdoTHF7CPzg6lmH3QKI9H7M6uJBiIOXJVQpfYtv5tRsfqbqTilvkz4T-MrnWYBqvm+nSbUprFR50OxOmuSttuFtb6Kt769utRIu4xy3SxJJUYbsepniX4M0ejIKbYBunNytHsv55TOO8AqvBHNlLaYuwgPsIAUj7rIKUjLjBaggzsmxBsppoHB3lJB7xFiKUj3qFIZANU7NaU0YsjjBBDKzZvoO0FfutuIeKHmLKH2p2vOpodXSLDUxKz2y8Vpu7N3Qn6qzweRw-tyCmLHQz1hUXtYzUbvCrAh6Uoy41vgdCsalSKb01U-ZQ57YA5wxg4DVRjMEP5jaifPA5jkxujLB+COJ2hgc7hQZwibiqrlibh-Aqd65-b9WA50756ctiq0dOQgSUC33eO2yptov6FfWMoDDbhRP3XGMNUnjJ6Oe7Ytj3PlSafM7nDXb6eICxR5a1bzDEdPE+BVV5ZOhWjGRDCV3fBxfOeJf9j9bg4NOqchJoHw6UCI43GbFHiy4NUBBhTbgSL45lw-A11OCkeVP0BrUbVFv+4ed4DHs+6trFtTcKsYBKutPpfgejTDTKx4SZgJE14QamTQaOJpBqKL4ftjcthzeTcdpueduedsHedF5+cxvYGW59CfA7wanmFgdpBjrkgZh2hqpbbHXjf94Lt9gCAAAqG6X6k4Z5Mgx1vn0bbqz3Sedu8UlnOxA0XICwlbOYhEkw5yaDI3-1VlLYIP0PYP7DBtnD9Dt4ANpPUP36gj-h0LticQRnFG2NiQNI2d+kSUFMTJ4hG4yCZpdPDkZP36etHDRP0Na64vk4TPK8YtSPIjQBaL6EpcxcuEz05R+hZYRNgLhPtj9AA4rL537nV3lP+1htB7xvpvDkF3BeCv2Wq3JufQOkXHyCLKsnQ3fQmYeWkhhYMi54Xo1ASpcABoRvtttsMicI-Qfw3RMsZ4VVtx4ItDV0QTjZkapwUYNUTYEAUfWMPQabuEtIljwwleOry7j0BarwvwFBFTRvJw5QV2lwBfzwi4Dsj1RFq524NoRnXIV6m3Z4+7JzgYkoCX4YSoKoFQ6osYWoDO+fd9qcdgm4dlqb4jOYdg5DpuF8jI+Bff9m7G4l2+AoPYfYbfgUZkw09u2k+vhHbxKw4KFbPvPwyQxdOig5I4WjY42+NJ0gyApwC-t0H8B9BmaeaPwCMBGDFhaqkyfMIyj6gi92IQOLiBZSAE9AFi+EN8m+WzgWcUgYIKRCGTtDVtvazndxmgKCjmh1+dVOIHOXWJ6RWQHRIYOMG+AqUoixqWaGuiOygwio4MQHGIDQGRVnACjKBjyCFw88di7wKvAkXxj4RhujfHWO8gRowQw4S0COGgIAxOsaq8UA5JFXzgshFi62fVCsAvjGpR448NNJPCUEzxeAHcAQVnU6hB9R0PgF8v5ggL45McCsEEA3y4bHAOEQCbhEPTfjkD3sqkEihpBL63o6B8iIaEogGA7gGMOkR9CgUmZADBC6pSENIm6RIswOXg69oal3BvR8hf5MjhyjUyOYn8dyXgEAMLBggScAZKRONBcH6RvgIhdSOizoh6USBwNL8EAOzD-A0WpfTkATlpQSZ+k5eaTkRSIHeCaedAbbE5zU61dgcq+XodkjJaEdJsXPF7IRHxwxUCIiQODh+zoIr4Kh50ZXvOHsrmgoQ-zW0JmG8Bgck8lApbJ4FpAT45BPggMCbSHhADPW39QwuZHAHgFro1fL6GTBpDTCbedAOoukQZyoCl+XSG0OImXDVZTwFbKAXpDmC+9rQUuY8NyHBEnN-iZxBnGXUgjqDdwYIJ6k8ULD5gHAbxdpkMMLptDVge9busKStLyk44kpcgV9EWJpItu33HntIjJCqt1wMXX+iUJYjRl-wcZSSFWTwBoCMwS4DIMR0yGOxqWYIDMn4DGhUj-WObBsP2RbCf9hyo5BGOOU8YCDN6a-FJIlX+BQgzM+ggdPSTAyPRUqYlPyhJR6FwjbY1nO8lYWqz5Nny56WPkm0mCmEKMIwQHs2lhrbUEaAg4sk-w5CrATwqJYsPliJrPClYtEEXiTwchA0p45A5WOaDuhY9560HdCHjUAwGoyiNDG0MXSeTooZKjcEWgX3gjIAPUG4PoBbj+Y2YyioQN9LKDlHYwPKBpAMkWXIjjJQgM8ROEQEfblg1+XYyxp4FCCgUoA5AAcbYF2LDi5MvrD5mfneQQB5AkQcsKEAUDAVVxHqEiM8GYwNlbhhEbceOMDTti5xcmBcYb3eG2QfaSg2OgHUJRACvsYiEYEqOVG2jA0KQXGHZ3Pj3o66NjN8SICVAjhgSu0dQQCiwi1Zy4ZI4Yjz2PDT4WhDVcqnRBH5-Uu6PdOOEfUlKCRT6UAJCUyF2KGoGaGwQYAV1+CII4BJcKwsZGNSYMgG9BE4b0LZC+9RE28A9DmHzgZAVsJfH4BxXZDHM-qPDGCHwyzwrCJglETcCMExYy1SY10CxrEED6WF-YhwijikM9FYw5yzgYXN303Bc1AxbvRICg28D7F4C+k1xtKCAH8E3efrSECkHvJ9Nqq2EuAi4gCAmQKuCwgauoIREqwuQsIZNoZm3BDdsEPIb8nEJkTSS2EZ3e3ubz4C-jQMMQADHsVEFhc3ELId4K7ShTf1zkyU0pKlJlBy9z+RkroP8E8yjAWhEiNWM9AIpjUPYrwdBEsCzEw0xeDPScKkJoEuA-g28CFNkiaGPRGQ-yL8rmVhblSOUJvCQGbxu4Dj-OxkiBvjigZ5ICI7IZ6FNjqpmQN4BQz0NkCAA */
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
          'Save checkpoint': {
            target: 'Saving checkpoint',
            actions: 'setCurrentCheckpoint',
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
