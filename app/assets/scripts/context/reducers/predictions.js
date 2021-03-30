import { initialApiRequestState } from './reduxeed';
import logger from '../utils/logger';

export const actions = {
  START_PREDICTION: 'START_PREDICTION',
  RECEIVE_PREDICTION: 'RECEIVE_PREDICTION',
  RECEIVE_AOI_META: 'RECEIVE_AOI_META',
  COMPLETE_PREDICTION: 'COMPLETE_PREDICTION',
  FAILED_PREDICTION: 'FAILED_PREDICTION',
  CLEAR_PREDICTION: 'CLEAR_PREDICTION',
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
    case actions.START_PREDICTION:
      return wrapApiResult({
        ...initialApiRequestState,
        fetching: true,
        processed: 0,
        receivedAt: Date.now(),
        data: {
          predictions: [],
          aoiId: null,
        },
      });

    case actions.RECEIVE_AOI_META:
      return wrapApiResult({
        ...state,
        data: {
          ...state.data,
          aoiId: data.id,
        },
      });

    case actions.RECEIVE_PREDICTION: {
      // Get bounds
      const predictionAoiId = data.aoi;
      const currentAoiId = state.data.aoiId;

      // only process prediction if AOI ID matches current AOI ID
      if (predictionAoiId === currentAoiId) {
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
            ...state.data,
            predictions: (state.data.predictions || []).concat(prediction),
          },
        });
      } else {
        logger('Received prediction for previous AOI', data);
      }
    }
    case actions.COMPLETE_PREDICTION:
      return wrapApiResult({
        ...state,
        receivedAt: Date.now(),
        fetching: false,
        fetched: true,
      });
    case actions.CLEAR_PREDICTION:
      return wrapApiResult({
        ...initialApiRequestState,
      });
    case actions.FAILED_PREDICTION:
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
