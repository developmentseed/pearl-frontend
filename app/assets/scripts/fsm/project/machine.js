import { createMachine, send } from 'xstate';
import config from '../../config';
import { actions } from './actions';
import { services } from './services';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEgutjWr4dATFudLxD4dKeAy0LpG8Sw4Rm2iOPYYyOF6tYCledC3vetCPpQz5vl+P5-gBLAQKgJCdk+L7gV+0GwfBeqIXOKagM8lFRHQwxDP8RFfAMDKrLuCn2FyJ5Zv8GY0fyyJ+iKFxqMGnAkMgAgALJWZGOBmZACF3MmjwydYdjkS4AzJCuqwUu49gMh8YJjG6aTWhMcLnuOxlCgA6iQbQWTK6DKrxzAsOlLAqNQOBgGItn2Vw4YQOg7ZaBJrnIR53Qnu4rguAkfwFl4DjWup4zoT41qODhSwDE4hlIr6iXJeZ0ppRlfHSjleUFUVv5wNxC2FcJkGZZ2MF4HBVWJlJ7mWNYLp+CWHjUvY7JXb4XXEu8fzpPM3x4XuI2XiZSUpVNOWZXNyprUtXGQLlJD5etEE8Xx21iVoNyzoa0nHd08SrE1ubsk9fjpH4BGBMyWNQjpNpVjstHxcc17Q62kNQWEUPMFAUrFcgnA8IqXBSC5eKI0dsnps45I4yeoK+UR6lcn0u44QC7pskEZ5k0ZY2U9TFm0-Tf1M8GLNs+G3DINzSHznVBABPY7xRFSqPEjaFJ43mlvJNj7KPYrNbK-WN5q9KGsM1A2tQJxK0g4DG0MzDu3iQdvPGmbQULPMZKDSRG7qQ46HjK4NgJK4sRBLC710SZABiNDsOQPF3uX6siVBPDUBAsACOVxw0BI6DivQF7F0KZfUBXVdMTTdcN03CDt+gWrtA0RuHXHxIgjEvh2JRIJEckBE+M4G6L9yV3Z9RsXkyr9AlyOFBsAPagkGIPGqCQLcaPQk9d3QPcU2fF+V+XN93xAD8J7UA7tPaOc9Y4oV6Bba0T1QQbAGM6W64REB5j6FuQY10yzzHdh-U+dBz54Evr-Sgt9754EfkqDAqB35iFUNNIg784p4IIUQ6+JD-6AMnqA-a4C3Jx2UnQF02dORo1OgySYJJiRXViCsPOsIvBF0-owKoEBlAPEqNULEv5KD9lElHagY4Q4QF4bVZGFJEiW2JLCe09gEj2gIpLOgXgiJOABEyKkii8HLVUfgdoGjLjCDAAAR24HAdim1CojmnNVHmfCFyfAUpuPwWYPDrjtCkMEgxJi5lhIkTxXtlGQDUX4zEdRlr-hBh2cOO09omJNsjAKYJ+qu20rI80BEHALD8ACO23xxjQnyfRbxxSND+KxCIEJYSQaQ1gO2EwFA6lIy6DbC2q5+rpleMMZxdotzQPSBmHCGQk7uEGSZYZvjRmlMCZMl80yRKwHICQKoLAACqQgAAyiy+aIEoi6Uk5EXQbHTCubcyCEDZhGApWW-Ugq7jsKcoU5z1FXMHHMwhlccDcFQFUPgV8XxgwKiwPAYRkDRJjnEuqHI0G5gFvackV10mUX6FyLMyxKIOgRaiFRIyDFXIAEKqEvmgIpFyDE4HQEQYCUTjExONksn5ww+gryCDYGWG5JhIJmERIY7xnFUgdP4WENhOWlG5aKsZdRUXzMrnBDReA+I0DZhAMlCMKXI3JBsGIFEBgtT3N8dSlIYheFWHmZYwb4gmroE2fgyphU+ORbwXU5LTFdBtAsL40ItzUl3AkKYYLAqZPmHnfw2lYEnOPp7ei0aIxxp5ZURNCZXUpsQGmlw8Cs3DDiDhLeCR3hsm8BSSiPhjUVtGgU6tsazUJuoNiZN9TU2TDbZmnOnbc3qQ2GabwMKRgAgmOWpWY76LCjMiPb8rcX7AM7t3JhBTj3VEmhtIBIDVAzz0F840Vs+iwO0sO4F9J80K3+dnDcZJXEKNHR9IUEzQkvlbDQfF4Mn5t0vW-XBBToNhLg9QBDBUn1TxfWA2V88FxSLBNI14wbJjhWCvmnpgiViBBtk9e0R8D2QeOBh2DFl4PkMQ5Q9KNC6HpQYWh+inGH08YJWAPD3DZ5EYgZShwZHfBxGFlR7MNGZiowohhI1sD2QxTY73DjvAB4WVraKgQXBnVFXxXgBUGiCqUCkDKud8qEDQi+E4uFURvApHxj2pqQQySsoGDCSNQhTOtgsw8QJTmXO5TFOKFoNA8DvpIwMBYXJgsOGzLEVwW8VgxGpKk8isQwsRai+Zqd7Q4tgGcyDNQ-YZR8X7Olyl5ISQ2mSLCV4jUMiacQBSby6yQSUTdH4AyEHjP0Ei9QMz0oYu1ZEPFkGS3Rl5CgFxdrZj7DpicemH1iRnTjDxnYRYNoIQ9ZdIMSr83os1Y0AIV89dUCjlQLwHbyys6kjZNCYYDhiR5wIiuR0Kx9k2IdFdO7C3DHxtq0ikpvAWDthIKqV72ovtDbzOjdqxagrJ22QBwIpIbTjD29ncYOCb1iaq4tx7M7EeXOR6jjg4rJViGlVjjzG4gtkjK8SCRbJ13aUWO1Z0HgiJBH3R7Q9Jk70vuq7RJDF6O6oZp-Lk9Sv+QyYIzw+TbquhfG8LpuwzGnDmP-Vp5pixPBDtVXuKIkb3mgUArQ-gQkIJJqbfO7HW5mpQgPv8DIeaZhRChP0EYfhEjOPtPC6bSiABqt9KAAP4BHAxXvudmycF0-ZFJ7QrESLuHcGQ+h0jdNnFY2lfORuT2IVPqhpBbUzxxRtkkFPIxz+yQRbIRiBGDYEQbsxrpBpXMInGK5wNGaUROlgRTwlOoHK+CAgFSCszAFIXFjzG6c+fNn2xREMJ-FsVCGk7UCLMYwskVVti1i14T3ghsqiH1e8huK1AtBlSs-9jAVzPv3MzZXg3g5ZDUesIRHAt5fhBFfgNxVUK9JgZdRMTJn9voNpnsRICpmxlQKgtZnIDdm16oPhMxVgnA9wiZ3RICAMLF2p0ENxfh9kKJI1UDX8OJyluJ38pM74alo4ADvl6oE5dVk4N5yQ05aMAQYhvg7cogocghmCX9T1g4KlAJ38NAnwiA9FakCDfcBC9shDswRC2RNUhtPBnABoBgt1oQVxI1rx2BgISAwhWwDYQIwJIZrNb4BAXlgJXcQYJAU8VCRJ7xOds9PN0INx2QcI7AKIyQCJojwRsJiYgoIs7w-xK5IZ3l2A8BvcO9DdrAV5HQZDYQ7d15h9143gnoY8RgVhEFkiWs4A0iRIMiXx6h4YcjCCCAV5nAaRGoBhiRnE9x1Js4wcVMsYnAcYsxmCLA0Cqh8AwYoBOdw4tol9siaodCCBQiLsIj2pdxVh0g8YzoxhoR5gzcsxUZI1hQ1DKAoAsVWwqkvcbIjBkocBIxFROd8B8C3N+D1jfgmkbpYFD5Ao7Q-gSRqR1ktxU5p9Zd2N-RLjrjUBbiwBOwvdPxSAYBUB6ZYAeBUBCUKhXiCgPi+CF46QmpAUohZY5Fh8nBQQXAM0xhyQ6RxhWMoSZsRRYSbiLI7iOIHibMXjIl3j-82i1jtMzCTxxhVVhhyw9iwUqTMkM0Bts4+jzi2T4SOTET0DxM7lIJZlrUQigowpKINhUZs52pyI7QRhnBeghjVVM0thH9b1lSESkSOJxNFjIl+AQicIlVSJtIARBgictUAUSx+oXR9lfhPBITkChQLjqB7w4THT0DtFdEeCDFhVlCPTUZBEKJoQ3RQQTszTixVVAgNggp5g2QlSYyrj2TpROTvx2CQZnDXdqlYZs8RgmVw0PAJEqQId1JnELYQ17QlgjkHBI1XxkBgJHCLIwApiuNfYOJz06BX5r0T4ClRzxzWwpzMjT1dcHg5NPi44yQnFDSZZ3QiyNg7QNNSR+pbF8wTwEgbC3T1zpzWCz1n4FyUMlzK0TJbxOcH0NyZzH0uE9ddzCTIExgmoGpg09ttIgouQ7QoRM5Eg-guQpdAhkibltRXSfyBwWyb8fIM4ctlgQgwV15Mw9VBdJhaRfA0KYMMLIYbMokWi9zIFAgeoRgpciI84HAqCtUoQLTdkVN0xdJqdlyj0tdZytTHlnk3l3kVc3y1cPy5coyxLw4HknlpBpLtzX1dBudGlFg+i4hdxizTtiKQ0nFpEOQqSc5zjlKZlJL1KPkBB+NqF7C8B6FGERLNd71T0WBVKpKPlNLCMmK6pSCmls4vhnEB9Jsdl-cWkBsnoUhbSZ88ERBFRRwW90CD9UYLZtiqQc4ogUlL8BgYgDUXQyQGSmC7T6JbDYB7D6ZIY1KSAnVSFVFb50Ag4UryE3sI5WxkzDE0ztDACyQKRSRrQ9sAchg9siKw9nESQ-U+oDU7AndKqvy7DaE6qRIGqmr-52E2rOIp4wAQZerUyAID8pDFgqJVhg88xQ9Ig9wuiQNvAKxGptJI1BxOqH11sZ1uco90IMEJFORAh05nEDxB1PShheLXr3qHsRVYt29Vj3MV0moRiMgYF9kgp1JbESRnQAg-B0xQRvBqKwloJBVK5PrZLFz3LPyoNgkaLib0U4ceUAr9cgqzFUYwQrDWpUFnEprEBGD0IVh0FvhVxPRlqhRPwIAG9uNeURwHUDFrMBwrV6bbUYsl8dK9J3gnpV40Zd1jCEByMFIejTyC50xI1xbJaQxpb7Vko5b0BnUhwRw7VZbLJWZ5budycFhetsbSttIzTkgDtXgKNPBjTTaJasNHbrbliV9AIqgrbHVYA+wpU3aUg+gPB0wghA9SqzTrQRrxcjjGCI1Rbjgzaw6Y6nb5b7b3sZaI6yA1ApBcpaF-w3atwwQgh2oYR5YGViKpcnFPBBhvg-MrQQ7zar5w7HVy6RBY7pb0KCTBT3MhgJh3gUgf0UhxTuLebwqc7Bg87YgC6kr0MabMMpacNpBppR6Z15yKbIyOMD7-zJNwZHwcpS7rambgLZ6vi9tyRSRc82Qro9s4gMa3RSRjjrQEgIj3RCbb7sNeNCVT6n6aBHLsUBMXK3Kr7Zsb6JMoGpMH7lQ4HqAX630Br37nE+gQ0K9f6Nkupe0rpZFTifSR1qxqBba4B9QNcSgQLTZRDmQsqycV4uyCswUc8YgnoP6NhBgKJ4896hlThIxSpmwIB2Gu9FqSGQRQSjx1weaEAgpirBz9kAU4UkDWHURpHzhNEZh4avilwLYAR+oqRMZ+Gw8T8Lsc5PAcIxYIzDH-Qks4MwxFQcDVRowNRlAm95G3644oiutoQ26twIVQUZg1hft7RsayRaRSZmTZ9sD4ye5ex+wFHngzcuk+65ScZinS8itqQrDXF+1khkjVEZjRxlbxwxx0AgjpBkBThcm8jRcrpW7yJkl2obrwVVhLz2RUF5hdkDGPKhRGIHxBJwkOnFwhnvUc4fVBoNGc4bQ+1CJXhusBhrKvKLJ195mehqTxibF8sIirdEA9Ue6xg0IDScZ3HJnjgvoH1T6-psoAYuCjnB1nBXhBdrolhcZpTEh0Igolg9t-sKJEq0m8EqZ+JvK6Zf8pQjmxqFgP7qHkneLKT1bBLM11hS1UnUH8Fy4Hkh4a5xLoIx54BQmUJF4FhnqjTEExipTrdPBI9XZ4LD9d6YWCkWEf42FmqH4jnV4uiPgKd+dwTLnNHs6pEBhdwO1dnC7TUYaSlTH5mKQsxFhd0V19UPg7RPAwiQQfB8xJhHmqbGxsCGbzUPsjo5V+C9sukTwV4RZ5gWKCIUgFhkhSzVhEFuWiWFdnz5mHAc5zrB98jojswt5nRQ2h8DM6QTalW6BxMsNj6g3BKXAyqVmQX3XoC2Q5YIXqQJnzXZs6crXTE7XjRtN0IdINI9w7ZdaDSwQhiV7xh43hzE2A2HtaJ5mgh0JSz-BOl-g-Bh9zE3gkhvAjWP6yzE2XcwJ3ciaIJvnztc5c81xU6sxS95ghG63JZ5FnQ69-Cm8M8NoUW9wuGyDEmqSpFS8l40I8484lJILmDLWF9w55ajnOsRSroMheGA7L9qSp3iQjxJYi3FLGwFDa5PwUWBFnr1h2R-hBp3Xiw9wPVTXimbDVqHCnDvDXCRJ3CxBvnbGvV0wywswJER28tmUPgZCVwAdajUjw4mi8AjngV+hAXU6jUN3iKzr+oBy2LVNg1JjpiCg5iFi6LoYl9vnxH+hrrwWQW+s8YcYMJGCGM84a8qKO2HTVSnSoOaXTYuQMwDw-ATttmlg169aEhmQh1JhtJgy7AzWwP6BVyxAJzpQ-zA29Ou8QOHpUYCcPhJ8iwtHkLPBO1EgOVE3vyRxHzNzIPhWcIm2hbiG8x3Q6Q4LhgqOxHku-gIHaKRJ6L+AFG4JkBebAzMZdwfitx8IQBOcZRmOUYqIFIMxvBqiH30xQh64o4iB16-kyvmvyIxHQh4SoByA6uXhhryJwyWuMw2uQA5kIB5AiRtBQgFAriRvea81ngQyuimvfgHRWvzP269KLCKuxG9nFcKXfL7L3l5mfTQXLtb8V5aR9XoglgV4yxwznFkjUrj3F3PPZI6VScxHkbJddac4DzedByJggh5gMOaq1rw5Nr8OeIdqoAUXyQmoEg4gEqM1BgWXbqMyQvEhEhZOXrE23qnkPqGdCv0Biu9arYMIwvyMPAoQ80au6uohGoGeEgrYZDCz2v0BOuflToufVgVNd0WfBvVv2f8sufbYJSTxhdZvU8FvZgXRlv6thu6ucZQgjdLtZeeeB3Fe4n6eJdResfnQcIcu6ahUqe-vIhpddN0Fg9XHtfpSNVl4ysCcfiiIh6S6q6x6mH5m0azQQRK8Ug8wxC4m8d+gqT89fh06cuU3oGT7H7-fbXiMOGrFBFRef2vg-2wV57fqoecl2RoWiWJ7ZbkW7fuhP3s-v2IU+HxFtMgzIfuHshsggA */
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

      Retraining: {},
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
