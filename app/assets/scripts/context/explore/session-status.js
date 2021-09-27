import { useReducer } from 'react';
import logger from '../../utils/logger';
import { wrapLogReducer } from '../reducers/utils';

export const actions = {
  SET_MODE: 'SET_MODE',
  SET_MESSAGE: 'SET_MESSAGE',
};

export const initialState = {
  mode: 'loading',
  level: 'info',
  message: 'Loading...',
};

const modes = [
  {
    mode: 'set-project-name',
    level: 'info',
    message: 'Set Project Name',
  },
  {
    mode: 'set-aoi',
    level: 'info',
    message: 'Set AOI',
  },
  {
    mode: 'select-model',
    level: 'info',
    message: 'Select Model',
  },
  {
    mode: 'prediction-ready',
    level: 'info',
    message: 'Ready for prediction run',
  },
  {
    mode: 'running-prediction',
    level: 'info',
    message: 'Running prediction',
  },
  {
    mode: 'loading-project',
    level: 'info',
    message: 'Loading project...',
  },
  {
    mode: 'retrain-ready',
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
        ...modes.find(({ mode }) => mode === data),
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