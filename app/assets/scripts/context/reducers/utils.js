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

/**
 * Wraps the api result with helpful functions.
 *
 *
 * @param {object} stateData Api result object.
 *                 {
 *                   fetched: bool,
 *                   fetching: bool,
 *                   data: object,
 *                   error: null | error
 *                 }
 *                If `hasKey` is true then the object needs to be keyed.
 *                 {
 *                   id: {
 *                     fetched: bool,
 *                     fetching: bool,
 *                     data: object,
 *                     error: null | error
 *                   }
 *                 }
 * @param {bool} hasKey Whether the data is the result of key actions.
 *
 * @returns {object}
 * {
 *   raw(): returns the data as is.
 *   isReady(): Whether or not the fetching finished and was fetched.
 *   hasError(): Whether the request finished with an error.
 *   getData(): Returns the data. If the data has a results list will return that
 *   getMeta(): If there's a meta object it will be returned
 * }
 * If the `hasKey` is true the return is a keyed object.
 *
 * As backward compatibility all data properties are accessible directly.
 *
 * @tutorial
 * This is recommended when using a cached thunk to fetch multiple related
 * entries.
 * A common use case is when you have a list of content and then individual
 * entries. Let's use books as example.
 * A user may have a list of books, and then get info on a specific book.
 * A state for this could look like:
 * {
 *   books: {
 *    fetching
 *    fetched
 *    data
 *    error
 *   }
 *   singleBook: {
 *    fetching
 *    fetched
 *    data
 *    error
 *   }
 * }
 *
 * This means that we're storing info about a single book at a time, and if the
 * user wants to go back to a previously visited book data has to be fetched
 * again. In this case would be better to cache the data.
 * So we structure the state as:
 * books: {
 *   list: {
 *    fetching
 *    fetched
 *    data
 *    error
 *   }
 *   single: {
 *     [bookId] {
 *       fetching
 *       fetched
 *       data
 *       error
 *     }
 *     [bookId] {
 *       fetching
 *       fetched
 *       data
 *       error
 *     }
 *   }
 * }
 *
 */
function wrapApiResult(stateData, hasKey) {
  return hasKey
    ? Object.keys(stateData).reduce(
        (acc, k) => ({
          ...acc,
          [k]: wrapper(stateData[k]),
        }),
        {}
      )
    : wrapper(stateData);
}

function wrapper(stateData) {
  const { fetched, fetching, data, error } = stateData;
  const ready = fetched && !fetching;
  return {
    raw: () => stateData,
    isReady: () => ready,
    hasError: () => ready && !!error,
    getData: (def = {}) => (ready ? data.results || data : def),
    getMeta: (def = {}) => (ready ? data.meta : def),

    // As backward compatibility
    ...stateData,
  };
}

/**
 * Default initial API state when using Reduxeed
 */
export const initialApiRequestState = wrapApiResult({
  fetching: false,
  fetched: false,
  error: null,
  data: {},
});
