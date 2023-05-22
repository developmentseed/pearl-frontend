import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEgutjWr4dATFudLxD4dKeAy0LpG8Sw4Rm2iOPYYyOF6tYCledC3vetCPpQz5vl+P5-gBLAQKgJCdk+L7gV+0GwfBeqIXOKagM8lFRHQwxDP8RFfAMDKrLuCn2FyJ5Zv8GY0fyyJ+iKFxqMGnAkMgAgALJWZGOBmZACF3MmjwydYdjkS4AzJCuqwUu49gMh8YJjG6aTWhMcLnuOxlCgA6iQbQWTK6DKrxzAsOlLAqNQOBgGItn2Vw4YQOg7ZaBJrnIR53Qnu4rguAkfwFl4DjWup4zoT41qODhSwDE4hlIr6iXJeZ0ppRlfHSjleUFUVv5wNxC2FcJkGZZ2MF4HBVWJlJ7mWNYLp+CWHjUvY7JXb4XXEu8fzpPM3x4XuI2XiZSUpVNOWZXNyprUtXGQLlJD5etEE8Xx21iVoNyzoa0nHd08SrE1ubsk9fjpH4BGBMyWNQjpNpVjstHxcc17Q62kNQWEUPMFAUrFcgnA8IqXBSC5eKI0dsnps45I4yeoK+UR6lcn0u44QC7pskEZ5k0ZY2U9TFm0-Tf1M8GLNs+G3DINzSHznVBABPY7xRFSqPEjaFJ43mlvJNj7KPYrNbK-WN5q9KGsM1A2tQJxK0g4DG0MzDu3iQdvPGmbQULPMZKDSRG7qQ46HjK4NgJK4sRBLC710SZABiNDsOQPF3uX6siVBPDUBAsACOVxw0BI6DivQF7F0KZfUBXVdMTTdcN03CDt+gWrtA0RuHXHxIgjEvh2JRIJEckBE+M4G6L9yV3Z9RsXkyr9AlyOFBsAPagkGIPGqCQLcaPQk9d3QPcU2fF+V+XN93xAD8J7UA7tPaOc9Y4oV6Bba0T1QQbAGM6W64REB5j6FuQY10yzzHdh-U+dBz54Evr-Sgt9754EfkqDAqB35iFUNNIg784p4IIUQ6+JD-6AMnqA-a4C3Jx2UnQF02dORo1OgySYJJiRXViCsPOsIvBF0-owKoEBlAPEqNULEv5KD9lElHagY4Q4QF4bVZGFJEiW2JLCe09gEj2gIpLOgXgiJOABEyKkii8HLVUfgdoGjLjCDAAAR24HAdim1CojmnNVHmfCFyfAUpuPwWYPDrjtCkMEgxJi5lhIkTxXtlGQDUX4zEdRlr-hBh2cOO09omJNsjAKYJ+qu20rI80BEHALD8ACO23xxjQnyfRbxxSND+KxCIEJYSQaQ1gO2EwFA6lIy6DbC2q5+rpleMMZxdotzQPSBmHCGQk7uEGSZYZvjRmlMCZMl80yRKwHICQKoLAACqQgAAyiy+aIEoi6Uk5EXQbHTCubcyCEDZhGApWW-Ugq7jsKcoU5z1FXMHHMwhlccDcFQFUPgV8XxgwKiwPAYRkDRJjnEuqHI0G5gFvackV10mUX6FyLMyxKIOgRaiFRIyDFXIAEKqEvmgIpFyDE4HQEQYCUTjExONksn5ww+gryCDYGWG5JhIJmERIY7xnFUgdP4WENhOWlG5aKsZdRUXzMrnBDReA+I0DZhAMlCMKXI3JBsGIFEBgtT3N8dSlIYheFWHmZYwb4gmroE2fgyphU+ORbwXU5LTFdBtAsL40ItzUl3AkKYYLAqZPmHnfw2lYEnOPp7ei0aIxxp5ZURNCZXUpsQGmlw8Cs3DDiDhLeCR3hsm8BSSiPhjUVtGgU6tsazUJuoNiZN9TU2TDbZmnOnbc3qQ2GabwMKRgAgmOWpWY76LCjMiPb8rcX7AM7t3JhBTj3VEmhtIBIDVAzz0F840Vs+iwO0sO4F9J80K3+dnDcZJXEKNHR9IUEzQkvlbDQfF4Mn5t0vW-XBBToNhLg9QBDBUn1TxfWA2V88FxSLBNI14wbJjhWCvmnpgiViBBtk9e0R8D2QeOBh2DFl4PkMQ5Q9KNC6HpQYWh+inGH08YJWAPD3DZ5EYgZSjqMQ5jugmB4e0IR826X6HEEYFEKKPUjUIXgA8LK1tFQIO9qgQaSfBiwdsYAoKwCnl3PA76SPEmZN4FcyQuT7PgQRH1TioRfDzIEWEEwjMmdbOZh4AguDOqKvivACoNEFUoFIGVc75UIChFdQRFF7DBrGFddMeaZgy2InLEr8xzS+Ci9QUz0pYvtECelzLuUxTihaDQNz8m3XLOhBbLc+yPh+uGEsAiuZBGDA2CkMk7UHANaa4Y+NrWRDtZBmofsMo+L9nc5SzNLgHBQnmEsFc-6Kt5mZL8DcXxvi2P2ctmLU71u4DABlkGLXRl5CgFxA7ZipGkhYxNiKKw8ZUkWO1SWfwV7Zme2Z17GgBCvnrqgUcNSfvAyy02+diAoQDEWFSZxgVVz7IIhdqFwafC+CwgZCDvcOPRcRyKuLSKSm8HsyQVUaPtQA+WXmdG7Vi1BWTtsgDgRSQ2nGEV7O4wcE3rE8z5rSOZ3s8uZz9s3PcoSqlXz-rzbcsbiasGmE-VBjQ81Qq7SUPBiJHNEEfdHtD0mSsw+nuSGL0d1Q4r13J7Ee0RkwRnhBu8ezHIgsTwdhmNOHMZd-HzTFieCHaqvcURI3vNAoBWh-AhIQSTbjnLFItzNTy87dT5XIjsi-SMPwiRnH2nhQzpRmewI57CRteo8NJIKYaaCSRPmC5PT8pX2YXbgffApBnUEpNnfsfoK37P1m88cU0DiQv3yEDaAZNoSNAA1W+lAAH8AjgY-P-PrAhq6fsik9oViJF3DuDIfQ6RumzisbSURWNz8Z-QA-Ygj9rNT9O9G0e8BtL8ro+goRlVAhg1AgaMZgohUYg0VxhEcYVxwM2Nf8GJ2BgISAwhWwDYQIwJIYEtb4BAXlgIs8QYJBD9AJIZ7wxAXUwDDcCBoR5INxq9FtCt0gptVhwRsJiYgojM7w-xK5IZ3l2A8AC8WCw8CAV5HQogAhk914EDEB143gnp68RgVhEERDds4BxCRJJCXwu9stN95DNIaRGoBhiRnE9x1Js5HRvg9wk49x2oFcT5x0LBvo0teMoAmDw4tonUBwL8UZfJFhd4cI7AeC8YzoxhoR5ho8sxUZI1hQNB7woAsVWwql88bIjBkocBIxFQmD8BnJQ8cs2DZZSQ9wV5St0wvg1DwU0hFgvg5c2QTtZ9RNXcMjKAsjUAciwBOx89PxSAYBUB6ZnMsVCUKgSiChyjzCF4AQSRKILsPg1VQUtULcYgqQ1wPgFtMCf8lF0jqBMjsiLJciOJ8jEtijIkyicdZDKjNgyNaiM5t5Qs7RPACZvAjwG8jk0jej+jBjhiOJxM7lIJZlrUwi2CgowpKINhUZs52pyI7Q9NjsH8LtM0thm88ETiziBiLihjO9xMgjIl+BoSoQ6RFhSJtJljJheCwUYQlVY8XR9lfhPBDjuihQ8S+jzjpRLjvxtFdFMcDFhUKkHiao5CiYLZB1oQ3RQRnQGStjixVVAgNggp5g2QATTjeSCT+SiT89yluIiCs9qlYZoSRgmVw0PAJEqR9klSflnELYQ17RzsnolscTb1AS+S2wDSOIrV0VcosUcVRxbNCViVSUKSAQFgTwKIc09xuomicYoQdMTwcYKIhtv8uTjhXxkBgICCLIwAfCuNfYOJz06BX5r0vD6Jcz8zWwiypDT0g8Hg5NFiUIyQnEESZZ3Q1SNg7RsxnT+pbF8wTwEhI1bwmCH0GySzO9yzKzGFqyTIJyRx6ziyH0IJmzX1dALSxgmoGpg0ittIgouQ7RoDmVaQ-McZAgRCbltRSTJzQiKiLCohs4fI3jYVlhNMtUxhMw9VPNJhaR6tPSxNgkYM7zIZEsokzCN844ogzp2oG8G884HBHBTyKQXBdlad0xdJPDK0-d71T0WAHknlpA3l3lPcKyUMqy8LuT-dSyITHlnkyLNzCM2y6pGlqS9ND51TxgiwnAnFpEOQnBhhsSsDji6Lw5iKmKPkBB+NqE8C8B6EFyaLjg3dCKpLSKPkWKQ82KGk1gYhs4vhnFYC-BULGTYgSQWkMgyQelRKji8ERBFRRwtoz9V8ny45tJ+DFsqQc4ogUlAtCcKJrQXQFtM0ujfchRrxcDaF6ZIYSKSAnVSFVFb50Ag5HLyF0cI5WwRTDFxToSyR0KDUithhZsisvzIhnESQ-U+oDU7B09gKlzor8Dw54rEr-52FUrOIp4wAQYcqxSAJ8rvhnD9lVh-hPA-gdw9xnBvhDVRg1NtJI1BwMr3dVcZDJScta90IMEJFORAh05nEDxZS8IESsyIrjglqnkVrWdWtQD1rN8V0mpad5cYF9kgp1JbESRnQAg-B0xQRvAbywLoJBVK5vsZ05yqLlKXcoNQKO8oJgbVseVtLWyYKPMmVoQlIZEcJeLzLYQtJ0FvhVxPQGrob7VkpeVNFLU0VL5bVYsQiwi0zE53SHA0Zd0rcEByMFIbDeyC50wRDSbHUUURw7UHUDFSBWYEtmC7rjQiJXyyQhgvrBoJrGTdwepyINwcZ0CntiaOMRwRaLUUcIBAIqh+aDFYA+wpUwjxhQQMJAh5TVVXhnRyrwVxgYyItvBFsLc+a9bBbRxja9ayA1ApBcpaF-xLarzFgBhvBdCdCkyTxI9rQEhBddw4gvayb9bKDj9pA-a06cAQ6OAzbJUmDYAw6lgtI5cRtki7QV4+hRYi0i0adU6BaKahwqaMVgyNQ8VeNwySVJbYlDcN43g8wULqQiIXa7QVhnAPqMwUhnZ6qxKHLda06rkRATaNFbyFiUa6p5bmQekf0UhVUUTla-hSQJFFTXhYgI1tb6BxMsMcNpBpphayaKL5zszr6YaZywz76cps6aAka313KFxGpF1GpDKjzJ9R8nAggXAp9MYKIUhL7570N36JNsMu6v7lQf6Z05LBNFLhNIb586Ab7uNUGpNHxv7F7f6uFg9kbHjN9-ILZsxdy8IHAc4A15hBF-gP8lgbQlhG6mt4t0BEsBBktUsqhNsJS+6w8KIV4FIXQtxwpp749wVodl57cqQ4hsY+HmYNsPsOsKBAwes+AwjpGFgXaPCuDydGSQHIjEhUh4SUgndX7CGKH+GdHPtAJttRCpxjGElHdEiYFrpTyZHmHHbtJlUtGdY3GOtQaxxUr-sAG6pCsFhWogh9jNj1C5ZBFtI9wC1+9wrFySaRbmZUd0pfbeBjGQQmpnR0weHXhlj+yTxSQHQV1J83QR1EGQKTbtGXGWBHkOA5KN7aHjRzspZk75Y5dCwcaFhSI+pEhfJHGzq36unImenUBNdtdxVC7pUwiSI3ggoMD2QE70xPj7pVTsnYVzcFmCmdblmg4Sm5A9E9pcqBqEnkYlgOz+lCtJ8cYq7yRZH5TzRkKghshqxqBBG4B9RFnN7kYzYEgCZoRg17sxYHTuh0xwQycRhad2Qc5I00RIxSpmwIBoXng6q+gyQqRyIjx1wnagoYgrp5c8xzctwrmVLShThIxSliXPJBgLYAR+pdjEidw-gLY7sPB1kxZOTFmRQus4MwxFRlQKg1QYxNRrMiWhnIE4VqScYswRsV50n2amVS1SxVhYFg1I0J1gTYn+Rex+wuXFwcYnFZsM0MhnFxdEChheX4Egou0sW7KnGRBVExHRwabxxYnGDpBkBTg7X5CbdSsqNvBlURg+Kaj2RUF5hdkWWobKZq5mJBJwlo3V5hsyQc4fVBonac4bQ+1CJXgeGBg0iJKxaC37t+gPCQ04hq8lG9UnEhhup-BRYfBI0voH0H6-psoAYpMxBo3B1nBXhPNrolhcYwVaT0Igp3m6QYRbFxyfZqlNZZpA5o3iqYynSIotDB104HXsLM11gjXI1+5B5nVh5a5IJ65eAm4p29IMJ1jbFEEnBxZ80MxBYkCET-BZ3b3v4r42gkqH4m3+L9VZdyWtx2RxFrQZti3k6V062r7Ck1tLkKa7Wp9iJd0WmPgPhPjcalg-hfhAoB2sOJ0EbzU1mjo5VN8isukTw6i2ifq2bbGFhkhNTVhEEEH7Lb0JKII7WWHHrhW7tk9k4t5nQicfrIDGNeasOiGQwSHwZxPsKXAFtS3bGCJnpBEKxUY6RqRM2CHjNGsXtrqkZmPjRUZcadINJajEF11ranD96Xboj8nWXTICKA9+Q7Wgh0JNT-BOl-g-AmjzE3gkhvAQRqdyQgKOmTJF8WB28V9Px32SRc5IG9iJEUXBh2GprsxJZ5FnR986CgCXKNoD29xmQHO9wHRhKpEn8l40I8484lIDzxymqCzpQTSSCRIyDJ31XTYhF0J85+W4cJEovsxBZEh2PmmSr9CxDw4TC8Bo3gV+gF2PAano9x7K3+pXSRhRthZzWfCH0g2wYAjpAILoYQip24ydNYd7RbGHa8YHWMgZED4My57hOj1vS9TfSQTMvRuYWuQMwDw-Az7swlgzKZhbEuR-kghw1+piQRhI1ayxA+uWBpz1yvwp3HaHpUZRcPh0CixaW-NxrpYPhzPsDlypy1zT0C2cIwRqRlVyQ8x3Q6RTzhhzzBgZFQRJXrm37176CRJIL+BoW4JkAMn+otXdxfhKX8IQAmCZQNuUYqIFIAPfgHROvjmQB64o4iB1CD6Feo7lezKBioByANeXh0LyIOTdD9ezK5kIB5AiRt8QAFA+jbf1C81nhWTpqdfneMwDfvz5fMZFe-qBf63-P6KiLGLNL3k7Xl2bbGpVUroV1R9EyI7q6hr3bcKs236nLgCxOwfZI6UpcBenqgHswdwyfIiUhxgJhUnhffOorYA8DYqRJWrhueIOqoAD3yQmpE7bKM1BgCuhyMI03Eg8xIuhOnGLr0drOcOmPiNQAZefkrYMIFvyMPBKTQg1eNeohGpd+EgrYlDVTQgje4ITf2bTpz-Vhadd1D+QBre-ex84hz-bYJsTw2RQgbvD3rMBdChAfeNvDXj82Rin8qmiQX-lfwAFLsd+zofYi-wP44QAasNeGqDS04TAZ+6CMaljSgEI8NUy8ciAWGKpjAi+FnVZnhwr7qEyIGEEEG-hSBhY2aRWHOP0GEo35fgQQRflKzU6d1SGD9TBnawyDJA+0yQXcikn9RLs4gO9IYP1GETn0swETIfvQIQD4wwQi8eAvCQFgBokeyQVcHMzXB-AQWmQIAA */
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
