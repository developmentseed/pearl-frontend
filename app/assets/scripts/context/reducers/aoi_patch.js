import { initialApiRequestState } from './reduxeed';

export const actions = {
  INIT: 'INIT',
  START_PATCH: 'START_PATCH',
  RECEIVE_PATCH: 'RECEIVE_PATCH',
  RECEIVE_AOI_META: 'RECEIVE_AOI_META',
  COMPLETE_PATCH: 'COMPLETE_PATCH',
  FAILED_PATCH: 'FAILED_PATCH',
  CLEAR_PATCH: 'CLEAR_PATCH',
};

function wrapApiResult(stateData) {
  const { fetched, fetching, data, error } = stateData;
  const ready = fetched && !fetching;
  return {
    ...stateData,
    raw: () => stateData,
    isReady: () => {
      return ready;
    },
    hasError: () => ready && !!error,
    getData: (def = {}) => (ready ? data.results || data : def),
    getMeta: (def = {}) => (ready ? data.meta : def),
  };
}

export default function (state, action) {
  const { data } = action;

  switch (action.type) {
    case actions.INIT:
      return wrapApiResult({
        ...initialApiRequestState,
        data: {
          name: data.name,
        },
      });

    case actions.START_PATCH:
      return wrapApiResult({
        fetching: true,
        processed: 0,
        receivedAt: Date.now(),
        data: {
          ...state.data,
          patches: [],
          id: action.data.id,
        },
      });

    case actions.RECEIVE_PATCH: {
      const [minX, minY, maxX, maxY] = data.bounds;

      const patch = {
        key: state.data.patches.length + 1,
        image: `data:image/png;base64,${data.image}`,
        bounds: [
          [minY, minX],
          [maxY, maxX],
        ],
      };
      // Add it to state
      return wrapApiResult({
        ...state,
        processed: data.processed,
        total: data.total,
        receivedAt: Date.now(),
        data: {
          ...state.data,
          patches: (state.data.patches || []).concat(patch),
        },
      });
    }
    case actions.COMPLETE_PATCH:
      return wrapApiResult({
        ...state,
        receivedAt: Date.now(),
        fetching: false,
        fetched: true,
      });
    case actions.CLEAR_PATCH:
      return wrapApiResult({
        ...initialApiRequestState,
      });
    case actions.FAILED_PATCH:
      return wrapApiResult({
        ...state,
        fetching: false,
        fetched: false,
        error: true,
      });
    default:
      console.log(action);
      throw new Error('Unexpected error.');
  }
}
