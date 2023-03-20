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
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdgCcADlvv3AZgAsn+18AGhAAT0QPOl83AFZ7NzdvGO1Y7Ri3AF8MkLQsXEJSChp6JlZ2FlQwEghQgR19JBBkIxN1anMrBBiXJzok23SHGNtohxDwhFttbTpbaxc-a215+27tbyycjGx8YjIqWkZmaXLK6trNWwbDY1N2xs7u3v7B1ZGPe3HEAbc6e1s3C4pk4Et40k4Ypsmtt8nsiocAMIKHAAaxoUDYADMWNxYGBUGwOLJ5Io1Cp+BA6npzM1bm0Ot9tE5bLN7PYnL4nNY3E5tC5tMEwt8Ic5plNEr4XED4vYobkdgV9sU6EjcGjqBjKNjcfjCTI5AolOTBJdrk0WncGZMmSyHOzOdzefzBRMFs4Rr4+Us-OLIdloXldoUDvQAKJ8fHoli0ADuLHl+WjJCIYAEAGUwHh4zD8EmU-UaRb6Q9vulvHQBYkpuy3Oz2V9Jsk-v5okDFutrFl-dR0BA4DSc4r4WBC3SzCWEARPkLJzE6FKF4ulxt-Qmg0rDqUThwuLwKaPWuPQJ1fNYG1NfM5pfZrLfht1bE45YO4SGjmUOGcagfLRPfL5HAGbw2XsAVvH5BZzwFK87Vvax7yBJ9VxfYNlVVVEoy1HE8QJcpiUNMlVEgH9i2PRAnAoug3GmRIYmSGIKP8Bt3D6Jx2XmcDAVsKZbGfQMhzfAAZdBqijMALHYNQNWzfiSKPSxyMo6iUiSejGNsc84iotlvGsewkkCPiFVfZVw34VAo1jGSFTzEdGlpQ97jIyY9OeCjmRcW99MCJxNJmXxhnApIwQGAE-S2fiTMOEQIEoSpczwdAWHIdAU3jY45KchSXPZViKM8LzgM5ZiWRcf5XFWLk2W5FcIuM1DDgAETATFijYahWhIMQWAAQQAeQASUyq1H3sFxZh5XluUQ7wBnPbxegC7xltcZJmT5FcsiAA */
    predictableActionArguments: true,
    id: 'project-machine',
    initial: 'Page is mounted',

    context: {
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
          'Resolve authentication': {
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

        entry: 'setEnteringProjectNameStatus',
      },

      'Redirect to home page': {},
      'Define initial AOI': {
        entry: ['setFirstAoiStatus', 'setEmptyAoi'],
      },
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
