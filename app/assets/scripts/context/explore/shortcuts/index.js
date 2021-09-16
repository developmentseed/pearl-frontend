import { useReducer } from 'react';
import logger from '../../../utils/logger';
import { wrapLogReducer } from '../../reducers/utils';
import { KEYS } from './keys';

export const actions = {
  TOGGLE_LEFT_PANEL: 'TOGGLE_LEFT_PANEL',
  TOGGLE_RIGHT_PANEL: 'TOGGLE_RIGHT_PANEL',
  SET_PREDICTION_OPACITY_0: 'SET_PREDICTION_OPACITY_0',
  INCREMENT_PREDICTION_OPACITY: 'INCREMENT_PREDICTION_OPACITY',
  DECREMENT_PREDICTION_OPACITY: 'DECREMENT_PREDICTION_OPACITY',
  SET_PREDICTION_OPACITY_100: 'SET_PREDICTION_OPACITY_100',
};

const initialState = {
  left_panel: true,
  right_panel: true,
};

export function shortcutReducer(state, action) {
  switch (action.type) {
    case actions.SET_PREDICTION_OPACITY_0:
      return state;
    case actions.DECREMENT_PREDICTION_OPACITY:
      return state;
    case actions.INCREMENT_PREDICTION_OPACITY:
      return state;
    case actions.SET_PREDICTION_OPACITY_100:
      return state;
    case actions.TOGGLE_LEFT_PANEL:
      return {
        ...state,
        left_panel: !state.left_panel,
      };
    case actions.TOGGLE_RIGHT_PANEL:
      return {
        ...state,
        right_panel: !state.right_panel,
      };
    default:
      logger('Unexpected shortcut action: ', action.type);
      throw new Error('Unexpected error.');
  }
}

export function useShortcutReducer() {
  return useReducer(wrapLogReducer(shortcutReducer), initialState);
}

export const KEY_ACTIONS = {
  [KEYS.a_KEY]: actions.SET_PREDICTION_OPACITY_0,
  [KEYS.s_KEY]: actions.DECREMENT_PREDICTION_OPACITY,
  [KEYS.d_KEY]: actions.INCREMENT_PREDICTION_OPACITY,
  [KEYS.f_KEY]: actions.SET_PREDICTION_OPACITY_100,
  [KEYS.i_KEY]: actions.TOGGLE_LEFT_PANEL,
  [KEYS.o_KEY]: actions.TOGGLE_RIGHT_PANEL,
};

export function listenForShortcuts(event, dispatch) {
  if (KEY_ACTIONS[event.keyCode]) {
    dispatch({ type: KEY_ACTIONS[event.keyCode] });
  }
}
