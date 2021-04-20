import React, { useContext, useMemo, createContext, useReducer } from 'react';
import T from 'prop-types';
import { initialApiRequestState } from './reducers/reduxeed';
import logger from '../utils/logger';

const PredictionsContext = createContext(null);

export function PredictionsProvider(props) {
  const [predictions, dispatchPredictions] = useReducer(
    predictionsReducer,
    initialApiRequestState
  );

  const value = {
    predictions,
    dispatchPredictions,
  };

  return (
    <PredictionsContext.Provider value={value}>
      {props.children}
    </PredictionsContext.Provider>
  );
}

PredictionsProvider.propTypes = {
  children: T.node,
};

// Check if consumer function is used properly
const usePredictionsContext = (fnName) => {
  const context = useContext(PredictionsContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <PredictionsContext> component's context.`
    );
  }

  return context;
};

export const usePredictions = () => {
  const { predictions, dispatchPredictions } = usePredictionsContext(
    'usePredictions'
  );

  return useMemo(
    () => ({
      predictions,
      dispatchPredictions,
    }),
    [predictions]
  );
};

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

export function predictionsReducer(state, action) {
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
        // Discard messages with no image (non-live message)
        if (!data.bounds || !data.image) return state;

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
        return state;
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
