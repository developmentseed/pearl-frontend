import { useReducer } from 'react';
import logger from '../../utils/logger';
import { wrapLogReducer } from '../reducers/utils';

export const actions = {
  SET_STATUS: 'SET_STATUS',
};

export const initialState = {
  gpuMessage: 'Initializing',
  gpuStatus: 'initializing',
  wsConnected: false,
  gpuConnected: false,
};

export default function instanceReducer(state, action) {
  const { type, data } = action;
  let nextState;

  switch (type) {
    case actions.SET_STATUS: {
      nextState = {
        ...state,
        ...data,
      };
      break;
    }
    default:
      logger('Unexpected instance action type: ', action);
      throw new Error('Unexpected error.');
  }

  return nextState;
}

export function useInstanceReducer() {
  return useReducer(wrapLogReducer(instanceReducer), initialState);
}
