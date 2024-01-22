import config from '../config';
const { environment } = config;

/**
 * Log a message to the console if the environment is not production
 * @param {...any} message - The message to log
 * @example
 * logger('Hello world');
 * // => 'Hello world'
 * @example
 * logger('Hello', 'world');
 * // => 'Hello world'
 */
export default function (...message) {
  if (environment !== 'production') {
    console.log(...message); // eslint-disable-line no-console
  }
}
