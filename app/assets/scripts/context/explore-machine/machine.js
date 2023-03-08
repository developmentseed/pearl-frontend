import { createMachine } from 'xstate';

/**
 * This is a XState machine for handling AOI states
 */

export const exploreMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwDoBlPAQ1TwGITy8ACAG3VIgEsA7KOtLXPAbQAMAXUQp0sVnlbp2YkAA9EAJgCsyggDYAnJs3KAzJoDsy06oCMAFgA0IAJ6ILq1VoPaDV48cFGvqzQBfQLsebHxiMgpqKPomFg4uML5+C1EkEGQJKRk5DKUENQ0dPUMTMzVrO0dCgK0LAA5VKwNlbQtBDwNg0IxwwgAFUhg6Vlg6AFt0AFd2PEgY2kZmNk5uPpSReSzJaVl5AqKtXX0jU3Mqh0QGiwIrJs0G5WfVBsFDVR7MjYihkbHJjM5gsaBRlgk1sl8Kl0uJdrkDip1MdSmcKpZbFdCoJNAQLMoGtorM1tMYDD4rMEQiB2OgIHBtj88Ntsns8qACgBaTTVRCc1zaQVC4XC7rUqGEUHMjI7HL7fKIKzKXkIay4wnvfHaJrWVTGL4SggAUWBqHWvHwdHYpAmYBZ8PlHMQqm0rnuBgsnsEVm0BIaKsJBEM7nu6n8mgsQXFTIIAyZo3G8XpEHtcvZimdrruDQ9Xp9fpVygsBgIDW8Hw6kda2oNMb+YATgNm8xTMtZCIVCBMpe1obUAQamkExgDDTughxzgs7SVBOUVMCQA */
    predictableActionArguments: true,
    id: 'project',
    initial: 'Start',

    context: {
      project: {},
    },

    states: {
      Start: {
        // entry: 'setProjectId',

        on: {
          'Start loading project': [
            {
              target: 'Enter project name',
              cond: 'projectIsNew',
            },
            {
              target: 'Project is loaded',
            },
          ],
        },
      },

      'Enter project name': {},
      'Project is loaded': {},
    },
    'Page is mounted': {
      on: {
        'Initialize project': [
          {
            target: 'Enter project name',
            cond: 'isNew',
          },
          {
            target: 'Load project',
          },
        ],
      },
    },
  },
  {
    guards: {},
    actions: {},
  }
);
