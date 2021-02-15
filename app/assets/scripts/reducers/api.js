import config from '../config';
import {
  makeAbortableActions,
  makeFetchThunk,
  makeAPIReducer,
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
  makeAPIReducer('REST_API_HEALTH')
);

/**
 * API Metadata
 */
const apiMetaActions = makeAbortableActions('API_META');

export function queryApiMeta() {
  return makeFetchThunk({
    url: `${restApiEndpoint}/api`,
    requestFn: apiMetaActions.request,
    receiveFn: apiMetaActions.receive,
  });
}

export const createApiMetaReducer = wrapLogReducer(makeAPIReducer('API_META'));
