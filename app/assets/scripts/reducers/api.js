import config from '../config';
import {
  makeAbortableActions,
  makeFetchThunk,
  makeAbortableAPIReducer,
  wrapLogReducer,
} from './reduxeed';
const { restApiEndpoint } = config;

/**
 * REST API HEALTH
 */
const restApiHealthActions = makeAbortableActions('REST_API_HEALTH');

export function queryRestApiHealth() {
  return makeFetchThunk({
    url: `${restApiEndpoint}/health`,
    requestFn: restApiHealthActions.request,
    receiveFn: restApiHealthActions.receive,
  });
}

export const createRestApiHealthReducer = wrapLogReducer(
  makeAbortableAPIReducer('REST_API_HEALTH')
);
