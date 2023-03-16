import { createMachine, assign } from 'xstate';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxAElqlPJRIAbSgC8wLZM3mw8JfgG0ADAF1EKdLDGV01PSAAeiAEwBGAGx0A7AE4AHDYCstq1dce7ACwANCAAnojudAF+jpoBAMwBjlYBds4AvukhaFi4hKQUNPRMrOwsqGAkEKECWrpIIMgGRiZmlggeyXRxHl7+yTaJIeEINpqadDZWzvHumoNWvfGZ2RjY+MRkVLSMSmwcFVU16jb1+obirQ3tnVbdAb2LdgNDYYiernR2Nq4zHvFWRweeaOFaNNZ5TaFHYAYXIuAA1jQoGwAGYsbiwMCofYsEjcPDwviUHBqQR1MxNC7GUzXd49OiuTR+AHxNKdRzDRAzJw2AIBRbxTSLVzfME5db5LZFOhwxHItEYrE4sr4wlgYmk-gQWqnSnNS600DtMYPRnM-5WNnODlc0ZeOhWOLjZwC-l2aZWTJZEDUdAQOCUiEbArbMD66lXY2IAh2O2x7rjJPJ5Ogn0SyGhmUleRlLi8bURlpGiyIAV201OZw2WKJeKOZIeX7i4NS6HFPZlQ7VIuGtplp2MpLfW7zJKct6jOJVmuaOsNkUZdOtqFh2XwnBI6goyjozHY3FqoniLWQXs0-sIIF3flWOz+OzMgI2QZ2tx0evPBv-VKuWKuFtchDaUdgAGXQKoFTAcx2HEbcFFbc8o1LK8HVve87EfVxn1fSdPAcUU7HiAEbWmGw3EAyVVxlABRPhsQVWgAHcEKAvAWGoEgiHDBoqWLS8pgFbpyICNw-DnMY40nas6Gcb5XB8ZxfHGAVKMzED6AAJUgSgKnwFg8HQFhyHQbiFCUJCSxNFI7nmV0xOBeJJIrYEog8Pl4k6f4+imb10iAA */
    predictableActionArguments: true,
    id: 'project-machine',
    initial: 'Page is mounted',

    context: {},

    states: {
      'Page is mounted': {
        on: {
          'Initialize page state': {
            target: 'Page is ready',
            actions: 'initPage',
          },
        },
      },

      'Page is ready': {
        on: {
          '': [
            {
              target: 'Checking if user is authenticated',
              cond: 'isProjectNew',
            },
            'Loading existing project',
          ],
        },
      },

      'Checking if user is authenticated': {
        on: {
          '': [
            {
              target: 'Entering new project name',
              cond: 'isAuthenticated',
            },
            'Redirect to home page',
          ],
        },
      },

      'Loading existing project': {},
      'Entering new project name': {},
      'Redirect to home page': {},
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isAuthenticated: (c) => c.isAuthenticated,
    },
    actions: {
      initPage: assign((context, event) => {
        const { projectId, isAuthenticated } = event.data;
        return {
          project: { id: projectId },
          isAuthenticated,
        };
      }),
    },
    services: {},
  }
);
