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
  TOGGLE_LAYER_TRAY: 'TOGGLE_LAYER_TRAY',

  TOGGLE_SHORTCUTS_HELP: 'TOGGLE_SHORTCUTS_HELP',
  OVERRIDE_BROWSE_MODE: 'OVERRIDE_BROWSE_MODE',
  UPDATE: 'UPDATE',
};

const initialState = {
  predictionLayerOpacity: 1,
  leftPanel: true,
  rightPanel: true,
  layerTray: false,
  shortcutsHelp: false,
  overrideBrowseMode: false
};

export function shortcutReducer(state, action) {
  switch (action.type) {
    case actions.SET_PREDICTION_OPACITY_0:
      return {
        ...state,
        predictionLayerOpacity: 0,
      };

    case actions.TOGGLE_SHORTCUTS_HELP:
      return {
        ...state,
        shortcutsHelp: !state.shortcutsHelp,
      };
    case actions.DECREMENT_PREDICTION_OPACITY:
      return {
        ...state,
        predictionLayerOpacity:
          state.predictionLayerOpacity - 0.1 < 0
            ? 0
            : state.predictionLayerOpacity - 0.1,
      };
    case actions.INCREMENT_PREDICTION_OPACITY:
      return {
        ...state,
        predictionLayerOpacity:
          state.predictionLayerOpacity + 0.1 > 1
            ? 1
            : state.predictionLayerOpacity + 0.1,
      };
    case actions.SET_PREDICTION_OPACITY_100:
      return {
        ...state,
        predictionLayerOpacity: 1,
      };

    case actions.TOGGLE_LEFT_PANEL:
      return {
        ...state,
        leftPanel: !state.leftPanel,
      };
    case actions.TOGGLE_RIGHT_PANEL:
      return {
        ...state,
        rightPanel: !state.rightPanel,
      };

    case actions.TOGGLE_LAYER_TRAY:
      return {
        ...state,
        layerTray: !state.layerTray,
      };
    case actions.OVERRIDE_BROWSE_MODE:
      return {
        ...state,
        overrideBrowseMode: !state.overrideBrowseMode
      }
    // Generic value update
    case actions.UPDATE:
      return {
        ...state,
        ...action.data,
      };
    default:
      logger('Unexpected shortcut action: ', action.type);
      throw new Error('Unexpected error.');
  }
}

export function useShortcutReducer() {
  return useReducer(wrapLogReducer(shortcutReducer), initialState);
}

const SHIFT = 'shiftKey';
const META = 'metaKey';
const CTRL = 'ctrlKey';
const MODIFIERS = [SHIFT, META, CTRL];

export const KEY_ACTIONS = {
  [KEYS.a_KEY]: {
    action: actions.SET_PREDICTION_OPACITY_0,
    modifiers: [],
  },
  [KEYS.s_KEY]: {
    action: actions.DECREMENT_PREDICTION_OPACITY,
    modifiers: [],
  },
  [KEYS.d_KEY]: {
    action: actions.INCREMENT_PREDICTION_OPACITY,
    modifiers: [],
  },
  [KEYS.f_KEY]: {
    action: actions.SET_PREDICTION_OPACITY_100,
    modifiers: [],
  },
  [KEYS.k_KEY]: {
    action: actions.TOGGLE_SHORTCUTS_HELP,
    modifiers: [],
  },
  [KEYS.l_KEY]: {
    action: actions.TOGGLE_LAYER_TRAY,
    modifiers: [],
  },
  [KEYS.i_KEY]: {
    action: actions.TOGGLE_LEFT_PANEL,
    modifiers: [],
  },
  [KEYS.o_KEY]: {
    action: actions.TOGGLE_RIGHT_PANEL,
    modifiers: [],
  },
  [KEYS.shift_KEY]: {
    action: actions.OVERRIDE_BROWSE_MODE,
    modifiers: [SHIFT],
  },
};

export function listenForShortcuts(event, dispatch) {
  if (KEY_ACTIONS[event.keyCode]) {
    for (let m of MODIFIERS) {
        console.log(KEY_ACTIONS[event.keyCode].modifiers.includes(m))
      if (event[m] && !KEY_ACTIONS[event.keyCode].modifiers.includes(m)) {
        return;
      }
    }
    dispatch({ type: KEY_ACTIONS[event.keyCode].action });
  }
}
