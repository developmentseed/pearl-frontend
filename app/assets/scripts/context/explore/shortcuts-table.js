import { actions } from './shortcuts';

const I_KEY = 73;
const O_KEY = 79;

export const KEYS = {
  I_KEY,
  O_KEY,
};

export const KEY_ACTIONS = {
  I_KEY: actions.TOGGLE_LEFT_PANEL,
  O_KEY: actions.TOGGLE_RIGHT_PANEL,
};
