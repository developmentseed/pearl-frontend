import toasts from '../components/common/toasts';
import config from '../config';
import { fetchJSON } from '../context/reducers/reduxeed';
import history from '../history';
import logger from './logger';
const { restApiEndpoint } = config;

export default async function checkApiHealth() {
  // Bypass home and about page
  if (['/', '/about'].includes(history.location.pathname)) {
    return;
  }

  let isHealthy = false;
  try {
    const { body } = await fetchJSON(`${restApiEndpoint}/health`);
    isHealthy = body && body.healthy;
  } catch (error) {
    logger(error);
    isHealthy = false;
  }

  if (!isHealthy) {
    history.push('/');
    toasts.error('API is unreachable at the moment, please try again later.');
  }
}