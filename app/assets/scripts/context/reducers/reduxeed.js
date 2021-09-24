import get from 'lodash.get';
import config from '../../config';
import { delay, fetchJSON } from '../../utils/utils';
const { environment, reduxeedLogs } = config;

/**
 * Creates invalidate, request and receive actions.
 *
 * @param {string} actionName The action name to use as suffix
 * @param {bool} hasKey Whether the actions need to handle a key.
 *
 * @returns Object {
 *  invalidate
 *  request
 *  receive
 * }
 */
export function makeActions(actionName, hasKey) {
  const invalidate = (id) => ({ type: `INVALIDATE_${actionName}`, id });
  const request = (id) => ({ type: `REQUEST_${actionName}`, id });
  const receive = (id, data, error = null) => ({
    type: `RECEIVE_${actionName}`,
    id,
    data,
    error,
    receivedAt: Date.now(),
  });
  return hasKey
    ? {
        invalidate,
        request,
        receive,
      }
    : {
        invalidate: () => invalidate(),
        request: () => request(),
        receive: (data, error) => receive(undefined, data, error),
      };
}

/**
 * Extend makeAPIReducer to handle an abort action.
 * Note that this does not support key actions.
 *
 * @param {string} actionName Name of the action
 */
export const makeAbortableAPIReducer = (actionName) => (state, action) => {
  switch (action.type) {
    case `ABORT_${actionName}`:
      return {
        ...state,
        fetching: false,
      };
    default:
      return makeAPIReducer(actionName)(state, action);
  }
};

/**
 * Extend makeActions to include an abort action.
 * Note that this does not support key actions.
 *
 * @param {string} actionName Name of the action
 */
export const makeAbortableActions = (actionName) => {
  const actions = makeActions(actionName);
  const original = actions.receive;
  // Change the receive action of dispatch an ABORT if the error name matches.
  actions.receive = (data, error) =>
    error && error.name === 'AbortError'
      ? { type: `ABORT_${actionName}` }
      : original(data, error);

  return actions;
};

/**
 * Base reducer for an api request, taking into account the action.id
 * If it exists it will store in the state under that path. Allows for
 * page caching.
 *
 * Uses the following actions:
 * - INVALIDATE_<actionName>
 * - REQUEST_<actionName>
 * - RECEIVE_<actionName>
 *
 * @param {string} actionName The action name to use as suffix
 * @param {bool} hasKey Whether the actions need to handle a key.
 *
 * @example
 * const resultsReducer = makeAPIReducer('RESULTS', true);
 */
export function makeAPIReducer(actionName, hasKey) {
  const base = {
    fetching: false,
    fetched: false,
    receivedAt: null,
    error: null,
    data: {},
  };
  // If there's a key the overall state needs to be empty. Ids will be added at
  // a later stage
  const initial = hasKey ? {} : base;
  return (state = initial, action) => {
    const hasId = typeof action.id !== 'undefined';
    switch (action.type) {
      case `INVALIDATE_${actionName}`:
        return hasId ? { ...state, [action.id]: initial } : initial;
      case `REQUEST_${actionName}`: {
        const changeReq = {
          ...state,
          fetching: true,
        };
        return hasId ? { ...state, [action.id]: changeReq } : changeReq;
      }
      case `RECEIVE_${actionName}`: {
        // eslint-disable-next-line prefer-const
        let st = {
          ...base,
          fetched: true,
          receivedAt: action.receivedAt,
        };

        if (action.error) {
          st.error = action.error;
        } else {
          st.data = action.data;
        }

        return hasId ? { ...state, [action.id]: st } : st;
      }
    }
    return state;
  };
}

/**
 * Creates a thunk to perform a query to the given url dispatching the
 * appropriate actions.
 *
 * @param {object} opts Options.
 * @param {string} opts.url Url to query.
 * @param {string} opts.options Options for the fetch request. See `fetch`
 *                 documentation.
 * @param {func} opts.requestFn Request action to dispatch.
 * @param {func} opts.receiveFn Receive action to dispatch.
 * @param {func} opts.mutator Callback to change the response before sending it
 *               to the receive function. Called with (body, headers). Defaults
 *               to returning the body content.
 * @param {func} opts.cache Whether or not the response should be cached. When
 *                true the function will resolve immediately with dispatching
 *                the receive action. The request action is not dispatched it
 *                there's cached data.
 * @param {func} opts.statePath Path in the state to check for the data. It is
 *               required if cache is true. Any format accepted by lodash.get
 *
 * @example
 * function fetchSearchResults () {
 *  return makeFetchThunk({
 *    url: `${config.api}/search`,
 *    requestFn: requestSearchResults,
 *    receiveFn: receiveSearchResults
 *  });
 * }
 *
 * @example with request options.
 * function fetchSearchResults (query) {
 *  return makeFetchThunk({
 *    url: `${config.api}/search`,
 *    options: {
 *      headers: {
 *        'Content-Type': 'application/json'
 *      },
 *      method: 'POST',
 *      body: JSON.stringify(query)
 *    },
 *    requestFn: requestSearchResults,
 *    receiveFn: receiveSearchResults
 *  });
 * }
 *
 * @example with caching
 * function fetchSearchResults () {
 *  return makeFetchThunk({
 *    url: `${config.api}/search`,
 *    cache: true,
 *    statePath: ['search', 'results]
 *    requestFn: requestSearchResults,
 *    receiveFn: receiveSearchResults
 *  });
 * }
 */
export function makeFetchThunk(opts) {
  const {
    url,
    requestFn,
    receiveFn,
    mutator,
    options,
    __devDelay,
    statePath,
    cache,
  } = opts;
  // Default mutator fn is to return the body.
  const _mutator = mutator || ((v) => v);

  return async function (dispatch, getState) {
    // Check if the cache is enabled.
    if (cache) {
      // Get the data from the state to see if it is valid.
      const pageState = get(getState(), statePath);
      if (pageState && pageState.fetched && !pageState.error) {
        if (__devDelay) await delay(__devDelay);
        return dispatch(receiveFn(pageState.data));
      }
    }

    dispatch(requestFn());
    try {
      const { body, headers } = await fetchJSON(url, options);
      const content = _mutator(body, headers);
      if (__devDelay) await delay(__devDelay);
      return dispatch(receiveFn(content));
    } catch (error) {
      if (__devDelay) await delay(__devDelay);
      console.log('error', url, error); // eslint-disable-line
      return dispatch(receiveFn(null, error));
    }
  };
}

/**
 * Gets the given path from the state or return the default:
 * {
 *   fetched: false,
 *   fetching: false,
 *   receivedAt: 0,
 *   data: {},
 *   error: null
 * }
 *
 * @see lodash.get
 *
 * @param {object} state The redux state
 * @param {array | string} path The path to get. Passed to lodash.get
 *
 * @returns {object} State or default
 */
export function getFromState(state, path) {
  return get(state, path, {
    fetched: false,
    fetching: false,
    receivedAt: 0,
    data: {},
    error: null,
  });
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
export function wrapApiResult(stateData, hasKey) {
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

/**
 * Add logging to reducer
 */
export function wrapLogReducer(reducer) {
  /* eslint-disable no-console */
  return (state, action) => {
    const nextState = wrapApiResult(reducer(state, action));

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
