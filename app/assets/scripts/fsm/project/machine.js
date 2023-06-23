import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862F48Q2HQ9hjPY6SOPYXgbIEUzhJErhxBamYYbEJ7uK4DjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPNhUR0MMQxeK4bI2GMW6kQgqw7qp9hwqe2YaZmjECqi-qihcaghpwJDIAIACyTlRjgdmQIhdwpo8inWHYG4uAMyTLqsBaAnpJ7mmMbppJyEz+JZKJ+sKADqJBtA5sroCqQnMCweUsCo1A4GAYiue5XARhA6Btlosm+ShAXdKedEuAkNqZgRDicvSuGcnQPicr8fhaU4KVXjZmXZTKuX5cJMrFaV5WVX+cACatFUSVBBUdrBeDwY1Sbyf5ljWOWfilh4rgrFC9jfAN-yYXdrLzG86GeOeOxMdZGVZfZ83FQVy0qtt638ZAJUkGVO2QYJwkHdJWg3DORoKRd3RXa4ql-CsOZsgkj0DRM9gxPh6nrg4bxTcxNk3kjLYI9BYSI8wUDSlVyCcDwSpcFIPkEhj51KRmzj-Cyp6UqFbIDXCfQ7vEGl3YygQZHT-3HIzInM5JrPs1AnMhtzvMRtwyBC8hc6tQQATk-RbrExhdrQvSkKvHQjtfDmV1spraXa0zDks2zoPG1AfGbdDEO7ezyNHTJp0iyaduFgs8y4UshOQr4A0OO8nzHoksRBI4vgB3W9AAGI0Ow5CCfedch-rPDUBAsACHVxw0BI6ASvQl708KtfUPXjfsXrUHQW3HcIL36Dau0DRW2dqc8pCMQ8myX3eIu7s+LjGT0YWIJun8nq-VZgc18OFBsGPagkGIgmqCQXcaPQC8D3QQ9a7feB751yfi-CAb957UD7kvJOq8U6oV6OTTk6Q7qUj+IMSE9J8wxEXA9csyRWSVxYtXO+DdgGUGfq-PA79lQYFQL-MQqgFpEF-mOf+dBiGANIY-choDwEL2gSdWBflU4aXSHQcs9EEg8nsF1EiMxJiYQwo9WIKxyLly8IQmyG0IDKAeJUaoOI-yUD7FJRO1BRzRwgEIlqWNBoLA2MrcK5FCJuz0jI2k4jWTlhkd8PwhZNHCm0bo9o+jLhRwAtDC2oFwIsxRtYm2tidxiM8MZP4-gNK0gGhmcmtJ5iOmzK8fxF5WE30YFUHR+AQnYjqCIAAjtwOAPE9oVWHFOJqwthHzicJha03guTIKGG8B0KRzSDEmHmcuiQAnonKcEjQoTDFQyAu2OOh1jrxMxl0ZWBFKJ0Szsgj2Dpsx9EhHFLwBdszTNKLMyp8zqnCDAPUxp0MEawDbCYCgGzRaIFWAMLC7I2TtSWARI5KQvZvBkfhfwCQK7FL+qUoJtzzH3LqQ018LzJKwHICQKoLAACqQgAAyXyTQgkzC4H4cJ5i3X6npQZTp5hjShPRDRcLr5VzKZAOZyKDF1AHO8zhJVuCoCqHwB+r5YblRYHgMIyA2nJ06a1M+mEJgnliMrAuGRizQn6GkV4-xXC3SuZyipej7kACFVD3zQFypFJV0BEBAq0qx7TrabMQGfMErxyIJA0iXEIekibmm2Rhc5YVPDGsRWa3lg4BX33gvovAwkaC8wgPK9GiqsbLjZBaSF3S7ARQdNaYayxDWrkmmy1KHKo1VJjW+ZAIE2YUCDC0GgeASVdKCH0Skmkcy-AGIaqKMwnBOCMqeQ1x4nCZ0jTc6NYSXJGCyjgFgbYSAcAoLDGALqFU2K6ARFkFpPhOySPMLJHhhqDpsLCE8XhViwqvlWlijZ+AqhtaaqpvA9Q7oSV0PeLhMxHmWP0odiA4R2EWBuYY3gNinlvca59kY33csqJ+xMGbd2ID-TuIYdggPZhAwgSEGQsK4XQv8SkrwMzwabK+2dH7qC4m-e6hAWGAO4e0sB92f6vjl2+HRbwuFjUijslPD+PdIH90HiUjlwnqhA12hAqBqhl56A7a1bMhZVIsjiJyQa2ECPQiWFhHqjI8JcgRJW6awo3yVIkMphyNAJVwyfMVJDSKBBfmoE5qV5xeBjxDGprGx47QWhdj6j6OY6R6WhCeL2FINzGRej4Y1Nm1B2fk45qhzmFoWPfRoDzXmss+axLywLWyFbiOVtI340IojuxSM4WIDhfjDHZLuFLtn7OhkK5K6QOW3MPAK956QZA0vKfmdijgsospiG8q6te84dx3X3FCDI2llJ52i6q8R3wogESCCsRwxqhB+ZbAN9oAhZOqGhpl3rK6wDQVgIvAe7b5twNalS3G6FsJLFvXRCF7tSPiMmCCHMnJNI2GO6dhy538tcDTZVCVeBFT6PKpQKQ270M-tA1Cc0ploR+D+BpHcB8eRacGMMHj8QofUH8zKWHDGRBo4xyVcUEpW18DKzjnVVFAgngwrCFYXG4SLHCtCWEiQ-CsofVZ44J3adnbo-lpnYB0cxzZxzkcYh2CvaY98wj5nVLZjXIWMKRZovbwpjaKIMJNJbEs8POX0P6dK8Z7gVXLO1B9llMJPsXODenhcMuK9lpPB1ei-4MRfxEgbldleuENO6e5e5Q85n0MGejnQFAfi-uqXOF6vxtBQxHDu3Ti4bDyCfjsiUYnxXtrBtvhnqgEcaz5k2oiZjuS72saQhF0sWIBEIqPT8O7Nk5pT6BChG6UEYxa8w9d1HPL5jJtPhm3NvXJpEjZlC7EFkhEQTbOekEL2AHHpQm0ieS+3p2UsXl0nhni-kOoF4CutdMgm86lzxk-oPgNzl3IyOvnB1ByDvFyKCD4JDg7mwnfnXkvo-nas-uYquuug6k6p-m9pmlsr-pRKCD8EEDuBsOkANMZM4D8IaoRDaMkKCFfn-KUldvJkPGJl-BJj-LQTJiJvPkxIpovONoIhgRhrMOWJhMCsRJpE7CCtFnvqpHaLhLdP2gRMaoSmBEBAwvwOJJBF+ljsxnEGIiCCDoWB4MeHhNuOyJhGyJsMMJsB4NTlAaUkoeBKoY0rtPUGjF3pgT8kMMNNHjaLaMuLnNuFCGIvgvhN1JuAobYRyvYSodduobxJoHiFofrqsMNFCoaoahfOhPENuABlhCDsZAkHEJpDQdJixAAGrPyUBgL8DxzmIaH+52xOALCsi-C7j6Zb4l56SDD-BeFOzrbGQ27GrlHa5VHSD7S1FxGuHNTY5tSPQnKQgjDETD4EZRBk7eDLiSIsjLjS7X6PoMzsAgQkBhAthRLKFxzw7PwCB4ogTKHQx2bDFxwPizb1HHjzClgsjDAyIFK3qj7b7byHhLB4F2jGo3j7EMJHEOQnExKSTnGVQiigRKjATRJAQIwwnPF+FewyIyLoS0i9REGSHJCqSZhDCbEeBshHYREsQgmwAHHgkyiQnInQnoBgKwnwnSD0lnFMnPxoZuECG2BSGrATBRBUgCal7RBEzsiESlxknHb3j-gNwIyEo66aE8nTEECG5cj+DlwpKg4Eag66EJDzAjArBqwyk+5wDymSSKmvguEb6oRcjOA9p0QDChp4R4nDonwQZV6Zy7jnI-Q7Gy70D1gWBzSo5ZZQCzZxz7Spr9j1FoLvDfBQgao7i-LuyT5aZ-CGnZjHLFHwoyYaAPhQDCotgrIaELqwBLqv4cBKizb4Dr6JHrxRBgggh+IZk5j96grOD-a4RRD+CPSQEy6O4Bj5mUCFmoDFlgAdgaFfikAwCoBsxPbCrFYsDVkFB1kqnMYECbCYTYR+H84aRchHKTAxC0iriX575CbDmjnjmTm8QLoI5Rgrm1md5TEbkWHGY5gFw+CbgbgOieBNl7zDCsjjDIIXnUAFlFkOQlm8SorPIMlQRvIfLkCxmFixTYQOKfHnI-mBojDOC9Anzx54T24DlsIiiXkQUyhQU-gwWxHNKzb8CxlVaLDKz4Rbkg5Fq-Clg1ZjDQaeDbFsEsSkVgUjnkWtgTnOFGImKt7mLt6AQMVk7QiJbT6gh-BHIlhXqBBUhYmQigXgVjmQViUaEbQd6ImnGxJmLPG3rmi3qJATCYWaS7hZLsgkatFLDHwMQUk2SCW6XXnOH8qIVCoiqajipFbSAypyqxnkFYTJlLa7jjD+AOiZH9D4RmQsVtYpYNpiC0ksBgDBmviibdzMF9ysElE2T1qNotg5U65TzcECIrz8GqlgYLC+zHi-BTqEy-mjrWg2gYS0gFIWbEWlJ3h0UVW5XyYaEFV0DfxSa5mUktLyaVV5Utxfg1W8F1W2m2zaTIJRWTCrDWWFhwgOiwiFwx5fSgF8UlXCjUU6iRlzUxn1UblRD0QhSfmFhZmghFp7gjAH5jIZJ+AylPLopwWNx0UxmTEdK8lRDXTnJAVAXkTNaHU6o7gFzeDJWXIeXCj0FTzLnYq4oEqEpMGTUsHTU36eUcEyivI43SB40rUPBrX1nzjLDkyD5haE6nqBq-BHwvG3oLEeBCZk1xxYo4pU1EoCA0J5T0KMJ5TML8Wk1yZY2C241Eo00qa6D+4giGrDS3oQFXQcibYzAfnxm-bkSQrkT3r+mDl0AiBKgjhjHOH1HGTJHnIX7HhRDZhRYzB-B-KUy46kZ-D4TAmgmHFxxC0kCpoUI6LPxZ4PISrN7xwthSUWId723-D566aESLgrBBDbisiYS7i4He12BRAB3UlgnB0XBh2gI8JR1-iLxgDQwJ0yVrkvn652xvBOjcW7UeCUbZF4TSGamjCqrGTGoDhULN6wEp7+4jDXSDB2jnJSKBD5ysj7gKVVZDCwjkkDUcoj04oMEL7cnN0mjHgeJV4ZBIJ4SFjEFPWMgBBS6vAbjnUzU2RXUwRWoNwP4TVTUsKP2XWPJoot6v3J5IrK0wL3VJFE5JVGl4JqzjCHXAFyGaRwipAylJpZQ8phJ+WCoJoDbRlq2JkWhm64TQj5gDRSKLDkEArHgRro1y7DjJpoM4hDgjhVAoMpqkA8zw7prrn67LiaZgE+CEQERjBZGBprAhROA+lJDHjIN0MLJ1BvgQBATMMyPlmOpPGgMmjLhQjDS4SOgCOUEOhci53qX8MQinjSOoOyODjDiJoyOjZq4lQMIAT+7ZoZyx5ClwhtYOh4SYQaT6ZhEjSDDmMpr3JXEjE2MWM4CONVm9hOqwDOPqVYRjDzAap4SZgOhan-JBSUiPRGrUP0AiAsP0N8pxoNw4DCqioji3bOZhWcMH3zh+FkiUoFJGkJCgrmgtF+Bw2iFBNFMPKFP6IA3oHrVZopBgiEN24pDILZhZIOAUzlj4TYTLCcg9OWNXUYrwWU34pEpq13RR5r0yJxV+EkNHnLhxA+DIKtY5kk0-2FNcwq5q6KO0OoMCB5DZ6bT+74QHo7i+M4R9IdHyKHaJO0Q8iWWMg9N3Pu4PPhM0ACA4CoEg0fNZy6r4T9qtEpAJWbgWiWGcifT4LgsmwcOI5ULI4lZp7Png3TFQo9LzObU-B0TCP62vDkwshVYjAjLjD4uRz3Ms7NqSia6IuBDggZI+kZCJC-mabsuF0eBfmcup4e7q4troBtosDa6viIsTBbyAZEz9L0hbFgjQ0sjZjjCngJ55OW1PPNxcuQue7GKymTiIuYtBA8M-DHq6lpJkN0SEQnjaQEJmsFN0MQtkuAN6KvM57qPzgLP2Lix8aLgkyBqghgjlibBV4ETAqyuN55RMO8AfPq2hbZJQgZIODFiaQkbqTeBBCGuyv+sWMr5i3lL+6uWKw7i-B874a6mlyeKZiUoQ5Al+sWt059MyOIGVn2qqPOoNuhQxBkYaVugTAMseoehexOz4F+3nLpszxyCmLHSJ2yXhutTAq6GMgLNvBE4GPdFESUiWhw1BAdZjYZY9ZwxDYhVRiIF071E5jkxujLCE6+EBozA7jfDA6biqo0t-C3vo5dbBW9aXYa5KtirIEyAZWUBN0UsbmGuLB+DQaSIZgDDbgLH9DJAFyfCpsP3XPHCpYQf3vDZPt3bnClZ7tYybm4VzAjAYSGlrD-ORCCPiKQ3zCnzfMb3m1sIUfpYthVPlQ0fOZ2OicTZv7TaUCzbktuot2eFHg9vGu8YeDbgSI7Zlw-AX5TrpXlUOS8vs5wd4BytQumea4vMYBvNOMMddD-Bk42iGrqKeDZPEHDDiL-Acht25Kz5mtlWZUtjWfmcweKvKsIdOQgTIdKcLZKrzNxZcjD53QchyI-IotjqfFtV2DZBejUBMlwAGgXW0D022wyIi6Szc0yxnhunWDJG7iQidMuswZm0y2BKnBRg1RNgQDleMeF19C4S0gbjaTaRt26vkxQrAWvC-BI39VCcIpdd0eXD9fPCxtezkQSKBHu2RA2iftchd3Kyyyke7EY1s5ifhhKgqgVDqixhajXZ9dcOpx2CYuBG+mbgfm6TDrYRYQXzX2yH7fUYvo+VDw9h9hreBRmTDQU7aQeOsisjbhDAOyEGFgwgutEWLccoiA6JVD4DSroCZ4CiZ6PHSDICnCQ-dD+BDfqySl+AjAjDFhM2TL5iMp9TAlNwcRiRNKU89CNfdkQ6TMwOdGjNeywjil2hLD9lY8CX81sO89ZM-5ts0SJnzsICshWXEmcj+AyzJZmuzTyY5agxFTgy9ZiC88KXOAIMz08i-Z60-KJDvCm4Sn4z4SY8ddBy6xLUwRhxLQRy8+CMLD7qPQExSL4T5wHrZJ+3rCJZXNnfHCjzjxpqTze8bvtzwDPeoQ8hDSTr2XqQZij4gg7ZrYKx6HGocJALcLh1vwK-NaqSX6+NkorG6tDRKIDDNtH0DAzr161qreZ+tQjp9AwrSLdLnIHXxsdRpG7hvRufS8e+Bk0bBv0aU+FhgiHa8VSLjScf6TfC4x+cjSGr0t4R81y1LWU9Gt9AaWqwJkz2pnb7DCUpDApCS8Lfz90AieQfid9auau7n-ZIuCkYB0zKe3oRg+g7ZlKBEGPK-1K75NncS-TGMp03wZgrKhEDJGyELDKJ6shEcAdfXQiqwT+kHIeJTzAEJsCC5kOnqPmuiPQWW8IZRKCEUKnFHCNFSnthCapJBwcj0cKPV1mCVdjyX7HSPRGMjQDv6xwIYpUWuw1FdoAfXcIm3EaOgnAGwItp0QyDj5d+eYfPqsGLo0lji1xKElBBhIK8voKRNJKkzSBDJosd6L2L6TeDiF0IppOUnHCtJ4BeeGYJskbXGSGNuBnqLeOyC5DNFNIcGM1kGRDJ48wyEZBGFGQ4YW886TFcYFCn3y95UyB6d0Gx1NoFwdKwlPShRQMrfgLef5fcC2WQRtljCbiBIGMwPDWUasdgU7gGXf4ZUsqC1MarkP76McFYYIO6Nn1WAnhNixYTTB4w85KxaIHPYag5EaFTwFeysc0HdD8Ep1L26EQ6t5wNSDAVElIGoRbTWZA0EcrSfrvBGQAeoNwl-NBNBlG6eBQgs2WUM4OxjcVCSvFY0uRHGShAZ4icIgB6ivTmhAi3zCjMsNCBjkoA5AS4bYAKI3DoMHIe4QXxADvIIA8gSIOWFCAKARy-wj1CRGeDlhe6G4W4aCMzDgj9aBw2IZ8JOGCc3+mNb3grWFqEpKebWMRCMAyAjQjqavSvLjHmbnwr0rtP0m-ytrWNbakEAPgCiwjmZy4Mg0kiAMnRBFSQ4wWyp6y0Gl0EYIdCuoJCrpQAeRTIAomWnoiKCtUnRVqjgUSAlxKCQ9M1tvTHrz4e+CAhLkFnMJTsEGhDc5iAPahiIiiZ8XfMCjj61Dn60EABgzj-4atPAm4NloyBhqkxro5cP-BgIoL+w+2-TapCv0dBeweGasa3KrBmbkxFwkwY+JZXa4wDzWtzEMJT3VjBpswgQNYKEQGi-AGUK4RIGDlWHgdRODmB9uVAD42gL0KQePPvmwzbgp02CHkD2Xb6YkjOIXEzrBzbQUiH+iwZlGyHXD0RXEw6HhuCD-IDIEyVYfLkAA */
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

          'Mosaic was selected': {
            target: 'Prediction ready',
            internal: true,
            actions: [
              'setCurrentMosaic',
              'clearCurrentPrediction',
              'loadLatestMosaicTimeframe',
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
              'setTimeframesList',
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
