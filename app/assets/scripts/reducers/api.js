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

/*
 * API Endpoint reducer
 * Use to query any get endpoint
 * if id is undefined -> List  results
 * else -> get by id
 */
export function queryApiGet({ endpoint, id, token }) {
  if (!token) {
    throw new Error(`Token required for ${endpoint}`);
  }
  const queryApiGetActions = makeAbortableActions(
    `API_GET_${endpoint.toUpperCase()}`
  );
  return makeFetchThunk({
    url: `${restApiEndpoint}/api/${endpoint}${id ? `:${id}` : ''}`,
    options: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET'
    },
    requestFn: queryApiGetActions.request,
    receiveFn: queryApiGetActions.receive,
  });
}

export const createQueryApiGetReducer = (endpoint) =>
  wrapLogReducer(makeAPIReducer(`API_GET_${endpoint.toUpperCase()}`));
