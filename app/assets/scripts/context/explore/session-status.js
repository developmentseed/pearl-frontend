import { useReducer } from 'react';
import logger from '../../utils/logger';
import { wrapLogReducer } from '../reducers/utils';

export const actions = {
  SET_MODE: 'SET_MODE',
  SET_MESSAGE: 'SET_MESSAGE',
};

export const sessionModes = {
  LOADING: 'LOADING',
  SET_PROJECT_NAME: 'SET_PROJECT_NAME',
  SET_AOI: 'SET_AOI',
  SELECT_MODEL: 'SELECT_MODEL',
  PREDICTION_READY: 'PREDICTION_READY',
  RUNNING_PREDICTION: 'RUNNING_PREDICTION',
  LOADING_PROJECT: 'LOADING_PROJECT',
  RETRAINING: 'RETRAINING',
  RETRAIN_READY: 'RETRAIN_READY',
};

export const initialState = {
  mode: sessionModes.LOADING,
  level: 'info',
  message: 'Loading...',
};

const modesMeta = [
  {
    mode: sessionModes.SET_PROJECT_NAME,
    level: 'info',
    message: 'Set Project Name',
  },
  {
    mode: sessionModes.SET_AOI,
    level: 'info',
    message: 'Set AOI',
  },
  {
    mode: sessionModes.SELECT_MODEL,
    level: 'info',
    message: 'Select Mosaic & Model',
  },
  {
    mode: sessionModes.PREDICTION_READY,
    level: 'info',
    message: 'Ready for prediction run',
  },
  {
    mode: sessionModes.RUNNING_PREDICTION,
    level: 'info',
    message: 'Running prediction',
  },
  {
    mode: sessionModes.LOADING_PROJECT,
    level: 'info',
    message: 'Loading project...',
  },
  {
    mode: sessionModes.RETRAINING,
    level: 'info',
    message: 'Retraining...',
  },
  {
    mode: sessionModes.RETRAIN_READY,
    level: 'info',
    message: 'Ready for retrain run',
  },
];

export default function sessionStatusReducer(state, action) {
  const { type, data } = action;
  let newState;

  switch (type) {
    case actions.SET_MODE: {
      newState = {
        ...state,
        ...modesMeta.find(({ mode }) => mode === data),
      };
      break;
    }
    case actions.SET_MESSAGE: {
      newState = {
        ...state,
        message: data,
      };
      break;
    }
    default:
      logger('Unexpected instance action type: ', action);
      throw new Error('Unexpected error.');
  }

  return newState;
}

export function useSessionStatusReducer() {
  return useReducer(wrapLogReducer(sessionStatusReducer), initialState);
}
