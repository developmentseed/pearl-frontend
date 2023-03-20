import { createMachine, assign } from 'xstate';

export const sessionLevel = {
  INFO: 'INFO',
  ERROR: 'ERROR',
};

export const aoiStatuses = {
  LOADING: 'LOADING',
  EMPTY: 'EMPTY',
  CREATING: 'CREATING',
};

/**
 * These are helpers to set context without repetion, mostly used on onEntry
 * actions.
 */
const set = {
  sessionStatus: (sessionStatus) =>
    assign((context) => {
      return {
        ...context,
        sessionStatus,
      };
    }),
  aoiStatus: (aoiStatus) =>
    assign((context) => {
      return {
        ...context,
        aoiStatus,
      };
    }),
};

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxAGUweNtUp5KJADYtkzMPIzJYAbQAMAXUQp0sSZXTVdIAB6IATAEYAbHQDsDgBy3LAFmuWAzLeveATgAaEABPRAD3R1d3SO9rBw0Nd1sHAF80kLQsXEJSChp6JlZ2FlQwEghQgU0dJBBkfUNjUwsEAO8ogLsAVlsAvpsEyxDwhGt-Ok8HCYCHHstEjR7rDKyMbHxiMipaRkU2DnLK6rVrOr0DKRb6to6u3v7BiYcRsMQE6zoAjVt+6w0DnclmcGgCtjWDQ2uW2BT2AGFyLgANY0KBsABmLG4sDAqEOLBI3DwSL4lBwJH4EBq2lMjSuRhMtw+7g0zjo-UsPUGsR6ARsow+znZc3czh6rm8TgBdkh2U2eR2hToiJRaMx2Nx+NKRJJYDJFKpNXOdKa1yZoDa1lZ7M53LcvP51kF40BdCSNilDlswLszjl0K2+V29AAonw8eraAB3ZQ5fAsagkIhgYSiOMKxPJsC1U0Mm6Wj78jR0HqeVl9azg5zeF12bzfSz8jrg62s6z+zJQ+OKuH0eHHKTUdGkZACACyJGQBJwg8gufq9OaFvMiAlDdcVcsfm8gWWDhdzi+7gc3Q6YN+7m8GS71HQEDgdMDvZDeeXrUQBFsLq-AZ7sJDfYSg4LheCpN9zQ-BBgTrDt3VeH4el8SIAhrAI-wVADlWKJRSmOKoIMZKCXAbBx4leXcy2tbwelg9lASbZZkNiNCMJhYNlVVHBUWHDUcTxAldVJKRDUgQiC1XcYJh6OhOjcbdbGSOwOlgr5bAlDRvA0LlAWFPw2KDJU9gAGXQSp1TAMx2CHdF5VycSVytaTZJSSwFKU-pa3ecZEjoa15ildwemWZJUgMl9lXDfhUCjMBYzshMkxTByoLsZI6GcJwpVsQJFniOscscbxtxrRIeiBOZwqwvYACVIEocoEzwdAWHIdAU3kRQUuZcZFKiTKyO9XKyOdbyARkjwtLFbcfGSboqo4vYABEwAxQpxEMWQWAAQQAeQASW6wsEBsX4OT8QFXn3cq62CoqXHBfp3DFKUFqM-tB3VUcjskq9LDoJtIj+09FK5dw6PgxikKe1DXpvIA */
    predictableActionArguments: true,
    id: 'project-machine',
    initial: 'Page is mounted',

    context: {
      displayGlobalLoading: true,
      project: {},
      sessionStatus: {
        level: sessionLevel.INFO,
        message: 'Loading...',
      },
      aoiStatus: aoiStatuses.LOADING,
    },

    states: {
      'Page is mounted': {
        on: {
          'Set initial page props': {
            target: 'Creating map',
            actions: 'setInitialPageProps',
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

        entry: 'setEnteringProjectNameStatus',
      },

      'Redirect to home page': {},

      'Define initial AOI': {
        entry: ['setFirstAoiStatus', 'setEmptyAoi'],
      },

      'Creating map': {
        on: {
          'Map is created': {
            target: 'Page is ready',
            actions: ['setMapRef', 'toggleGlobalLoading'],
          },
        },
      },
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isAuthenticated: (c) => c.isAuthenticated,
    },
    actions: {
      setInitialPageProps: assign((context, event) => {
        const { projectId, isAuthenticated } = event.data;
        return {
          project: { id: projectId },
          isAuthenticated,
        };
      }),
      toggleGlobalLoading: assign((context) => {
        return {
          ...context,
          displayGlobalLoading: !context.displayGlobalLoading,
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
      setMapRef: assign((context, event) => {
        const { setMapRef } = event.data;
        return {
          ...context,
          setMapRef,
        };
      }),
      setEnteringProjectNameStatus: set.sessionStatus({
        level: sessionLevel.INFO,
        message: 'Set Project Name',
      }),
      setFirstAoiStatus: set.sessionStatus({
        level: sessionLevel.INFO,
        message: 'Set AOI',
      }),
      setEmptyAoi: set.aoiStatus(aoiStatuses.EMPTY),
    },
    services: {},
  }
);
