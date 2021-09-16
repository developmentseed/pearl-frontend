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
  UPDATE: 'UPDATE'
};

const initialState = {
  prediction_layer_opacity: 1,
  left_panel: true,
  right_panel: true,
};

export function shortcutReducer(state, action) {
  switch (action.type) {
    case actions.SET_PREDICTION_OPACITY_0:
      return {
        ...state,
        prediction_layer_opacity: 0,
      };
    case actions.DECREMENT_PREDICTION_OPACITY:
      return {
        ...state,
        prediction_layer_opacity:
          state.prediction_layer_opacity - 0.1 < 0
            ? 0
            : state.prediction_layer_opacity - 0.1,
      };
    case actions.INCREMENT_PREDICTION_OPACITY:
      return {
        ...state,
        prediction_layer_opacity:
          state.prediction_layer_opacity + 0.1 > 1
            ? 1
            : state.prediction_layer_opacity + 0.1,
      };
    case actions.SET_PREDICTION_OPACITY_100:
      return {
        ...state,
        prediction_layer_opacity: 1,
      };

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

    // Generic value update
    case actions.UPDATE:
      return {
        ...state,
        ...action.data
      }
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
