import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEgutjWr4dATFudLxD4dKeAy0LpG8Sw4Rm2iOPYYyOF6tYCledC3vetCPpQz5vl+P5-gBLAQKgJCdk+L7gV+0GwfBeqIXOKagM8lFRHQwxDP8RFfAMDKrLuCn2FyJ5Zv8GY0fyyJ+iKFxqMGnAkMgAgALJWZGOBmZACF3MmjwydYdjkS4AzJCuqwUu49gMh8YJjG6aTWhMcLnuOxlCgA6iQbQWTK6DKrxzAsOlLAqNQOBgGItn2Vw4YQOg7ZaBJrnIR53Qnu4rguAkfwFl4DjWup4zoT41qODhSwDE4hlIr6iXJeZ0ppRlfHSjleUFUVv5wNxC2FcJkGZZ2MF4HBVWJlJ7mWNYLp+CWHjUvY7JXb4XXEu8fzpPM3x4XuI2XiZSUpVNOWZXNyprUtXGQLlJD5etEE8Xx21iVoNyzoa0nHd08SrE1ubsk9fjpH4BGBMyWNQjpNpVjstHxcc17Q62kNQWEUPMFAUrFcgnA8IqXBSC5eKI0dsnps45I4yeoK+UR6lcn0u44QC7pskEZ5k0ZY2U9TFm0-Tf1M8GLNs+G3DINzSHznVBABPY7xRFSqPEjaFJ43mlvJNj7KPYrNbK-WN5q9KGsM1A2tQJxK0g4DG0MzDu3iQdvPGmbQULPMZKDSRG7qQ46HjK4NgJK4sRBLC710SZABiNDsOQPF3uX6siVBPDUBAsACOVxw0BI6DivQF7F0KZfUBXVdMTTdcN03CDt+gWrtA0RuHXHxIgjEvh2JRIJEckBE+M4G6L9yV3Z9RsXkyr9AlyOFBsAPagkGIPGqCQLcaPQk9d3QPcU2fF+V+XN93xAD8J7UA7tPaOc9Y4oV6Bba0T1QQbAGM6W64REB5j6FuQY10yzzHdh-U+dBz54Evr-Sgt9754EfkqDAqB35iFUNNIg784p4IIUQ6+JD-6AMnqA-a4C3Jx2UnQF02dORo1OgySYJJiRXViCsPOsIvBF0-owKoEBlAPEqNULEv5KD9lElHagY4Q4QF4bVZGFJEiW2JLCe09gEj2gIpLOgXgiJOABEyKkii8HLVUfgdoGjLjCDAAAR24HAdim1CojmnNVHmfCFyfAUpuPwWYPDrjtCkMEgxJi5lhIkTxXtlGQDUX4zEdRlr-hBh2cOO09omJNsjAKYJ+qu20rI80BEHALD8ACO23xxjQnyfRbxxSND+KxCIEJYSQaQ1gO2EwFA6lIy6DbC2q5+rpleMMZxdotzQPSBmHCGQk7uEGSZYZvjRmlMCZMl80yRKwHICQKoLAACqQgAAyiy+aIEoi6Uk5EXQbHTCubcyCEDZhGApWW-Ugq7jsKcoU5z1FXMHHMwhlccDcFQFUPgV8XxgwKiwPAYRkDRJjnEuqHI0G5gFvackV10mUX6FyLMyxKIOgRaiFRIyDFXIAEKqEvmgIpFyDE4HQEQYCUTjExONksn5ww+gryCDYGWG5JhIJmERIY7xnFUgdP4WENhOWlG5aKsZdRUXzMrnBDReA+I0DZhAMlCMKXI3JBsGIFEBgtT3N8dSlIYheFWHmZYwb4gmroE2fgyphU+ORbwXU5LTFdBtAsL40ItzUl3AkKYYLAqZPmHnfw2lYEnOPp7ei0aIxxp5ZURNCZXUpsQGmlw8Cs3DDiDhLeCR3hsm8BSSiPhjUVtGgU6tsazUJuoNiZN9TU2TDbZmnOnbc3qQ2GabwMKRgAgmOWpWY76LCjMiPb8rcX7AM7t3JhBTj3VEmhtIBIDVAzz0F840Vs+iwO0sO4F9J80K3+dnDcZJXEKNHR9IUEzQkvlbDQfF4Mn5t0vW-XBBToNhLg9QBDBUn1TxfWA2V88FxSLBNI14wbJjhWCvmnpgiViBBtk9e0R8D2QeOBh2DFl4PkMQ5Q9KNC6HpQYWh+inGH08YJWAPD3DZ5EYgZSjqMQ5jugmB4e0IR826X6HEEYFEKKPUjUIXgA8LK1tFQIO9qgQaSfBiwdsYAoKwCnl3PA76SPEmZN4FcyQuT7PgQRH1TioRfDzIEWEEwjMmdbOZh4AguDOqKvivACoNEFUoFIGVc75UIChFdQRFF7DBrGFddMeaZgy2InLEr8xzS+Ci9QUz0pYvtECelzLuUxTihaDQNz8m3XLOhBbLc+yPh+uGEsAiuZBGDA2CkMk7UHANaa4Y+NrWRDtZBmofsMo+L9nc5SzNLgHBQnmEsFc-6Kt5mZL8DcXxvi2P2ctmLU71u4DABlkGLXRl5CgFxA7ZipGkhYxNiKKw8ZUkWO1SWfwV7Zme2Z17GgBCvnrqgUcqBeAA8G84oNmbs5BSHQRFczg-DWKIkLd0CPmtI5nUikpvB7MkFVGj7U2PEAUkh94HOEXVjZm2QBwIpIbTjCK9ncYOCb1iei4jkVcX6eXMZ+2ZnuUJVSrZ-15tuWNxNWDTCfqgxoeaoVdpKHgxEjmiCPuj2h6TJWYfT3JDF6O6oal3bk9iPaIyYIzwzX87IjkQWJ4OwzGnDmMuxz5pixPBDtVXuKIkb3mgUArQ-gQkIJJqbf73LsQSQ5zy87dT5XIjsi-SMPwiRnH2nhRB3uxwABqt9KAAP4BHAxGf2f1ScF0-ZFJ7QrESLuHcGQ+h0jdNnFY2koisZt+x+gjexDN+s23ja9R4aSQU8jM2V0+hQmVYEYNgQaMzCiKjINK5hE4xXOBtjdf6ATpYEU8JTqByvggIBUgrMwBSFxY8xuYglRYBO8zZXg3glJbEoQaR2pAtXgMJkhVVbE1hp9I0GxVEH0M9IZxVUBaBlRlcOAtZnI-ccsQCiIFJEEAg84IRHAt5fhBFbsV4cI2RJhrdRMTJUDvpV9MCNQIwKgCCsss9iDEDMxVgnA9wiZ3RqCAMLF2p0ENxfh9kKIUC0DT1g4KlAJMCpM74alo4BDvl6oE5dVk4N5yQ05aMAQYhvgY8ogHQisWC3chR2D0COJyluJMCNAnwiA9FakiC9D44itDDsxjC2RjdctPBnABoBgt1oQVxI1rx2BgISAwhWwDYQIwJIYEtb4BAXlgJk8QYJAm91CRJ7wADgDoR5INxS9FtCt0gptVhwRsJiYgojM7w-xK5IZ3l2A8BM8N8BtrAV5HRrCItvUSs7Qxg3gnpK8RgVhEFmjds4A2iRIOiXw19stfCV5nAaRGoBhiRnE9x1ICdFhvg9wk49x2pJcT5x0LAOCqh8AwYoAADw4toX9uiaps8CAyj0IKioQqi+c8YzoxhoR5gQ8sxUZI1hR3DKAoAsVWwqkM8bIjBkocBIxFQAD8BCDViF5fgmkbpYFD5ApRj2oHp1ktxU4b9Z878RQISoTUAYSwBOwM9PxSAYBUB6ZnMsVCUKgUSCh0TdDMSLFAUohZY5Fj8fk8xMkM0xjGDxgZ9WChRwTqB7xqTaT6SOJ4TEtkTIk0T+Ceitd3jRDBETxxhVUJs+kA1QRjsNgMhbFVURgwSqToSLJYSOJxM7lIJZlrVSigowpKINhUZs52pyI7Q9NjtB8Lt8c7SFTISHTpQnTvxxNHjIl+BSjGDFhSJtIARDcaiwUYQlUw8XR9lfhPAyTZTjh5TFToy2w6TV9tFdFtCDFhU1Dkyz9B1oQ3RQRnQsytUlNVVAhLTbEx8IzyyaTHSqyM8XCQYUjk9qlYZgCRgmVw0PAJEqR9lOyflnELYQ17Rzsnolta8lFXxkBgIkiLIwAriuNfYOJz06BX5r0Lj6IDyjzWxTzOjT1vcHg5MMSUIyQnFfSZZ3ReyNg7RswNz+pbF8wTwEhYjEynyzynCz1n5ryUNbzK0TJbwACH1nzzzH0uEfcPzeTIExgmoGpg0ittIgouQ7Q99mVaQ-McZAhmibltQEz0KBxZz4CfIM4ghDSvhNMtUxhMw9VPNJhaR6s9y8EXTCiIkWKVj8LTYogzp2oq8q884HBJCtUoRnA4VpF0xdJziUK5SPcLy3THlnk3l3kndEKXdkLbcDL71T0WAHknlpAzK3zX1dBO9GlUy9ND5LTxgiwnAnFpEOQnBhgtgxLb1DLw5HLTKPkBB+NqEEi8B6FGE7z3c7La5jKnLXkPlXLCNPy6oRCmls4vhnED8ycdktxUzpi6Uekwrb8lERBFRRwtp28OJgDtI6jFsqQc4ogUlAsBgYgDUXQFtM1SZySlE4jYAEj6ZIYnKSAnVSFVFb50Ag5GryF0cI5Ww6zDFGyfC44yQKRSRrQithhZtbCdxnESQ-U+oDU7AE9wr6JJrprw45qFr-52EVrOIp4wAQZtqGyAJ2rLDDj9lVh-hPA-gdw9wNiQNvAKxGptJI1Bx1qHdacXjYktdy90IMEJFORAh05ccQQWy8JfSZT7DjgkankUa5dWtG0dTs8V0mpfA9wMgYF9kgp1JrSMJUZ5FwtQRvAGKYNRwoJBVK5vsZ0rybyUr9KONglBboIRbVseVcrfd8rAcmVojWpUFnFeLEAFD0IVh0FvhVxPQHqTJPwIBF9uNeURwHUDEEsBwrV0UiV0BFb8AX8PK9J3gdyHA0Zd0QjyMyDXgAKC50xI1zbLaQxrb7Vko7b0BnUhwRw7VbbLJWZ7bO8iJs5gchhnQroiIIbszdwepyINwcYr8ntTahRw6sMk6Y7ni39AIqho7HVYA+wpV06hgzRAg2zVVXhnQdbwVxgFgAgizFtDcw6Lbq7G7k77aE6Mcbba6yA1ApBcpaF-x066LFhIjfgHQpiRTwUTwg9rQEg8xD44hx6I6r4a7HUZ6RAm7rbGKeS6acts7mQekf0UhjS1LdaSqjr2oOzXhYgI0K7jgq6rar7Y747siW9pAp7a6cBV6OAW7JUACgC9qFxjCtJxcRtgS7QGCFJCL-gi0fBRL6rxLZbMMracNpBppwGLLJaSz6BxMsMqHHwcpYGaBla8Kn69DGpF1GpiqyLvhu0wVu9MwKRT8QaUggHSH0NyGsLbNCUaH2GZ14rBMkrhMpabKZbGLmHeNFG2H56OGcL3y300G6p-ILZswCGWUIKA15g6DLpc6bQlhmi77mZ7aktyEUsMR3tPttTXicsKIV4FIXQtxwoMxARszodl4LcqQ4hsZXHbbmYNsPsOsKBAwes+BO8gmFhB6zjKj9k7R+HFh2QUgPgfSUg7DUqoNDGms2tUmtsdEWipxsmEkrdASYFrpKLgm8JzdyLlVEmY7knfGOsxaxwVr-szHkZCsFhWoghynQU+LnQDS+8C1QRdyZGxNanmZUd0oMcscpmug-UmpnR0xnHXgMygKTxSQd7qQhG3QR1NmTJb6kmdYXna7HkOB4rH6Am9DzspZdxml-gsxCxsz846CMwmbEhfIqnpbGHtm3nan60DE8CZBWcfn0bs8lhvz+lCshGcZcHyQQm2zzQVKghBma5VqkXMcUWVdxVkHpVO8SIwCd6K8j70win7oeztICxpZBhz7J6kWZ7HbL5MVsUNQ8U9HpBiVSV16lgLDVLqQKdJhRiArrSImdd2pRLqxqA464B9QyawBZKt8TDmRUYroMgV5lzXAGRt8Ygdy84CH4mDJgHShThIxSpmwIBjXng7q+gyQqRyIjx1x+6gpBrty8wDctxYWtG3XygfHLgfXPJBgLYAR+oqRMYbWwUSqLY7sPB1kxZizDWRQus4MwxFRlQKg1QYxNRrNvXuG447BKrMYziRsV5FmfkmVS1Sw+daQxqGGo1mxhyYyqye5ex+wk3FwcYnFZsM0MhnEBcT8hhU34Egou0mbkhmjVEbjRxbUx28hijpBkBThJ2CB-B-X8ZfhYaRgRh-LSRclUF5hdkY258GJq5mJBJwlT3V5hsyQc4fVBp+6c4bQ+1CIg6YFHnxq8F7dWxP9v37t+gziQ04hS8I8EA9UnEhhup-BRYfBI0voH0aG-psoAZNDT3B1nBXhPNrolhcYRHEh0IgpsW6QYRbFYifZqlNZZpA5T2Tqh71yIoJjB105p2dLM11hu3I1+5B5nVh4MroIx54AG2UJF4g8Pg-TyC9xVyc9PB+hT9fT-AqOpPv4r42hFqH54OAr9UxcA2SS0PooZs-3AWV0BhI0FdrbE3lPKURtFhd0V19UPginYRN6-hfhAo8PXXB2Y1Xbp1J2isukTwV4RYzs6OKsUgFhkh5hzXEFpGoOIr0qjLJ2HAc5DjD9+jqiQjDklVYdD95ZSIBaKHI6qGiudKXAFsAOGOCJnpBEKxUY6RqQX2KTjNGsXtqakY5U9Dub0IdINI9w7Z-a4FLZGo4dWR2p+3i2YPPd+RJ2gh0Isv-BOl-g-A97zE3gkhvAQRg1nE2RE8pzU8wkNpyO7A+0xs-AhgPAzjh97GobsxJZ5FnRI0F8l9W8WrHuvOt8nB9xua9wbDUEHBh8l40JKCyIfBVgUCh3H80Dw57bT3yRNJzWRcrWLnAtzSityRiQjxJZBulFHDT1eOBF4b1h2R-hBouviwtOXRJgF29LY2GJ4jaFjzpRJy0iRIMixByOM2vV0wywswJETvsxBZEhEud7TrZjWjw4li8BT3gV+haOPujUsxRiQP+otyRhRthYUCriH0d27iHjIYnicfwfnhB0SR-NsZ0zkg-L81aOMIFCGM84p8SG8uj17Th3KyVTPxyPPACZYd-7swlgv6EAIDmQh1JgeWQtbTIuHyxBBfH9YK6eneTo+6HpUZCcPgr8iww2-NwbpYPhqe8E0KRwYKXyMrv2cIwRqRlVyQxTWRKLhhqLBgZFQQi3qntHBbXSq4WLjW4JkBdaAVUyt6+bB-QgACZQteUYqIFIMxvBpi85slQh64o4iBv6-lMZdwsTo3JCaSoByB1+XhDryIizd+MwOWQA5kIB5AiRtBQgFBITb-da80zvTfo-x34Og9+r-Piv1AX7n8l+ngMEpFRmQmVnKHyOLgxzgKNQECK8WkEU2iBLAGClhbwM4maJNUV8EEXjnSmFyD8maWcS1juHL4lMUg4wCYPMxH5ws+eU1AXi9QuBvUeIH1KAOQIsTH1aqGaQYNp2ljQJH2iQPMMd1y4DsKa6OUbmtnG7EZQAM-H5FbC5rlMmau6b4ivzvDr8ogjUTQbbAmwng2QB-dAEfx+SnRNBqwbQR4F0EgBr+--WYLEBOaJATB1hHsqEHf6f9ZgLoH-h9hv7r8CWyMQwe4ISBWwvB5gkRhoOdBaC4gDgnCA1yEjC0naYtFrhMAwi54d0pzIiMXiT4apl45EAsCdTGICswGyjF-JOzZpmgQQ4+FIGFn9rtQmoIOXvL8CCCyDi2TDShlK1YbKhlGk7S1k1ASDJBCKKSf1CIziCv0hg-UYRAAyzAUsmsk7fGGCEXhH4fSAsANFyF86rhoWa4P4JGiqTJZpANgafugFn65YSKuvD4ICyrySFV+d-AWIIio7aotWtiCwVYKuGElswtw-OERCv5-87+2-F4ULEHrWEs2vg8gF-0CFAiABoQZ4M8OhaEQJEhnLeHUV+Enh-h5dbIEAA */
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
            target: 'Idling in retrain mode',
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

          'Abort run': {
            target: 'Running prediction',
            internal: true,
            actions: send({ type: 'Abort run' }, { to: 'websocket' }),
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
        always: 'Idling in retrain mode',
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

      'Idling in retrain mode': {
        on: {
          'Switch to predict mode': {
            target: 'Prediction ready',
            actions: 'setSessionMode',
          },

          'Set retrain map mode': {
            target: 'Idling in retrain mode',
            internal: true,
            actions: 'setRetrainMapMode',
          },

          'Add retrain sample': {
            target: 'Idling in retrain mode',
            internal: true,
            actions: 'addRetrainSample',
          },

          'Set retrain active class': {
            target: 'Idling in retrain mode',
            internal: true,
            actions: 'setRetrainActiveClass',
          },

          'Retrain requested': 'Requesting instance for retrain',

          'Update retrain class samples': {
            target: 'Idling in retrain mode',
            internal: true,
            actions: 'updateRetrainClassSamples',
          },

          'Switch current instance type': {
            target: 'Idling in retrain mode',
            internal: true,
            actions: 'setCurrentInstanceType',
          },
        },
      },

      'Requesting instance for retrain': {
        invoke: {
          src: 'requestInstance',
          onDone: {
            target: 'Retraining',
            actions: ['setCurrentInstance', 'clearCurrentPrediction'],
          },
          onError: {
            target: 'Idling in retrain mode',
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
            actions: send({ type: 'Abort run' }, { to: 'websocket' }),
          },
          'Retrain has errored': {
            target: 'Idling in retrain mode',
            actions: ['handleRetrainError', 'hideGlobalLoading'],
          },
          'Retrain run was aborted': {
            target: 'Idling in retrain mode',
            actions: ['clearCurrentPrediction', 'hideGlobalLoading'],
          },
          'Retrain run was completed': {
            target: 'Idling in retrain mode',
            actions: 'hideGlobalLoading',
          },
        },
        invoke: {
          id: 'retrain-websocket',
          src: 'runRetrain',
        },

        entry: 'displayAbortButton',
      },
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isFirstAoi: (c) => c.aoisList?.length === 0,
      isAoiNew: ({ currentAoi }) => !currentAoi || !currentAoi.id,
      isAuthenticated: (c) => c.isAuthenticated,
      isLivePredictionAreaSize: ({ currentAoi, apiLimits }) =>
        currentAoi &&
        currentAoi.area > config.minimumAoiArea &&
        currentAoi.area < apiLimits.live_inference,
      hasAois: (c) => c.aoisList?.length > 0,
    },
    actions: { ...actions },
    services: { ...services },
  }
);
