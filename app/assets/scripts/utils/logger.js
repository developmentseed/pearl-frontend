import config from '../config';
const { environment } = config;

/**
 * Helper function to write to console on non-production environments
 * @param {String} message
 */
export default function (message) {
  if (environment !== 'production') {
    console.log(message); // eslint-disable-line no-console
  }
}
