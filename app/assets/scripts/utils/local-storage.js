import logger from './logger';

/**
 * This files adds helper functions to read/write from localStorage. In some scenarios (e. g. Firefox on Apple M1)
 * localStorage get corrupted sometimes and the app crashes.
 *
 * ref. https://stackoverflow.com/questions/18877643/error-in-local-storage-ns-error-file-corrupted-firefox
 */

const theLocalStorage =
  window.localStorage || window.content.localStorage || null;

export function getLocalStorageItem(key) {
  let value;
  try {
    value = theLocalStorage.getItem(key);
  } catch (error) {
    logger('Could not load local storage key: ', key);
    if (error.name === 'NS_ERROR_FILE_CORRUPTED') {
      theLocalStorage.clear();
    }
  }
  return value;
}

export function setLocalStorageItem(key, value) {
  theLocalStorage.setItem(key, value);
}
