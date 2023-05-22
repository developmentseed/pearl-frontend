import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEgutjWr4dATFudLxD4dKeAy0LpG8Sw4Rm2iOPYYyOF6tYCledC3vetCPpQz5vl+P5-gBLAQKgJCdk+L7gV+0GwfBeqIXOKagM8lFRHQwxDP8RFfAMDKrLuCn2FyJ5Zv8GY0fyyJ+iKFxqMGnAkMgAgALJWZGOBmZACF3MmjwydYdjkS4AzJCuqwUu49gMh8YJjG6aTWhMcLnuOxlCgA6iQbQWTK6DKrxzAsOlLAqNQOBgGItn2Vw4YQOg7ZaBJrnIR53Qnu4rguAkfwFl4DjWup4zoT41qODhSwDE4hlIr6iXJeZ0ppRlfHSjleUFUVv5wNxC2FcJkGZZ2MF4HBVWJlJ7mWNYLp+CWHjUvY7JXb4XXEu8fzpPM3x4XuI2XiZSUpVNOWZXNyprUtXGQLlJD5etEE8Xx21iVoNyzoa0nHd08SrE1ubsk9fjpH4BGBMyWNQjpNpVjstHxcc17Q62kNQWEUPMFAUrFcgnA8IqXBSC5eKI0dsnps45I4yeoK+UR6lcn0u44QC7pskEZ5k0ZY2U9TFm0-Tf1M8GLNs+G3DINzSHznVBABPY7xRFSqPEjaFJ43mlvJNj7KPYrNbK-WN5q9KGsM1A2tQJxK0g4DG0MzDu3iQdvPGmbQULPMZKDSRG7qQ46HjK4NgJK4sRBLC710SZABiNDsOQPF3uX6siVBPDUBAsACOVxw0BI6DivQF7F0KZfUBXVdMTTdcN03CDt+gWrtA0RuHXHxIgjEvh2JRIJEckBE+M4G6L9yV3Z9RsXkyr9AlyOFBsAPagkGIPGqCQLcaPQk9d3QPcU2fF+V+XN93xAD8J7UA7tPaOc9Y4oV6Bba0T1QQbAGM6W64REB5j6FuQY10yzzHdh-U+dBz54Evr-Sgt9754EfkqDAqB35iFUNNIg784p4IIUQ6+JD-6AMnqA-a4C3Jx2UnQF02dORo1OgySYJJiRXViCsPOsIvBF0-owKoEBlAPEqNULEv5KD9lElHagY4Q4QF4bVZGFJEiW2JLCe09gEj2gIpLOgXgiJOABEyKkii8HLVUfgdoGjLjCDAAAR24HAdim1CojmnNVHmfCFyfAUpuPwWYPDrjtCkMEgxJi5lhIkTxXtlGQDUX4zEdRlr-hBh2cOO09omJNsjAKYJ+qu20rI80BEHALD8ACO23xxjQnyfRbxxSND+KxCIEJYSQaQ1gO2EwFA6lIy6DbC2q5+rpleMMZxdotzQPSBmHCGQk7uEGSZYZvjRmlMCZMl80yRKwHICQKoLAACqQgAAyiy+aIEoi6Uk5EXQbHTCubcyCEDZhGApWW-Ugq7jsKcoU5z1FXMHHMwhlccDcFQFUPgV8XxgwKiwPAYRkDRJjnEuqHI0G5gFvackV10mUX6FyLMyxKIOgRaiFRIyDFXIAEKqEvmgIpFyDE4HQEQYCUTjExONksn5ww+gryCDYGWG5JhIJmERIY7xnFUgdP4WENhOWlG5aKsZdRUXzMrnBDReA+I0DZhAMlCMKXI3JBsGIFEBgtT3N8dSlIYheFWHmZYwb4gmroE2fgyphU+ORbwXU5LTFdBtAsL40ItzUl3AkKYYLAqZPmHnfw2lYEnOPp7ei0aIxxp5ZURNCZXUpsQGmlw8Cs3DDiDhLeCR3hsm8BSSiPhjUVtGgU6tsazUJuoNiZN9TU2TDbZmnOnbc3qQ2GabwMKRgAgmOWpWY76LCjMiPb8rcX7AM7t3JhBTj3VEmhtIBIDVAzz0F840Vs+iwO0sO4F9J80K3+dnDcZJXEKNHR9IUEzQkvlbDQfF4Mn5t0vW-XBBToNhLg9QBDBUn1TxfWA2V88FxSLBNI14wbJjhWCvmnpgiViBBtk9e0R8D2QeOBh2DFl4PkMQ5Q9KNC6HpQYWh+inGH08YJWAPD3DZ5EYgZSjqMQ5jugmB4e0IR826X6HEEYFEKKPUjUIXgA8LK1tFQIO9qgQaSfBiwdsYAoKwCnl3PA76SPEmZN4FcyQuT7PgQRH1TioRfDzIEWEEwjMmdbOZh4AguDOqKvivACoNEFUoFIGVc75UIChFdQRFF7DBrGFddMeaZgy2InLEr8xzS+Ci9QUz0pYvtECelzLuUxTihaDQNz8m3XLOhBbLc+yPh+uGEsAiuZBGDA2CkMk7UHANaa4Y+NrWRDtZBmofsMo+L9nc5SzNLgHBQnmEsFc-6Kt5mZL8DcXxvi2P2ctmLU71u4DABlkGLXRl5CgFxA7ZipGkhYxNiKKw8ZUkWO1SWfwV7Zme2Z17GgBCvnrqgUcNSfvAyy02+diAoQDEWFSZxgVVz7IIhdqFwafC+CwgZCDvcOPRcRyKuLSKSm8HsyQVUaPtQA+WXmdG7Vi1BWTtsgDgRSQ2nGEV7O4wcE3rE8z5rSOZ3s8uZz9s3PcoSqlXz-rzbcsbiasGmE-VBjQ81Qq7SUPBiJHNEEfdHtD0mSsw+nuSGL0d1Q4r13J7Ee0RkwRnhBu8ezHIgsTwdhmNOHMZd-HzTFieCHaqvcURI3vNAoBWh-AhIQSTbjnLFItzNTy87dT5XIjsi-SMPwiRnH2nhQzpRmewI57CRteo8NJIKYaaCSRPmC5PT8pX2YXbgffApBnUEpNnfsfoAANVvpQAB-AI4GPz-z6wIaun7IpPaFYiRdw7gyH0Okbps4rG0lEVjc-GeL+X6v6QW0N8cUbT3gb2+rp9ChMqwIwbAgaMZgohUYg0VxhEcYVxwM2N78o1mxlQilwknUBxXwIBAJSBWYwApBcVHlG4xAlRYAt96pXg3glJbEoQaR2pAtXgMJkhVVbE1gb9I0GxVEH189IZxVUBaBlQtcOAtZnJQ8cszYSCFJEEAg84IRHAt5fhBFbsV4cI2RJgndRMTIWDvpO8OCNQIwKh+CccP9DdhDiwHAQ09wiZ3QpCAMLF2p0ENxfh9kKJmDWDT1g4KlAIOCpM75Md9pC9vl6oE5dVk4N5yQ05aMAQYhvhk8ogHQitlDfchQ1C2COJyluIOCNAnwiA9FalBDfD44isAjswgi2QrdctPBnABoBgt1oQVxI1rx2BgISAwhWwDYQIwJIYEtb4BAXlgIs8QYJBH9w57x8CiCCBoR5INxq9FtCt0gptVhwRsJiYgojM7w-xK5IZ3l2A8AC99Cw8CAV5HQoiItvUSs7Qxg3gnp68RgVhEEljds4BViRJ1iXwu9ssciV5nAaRGoBhiRnE9x1Js5HRvg9wk49x2oFcT5x0LB1Cqh8AwYoB8Dw4tpkCtiaodjRj0JxioRJjVhpj81Ah0IxhoR5ho8sxUZI1hQ0jKAoAsVWwql88bIjBkocBIxFR8D8ABCXiF5ZZSQ9wV5St0wvggDEAWN9iqQSTeTSTm88FyTqB7wqTUAaSwBOx89PxSAYBUB6ZnMsVCUKgWSCh2SfDOTs5-kLsPg1VQUtULdwiUghgPgFtoC78lFpTZTqSLJaSOJ6TEtmTIk2S9CUShDNgyMeSM5t5Qs7RPACZvAjwG8jkySKS5SFSlSOJxM7lIJZlrVhidIwpKINhUZs52pyI7Q9Njsj8LtM0thJTb04yXTpQ3TvxxMETIl+AMyFDFhSJtIAQLccStUAUSx+oXR9lfhPB7SVChQnTKTqy2xFTO9tFdEvDDFXDmzQDB1oQ3RQRnQuyhSlNVVAgNggp5g2RYyZTxz5TXSpz89kiQZmis9qlYZhiRgmVw0PAJEqR9kNyEAit7RSQnB7RzsnolsKyj0qyTyayzyOIrV0VcosUcVRxbNCViVSUMyAQFgTwKIc09xupBTwVsIdMTwcYKIhtb8RzjhXxkBgJGiLIwBISuNfYOJz06BX5r1wT6ISKyLWxKKNjT0g8Hg5MOSUIyQnEcyZZ3QdyNg7RswLZY9bF8wTwEgajGy2KqLEiz1n56KUNGLK0TJbx8CH12LqLH0uFg8eKDTIExgmoGpg0ittIgouQ7Rf9mVaQ-McZAglibltQGztKBw7y6CfJgzYVlhNNuz9wRgQRPNJhaR6sAKTJky3CRJEsolnjjLTYogzp2oG8G884HALCtUoRnA4VpF0xdIwSNLRz-caLUzHlnk3l3lPdVLvd1KXcSr71T0WAHknlpAqquLX1dAiDGlWy9ND5dzxgiwnAnFpEOQnBhhyyYDHTSrw5WrKqPkBB+NqF6i8B6FGEmK-cmra5yq2rXkPlOrCNeK6pVgmVdMvhnF-8-AsqhTYgSQWkMgyQekpqHS8ERBFRRwX9O9hjtJZjFtRTgMUlAtCcKJrQXQFtM1Z8iKbw6jaF6ZIY2qSAnVSFVFb50Ag53ryF0cI5Ww5zhUFzsi44yQKRSRrQithhZsYidxnESQ-U+oDU7B09IqhRajYB6j4aRJEbkb-52F0bOIp4wAQY8bscfqIiid9lVh-hPA-gdw9x3iQNvAKxGptJI1Bwsb3dVdkTYlDda90IMEJFORAh05nEDxly8IczCK4jjg1ankNbWdWt38-TfCV0mpad5cYF9kgp1JbESRnQAg-B0xQRvAXKYMMdBVK5vsZ06KGKNriqONglQ7oJw7VseVDqQ9jrAcmUqjWpUFnEArbrYQtJ0FvhVxPRmb477VkpeVNFLU0VL5bVYtkCeq9J3g-zjDbFd1ijyNRDXgRKC50wljK7HUUURw7UHUDEMCm7CaFwiIjSyQhg-bBoZawUKiepyINwcZICnty76ARAh7q6AlUDAIqh96Wq+wpUiDxhQRaDRhFVXhnR87wVxhkLDjh0lxhyrbd6Rxx6LUhxR6T6f6yA1ApBcpaF-xL6nLFgKjfgHRLjMLG9I9rQEhBddw4hB6f6rkuin8x6q7QHucOBYBz78DCDp66ogitI5cRtiS7R5CFJTL-gi0ad0HcGUU66MUoKNQ8VeM4KSUXVtictyG8xMrqQiJn6TiRqfaMwUhnYmbpq3rv6WGa7AlT6qhXL9T+HfCF7mQekf0UhVUCyV6LrSb2p1zXhYgI0d66BxMsMcNpBpocGaAaqY7oarGE7MNuNsNuG7GcoAGq606jKNHjRGpF1Gps4Tshh2RR8nAggXAp9MYKIUgLG5H0M3G9LYLvHlRfHHHlrBM1rhNY6Gr47XKbGvHHwfGFGaB-G31SHkZ-ILZsx6GWUZKA15hZDLorpswYFmGa4g4EtCoBBktUtoSPtMsiCKIV4FIXQtxwopH48sLVVl57cqQ4hsZumms2sRnQ4uses+AxnSsWRh1sxMTycV7QnFh2QUhbSaQbQ1nmYNtNnAJttlipw9mS9HdCSYFrpbKJm8I7drLlVbmdZ7nPtAJI6xx0b-samuhCsFhWoghbTzShS5ZBFtJTCyJ+8obP7XH97mZUd0pRxUBeAxmQQmpnR0wbRkgnps4xKTwvzwD1w2RhhAWMaKmDFHkOBlr1GnbjRzspZUH5Y5dCwV785ZCMxadEhfJYjNqoNWW7nWX60DFeCddJUPLfTtaw8SJSDYG68kH0wwz7ptzUXYVzcpW46v6cWdY8W5BMiscjEiClh+L+lCtJ8cYaHyRJnVzzQMqghshqxqB0BnV4BEJP7ErkYCBgjmRUYroMgV4XzXAGQzZhsY3nEfaEFFjLG0RIxSpmwIBQ3nhGa+gyQqRyIjx1xH6goYgOmMg8xzctxTXCnShThIxSk83PJBgLYAR+oqRMZ42wULqLY7sPB1kxYP7pXjgAwJQ4MwxFRlQKg1QYxNRrNc3AnIE4VWycYswRsV5EX3ymVS1SxsTaRMWx36AJ0EzwX+Rex+xW3FwcYnFZsM0MhnFxdgChgO34Egou1adkgljVFoTRwG7xxwXBjpBkBTgb3dibdSsqNFaRgRhhruT2RUF5hdl6358GJq5mJBJwkIPV5hsyQc4fVBpH6c4bQ+1CJe6YER1kmj1ZqMDcP7t+hQSTDEmoQGQ9UnEhhup-BRYfBI0voH17G-psoAYPCIPB1nBXhPNrolhcYwV2z0IgoHW6QYRbEaifZqlNZZpA4IPybkKU2IpzjB10472CrM11h93I1+5B5nVh4droIx4g3uWUJF5I9TTbExD0KptPB+gQCcz-ApOrPv4r42gUaH4GORr9VZci2tx2RxFrQZsCPUGV0BhI11cD7agb2p9iJd0V19UPgwzC6lg-hfhAo+PLGJ0U7zVCWjo5VfCisukTxeSvgzs5OKsUgFhkh9zVhEEknXrb1ZqIIb2HAc4icAC9ipjijDklVYcAD5ZSIQ73GQxPGpNhuCqXAFsiPEgpvnpBEKxUY6RqQ0PYDjNGsXt7akY6vjRUZC6dINIeTEF11r7-i9Hn6cJ-yaOtqX0A9+Qb2gh0J9z-BOl-g-BMLzE3gkhvAQRqdgiM9rz2888vxxO7A+0xs-AbSJE3zBhWm5ajnnR5FnRI0l8xAV9rN18NpdO9xI2nA9xojUEHAT8l40IJCyIfBVhmD4CWBEDw4+mIPyRNIo3pdY3Xhe2KsLRSQSdiQjxJZjulEEjT1dOBFlb1hImUhxZaNix0KXRJhn2iqG2GJYaGimjujWiRJ2ixBxPu2vV0wywswJEwfsxBZEgmvYGKabiVjw5Hi8AIPgV+hZOPByXo8TiyP+ofzgq4hhZmDISH1-3YT4TIZETeeV3TZB0SR-NsYFP768Y73q28wD58LZH+vAKjz4zTzEzPxxPwyDx0fCTswlgbr3yEhmQh1JhUWQsRhI0WKxByLpRdKlLK+uQHpUZRcPhICiwK2-NpbpYPhZe8EtKRwFKOKdrcOcIwRqRlVyQ8x3Q6RbLhh7LBgZFQRR2zXXG1GYqIkPLQ24JkAkX+p13dxfgS38IQB8CZRveUYqIFIMxvAri85slQh64UcIgJuT+SYwH+QdA-qEHlJQByA7-F4CTXIhDlf+GYPViADmQQB5ARIbQKEAUCUlYBQpPNM8H7LvFv+MDRqCgIb4wglUoxH-k-0tontTI21Mqi1QqrtUPkN7BTrQUaj0EV4tIMMtECWDyEIi3gZxEsQ+rk8huyfMNqBjeBXQD+btYJtmB3Cj9zmavPdPC2P769Wa7NcOFzXN48ReaUAXTuSCajINnqGaQYFj36jQJkOiQPMKDz64uMba6Oc7mtku7EZQA1-H5FbAwjO9yMHgTEqEFf7v8ogjUXwQkCthRFtyAA9AEAJ+SnRwhqwWnLukCEgBoB+AsfHEHCG2wJsJ4NkKEHQGYDZgLoHAR9hgHv9XWyMUIaS0SA5Coh+Q+Tj4OdC2lkhAQnCItyEhQRk6kdNbhMAwh3Ud0ZLIiFEw1TLxyIBYcmqcTWYWob2ntM0CCAvwpAwsXdYXP0Amp75fgQQRwVi2sYeNbGZTTJqyxvYxtTBbIERnLnX4tNtGQwfqMIjMZZhmWN7fGGCEXiAFsyAsANIPzoIgFKOR-X1pkCAA */
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
      sessionMode: SESSION_MODES.PREDICT,
      aoiStatusMessage: 'Loading...',
      aoiActionButtons: {
        uploadAoi: true,
        drawFirstAoi: true,
      },
      aoiModalDialog: {
        revealed: false,
      },
      uploadAoiModal: {
        revealed: false,
      },
      imagerySourceSelector: {
        placeholderLabel: 'Loading...',
        disabled: true,
      },
      mosaicSelector: {
        placeholderLabel: 'Loading...',
        disabled: true,
      },
      modelSelector: {
        placeholderLabel: 'Loading...',
        disabled: true,
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
            target: 'Load latest AOI',
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

      'Requesting instance': {
        invoke: {
          src: 'requestInstance',
          onDone: {
            target: 'Running prediction',
            actions: ['setCurrentInstance', 'clearCurrentPrediction'],
          },
          onError: {
            target: 'Prediction ready',
            actions: 'handleInstanceCreationError',
          },
        },
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
          'Prediction run was aborted': {
            target: 'Prediction ready',
            actions: ['clearCurrentPrediction', 'hideGlobalLoading'],
          },
          'Prediction run was completed': {
            target: 'Prediction ready',
            actions: 'hideGlobalLoading',
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
            actions: ['setProject', 'refreshPredictionTab'],
          },
        },
      },

      'Load latest AOI': {
        entry: [
          'updateAoiLayer',
          'refreshPredictionTab',
          'showExistingAoisActionButtons',
        ],
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

      'Enter edit AOI mode': {
        on: {
          'Add map event handlers': 'Editing AOI',
        },
      },

      'Editing AOI': {
        on: {
          'AOI corner was dragged': {
            target: 'Editing AOI',
            internal: true,
          },

          'AOI center is dragged': {
            target: 'Editing AOI',
            internal: true,
          },

          'Pressed AOI cancel button': 'Define first AOI',
          'Pressed AOI confirm button': 'Exiting rectangle AOI draw mode',
        },
      },

      'Displaying upload AOI modal': {
        on: {
          'Uploaded valid AOI file': {
            target: 'Finish defining AOI bounds',
            actions: [
              'toggleUploadAoiModal',
              'setCurrentAoi',
              'updateAoiLayer',
            ],
          },
        },
      },

      'Refresh AOI List': {
        always: [
          {
            target: 'Prediction ready',
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
        entry: ['refreshPredictionTab', 'refreshSessionStatusMessage'],

        on: {
          'Mosaic is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: [
              'setCurrentMosaic',
              'refreshPredictionTab',
              'refreshSessionStatusMessage',
            ],
          },

          'Imagery source is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: [
              'setCurrentImagerySource',
              'refreshPredictionTab',
              'refreshSessionStatusMessage',
            ],
          },

          'Model is selected': {
            target: 'Configuring new AOI',
            internal: true,
            actions: [
              'setCurrentModel',
              'refreshPredictionTab',
              'refreshSessionStatusMessage',
            ],
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
              'updateAoiLayer',
              'refreshPredictionTab',
            ],
          },
        },

        entry: 'clearCurrentAoi',
      },

      'Deleting existing AOI': {
        invoke: {
          src: 'deleteAoi',
          onDone: {
            target: 'Refresh AOI List',
            actions: 'onAoiDeletedSuccess',
          },
        },
      },

      'Requested AOI delete': {
        always: [
          {
            target: 'Refresh AOI List',
            cond: 'isAoiNew',
            actions: ['clearCurrentAoi', 'refreshPredictionTab'],
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
            target: 'Requesting instance',
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
            actions: 'setSessionMode',
          },

          'Set retrain map mode': {
            target: 'Retrain ready',
            internal: true,
            actions: 'setRetrainMapMode',
          },

          'Add retrain sample': {
            target: 'Retrain ready',
            internal: true,
            actions: 'addRetrainSample',
          },

          'Set retrain active class': {
            target: 'Retrain ready',
            internal: true,
            actions: 'setRetrainActiveClass',
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

          'Retrain requested': {
            target: 'Requesting instance for retrain',
            actions: 'enterRequestingInstance',
          },
        },

        entry: 'enterRetrainMode',
      },

      'Requesting instance for retrain': {
        invoke: {
          src: 'requestInstance',
          onDone: {
            target: 'Retraining',
            actions: [
              'setCurrentInstance',
              'clearCurrentPrediction',
              'enterRetrainRun',
            ],
          },
          onError: {
            target: 'Retrain ready',
            actions: 'handleInstanceCreationError',
          },
        },
      },

      Retraining: {
        on: {
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

          'Received timeframe': {
            target: 'Retraining',
            internal: true,
            actions: 'setCurrentTimeframe',
          },

          'Received prediction progress': {
            target: 'Retraining',
            internal: true,
            actions: 'updateCurrentPrediction',
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
            actions: 'hideGlobalLoading',
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
