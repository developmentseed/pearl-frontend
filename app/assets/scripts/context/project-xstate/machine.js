import { createMachine, assign } from 'xstate';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxAElqlPJRIAbSgC8wLZM3mw8JfgG0ADAF1EKdLDGV01PSAAeiAEwBGAGx0A7AE4AHDYCstq1dce7ACwANCAAnojudAF+jpoBAMwBjlYBds4AvukhaFi4hKQUNPRMrOwsqGAkEKECWrpIIMgGRiZmlggeyXRxHl7+yTaJIeEINpqadDZWzvHumoNWvfGZ2RjY+MRkVLSMSmwcFVU16jb1+obirQ3tnVbdAb2LdgNDYYiernR2Nq4zHvFWRweeaOFaNNZ5TaFHYAYXIuAA1jQoGwAGYsbiwMCofYsEjcPDwviUHBqQR1MxNC7GUzXd49OiuTR+AHxNKdRzDRAzJw2AIBRbxTSLVzfME5db5LZFOhwxHItEYrE4sr4wlgYmk-gQWqnSnNS600DtMYPRnM-5WNnODlc0ZeOhWOLjZwC-l2aZWcUQjYFbb0ACifGxCtoAHcFD68CxqCQiGABABlMDRiV5GNxsAUhpUlpGizvAKux3ROyzcYuHxWO08p12DzuDwPTQ23yZLIgajoCBwSlRqH+-XUq7GxAEOx2ggeOjOGZFuJl+IueJeb25X3SnYleRlLi8bVDvNtRACu2mpzOGyxRJL5INjIdtMb6HFPZlQ7VQ+G48IAUTVxJN8tzzEknJvKMcQXlemg3o4d6-GukoDjKco4Ei1AopQ6KYtiuJqkS4hapAX40j+QJ3PyVj1nYdjMgENiDDWnxLs8cH-KkrixK4iGQn6MoADLoFUCpgOY7DiBhkbrngJEjgWCDkVEArUbRAEMfEZ7+IyNHxACraXm4PHPv6dBBvwqChmAEZPtGsbxrJ+YmikdzzK6bh+DBYwTuBl4zt8rg+M4vjjAKRlSi+dAAEqQJQFT4CweDoCw5DoPGChKA5P5TAK3Q2G5rgefEXmaRMDx8iuQIrosUxhchOwACJgKiRRsKI4hSCwACCADyQiZXSozJC5ARxGyulwY4oo1jYflXkFgTzsKdjtukQA */
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

      'Entering new project name': {
        on: {
          'Set project name': {
            target: 'Define initial AOI',
            actions: 'setProjectName',
          },
        },
      },

      'Redirect to home page': {},
      'Define initial AOI': {},
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
      setProjectName: assign((context, event) => {
        const { projectName } = event.data;
        return {
          ...context,
          project: {
            ...context.project,
            name: projectName,
          },
        };
      }),
    },
    services: {},
  }
);
