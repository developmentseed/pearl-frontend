import { initialApiRequestState } from './reduxeed'; 
export const actions = {
  START_PREDICTION: 'START_PREDICTION',
  RECEIVE_PREDICTION: 'RECEIVE_PREDICTION',
  COMPLETE_PREDICTION: 'COMPLETE_PREDICTION',
  FAILED_PREDICTION: 'FAILED_PREDICTION',
};

function wrapApiResult(stateData) {
  const { fetched, fetching, data, error } = stateData;
  const ready = fetched && !fetching;
  return {
    ...stateData,
    raw: () => stateData,
    isReady: (log) => {
      //ready
      if (log)
        console.log(fetched, fetching, ready)
      return ready
    },
    hasError: () => ready && !!error,
    getData: (def = {}) => (ready ? data.results || data : def),
    getMeta: (def = {}) => (ready ? data.meta : def),

  };

}

export default function (state, action) {
  const { data } = action;

  switch (action.type) {
    case actions.START_PREDICTION:
      return wrapApiResult({
        ...initialApiRequestState,
        fetching: true,
        processed: 0,
        receivedAt: Date.now(),
        data: {
          predictions: [],
        },
      });
    case actions.RECEIVE_PREDICTION: {
      // Get bounds
      const [minX, minY, maxX, maxY] = data.bounds;

      // Build prediction object
      const prediction = {
        key: state.data.predictions.length + 1,
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
          predictions: (state.data.predictions || []).concat(prediction),
        },
      });
    }
    case actions.COMPLETE_PREDICTION:
      console.log('COMPLETE')
      console.log(state)

      return wrapApiResult({
        ...state,
        receivedAt: Date.now(),
        fetching: false,
        fetched: true,
      });
    case actions.FAILED_PREDICTION:
      console.log('FAIL')
      return wrapApiResult({
        ...state,
        fetching: false,
        fetched: false,
        error: true,
      });
    default:
      throw new Error('Unexpected error.');
  }
}
