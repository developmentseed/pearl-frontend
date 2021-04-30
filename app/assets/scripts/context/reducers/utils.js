import config from '../../config';

const { environment, reduxeedLogs } = config;

export function wrapLogReducer(reducer) {
  /* eslint-disable no-console */
  return (state, action) => {
    const nextState = reducer(state, action);

    if (environment !== 'production' && reduxeedLogs) {
      console.groupCollapsed(action.type);
      console.log(
        '%c%s',
        'color: gray; font-weight: bold',
        'prev state ',
        state
      );
      console.log('%c%s', 'color: cyan; font-weight: bold', 'action ', action);
      console.log(
        '%c%s',
        'color: green; font-weight: bold',
        'next state ',
        nextState
      );
      console.groupEnd();
    }
    return nextState;
  };
  /* eslint-enable no-console */
}
