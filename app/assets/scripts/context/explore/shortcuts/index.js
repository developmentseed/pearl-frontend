import { useReducer } from 'react';
import logger from '../../../utils/logger';
import { wrapLogReducer } from '../../reducers/utils';
import { KEYS } from './keys';

export const actions = {
  TOGGLE_LEFT_PANEL: 'TOGGLE_LEFT_PANEL',
  TOGGLE_RIGHT_PANEL: 'TOGGLE_RIGHT_PANEL',
};

const initialState = {
  left_panel: true,
  right_panel: true,
};

export function shortcutReducer(state, action) {
  switch (action.type) {
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
  [KEYS.I_KEY]: actions.TOGGLE_LEFT_PANEL,
  [KEYS.O_KEY]: actions.TOGGLE_RIGHT_PANEL,
};

export function listenForShortcuts(event, dispatch) {
  if (KEY_ACTIONS[event.keyCode]) {
    dispatch({ type: KEY_ACTIONS[event.keyCode] });
  }
}
