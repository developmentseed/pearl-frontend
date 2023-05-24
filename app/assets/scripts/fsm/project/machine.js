import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862Jy7wTJuXiwj42GePSfxssy8QZkMjj2GMjjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPBRUR0MMQxeK4bI2GMW7hIgqw7vJ9hwqe2ZKZm1ECqi-qihcaghpwJDIAIACyNlRjgFmQIhdwpo80nWHYG4uAMyTLqsBaAhpCAnuaYxumknITP4xkon6woAOokG0VmyugKo8cwLCZSwKjUDgYBiPZjlcBGEDoG2Wjie5KFed0p7uK4LgJDamb2F4DicvS9jjO8Picr8fgqU48VXmZKVpTKGVZbxMp5QVRUlX+cBcUtxVCVB2UdrBeDwTVSaSZ5ljWOWfilh4rgrFC9jfL1-w2HQ12svMbx4bu420ZNqWWTNeXZQtKobStnGQPlJCFZtkHcbxu2iVoNwzkaUmnd0PL2C1eZQukXwsr4BGBGCuPYbChZ2p6Ow0aZwo3nDLYw9BYSw8wUDSqVyCcDwSpcFIbkEijJ0yRmzj-Cyp6Uv5bK9XCfQ7iRrjXYyRPnlTJmJccdN8QzwlMyzUBsyGHNcxG3DIPzyFzg1BABPYz1RLSPLxFEjKOITrz28kI1QjabJfTTmv01ZjPM4DhtQBxa3gyDW0s-D+1iUdgsmjbhYLPMfVLDm-z3aFp53eCrjHoksRBI4vj+xr9AAGI0Ow5DcfedfB7rPDUBAsACJVxw0BI6ASvQl7fcKtfUPXjeMTrUHQW3HcIL36Dau0DQW8dKfOyCMRcg46xsskBE+M43wbxMqzJDuld1jXw4UGwY9qCQYjcaoJBdxo9ALwPdBDwH194LfdcH5PwgC-ee1A+5L0TqvZOqFeh205LjSkGwBjK3pPmGIi5brli9qrb06sr50GrjfBugDKCP2fngV+yoMCoG-mIVQs0iDfzHL-QhxC75tHISAyhYCIGqGXnoaBHkU5KXSHQcsRcEgYzalMUKkwnrOzurEFYrhYiBEvnRVaEBlAPEqNUHEf5KB9hEgnago4o4QCEfVNG0ImRF2duXdkmM-ghRmGTPorJ2RxGUqCWkGizJaJ0e0PRlxhBgAAI7cDgGxbaxVhxTlqgLYR84nBPWtN4LkuMhhvAdCkc0gxJh5nLokfxwpAn4GCdiOoq0ALg3bLHPaB0rFWzRkFc0vwfa6RUZaAiDgFh+EVnabB4w-ilPRFUbRFSNAhJxCISJ0TwYw1gG2EwFBmmoy6KsAYdA+p9XZIMJYnUHTHjJG8TG5F-AJArheFhVdGATKCdMqpYT5mvkWcJWA5ASBVBYAAVSEAAGXWULRAHoFiFkxtmJYisKIhFCssJ64w4gDD6pMYYYzSgPKmWY55A4Vn-wbjgbgqAqh8Dvq+SGRUWB4DCMgBJSdkkNU6nYeSbwhjO1BKyVxoKUUxFZMMRIO4bBwgxfcyAjycX6LqAAIVULfNA4rsX5XQEQEC8TLGJMths0FKxzSskZLY5qG5ZEzExn1HZ-wUg8lLoyBENzqZ3PKbo3F+Lb7wT0XgXiNAuYQHpcjRlaNqR2x3OTbCUQdzcoQHdBI+4PA2iWJMLY9r8F0UbPwFUCrJnOt4HqBl1iuh2gWKpP4m5ro7gSCaxABZ8nzFUf4XSiC7VqwSgQtNkZM0SsqDmxM-r82IELS4ZBpbhgwkrQgBWfQrneGhBRHwNhRVtozVi7N1BcR5paQWyYg6S3HhHRW3qGxzSeAzHCEYit4SipFBZKeb8e7gP7oPW5BCr3VD+ltXhi9+FQM1WvecDs+iIN0nO0i8QD4ZB2bSKI-gvHzFFW+CpEh+FWRoBSqGT48oduxQIL81BUNUvOLwMeIZgUmhOUuZ2yRvFeEinSUK0ITzPQpBuBtzsfBwYQ0h0MuHKFodmuYrN7RsPccpZiGZYQSPznceIkiGNfjQiiARFIzhYgOF+MMLxuCf53Pg2oRDb6UM8apXxzDDwBA6coHp4JXyODUMyq5H9MCGrOxSC4VSSxoS7kzDLJSdA-CzuGOuLqTa8EtrokIQjLYTOCZfaocGBmRMsDbGAaCsBF4DzwBJpzzUWrYQoksLwHJrr+AIn1BYcJ+U5k5MpedybQtmXC9QIjMoosaAEFwX1JUKV4EVHooqFn7Pru1eOn2OzegZL+EpHcB8eTyRQcML4vxRUNaa-xiVYS+tSCAhQIMLQaAZYcwGrokJoQxGVkpXSwryyRsNYsQKtjYRfC8EtiLVkWurpEBt8Gag+yyl4n2TLNj-BPUGL0S0ngFN0eg+Iy1G4hmXeC1pghy3IvLsEx9sA-WgJvdHOgKAnEAdHeas4ZlRO-iDA3ARNOrnMy4x+OyRRz3Gso8VaZt8M9UAjkadMhVtSNWDZBcNuEzJYidSCndPwBE2RHszn4SElIhiaafWFl7zXUetadVZkgHBZSpTEAN3tG6q1FzEa7XcPh1gkUjaVsEqihh3ShKpE8lMQsTWFMj17avV0a6ebwRLWuZDs51ATqtSlzQsmo2o-4KxyK9UGC1DkbI-CqUmF1RnK23uRwEz7sxbZ-c4BVWqoPB2+3jvNxaV4Q0gg7mQb1XSR8qOUgGaCZ3iO6IxbfUPW9H971f1b2ZdvKOaIfsgYdYPsxjXl7sLjLx92CIdNu+RG0wrdxRFFQCsCQF6H8EEpBXNBuhudTGIxxWqlTwr4JqFbMLJfP8sXHsgpa+N8sC39Era9QkYSUc60uIYJYQ8lpPMNhOetuKyAsORA4OWrWqSI-uBC-jvuxJoHiPvgLrYBRIsKATmJ1HCDmCsJTkLlENRp1K8P8LpAjkrmZAAGqPyUDcLSA7RmK75j42xOD9LpC-C7gUS6RFxuyX4ZAeJy5FwrAXY-CipUFiA0GxZxwMEIEf51SG6NR3R9Cwhch+A+Di6RpRAzbeDLiSIsjLhPa1au6azsAgQkBhAthmygTgQwztaPwCC-IgQb7gyIbiFAQwwPh65MFk7vDfBQgkR2DkR9Rz6rD9DzB-7kyFhLb3j-gNwwwArsB4B76f6HYkiDCLBRABCeB9RjCRoghES4yJBdSEHKxRG-ZwCxHCTxGvjv784pxcjOCUhXQDCsZsHpC9RFxOhvC7gZxm7ZgLoWDTS9Y8ZQB66xw7Q+r9heH+SLDHz+ERpBGQ4XRjB-DzBT7Zg8iXoaAPhQDEotj1K752RGCpQ4BRhKh674D67JEl4ECbDmhOA5gOCBAZin7FiZjpGQY5zcgt7kHCgihbGUA7GoB7FgAdi75fikAwCoDMypbEr4YcBnEFCXFyFDY3En4QbLgAgKxcjHJbqvApBDBO7h6bHUDbG7FWT7HsSHEdanFxIXF87IHryKx3G7hcji7PEU7wqeDEzeCqQjBsgZBJrNpGEBj-GAnAmgnsRzJRJvJuEfKurkBeGFgRQUQbA8hFxdQckzADAZiuaCoYklqCku7DzHB-EkkAlkkygUk-hSmv4wwdbxJeEyaLAkTkSbCDCsgOgbh9D+ByaUTUbHrEmklAnkkglv6GLGJc5mI86ASOkzYzp-Bujy5-DHIljCqBBUiYzYTXJCnGkilmlikhkSk-g1JcSWFP6MwIxMEjBoEFaJATAanKS7i9Rco7L3F3TjC4wOCBnmnBmWmhm754qrKErEqkojjxZoY0p0peGKwLBn5n6qL8nFbwqkz9DgEsiuleJwbIAgTmFWRgADGvg3rdzd59y94-HHBvjbliC7kyj7kJFTzD5fqj7F7yE2xiLUZ-6h6cjUYbAOiYE7K-CYwbDgEJCip3h65vp3mHktw-jHl0CfyPoOoELgXDgthQVvqQSPkPArwvkomqS4yjaTCrC1mFhwgOjKH9CJA2jYH4wGE5msI2kyljFxL8BJHIkoFRBFx+SPFBCnjLBwpaljBZj8rOz1kvTZlGkMURLSk6jMUQWTGyFJLXEEEDR8kshsiqKqbkUnZCpKIZj6SK5IVt7XowUsCfLfLSD-IApd7wU96IUpr94mUyhLJfI-JWVYUCK6Bj5OKsFBAnikU-AcjNnOytQTBKbLh2CXpOWxzmVuWAoCC2a0KmF4CMLMJGWOWvpTxmWuWWWAoeXfq1HzjsgEUjqkwFY7wX5anYHPQwg8hnhvBRFKgjj0Fv5MG6QhFdSO7Hjhq4yS7bLkSchXYsglrfHpW0wmH0LMwwwWUkA+pcJkKgQRwiAUoc5xwtiRnmK85tX-DE6ciH6LgrBBAgH9UghDQcjbyr6GG5n0QTVmGxwzVzXAILW44cSLxgDgwbXRlIlKWvl5adFsHEUeCvBjo7hsHyTfAsFuhhW6SioDiUIc7M5Z6rpj4jAXQHLyJSKBCx6sj7jxl4SqlURXWsJw3fId6e41EMl-rXQtR04ZAIJsGFi15cWMgBCqGvDGpRGvKc5yoNwZ5wUIVpUOVu7SWv7QQ82rbYr5XPmFVMoTarkjCHpDIJrkXNQ7JXTIpwipBRGeqpSSqhKDkErUroAS0jjtZ+pXHyFDCMihGwi9AkTny9QTDmgcrL4kRvD+Xa1ep604hDgjhVA63eqkCcxm1j7LjlynbZbZKnygbwrV79Cy66rrjopE13IiAB3e11BvgQBAT+1e1mW9hqqh0jA24-47UV6xB-nW2ggRX5hJ7xCe261iaDjDgep51kC6bSA4D0IARF2-DySuwPYJD7rwqnhKEJ4UyOykEN3erPIOG0Gt2N1d1a7wkF166wBF0EVMaGSkx2gOhQ3oFljYTMaGVC3HBp150upDn5QjmajkqGbSCTnm3sUmjLhDC6nCFBAQiemnjyT5iqKHzQjT0Z1hLp16Jc3fVaoC7NR2gWqJC4wpCdltF5xdR2yxDliBFqSggSV97C3p3szo6Y4L00ACB5B45rRj7aD0jaBAP4O4AY6bZEOrr56qryVj7kQ5j9BOBOAlrsgpAOjPEWgCqcjvRew0NGxm2daULdZYh0OY5sN3RpLoP4U-DNQx1amvB2zDVhpKRujjBiNLWyMMPbaSi7Z8DyOBDgih5m58G0ZamnzPS6N2DHgp6E30Wp3Dhe20OfZATfbRGTjyObi+YTAHLlwAG5EJmLBXTUYniqSsj6Prb0PgzY6kP464UC6BELDtTlx2h36VU6oTDiIbCDIcEjSjWn30Dn263sxs6ZR+28BsMggtSMj6VQih4ODFjKStmKTeBBAsg1ZuNI4eNVNGyVPerWYsCJUQO-oNQJpyw7gdKTZOIOilziKkQ-BwMuzxOjM4q+654cDMOF5TNf4FpiwWgcgjBQhVYZgOiMjA6Qh16FjyyDDxM1NyAmIHSbUxlpMmiHJiIjIYM4xjrZx9AbCJmWiaVBDsa6acZ30iZCZ4aiaoAq5MH-mOPxokQxQCWRDZPiLg5hVKOjIp0ELmaWbIbCZQzwv31RhVJeF2xjA+ADAFIIOeBIMzDZgrDiKrHaE+wQhQsWYwvjlFRmYca6LjOTP0kW0okPaROuwghRCAVqORBCGcNVaqZ1XsjZBejUDoC+rwBITnlgCU3WzOLEwTYSxqRZz0gEA6l6FGqCH0ZVhEuaKnBRjlRNgQBGtow9DCoWq0gbi8lrhYsICFgxDtkZCvC-BCpkFjXoguvnBSqevPB37PSqISI4y2NKsFYzHOPDRSx0WSV3KBiSgthhgKhKgqgVDqixhaixYeuSscVCrOl9NsFQp2C153EuIs19QvRlN1bCiLrik44Cg9h9iJveQGS+bk7FoZAYHbh27PTIKFgwg-DJBRHaJVD4BG1Dvdh5AeHSDICnBjvdD+B9Di5ooZIjAjDFh2wBDQhFPPEchgVNxMQCQxJHs9AhHsPHgDAIPjDbj4nPSwgaWVZLD9MFvPrRVB3vs+Rh5dROKxBWqwj0j8pBNCUQ2SxsZOs-SDF8aAy5TAwiZiDvszrODKSiW3T5Z5NRqJAYTtlYEgjkSGk4OBzaymV6xhzSjvuH6zlcpRQFEzqx7X76UlrrANq9vCmEJ1yfITzNzOWty8AdzEcTvNTtUeD3O7istVqZiiyaGqmXL-CipEKG2kJcIvzQeqbyRO7nYMeaH0ixTiIOCMsqbXQDCire4Z1HtcOTrHarCpJdRkXwqggtSKwLkvSKybgLpNhLos6VK8Cec+C+anismO6qFUc0cLDJBhGrDKz11Ye-HRWQRHsQE002j26DCBE5hgbenxoFZQiBAul8uktcYIvobRdI1Ff6UuClY-tQh8N0ZvTiJQ08hAGghp6I0SpHsul6rUah78lnw8FuIDdy4s0jfRvlPmSZUe40RHu2jPRZn5w+BfDXa-BiJJDeAggFasiQgwGb6xbwFfiTdpHjBH12CYzjCTDbgcioPfvQbXQrAat5fHBiESH8BSFbRce7i-5OAcFLsbDtO8GbzoSqK242gFbifXU3i3U3nARWGylQS2FEf1vry0jvClxqaZLyLXY5iiwAgZGHiRWA8VPRHlGxxVF4DvukT9D5YeAZjbyacIAggwMncKOsjIoFb9GDEbvDGjF2lwwTHEfgGrnxr04pDKRBuQjX7hsaOUbCHdkFl9lFnEdcn7h+CMjT7fBsHtFC6zpEX3Z2D5vMf0CXk7loUHkYXfhG9C7XQ8gQonh6HFghvYGeAjoAhrd9uawsWu-3kwXQdu0LsqE7Xy7YTkXDCUUdHKKN6c0yXvKxLyWevwTIA6p904w7g-mbj4QgB66yjs-oyUS-3HorBE6FKhAzwJxECgrCrmgl-eCUjl88FAlQDkA1+2AJANHafFG27XMgArIQDyCRDlihAKAAlD+gqyLPDlhg0bgN+FaZhT+CXF9k49-+ueBRWbdydQSxW5UApHv7JiLLuQjC-Qiemb9jC1otu25h8SfLUt0tWFdE+oS7IxECjTwLTQ8CVdL8fvGYsy3rLNQHeBrG6rAFMJTVhID1AntxGepQAuOlqQDt4nPhw8Mg24QCuXiKYlx40MNRnnQBJoI0PcMXVGJA3MAF9NIDsC0ACCUTnocIoQKvjXxdhNNEgFGALKPQvyt94I7fajjaBYFO4fg7AkiKEAH4r9ZgCHCQfwIyJplQgM-OfrMAX4gAl+g-GviyFCBdAeBSgh2CoMhCx43QEg+btILgExsmeXNGCOLTewdcCmngTcGemaaJ5HaF0UJrEAhQ-k-YFA7ZmJiPYZASwHgApHLi6hKxmyDgVzDAJJh5Z9GR7ImM7ShRo9G8FdPOL8CdBFxNCykVcDaEa4CtyWRULjuIKUgpBLs1GAYF5kvxOAsYwqJLqBzmCehsgQAA */
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
          'Activation has errored': {
            target: 'Prediction ready',
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
          'Instance is ready': {
            target: 'Load latest AOI',
            actions: [
              'hideGlobalLoading',
              'setCurrentInstance',
              'setCurrentInstanceWebsocket',
            ],
          },
          'Activation has errored': {
            target: 'Redirect to project profile page',
          },
        },

        entry: 'enterActivatingInstance',
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
