export const initialPredictionsState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  error: null,
  data: [],
};

export const actions = {
  START_PREDICTION: 'START_PREDICTION',
  RECEIVE_PREDICTION: 'RECEIVE_PREDICTION',
  COMPLETE_PREDICTION: 'COMPLETE_PREDICTION',
  FAILED_PREDICTION: 'FAILED_PREDICTION',
};

export default function (state, action) {
  const { data } = action;
  switch (action.type) {
    case actions.START_PREDICTION:
      return {
        ...initialPredictionsState,
        fetching: true,
        processed: 0,
        receivedAt: Date.now(),
      };
    case actions.RECEIVE_PREDICTION: {
      // Get bounds
      const [minX, minY, maxX, maxY] = data.bounds;

      // Build prediction object
      const prediction = {
        key: state.data.length + 1,
        image: `data:image/png;base64,${data.image}`,
        bounds: [
          [minY, minX],
          [maxY, maxX],
        ],
      };

      // Add it to state
      return {
        ...state,
        processed: data.processed,
        total: data.total,
        receivedAt: Date.now(),
        data: state.data.concat(prediction),
      };
    }
    case actions.COMPLETE_PREDICTION:
      return {
        ...state,
        receivedAt: Date.now(),
        fetching: false,
        fetched: true,
      };
    case actions.FAILED_PREDICTION:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: true,
      };
    default:
      throw new Error('Unexpected error.');
  }
}
