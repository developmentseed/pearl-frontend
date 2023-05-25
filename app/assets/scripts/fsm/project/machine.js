import { createMachine, send } from 'xstate';
import { actions } from './actions';
import { services } from './services';
import * as guards from './guards';
import { SESSION_MODES } from './constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRAQCMNgMwB2OnYCcAVkcAOLwDYnvl7uADQgAJ6INv50jo6uAEwevq7JTu4ALAC+maFoWLiEpBQ09Eys7CyoYCQQYQI6+kggyEYm6tTmVgi2dvF06Tbu2jZ+2unu7l6hEQgOrl50vgPa9qtj2omu2bkY2PjEZFS0jMzSFVU1dZo2jYbGph1NXQSO2r794-O+vo7x6Yn2aaRdLadz9SbxXzxOLxeITdzbZq7AoHYrHMpnDgXWr1eK3ZqtB6dazJd4JcbaDZDH7aVxA2buRKLdJedLpezuXwOeL2RF5PaFQ4lOgAYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CD1PTmFr3drE7q9bR0DIgt7aIK+Cb09lg-yM62+UEg3k5JH5fZFI70MW4KXUGWUeWK5WqmRyBRKbWCa74w1tMxPaxeRxgmzpO1xV7Q9yrB0cxYc+Ku90rPnI31C44AUT4yulLFoAHcWPyCq2SEQwAIAMpgPCdmsj6i9sANA2E41p012MHuOx2ynfbSOGz0myOcb9G3L4Y2Vz2KJZL1d2to+gAETAspKLAfqFgI4AggB5ACSAgYVVgSoQAqyBiOgNQsJ+X4sAARnIeAaNOTTJkS862Jy7wTJuXiwj42GePSfxssy8QZkMjj2GMjjVj6grXnQd4PrQT6UC+77fr+-6ASwECoCQHbPq+EHfjBcEIfqSGzqmoDPBRUR0MMQxeK4bI2GMW7hIgqw7vJ9hwqe2ZKZm1ECqi-qihcaghpwJDIAIACyNlRjgFmQIhdwpo80nWHYG4uAMyTLqsBaAhpCAnuaYxumknITP4xkon6woAOokG0VmyugKo8cwLCZSwKjUDgYBiPZjlcBGEDoG2Wjie5KFed0p7uK4LgJDamb2F4DicvS9jjO8Picr8fgqU48VXmZKVpTKGVZbxMp5QVRUlX+cBcUtxVCVB2UdrBeDwTVSaSZ5ljWOWfilh4rgrFC9jfL1-w2HQ12svMbx4bu420ZNqWWTNeXZQtKobStnGQPlJCFZtkHcbxu2iVoNwzkaUmnd0PL2C1eZQukXwsr4BGBGCuPYbChZ2p6Ow0aZwo3nDLYw9BYSw8wUDSqVyCcDwSpcFIbkEijJ0yRmzj-Cyp6Uv5bK9XCfQ7iRrjXYyRPnlTJmJccdN8QzwlMyzUBsyGHNcxG3DIPzyFzg1BABPYz1RLSPLxFEjKOITrz28kI1QjabJfTTmv01ZjPM4DhtQBxa3gyDW0s-D+1iUdgsmjbhYLPMfVLDm-z3aFp53eCrjHoksRBI4vj+xr9AAGI0Ow5DcfedfB7rPDUBAsACJVxw0BI6ASvQl7fcKtfUPXjeMTrUHQW3HcIL36Dau0DQW8dKfOyCMRcg46xsskBE+M43wbxMqzJDuld1jXw4UGwY9qCQYjcaoJBdxo9ALwPdBDwH194LfdcH5PwgC-ee1A+5L0TqvZOqFeh205LjSkGwBjK3pPmGIi5brli9qrb06sr50GrjfBugDKCP2fngV+yoMCoG-mIVQs0iDfzHL-QhxC75tHISAyhYCIGqGXnoaBHkU5KXSHQcsRcEgYzalMUKkwnrOzurEFYrhYiBEvnRVaEBlAPEqNUHEf5KB9hEgnago4o4QCEfVNGfVJjyRwoFVRXgNhuzztdFqJF-gqO+H4QsGizJaJ0e0PRlxhBgAAI7cDgGxbaxVhxTlqgLYR84nBPWtN4LkuMhhvAdCkc0gxJh5nLokfxwpAn4GCdiOoq0ALg3bLHPaB0rFWxsbpc0vwfZtMxpaAiDgFh+EVnabB4w-ilPRFUbRFSNAhJxCISJ0TwYw1gG2EwFBmmoy6KsAYdA+p9XZIMJYnUHTHjJG8TG5F-AJArheFhVdGATKCdMqpYT5mvkWcJWA5ASBVBYAAVSEAAGXWULRAHoFiFkxtmJYisKIhFCssJ64w4gDFsc4mwYzSgPKmWY55A4Vn-wbjgbgqAqh8Dvq+SGRUWB4DCMgBJSdkkNU6nYeSbwhjO1BKyEKMxRoxFZMMRIO4bBwgxfcyAjycX6LqAAIVULfNA4rsX5XQEQEC8TLGJMths0FKxzSskZNCOE11vC9RPGIvqiRbql0ZAiG51M7nlN0bi-Ft94J6LwLxGgXMID0uRoytG1I7Y7nJthKIO5uWaWSH0EEHgbRLEmFsO1+C6KNn4CqBVkynW8D1Ay6xXRvBPWDUeZYmSI0IDhCyt0rwdzOJ5CMSmeCEoENTZGDNErKjZsTH6vNiAC0uEzMW1SpbCYZB2X1bCXiNztVFS29NWKs3UFxLmlp+aur9qGHYEt2Yy3QjXV8cu3xmreD6qKkUFkp5vx7uA-ug9bkELPdUP6W1eGL34VAzVa95zZkLPJFkcROS2Ioju8u5qOqMnSOXQYoq3wVIkPwqyNAKVQyfHlNt2KBBfmoEhql5xeBjxDMCk0JylzO2SHEN6OY6ShWhCeZ6FINy6Uej4aDsH4Ohiw5Q5Ds1zGZvaBhjjlLMQzLCIR+cZM+g4Qxr8aEUQCIpGcLEBwvxhjsk+kmptdEYNqDg0+xDnGqXcbQw8AQWnKA6eCV8jg1DMquQ-TAhqzsUguCHf8WIEG4UzF0kpOgfgKJovXF1W1asNNmSEHhlsRm+MPtUODPTgmWBtjANBWAi8B54FEw55qLVsIUSWF4Dk11-AEXHeIyYIIcycmUui9TE1hRheoPhmUkWNACC4D6kqFK8CKj0UVMztnl3avLT7HZvQMl-CUjuA+PJf2DGGPu+Ior6uNZ4xKsJvWpBAQoEGFoNB0t2f9V0SE0IYjKyUrpYV5ZgNwkWIFQ1sIvheEW+FqyzXF0iHW+DNQfZZS8T7BltGkJTwuGXMKy0nhZPUf8GIv4iQNxDIu0FxttXjhLYi-Ovj72wB9aAq90c6AoCcX+4do9OzAuqL+LN1xMw9ILDsJmXGPx2SKKew1tHirjNvhnqgEcjTpkKtqRqgbIKhvXaWLETqQU7p+AImyc0hYcx+EhJSIYuCf53NRy99HLXHUWZIBwWUqUxD9e7SuxAgqxGu13D4dYJEy3jrBKooYd0oSqRPA2tXBCNdNa14unXTzeAJb1zILnOoidm6UuaFkzi1FeKcHbwYLUORsj8KpSYXUWfLde5HXj-uzFtiDzgFVarQ-7Z7eW63FpXhDSCDuZBvVdJH3I84uNSt3d3rotFp9Q9L0f2vV-D3Hfz2a5oi+yBh0w+zHLE9Q5gRRFuhPLI6nUf5IUyyeT9kj2avD2OACsCQF6H8EEpBHNJvBvIv3GVwsHhjwQe3Psj4mwBWKw8AtrfrDd-gQP9Era9QkYSXszYkMD5jDjaLaMuJCATKFFEH8IsPMORO1JuJ1KKh-vvjFkfuxJoHiKfsLqsD5hcs-uSJ1LCNuAOjsmVrpAkORuyKKgAGqPyUDcLSA7RmLH4T42xOD9IQbQjsgrCCpU6RAZB9DYTz6qRBRRBURv53J0FiAMExZxwsEYF-51Sm6NR3QSaQgjCz5S5lrQF2zeDLiSIsjLib7BbI63jsAgQkBhAthmygTgQwxtaPwCC-IgR77gxwYyFAQwwPhG5sEU7vDfBQgkR05bIETkR2wkywh6QUyLb3j-gNwwwArsB4An7-4HYkiDCLBRABCeB9RjBlrlZiK4yJBdTOJljXKmHb70AiA-ZwAJHCRJGvi-5C4pxcjOCUhXQDDOysi7imqZFuiM4ZxW7ZgzoWDTQ9acZQBG6xw7Ter9h+H+SLDHzBHhp9SEwXRjB-DzCbrZg8inoaAPhQDEotj1LH52RGCpQ4BRhKhG74DG5pFl4ECP47K7hchS4ZiiHFiZhZG0i7FvF7GSH3oHGUBHGoAnFgAdjH5fikAwCoDMwpbEo4YcA3EFD3HKGDZPGKxPSwrCongKxcjHJ2KvApBDBu5R77HUCHHHFWSnHsTnHtbXFxJ3GC7YHryKzmhOA5gOCz6bgbgOieDEwFrDCsjjC4wUlUlgk0kQk-5zJRJvJeEfIurkB+GFgRQUQbA8hFxdR8nwojDOC9BFzgF-BxDikgnUkyi0k-iynf4wztbxJ+EkR9BQgZgUGGmsgOgbhOlOCwiUTOKeAmFI5VGijAmgngmQnsSGLGK85mL86AQOnTbQiMZujK5-DHIljCqBBUiYzCGmmhlSnhk-g1JcS2F74NIIxsH1p6oUETDanKS9F5xcpjq7h3SilFxt72pAmUlmmSkWnSnH54qrKErEqkojhxbIY0p0p+GKwLCnjkQ7iqJsgAYOikz9Bzl-qMZjSAmabIAgTWFWRgBjGvgXrdy959z97t5mRvg7liB7kygHnJFTyj5vrj6l4qE2xiK1o4RKyZkbAOg5h2zemYwuKngJCip3hG5Pr3lHktw-gnl0Cfy3odl0TgXDgthQVPqQRPkPAryvkYmqS4wjaTCrD5Z6RwgOiwjvD-AvRwjJ7qJbmhYRJyk6gzFxL8CpHonC62Dnx+TclBCnjLAeY6p7gjAgjOw1kvQVGBmsLWnyksUQXzFKFJKPFRAXSlHJ5siqJKbkXHZCpKIumbqnpD4yhLJfI-L-IAo97wV96IXJpmSd5TwsCfLfLSDmVYUCK6AT7sidQ+ZGEniFiQjkSCUIBEGFoeDNQ-Ag7VaVGsL2UwWOWmUuWAoCDWa0KWF4CMLMJIV2VGWxxOVmWApuXvotHzjsgEXDDeA4T5w5Lwo0XPQwh1pLBvCxFKgjjME-5sG6S4FdSu7Hhhq4wy7bKBWdIsjGntm2W0wWH0LMwwzOUkDepcJkKgQRwiAUrc5xwtjRnmIC4dWuZkH+BoqzadRBUiVPS7igg-AcjbxRBgWTVWGxyzXzXAKLX44cSLxgDgybWxlolKVvm5ZOiUTEUeCvCL6RC7jtHfAcFugTB4mioDiULc5s456LoT4jAXQHLyJSKBC9QiX7iJmOnsrQiw3w1d4+7NGslfruKLC7gZAILuZ26QoWg8jlx+AZiUjeCxGvI85yoNxZ5wUIWZXjUo6MXf7QTc0rbYqFUvnFVMrjarkjAbBsqQjjDkXNQ7JXTIpwipCxEeqpSSqhIDkErUroDi0jhta+oPEqFDCMj9BSK9AkTny9QTDmgcrCrDRvB+Xa2ep604hDgjhVA61eqkCcxm0T7LjlwnZZbZKnzxDHIez4yXZvDJlRVSXq7Dhe3CYmYQBAT+3p2wC9hqqh0jAO7-quZV6xB-nW2ggg75gp6v7RWp0B3e11C+3urp1kDabSA4D0IASF2-DySuz3YJAJAg0ID7ISZJ4UyOy6SI4D4MWN0Z0uGMGt2635Td3In51G6wCF0EX0aGSkx2gOhQ2LD5aMjYQMaq4Xl1Zp0r3OqDn5TDmajkr6bSATnm0cUmjLhAFwKkZBAQgelA5TolyHyE30VX3z3PIiDgPC3ymh0kk7JUW4wpC4zZi9RdR6HKbhFqTnWe263syY7Y7L00ACB5AE5rQT7kQsj9pnb5EZL8EIBO7OAUR+U8j5agh10p2e7X3NzLW4BY4baEOLqF6qryXkOZz9Bx6-AQbsgpDLmbgWgCqcjvRew4PcOtboDtYCCdbdZVAfYskW1n53RpLli8k5iZgJAOivARHYShpKRujjAqONZrZ8PRzigSg7Z8CiOBDggR5W6CFUY8qnzPR2N2DHhp4SH12cON14O8MENfZxGTiiNyO-0HLly0gnjkU5iwHNTOIniqSsgOPRO6Mm3BIkOE64XC7hELAIGHqLh3QekTDiIbCDLNkjRjUhZgNe3syc6ZR+28DkMxqM0unOnXQODFjKRjqKTeBBAsjJ2z0dO4NGyQPp2WYsApXfVarC7xpyw7gdITZeUWPeDiKkQ-CJD+Qz2X1C1ROLNcM4oB754cBCPF7rOfoNRLAwGFjGFQiVYZj8nOwuCA7BTyxQagOXOdNGzdNyAmIHRbVxnlMmiHJFGuxrA4wj3Zx9AbDJmWiaVBAsbaZsZP2Cb8bYZCaoDPZQBsH-mLBYOK5gHHUHqlabjQ3GPCoX1ZXCimbmYIYCZQxEvP1RhVJ+H6lzAjCOZoMUR0N9LO0qXzDy41rhMcOaasa6bctFQmZKu65WYko2Z6Pv2oT3ZZPcHDAnO6TbgrARGXVtm-D8WehejUDqNwAGgXNgDk3WyYzXZiz5aqRqRZz0gECbzHixCMuMj1q6SSVzPoinBRjlRNgQAutow9DCrwO0gbiqResH1yJ6EtkZCvC-BCrnNssRvlBYhSpxvPC1PPTk60g4z+ORA2h2zfChPDRSwBnhsBiuMthhgKhKgqgVDqixhagxaxv6OcV07T7jbZibhcnqSeYUQ7J-BlhbIvRtNmF0Czphl44Cg9h9ilveQGQ+azaqQ0WsjulQFO7PTIKFgwg-DJCxHaI6MjhupDx44+HSDICnA7vdD+B9BS6TAbgp6lHFgAXFL5hwHdRgVNxMQCQxIfs9C4EUM34nKLnbhwNSIaUVZLCzNOvmSPothB0wc+SR5dReWxApBRH0j8o+Yq7oTqnkkgv0BTRPrcaAy5TAyCZiAweJnODKRiW3R5aQGeaWoWgtlEEgjkSJoRPIVBzGW6yhzzThwwedQ2ik7shRTFGJnY2UMunGnrAbmiqjzjw+qTxxUzy8Adwcd7vNSdUv7+C7jpBhGeD9DQEamXL-B6fsKkJcIvz4dKbyRu5naifQH0ixTiIOADA7PHhqSip+5N0ftx59BXIYypJdRkXwqggtTP67gvSKybgzpNhzrs6VK8AfsfM6SZjeBSIjR0PO6J6KRBCKzNTGmGU4cwUfvZj-DH3JvoRcg9SQ7ZjyTiFwhVt2h2i4tmb4tjkGaoY+6tcukuDjoDCkcyPUZvTiJQ0sOw75uC3VFkvFOowbMmgkQezW4R6Llnx0MlHO1rdEFKxNf4tDwfsrdV21571-sy4XQtl4Snw0ibftM76llf7oFfixdKdZLDcnh2ihfbhusxDWjla9XT20H0FL1tWQQKfU3iJODNmXsbCjOnubzoSqKO6gGrA3WwCWG3nAR2EKlQSOHsfDvrxVsxDeDKaZLyI7qmP9AAjZGHh2CxG1GfKxyNF4AwekT9B5YeAZjbx2epd2gxDztcg9HKT5ajHjH3uQxTHSC2lwxzEcdzmrlxpM4pDKRBVK3goQaWNkbnZhtYcighnmmth9nfgccCn7i+JbE5hi6mrXZ+ZEV3Z2AttYdXm7loWHkYVO-096s2rns8gQpmpBDFg-o0WeDlUAg-crsoWQWh9Tz4ckTmiFYiXQjK7YTkXDCc+GnKKUgB8FvVHQPMW2msXOsR+gDwTIA6p904w1ps2DCuJG6yjC-oyUTyRldlFHqFKhAzwJxECgrCrmgd-eBd-4QgBglQDkD9+2CUFD-+krCj8-MgArIQDyCRDlihAKAgmr+gqyLPDlgQab-z8FaZi788qemLAU7z8pueC3dh9QR5WJUAofv7JiIr2AVedtCA9I39JY8wOsgGwmDNVhw8hLaAp1Ko7Juu5camh4BzDIc+oSxJBvCDq5V8tu9EW6tNWEgPVae3EZ6lAEQFMhKCgyIuDjwyAkFpsyfRICXDjS6Qia3yEmgVz24vM0YbXPoOV3+AWofAGAvOIMDETKQ8iPwV4l5Q5pMUYIYtV7DNwaaeBNwIwF-CKRHocgLoqTWIBCmbx+w6OdAJZjfRLZN8A0joZ6J-WVg2gIuQVZlEGgKTTMM4TVIwSYO4YfsiYUrBXGsAQK9RfgToIuNAWUirgbQo3TluxmJYKclOSkFIBdmcQDBMwUPOIBggaoYc5gNrTIEAA */
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
        entry: ['refreshPredictionTab', 'showExistingAoisActionButtons'],
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
            actions: ['hideGlobalLoading', 'clearRetrainSamples'],
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

        entry: ['enterActivatingInstance', 'updateAoiLayer'],
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
