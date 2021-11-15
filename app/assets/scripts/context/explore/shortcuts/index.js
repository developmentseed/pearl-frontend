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
  SET_OVERRIDE_BROWSE_MODE: 'SET_OVERRIDE_BROWSE_MODE',
  UNSET_OVERRIDE_BROWSE_MODE: 'UNSET_OVERRIDE_BROWSE_MODE',

  UPDATE: 'UPDATE',

  SET_ESCAPE_PRESSED: 'SET_ESCAPE_PRESSED',
  SET_ESCAPE_NOT_PRESSED: 'SET_ESCAPE_NOT_PRESSED',
};

const initialState = {
  predictionLayerOpacity: 1,
  leftPanel: true,
  rightPanel: true,
  layerTray: false,
  shortcutsHelp: false,
  overrideBrowseMode: false,
  escapePressed: false,
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
    case actions.SET_OVERRIDE_BROWSE_MODE:
      // Keydown fires when holding,
      // do nothing if already active
      if (state.overrideBrowseMode) {
        return state;
      } else {
        return {
          ...state,
          overrideBrowseMode: true,
        };
      }
    case actions.UNSET_OVERRIDE_BROWSE_MODE:
      return {
        ...state,
        overrideBrowseMode: false,
      };

    case actions.SET_ESCAPE_PRESSED:
      return {
        ...state,
        escapePressed: true,
      };
    case actions.SET_ESCAPE_NOT_PRESSED:
      return {
        ...state,
        escapePressed: false,
      };

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

const ALT = 'altKey';
const SHIFT = 'shiftKey';
const META = 'metaKey';
const CTRL = 'ctrlKey';
const MODIFIERS = [SHIFT, META, CTRL, ALT];

export const KEY_ACTIONS = {
  [KEYS.a_KEY]: {
    keyDownAction: actions.SET_PREDICTION_OPACITY_0,
    modifiers: [],
  },
  [KEYS.s_KEY]: {
    keyDownAction: actions.DECREMENT_PREDICTION_OPACITY,
    modifiers: [],
  },
  [KEYS.d_KEY]: {
    keyDownAction: actions.INCREMENT_PREDICTION_OPACITY,
    modifiers: [],
  },
  [KEYS.f_KEY]: {
    keyDownAction: actions.SET_PREDICTION_OPACITY_100,
    modifiers: [],
  },
  [KEYS.k_KEY]: {
    keyDownAction: actions.TOGGLE_SHORTCUTS_HELP,
    modifiers: [],
  },
  [KEYS.l_KEY]: {
    keyDownAction: actions.TOGGLE_LAYER_TRAY,
    modifiers: [],
  },
  [KEYS.i_KEY]: {
    keyDownAction: actions.TOGGLE_LEFT_PANEL,
    modifiers: [],
  },
  [KEYS.o_KEY]: {
    keyDownAction: actions.TOGGLE_RIGHT_PANEL,
    modifiers: [],
  },
  [KEYS.space_KEY]: {
    keyDownAction: actions.SET_OVERRIDE_BROWSE_MODE,
    keyUpAction: actions.UNSET_OVERRIDE_BROWSE_MODE,
    modifiers: [],
    preventDefault: true,
  },

  [KEYS.esacape_KEY]: {
    keyDownAction: actions.SET_ESCAPE_PRESSED,
    keyUpAction: actions.SET_ESCAPE_NOT_PRESSED,
    modifiers: [],
  },
};

export function listenForShortcuts(event, dispatch) {
  if (KEY_ACTIONS[event.key]) {
    // If no key up action, don't do any checks
    if (event.type === 'keyup' && !KEY_ACTIONS[event.key].keyUpAction) {
      return;
    }

    if (KEY_ACTIONS[event.key].preventDefault) {
      event.preventDefault();
    }

    for (let m of MODIFIERS) {
      if (event[m] && !KEY_ACTIONS[event.key].modifiers.includes(m)) {
        return;
      }
    }

    if (event.type === 'keydown') {
      dispatch({ type: KEY_ACTIONS[event.key].keyDownAction });
    } else if (event.type === 'keyup') {
      dispatch({ type: KEY_ACTIONS[event.key].keyUpAction });
    }
  }
}
