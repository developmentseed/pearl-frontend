import React, { useContext, useMemo, createContext, useReducer } from 'react';
import T from 'prop-types';
import logger from '../utils/logger';

import { wrapLogReducer } from './reducers/utils';

const PredictionsContext = createContext(null);

const initialState = {
  status: 'idle',
  data: {},
  error: null,
};

export function PredictionsProvider(props) {
  const [predictions, dispatchPredictions] = useReducer(
    wrapLogReducer(predictionsReducer),
    initialState
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
  RECEIVE_RETRAIN_PROGRESS: 'RECEIVE_RETRAIN_PROGRESS',
  RECEIVE_PREDICTION: 'RECEIVE_PREDICTION',
  RECEIVE_AOI_META: 'RECEIVE_AOI_META',
  COMPLETE_PREDICTION: 'COMPLETE_PREDICTION',
  FAILED_PREDICTION: 'FAILED_PREDICTION',
  CLEAR_PREDICTION: 'CLEAR_PREDICTION',
};

export function predictionsReducer(state, action) {
  const { data } = action;
  let newState;

  switch (action.type) {
    case actions.START_PREDICTION:
      newState = {
        ...initialState,
        status: 'running',
        processed: 0,
        retrainProgress: 0,
        data: {
          predictions: [],
          aoiId: null,
          type: data.type,
        },
      };
      break;
    case actions.RECEIVE_AOI_META:
      newState = {
        ...state,
        data: {
          ...state.data,
          aoiId: data.id,
        },
      };
      break;
    case actions.RECEIVE_RETRAIN_PROGRESS:
      newState = {
        ...state,
        retrainProgress: data,
      };
      break;
    case actions.RECEIVE_PREDICTION: {
      // Get bounds
      const predictionAoiId = data.aoi;
      const currentAoiId = state.data.aoiId;

      // only process prediction if AOI ID matches current AOI ID
      if (predictionAoiId === currentAoiId) {
        let predictions = state.data.predictions || [];

        // Extract geo-located image from message
        try {
          const [minX, minY, maxX, maxY] = data.bounds;

          // Build prediction object
          predictions = predictions.concat({
            key: state.data.predictions.length + 1,
            image: `data:image/png;base64,${data.image}`,
            bounds: [
              [minY, minX],
              [maxY, maxX],
            ],
          });
        } catch (error) {
          logger('Could not parse message: ', { message: data });
          logger(error);
        }

        // Add it to state
        newState = {
          ...state,
          processed: data.processed,
          total: data.total,
          data: {
            ...state.data,
            predictions,
          },
        };
      } else {
        logger('Received prediction for previous AOI', data);
        newState = { ...state };
      }
      break;
    }
    case actions.COMPLETE_PREDICTION:
      newState = {
        ...state,
        status: 'success',
      };
      break;
    case actions.CLEAR_PREDICTION:
      newState = {
        ...initialState,
      };
      break;
    case actions.FAILED_PREDICTION:
      newState = {
        ...state,
        status: 'error',
        error: true,
      };
      break;
    default:
      logger(`Unexpected action type ${action.type} on predictions reducer.`);
      throw new Error('Unexpected error.');
  }

  // Add helper props
  newState = {
    ...newState,
    isReady: newState.status !== 'idle' && newState.status !== 'loading',
    hasError: newState.status === 'error',
  };

  return newState;
}
