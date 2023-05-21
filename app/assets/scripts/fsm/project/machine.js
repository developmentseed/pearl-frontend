import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import { guards } from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXbau6XSuTjba-l7aXq4JaaRdLabT9D7-eLxEGOfzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dSLxGx0ezpeJxbSuUHUrzxIGzEHufqTeK+CkJeITezwvJ7QqHEp0ADCChwAGsaFA2AAzFjcWBgVBsDiyeSKNQqfgQep6cwte7tQndXpgjIg75-dy+CYM9L2Zn+dzxS2+bQZFa8xH7IpHeii3CS6jSyhyhVKlUyOQKJRawTXXEGtpmJ7WLyOZk2dI2uKODYZ1Z2h2LB0ut1uj08nII-I+wXHACifCVUpYtAA7iw+QU2yQiGABABlMB4Lve0fUPtgBr6-FG1MmuzM9x2G2g3xuxw2Bk2RzjfpWr5uexRLLV7t1lH0AAiYBlJRY99QsFHAEEAPIASQEDCqsEVEDysgYjoDULAfp+LAAEZyHgGgzk0SYEgutjWr4dATFudLxD4dKeAy0LpG8Sw4Rm2iOPYYyOF6tYCledC3vetCPpQz5vl+P5-gBLAQKgJCdk+L7gV+0GwfBeqIXOKagM8lFRHQwxDP8RFfAMDKrLuCn2FyJ5Zv8GY0fyyJ+iKFxqMGnAkMgAgALJWZGOBmZACF3MmjwydYdjkS4AzJCuqwUu49gMh8YJjG6aTWhMcLnuOxlCgA6iQbQWTK6DKrxzAsOlLAqNQOBgGItn2Vw4YQOg7ZaBJrnIR53Qnu4rguAkfwFl4DjWup4zoT41qODhSwDE4hlIr6iXJeZ0ppRlfHSjleUFUVv5wNxC2FcJkGZZ2MF4HBVWJlJ7mWNYLp+CWHjUvY7JXb4XXEu8fzpPM3x4XuI2XiZSUpVNOWZXNyprUtXGQLlJD5etEE8Xx21iVoNyzoa0nHd08SrE1ubsk9fjpH4BGBMyWNQjpNpVjstHxcc17Q62kNQWEUPMFAUrFcgnA8IqXBSC5eKI0dsnps45I4yeoK+UR6lcn0u44QC7pskEZ5k0ZY2U9TFm0-Tf1M8GLNs+G3DINzSHznVBABPY7xRFSqPEjaFJ43mlvJNj7KPYrNbK-WN5q9KGsM1A2tQJxK0g4DG0MzDu3iQdvPGmbQULPMZKDSRG7qQ46HjK4NgJK4sRBLC710SZABiNDsOQPF3uX6siVBPDUBAsACOVxw0BI6DivQF7F0KZfUBXVdMTTdcN03CDt+gWrtA0RuHXHxIgjEvh2JRIJEckBE+M4G6L9yV3Z9RsXkyr9AlyOFBsAPagkGIPGqCQLcaPQk9d3QPcU2fF+V+XN93xAD8J7UA7tPaOc9Y4oV6Bba0T1QQbAGM6W64REB5j6FuQY10yzzHdh-U+dBz54Evr-Sgt9754EfkqDAqB35iFUNNIg784p4IIUQ6+JD-6AMnqA-a4C3Jx2UnQF02dORo1OgySYJJiRXViCsPOsIvBF0-owKoEBlAPEqNULEv5KD9lElHagY4Q4QF4bVZGFJEiW2JLCe09gEj2gIpLOgXgiJOABEyKkii8HLVUfgdoGjLjCDAAAR24HAdim1CojmnNVHmfCFyfAUpuPwWYPDrjtCkMEgxJi5lhIkTxXtlGQDUX4zEdRlr-hBh2cOO09omJNsjAKYJ+qu20rI80BEHALD8ACO23xxjQnyfRbxxSND+KxCIEJYSQaQ1gO2EwFA6lIy6DbC2q5+rpleMMZxdotzQPSBmHCGQk7uEGSZYZvjRmlMCZMl80yRKwHICQKoLAACqQgAAyiy+aIEoi6Uk5EXQbHTCubcyCEDZhGApWW-Ugq7jsKcoU5z1FXMHHMwhlccDcFQFUPgV8XxgwKiwPAYRkDRJjnEuqHI0G5gFvackV10mUX6FyLMyxKIOgRaiFRIyDFXIAEKqEvmgIpFyDE4HQEQYCUTjExONksn5ww+gryCDYGWG5JhIJmERIY7xnFUgdP4WENhOWlG5aKsZdRUXzMrnBDReA+I0DZhAMlCMKXI3JBsGIFEBgtT3N8dSlIYheFWHmZYwb4gmroE2fgyphU+ORbwXU5LTFdBtAsL40ItzUl3AkKYYLAqZPmHnfw2lYEnOPp7ei0aIxxp5ZURNCZXUpsQGmlw8Cs3DDiDhLeCR3hsm8BSSiPhjUVtGgU6tsazUJuoNiZN9TU2TDbZmnOnbc3qQ2GabwMKRgAgmOWpWY76LCjMiPb8rcX7AM7t3JhBTj3VEmhtIBIDVAzz0F840Vs+iwO0sO4F9J80K3+dnDcZJXEKNHR9IUEzQkvlbDQfF4Mn5t0vW-XBBToNhLg9QBDBUn1TxfWA2V88FxSLBNI14wbJjhWCvmnpgiViBBtk9e0R8D2QeOBh2DFl4PkMQ5Q9KNC6HpQYWh+inGH08YJWAPD3DZ5EYgZSjqMQ5jugmB4e0IR826X6HEEYFEKKPUjUIXgA8LK1tFQIO9qgQaSfBiwdsYAoKwCnl3PA76SPEmZN4FcyQuT7PgQRH1TioRfDzIEWEEwjMmdbOZh4AguDOqKvivACoNEFUoFIGVc75UIChFdQRFF7DBrGFddMeaZgy2InLEr8xzS+Ci9QUz0pYvtECelzLuUxTihaDQNz8m3XLOhBbLc+yPh+uGEsAiuZBGDA2CkMk7UHANaa4Y+NrWRDtZBmofsMo+L9nc5SzNLgHBQnmEsFc-6Kt5mZL8DcXxvi2P2ctmLU71u4DABlkGLXRl5CgFxA7ZipGkhYxNiKKw8ZUkWO1SWfwV7Zme2Z17GgBCvnrqgUcNSfvAyy02+diAoQDEWFSZxgVVz7IIhdqFwafC+CwgZCDvcOPRcRyKuLSKSm8HsyQVUaPtQA+WXmdG7Vi1BWTtsgDgRSQ2nGEV7O4wcE3rE8z5rSOZ3s8uZz9s3PcoSqlXz-rzbcsbiasGmE-VBjQ81Qq7SUPBiJHNEEfdHtD0mSsw+nuSGL0d1Q4r13J7Ee0RkwRnhBu8ezHIgsTwdhmNOHMZd-HzTFieCHaqvcURI3vNAoBWh-AhIQSTbjnLFItzNTy87dT5XIjsi-SMPwiRnH2nhQzpRAA1W+lAAH8AjgY-P-PrAhq6fsik9oViJF3DuDIfQ6RumzisbSURWPO-Y-QNvYgO-We7xteo8NJIKeRmbK6fQoTKsCMGwINGZhRFRkGlcwicYrnA2xxn9AJ0sCKeEp1A5XwQEAqQVmYApBcVHlG4xAlRYA+96pXg3glJbEoQaR2pAtXgMJkhVVbE1gF9I0GxVEH189IZxVUBaBlQtcOAtZnJQ8cszYoCFJEEAg84IRHAt5fhBFbsV4cI2RJgndRMTIsDvot88CNQIwKhSCcdd8Bt+8PhMxVgnA9wiZ3QGCAMLF2p0ENxfh9kKJMDsDT1g4KlAI8CpM75Md9pC9vl6oE5dVk4N5yQ05aMAQYhvhk8ogHQitODfchQeCcCOJyluI8CNAnwiA9FalyCTD44itzDsxLC2QrdctPBnABoBgt1oQVxI1rx2BgISAwhWwDYQIwJIYEtb4BAXlgIs8QYJB29dCRJ7xQCICCBoR5INxq9FtCt0gptVhwRsJiYgojM7w-xK5IZ3l2A8AC9RDDcCAV5HRHCItvUSs7Qxg3gnp68RgVhEEujds4BeiRJ+iXxt9stgiV5nAaRGoBhiRnE9x1Js5HRvg9wk49x2oFcT5x0LBeCqh8AwYoBQDw4tpP8hiaow8ajfJFhd4cI7Ami8YzoxhoR5ho8sxUZI1hRfDKAoAsVWwql88bIjBkocBIxFRQD8AyCdiF5fgmkbpYFD5AoZj2oHp1ktxU5H8l9n8RR4TETUBkSwBOx89PxSAYBUB6ZnMsVCUKhsSCg8TjCCSLFAUohZY5EL8fk8xMkM1Zi2DxhF8uChQ4TqB7wmSWS2SOI0TEssTIlcSRCfiKDUZYhBETxxhVUJs+kA1QRjsNgMhbFVURhYTGSkSLIUSOJxM7lIJZlrVqidIwpKINhUZs52pyI7Q9Njsx8LtM0thm88E1SNT3TpRPTvxxMPjIl+AAy2DFhSJtIAQLdmiwUYQlVY8XR9lfhPBaSVTjgkyESUy2xWSt9tFdFDDDEdCczr9B1oQ3RQRnRiytUlNVVAgHTbFp9XT1SGzmSPTmz88vCQYsis9qlYZqiRgmVw0PAJEqR9lByflnELYQ17RzsnolsEyClXxkBgIMiLIwBHiuNfYOJz06BX5r17j6JLzrzWw7yBjT0g8Hg5N8SUIyQnEQyZZ3RRyNg7RsxDz+pbF8wTwEhkiszvz7yPCz1n4XyUM3zK0TJbxQCH0fyHzH0uFg9AKRTIExgmoGpg0ittIgouQ7Rj9mVaQ-McZAguibltRMyCKBw1yUCfIM4ggLSvhNMtUxhMw9VPNJhaR6tzyxNgkYNuLIZEsoltiKLTYogzp2oG8G884HB5CtUoRnA4VpF0xdI7jcLVT-dHzfTHlnk3l3lPcsLvccKXdrL71T0WAHknlpBHL-zX1dAIDGk8y9ND4HTxgiwnAnFpEOQnBhh4yn8lE3cvKfKHKPkBB+NqE0i8B6FGF3y-dPLa47LfLXkPkArCMgK6opCmls4vhnFT8-BDLEA1CSQWlHSnoUhEq6SlERBFRRwtoe8OJqjtJWjFsqQc4ogUlAtCcKJrQXQFtM1SYeq8EUjYA0j6ZIZfKSAnVSFVFb50Ag4+ryF0cI5Wx2zhVOygi44yQKRSRrQithhZtnCdxnESQ-U+oDU7B095K8LUjaFNqRJtrdr-52FDrOIp4wAQYLrscRr7Cid9lVh-hPA-gdw9x9iQNvAKxGptJI1BwTr3dVdvjYlDda90IMEJFORAh05nEDwey8IQzlTXDjh8anlCbWdWtG1hiw8V0mpad5cYF9kgp1InSMJTTAhwtQRvBOKlLoJBVK5vsZ1nzXz8qrKONFKwk5b0VVseUKqQ8qrAcmVEjWpUFnExKWrYh0IVh0FvhVxPRfqhRPwIA19uNeURwHUDEEsBwrVtbbVYtP9gq9J3hTyHA0Zd0ojyNqDXhIKC50xI0naXaQw3b7VkpPb0BnUhwRw7UPbLJWYvaICiJs5gchhnQroiJUaSzdwepyINwcZ78nsHbjgE6sNs7U6vjv9AIqgU7HVYA+wpUC6hgzQJbQRVVXhnRzbwVxgFgAhqzFsLd47naW6u6c6vbM7Rxl626yA1ApBcpaF-wC72LFh4jfgHRFjpTwUTxI9rQEhBddw4gF7E6r5W7HVV6RBu63auLhTuacsS7mQekf0UgrTmrwV6r7r2oBzXhYgI1G76Bm7Xbn606M7CjO9pAN7HUcA96OBe7JVQDwDrqFxLCtI5cRsoS7RWCFIqL-gi0acH6l73a27V6fbL5MVsUNQ8VeNCViVSUD6lg7CDLqQiIp6ZjoqnSMwUhnYfqkq8FxMsMcNpBpoEHnKVbaz6AZHXa5HHwco0HqA9byLv6TDGpF1Go6r6Lvhu0wUnAggXAKQr9EaUhoGpH0MNbiLbNCUFHtHMrsUBMcq8qVG6A1Gk6NH3H6GaBdG318G6p-ILZsxKGWVEKA15hmDLoy6bQlguj37mYvaktyEUsMR3tPsjSSaw8KIV4FIXQtxwoxH49wVodl57cqQ4hsZ0mPbmYNsPsOsKBAwes+AICSmFgp7biGjycSzjGATEhUhgyUgXCCqoMQmms2t2mtsdFuipxemElHcISYFromLSm8I7cGLlVmnU7Wn8mOtFaxxDr-sInkZCsFhWoggPgTwZjnRzTh8C0R7lq-G36WmdZUd0p17eBemQQmpnR0xUnXhCzoKTxSRT7qQzG3QR1HGFKMmdZvm27HkOAsqv7jSTDzspY775Y5dCwSz85mCMxadEhfJpm1bVG5mTn3760DFiCdccHpUICSJoDT669r70w7RnQSQRztICxpZBgjma4g4-m5AAiscjF2W6UWRB1KJMZK9wUSIym+zzR9KghshqxqB064B9RmawANL98rDmRUYroMgV4dzXAGQD8Yh5iRhGp2R8ZnFI00RIxSpmwIATXnhvq+gyQqRyIjx1wJ6goYgy6Mg8xzctxqX3LURThIxSlfXPJBgLYAR+oqRMZbWwV6qLY7sPB1kxYayjWRQus4MwxFRlQKg1QYxNRrMfX9G45gS2roRbiRsV5QUZg1hSQhtS6yRaRPnS2J0tSLn+Rex+wU3FwcYnFZsM0MhnFxdL8hh034Egou1adkgujVFnjRw-bxwLnKjpBkBTgp3RibdSsqMsaRgRgorSRclUF5hdk43l8GJq5mJBJwkz3V5hsyQc4fVBoJ6c4bQ+1CJo6YFEWVrb0bLc7v37t+hbiQ04hq9qm9UnEhhup-BRYfBI0voH0FG-psoAZ9Cz3B1nBXhPNrolhcYLHxmMIy6itoRyJbFkifZqlNZZpA4z3Hrp6DyIp5jB104Z3zLM11hS0h2Znjh+5B5nVh5iroIx54Am2UJF5I8PhQyaC9w9zcsMxBYr8Qz-AKPI0WEf42E9qH44Por9VZdA3qTqnooZs-276V0Bh3XVcLUp2bHiJd0V19UPg+XYQj6-hfhAocOYGo1mxJ0OaNcjo5UTCisukTwV4RYzsaOKsUgFhkh5gLXEEHGoOj0YOIIp2HAc4icz8ximiojDklVYcz95ZSIZbMN1GOHjXlO6o9NVkFsAPxmCJnpBEKxUY6RqQX36TjNGsXtovYviNKUAhBFRcTw9w7YI64FLZnWsxWR2oJOaXTIiqVdaIp2gh0Jsv-BOl-g-Bz7zE3gkhvAQRqcrCM9lyc9Naiu2v99iQSRc5LG1wPBbiJ9En0bsxJZ5FnRI1V918u9BqNpuO9xzXpCNN4qpEJ8l40I6CyIfBVhMDIu39sDw4vaz3yRNILXpdrWIXAs7SityR3vFVx6NDeCXucWbqBEcb1h2R-hBpeviwtOXRJhF3LL42bx-r0jMiiiciRI8ixBSOs2vV0wyx1vNvAtacWKkvT6nqViejw5Ni8Az3gV+hqOfujUswZiQP+pjyRhRthZMDHiH1d3Xj3iVLoZP9SOKISR-NsYCzkhIr81qOMI1CGM85585KkXXc3SZzUy5yvxSPPACZYcIHswlhgHYDmQh1JghWQsXTwvPyxAbzpQiL0LI+uQHpUZRcPh78ixw2-MUbpYJDkKCLULfzirv2cIwRqRlVyRZTWQmLhgWLBgZFQQS3JPaXP7yiIleKTW4JkAWqAU8zj6pae-QhQCZQteUYqIFJdOT7GoMxeWQB64o4iAWqrTp-dxCTY35DmSoByAl+Xg7ryJqyli85slQg5kIB5AiRtBQgFAESL+Wq81ngKz9i1+7+m-YBqWUP7eBZ+ngWEoV3uT2U-KHyKdu72QKNRUCK8WkHy2iBLBWC9hbwG63C59Us6kPenkUwoKgY3gV0HvvzUMbZgdwJfAEikHGATAHm-fbbmtQ2rhxga4vHiGDSgDcdyQTUG+j0lnyeZtO0saBI+0SB5hzueXPxqzXRwTc1sSMOLuYHH4-IrYYtR5rTl3RQg80C-JflEEahqDbYE2E8GyFCA784Ie-BAK0kjyJBVgGgjwFoNCBn8v+swWICC0SCGDHCI5R-h3hf6zAXQ7-D7OfyX44xQgXQPQW4ISBWxPBJgixqoOdDqC4g9gnCI1yEhQR5aOtUVMV0dwYRYgdgZGjhCIgqsHQZ0WEORALCPVZitDeBto0d6vcugQtM0CCBnwpAwsEdYXP0HipD5fgQQKQaWwCbsMpMmjZUNoynZWs+BbIARnLhb4JM-6QwfqMIkgZZgxWTWKdvjDBCLxz8wZAWAGgL4oEr84HPvjq0yBAA */
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
            target: 'Prediction ready',
            cond: 'isLargeAoi',
          },
          'Idling in retrain mode',
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
            actions: send({ type: 'Abort retrain' }, { to: 'websocket' }),
          },
          'Retrain has errored': {
            target: 'Idling in retrain mode',
            actions: ['handleRetrainError', 'hideGlobalLoading'],
          },
          'Retrain run was completed': {
            target: 'Idling in retrain mode',
            actions: 'hideGlobalLoading',
          },
          'About button pressed': {
            target: 'Idling in retrain mode',
            actions: ['clearCurrentPrediction', 'hideGlobalLoading'],
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
      ...guards,
    },
    actions: { ...actions },
    services: { ...services },
  }
);
