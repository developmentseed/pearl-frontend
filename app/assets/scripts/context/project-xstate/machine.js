import { createMachine, assign } from 'xstate';

export const sessionLevel = {
  INFO: 'INFO',
  ERROR: 'ERROR',
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
};

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxAElqlPJRIAbSgC8wLZM3mw8JfgG0ADAF1EKdLDGV01PSAAeiAEwBGAGx0A7I4AcdmwE43LgKx2ALFYANCAAnoguNnT+jh42fjYAzJ6uVh4AvukhaFi4hKQUNPRMrOwsqGAkEKECWrpIIMgGRiZmlgg+jlEePR7OHv72Lskh4Qg2mpp0E30uXTZWiYNWmdkY2PjEZFS0jEpsHBVVNeo29fqG4q0N7Z3dvf2DdsM2o4jxLnQ+PYmOPolWOy2RKJOyrRrrPJbQq7ADC5FwAGsaFA2AAzFjcWBgVAHFgkbh4BF8Sg4NSCOpmJqXYymG7vTT+HxOP49ZyJOZ2P5vcZ-Oh2Lk+TSxfyaZJecE5Db5bZFOjwpEo9GY7G4soEolgElk-gQWpnKnNK500DtCZMlnfPqODmOQU8jyJfkDXyi4WpJKSyGbAo7egAUT4OKVtAA7gpvXgWNQSEQwAIAMpgKNSvLR2NgSkNaktE0Wd4+Tr8qz+Dx2Ppc0VuHk2G3RWyiuKTIExGyZLIgajoCBwKmR6F+w0066mxAEOw88d0SaTGzmpIeTTWr25H2y3YleRlLi8XVD3NtRCBGuMpx2QteTqJMvfFfSgdyzd4o7VffGw8IQJTSJC752TRJEycwnv4Z4Xr4No3hkHapmuML0AqODItQqKUBiWI4niGrEuIOqQG+tIfn8Vj1mW-7uKWCwOp8iRCgKPj+OWorPIkd5Qr6coADLoFUSpgOY7DiChEarngBEjvmCDEaRAqaBRcTBGEBYOC4oqAo2XLuCsMH9hxuyBvwqAhmA4awVGMZxuJeZmiW3T-i4bjxHY15JDWQr1v8ViaJ0cyeB4PhsXBfp0AASpAlAVPgLB4OgLDkOgcYKEoVkfgsgx0GWmgOe4fguYkDrdLRjiBM4wxpAMgUyvBdAACJgGiRRsKI4hSCwACCADyQgpfSvL+E6xUxJEakAq8Sm8k6i7DGWXRZZprHtkAA */
    predictableActionArguments: true,
    id: 'project-machine',
    initial: 'Page is mounted',

    context: {
      project: {},
      sessionStatus: {
        level: sessionLevel.INFO,
        message: 'Loading...',
      },
    },

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

        entry: 'setEnteringProjectNameStatus',
      },

      'Redirect to home page': {},
      'Define initial AOI': {
        entry: 'setFirstAoiStatus',
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
    },
    services: {},
  }
);
