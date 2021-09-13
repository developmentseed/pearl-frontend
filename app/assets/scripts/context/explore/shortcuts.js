import { useReducer } from 'react';
import logger from '../reducers/utils';
import { wrapLogReducer } from '../reducers/utils';

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
