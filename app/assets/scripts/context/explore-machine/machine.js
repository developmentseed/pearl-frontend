import { assign, createMachine } from 'xstate';

/**
 * This is a XState machine for handling AOI states
 */

export const exploreMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwDoAFAQxgAIBLWc1MEiATwGIiNt9yAzMPHAC3Kw8JVHgDaABgC6iFOliU8ldADs5IAB6IAjAE4AzAR0AOACwm9hgKwA2WwckGANCEaITOgmYDsenfY+OmbWAEw6oSYAvlGuaFi4hABivAKUqlDk8Rx4rOyJ3KmCYKoQUrJIIMgKSirqldoI1tZ63r561sFmtj6htiau7gie3n4BPcFhEdExrqroEHAa2YnLNcpqGo0AtLaDiLsEkscnp6c+s1X5+MRkYFQ0dAxD8oob9aCNZqH7w1569kmoTMIWskjMekuKxuKT4-HSmWheDWbzqW0QBhMPgIYJ8nlsAIMoT0JmsvxGANsQJBzXBkNiVwSNzYTLwD0KcMgKNqmwaiB83QItkkejMOmsBgMDmBLjcHn+gJCwNBdJiMSAA */
    predictableActionArguments: true,
    id: 'project',
    initial: 'Page is ready',

    context: {
      project: {},
    },

    states: {
      'Page is ready': {
        on: {
          'Project fetch start': {
            target: 'Fetching project',
          },
        },
      },

      'Fetching project': {
        on: {
          'Project fetch end': 'Project is fetched',
        },
      },

      'Project is fetched': {},
    },
  },
  {
    guards: {
      projectIsNew: (c) => c.project.id === 'new',
    },
    actions: {
      setProjectName: assign((c, e) => {
        return {
          ...c,
          project: {
            ...c.project,
            name: e.data,
          },
        };
      }),
    },
    services: {
      fetchProject: () => {},
    },
  }
);
