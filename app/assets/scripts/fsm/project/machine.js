import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsbLjZBaSF3S7ARQdNaYayxDWrkmmy1KHKo1VJjW+ZAIE2YUCDC0GgeASVdKCH0Skmkcy-AGIaqKMwnBOCMqeQ1x4nCZ2NY2fgKobWmqqbwPUCqbFdD3i4TMR5lj9KHYgOEdhFgbmGN4DYp4vCX29Oylis7IwLu5ZUZdiYM1rsQBuncQw7A7uzHuhAkIMhYVwuhf4lJXgZhnU2edNyzVPrxC+hJ67zmbs-dmbSu73Ybq+OXb4dFvC4WNSKOyU8P490gf3QeJSOWEeqEDXaECoGqGXnoDtrVsyFlUiyOInJBrYV-dCJYWEeqMjwlyBElbprCjfJUiQjGHI0AlXDJ8xV71IoEF+agCmpXnF4GPEMLGsbHjtBaF2PqPo5jpHpaEJ4vYUg3MZF6PhjVSbUDJ2j8mqGKYWhYxdGg1MaY81prEvL9NbIVuI5W0jfjQiiO7FIzhYgOF+MMdku4nPSdk6GfzkrpBeZUw8PzmnpBkBc4x+Z2KOCyiymIbyrq17zh3HdfcUIMjaWUnnSzqrxHfCiARIIKxHDGqEDplseX2gCGo6oaG7nsssDbGAaCsBF4D3bbVuBrUqW43QthJYF66IQvdkB8RkwQQ5k5JpGwg3hsOVG75rgabKoSrwIqfR5VKBSBdauhD+6oTmlMtCPwfwNI7gPjyDjgxhhYfiJd6gumZQ3eoA81772SriglK2vgIXvs6qooEE8GFYQrAw3CRY4VoSwkSH4VlV8q0sSGzDkb0GxsiCRzHVH6ORxiHYCtz77q-2idUtmNchYwpFks9vCmNoogwk0lscTw9jh09h957liOwBvehmoPssphJ9kx3z08Lhlw2DhGyTwMXLP+DEX8RIG5XbG7hNDpX8PVfq6AvD0c6AoD8T11S5wvVcNoKGI4d26cXAfuQT8dkSjHcM9tflt8M9UAjjWfMm1ESPvwd55CYnSxYgEQio9Pw7s2TmlPoEKEbpQRjBj9dxnvma1lZIBVqrNWeffL-fRZJ0Jdw+HWNs56QQvZbselCbSJ5L1-1KYr2PPmEcN+RbwWbTeZCJ51D7jJ-Re+xCWN4-C+cOoch3lyUEPgLty7YdP2vcexvz8feYtsy+cAOqdWv1bmatm98oqCH4QQdwbHSANMZM4D8IaoRDaMkKCBPpRixBNrRkPCRl-GRj-JPlRkRrXkxPRovKVoIm-q+rMOWJhMCsRJpE7CCpZiyPYnaLhLdP2gRMaoSmBEBAwvwOJJBCupnu3nEGIiCMdoWB4MeHhNuOyJhGyJsMMJsB4FDufqUgweBMwY0rtPUGjHJGtrYkMMNNbjaLaMuLnNuFCGIvgvhN1JuHQdIRyrIUwZNqwbxJoHBioe-j8uTNkskIauSARLCNuFulhMdsZAkHEJpFAfChygAGrPyUBgL8DxzmJsF652xOALCsi-C7i8aJDA56SDD-AaFOytbGRS7GqhGc4RHSD7TRE2HKHNRfZtSPQnKQgjDESF6-pRCg7eDLiSIsjLhU5Xo04MzsAgQkBhAthRKMFxx3bPwCB4ogSMHQwyaFFxwPjVaxHHjzClgsjDAyIFIXrF7ZjiKDRoZ9p+LGo3i9EMIDEORDExKSSjGVQiigRKjATRJAQIxXGLE6FewyIyLoS0i9QAHkHJCqSZhDDtEeBsgDZmEsRHGwB9GnEyjnGPGXHoBgLXG3HSCwkjEInPzPr2F4G2AUGAYTBRBUh4Yh7RBEzsiESlwgmDb3j-gNwIyEpc7sFYmVEED85cj+DlwpIna-onbcEJDzAjArBqxUna5wC0mST0mvhKFt6pxcjOA9p0QDChp4Q-HDonxHqR6Zw96XJgk2T1gWBzQvYeZQDVZxz7Spr9ixFoLvDfBQgao7i-Luzl4cZ-D8mob-CBHXo2QigaAPhQDCotgrJsEuRGBZQ4BL4cBKjVb4Ct4cHrxRBgggh+Iuk5i56grOB7a4RRD+CPRn7U4SbHDenUC+n+kOSBm8RfikAwCoBsyLbCqBYsCRkFAxlMm84ECbCYTYQ6F44aRchHKTAxC0irjj4UEEY+mUB+moABlgAdhBkIk7QVCNnRkZ4tnt5tmGq-a7hciF4ZjaTB6BqeAJl7zDCsjjDIKjlFnjklkyhlk-iorPJwlQRvIfLkCWmFixTYQOLrHnIbhHIZhh6pE6F-BxDnnFmTmlnTmKF3nWHNLVb8CWkRaLDKz4TtnHZFq-ClhRZjCnqeCdEoEwFjkTlTkzm8RGImIp7mJp6ATwWg7Qj2aV6gh-BHIljG6BBUgfGQggWXlgXXkQVsEbTp73HDGxJmKLEXrmgXqJATDfmaS7hZLsiAbJFLDHwMQ6nCiFmgVEWKH8rPlCoiqajioBbSAypyqWmgFYT2kNa7jjD+AOjoR9B4Snicb2YVp5ny70D1qNothgD6mvjEbdyIF9zIHQE2QeViDQksDeVc5TyYECIry4HMm4TDQOLKyqysUbAOg5jkxOA8h3S0XFyHEtK0aRW+Utw-j+V0DfwUZBHgmFVeU+W0aQQxXYFxXSnwJjC4ztQXr54mRwgOiwiFw25fRH64XBXChQU6immFUWnxWtlRD0QhQFxBCOXaQBozAnZZisgbBjIZJ+BUlPLooPmNywUWnlEdLYlRDXTnInknnkSJZ9U6o7gFzeD4RfoEZoEyivLYq4oEqEoIEVVIFVWelqXvVxxYo4rSA-VNUPAtWxnzjLBZUSVzUA7zAOi-BHxLEXp1EeBvU0ZTwNlfUQ1EoCA0J5T0KMJ5TMJ4Vekg2fXg34pEpQ1Ma6B64giGrDQXqn5XQcjtZrVsmLA7bkSQrkSwquUX5wDDhRGKGxHGSrDDRBSSJRDZgWYzB-B-KUw-ZAZAUendHCgQlQlxzg0kCpoUI6LPye4PISpJ7xwtjkUWLp7S3-B+7caESLgrBBDbisiYS7jf7q12BRCHHHH9EG0XDG2gI8Lm1-iLxgDQy22UXNkVGtnbZOhYWrAaSeA2ieF4SqTfDxFuiqrGTGoDhUJJ4z4q564jDXSDB2jnJSKBD5ysj7i0URZDCwigmi2lJF04pwF14I6YkJ3t7HgeKR4ZBIJ4SFiAHzWMgBCU6vAbgjXVU2TjUwRWoNzO7lWVUsIL1jWPJorJ4r3K5IqM0wIzXt72YLB4QCl4JqzjB9UH40GaRwipBUlJpZQ8phLaWCoJp5bmks22kWgi64Td7pVuJSKLCgEArHgRqqUK7DjJpv04hDgjhVAv0pqkA8x3bporkmjLjsbH4+CEQERjDxDFjYQhROA95JDHjP1wMLJ1BvgQBATIM0OwC9hOp67LhQjDS4SOgEPgEOhche0sX4MQinjUOv20ODgS1MPiPFbq4lQMIATsNmTgrlwEkm5OAZWbjDQxTdK9Y4NiMpr3ITFFGJo0M4AKMRmsPVawBKObzYTILoTnJ4SZio1GaZnaSUiPRGrQP0AiAoPwN8pxoNw4DCqiojjTaKbGWYP93YMsVeyUoFICkJCgrmhJF+C3XEEGMBMPL+P6L7Wv6tWtR0RuMGrIIpDILZhZIOAUzlj4T2MrUi1dH5m+OwPiMoo733mg0E303Eon2kp3RW4t0yLWU6EDQeALDLhxA+DILJba3NN0B+NwNczM5q7I7SM0ACB5Be6bR674QsiboaT2O517nyL9ZYRfFT1iWMhZPLO4CrPQzrMI5P6OrHW7NZy6r4T9rJEpC2VaOfqP2fT4I3MmwYMPZUJPZBYs7LkxPzhQo9K1PaR9p0TEOBqvDkwsgRYjAjLjDAuRwrOu4o4troBtpvOBDggZI94ZCJAOhkzxM6RuCTDgY+MLOtPNx4t3MEvNqSjs4sCc6vhvMTBbzbpEz9L0gdFghXUsjZjjCngO7MuLOv23NQvSrGLUmThvNaNBA4M-BOwnh9U5hgN0SEQnjaQELyusuw4u7I7u5bPe59Owup2qTiw4aLgkyBqghgjlibCR4ETAq4sCAJ55RIO8C7Os3GbOEpVrHFiaR4ndQjRSv+sKsprlYRUip5Tx1nWVFKWKw7i-C44-rcmlyeKZiUrnZ2iJsWt37hn2ovPOp65LAqTeBpKER52MgZUrB0vzA6F4TnL+uBtyCmLHR21UX2utTArcGMh1NvCA78OZFESUiWi3VBBpYlZuZZZwwFaGVRioBXZQCxGZVHrLAA7aGrWRDYZHabiqoIt-ArtvYZYGXZbjZs7EtioP5qgNqc4ZtuqrlSuLB+CnqSIZgDDbh1H9DJAFyfC+vz1A3HDOZ3truFabszbnDBajtYxtnOAFosoYT8lrAnORCEPiIXVduZnPW3uuYtgRPlRIeKayMUeN7N6UDVbQuZutnqFHhlsyvYYeDbgSJdZlw-Bj5TpOYfvhVcto4vt4BWus5EttqbMYDbOKNoddD-Cg42iGrqLp2E5uLKTiLunUhDDrk-RNNuV0ChVifPtyeBjcuSfVtOQgSUBft1ZKq1M2Zbm46ClyI-KfNjrrFToDC5kmdsK373LBksPKDVsUCwwwAsffsmgET7Mj0jKGpnZef6Rp3aMmuwgnhdWwpejUBznwBISjW0Cw22wyLE6SyY0yxngqnWCy27inInj8G4QF3MsYhRg1RNgQBlfod+19C4S0gbjaQeN2hivkxQqnmvC-CPVibt3VqnDbu8q9fPCutezkQSL6HK2RA2jkzdYeBjSyzQc60Fmo6UfhhKgqgVDqixhaiTY9dYPwKPWIVSsX05h2CAG-YXxT3UG7cQZzqaVDw9h9greBTKPnKfpUgsjQ-bhDAOz-6Fgwg6uy7ze05cpVD4DSroAe4Cge7zHSDICnCg-dD+ADfqzkl+AjAjAkOCZQj5iMp9QFXsQ5ZcTQXE89ANeZnnblM33pEpBghSKkl2gNs433toPs9BTmiverA0S2koszCbXDSAmcj+AyyObMuzS0ZeagxFTgzZZiDs+0XOAP1V08g7Y80-KJDvDC5kn4z4Qo9BelI6zvKlUwRhxLQRzs+EMLAJePQExSJ75uLg-IV4TrDOXGqjzjxpqTyu8zy8AdyG-c2dTDNbo+D4d-ol5dYtYKw8ER8kIPxtAm1vwS+JaqTj6HNkpNFitDRKIBcJYDOBdU2BI920PE8jp9AwrSLdLnK9XusdSuG7hvQaeN8lf0C3pQbX53K8DE+Fhgj9Y4VSLjTp8j4dXqRBApfkht2O+oG42lXE-St9CsWpXda0oq39IC6UqGc4blvMtwcUdybrtSq5Y937-ZIuBAYDrMoW8d6ERdYMXuGqwa8cOF-o93WwZhxKhEDJKblWA-BYsv-U5Jcxtxzdt+MBEGkPGJ4fRVI+JMDM4jnrF5roj0DFvCGUSgh6CwxeQmz1AG2IbQ-QJIGdkejhQ6uswCrgOTdAnZjw3IZAU32OAFFwik2SWpBC967hPW5DR0E4C2qNEMgpeb4D6lT5dUA6kJE4oMUmIXEoIVxCXl9GGj9pc8nzakAdkehewnGbwUguhGFI0k44EpPAOzwzAJkBa4yARkwM9Rbx2QXIRIppAvQzp9StGDHkaRNIIwzSGDQ3t7Re4pJWK-wKEI6X2bugcOwtAuJxUIrgViKX4Q3geX3BJlkEKZQQiA2JzYQggElKLHYGO7zNzOdVKKnvyoHPAFYAvM9IWHeLtFiw7GE3OnSVi0QCqsFUoSVQ+rfgJeysc0HdFcGO0F26EPqsMH6AAUVElIIoaZ3GoYoYKrSXrvBGQAeoNwh-NBKemG6eBQg1WWUFYOxhYV-iOFQUuRHGShAZ4icIgB6mNzmh9CO4MApez3KTkoA5AXYbYD8IHDT0HIY4RmFCDvIIA8gSIOWFCAKBxyzwj1CREqH7CNwhwz4ZmG+Hut0KNw9YfcNF4NVMU3TH6sTxSxiIRgGQEaP1Xl4eoUguMWpufGNyK1jO3AlpkqBHAlFdoXvAFFhFEzlxhBwJb-pOgMKkhxgUlI1goP1oIxDaodQSOHSgD0imQfhMtPRC2pap0ivwRBPTxLjgE2uqPGyJ3RLpX5Z8+-UQjEFETbxlYrIb-u1DEQBEz4sQQmKsD2q71l6gqeHK-0FaeBNwWLRkNdVJjXRy4G4HqIQzGAUjR+LLXJtUhn6OgvYODNWJLlVhVNyYi4SYMfDEqNNKRvopZiGGJ7qxg02YQIGsGMIDRfgDKFcIkFOyTDyO97KjmAC940CVYXIWEIRAGAuN0iU6bBDyCzIBd3iInTyg5HE7s5MRwwa0syjZDrh6IriYdDg3BAHkBkNpKsNkEyBAA */
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
        drawFirstAoi: true,
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

          'Mosaic was changed': {
            target: 'Prediction ready',
            internal: true,
            actions: [
              'setCurrentMosaic',
              'clearCurrentTimeframe',
              'clearCurrentPrediction',
            ],
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
          src: 'activateInstance',
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
              'setCurrentTimeframeTilejson',
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
              'updateAoiLayer',
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

          'Retrain requested': 'Retraining',
          'Requested AOI share URL': 'Creating AOI share URL',
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
              'setCurrentInstanceWebsocket',
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
            actions: 'hideGlobalLoading',
          },
        },

        invoke: {
          src: 'applyCheckpoint',
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
