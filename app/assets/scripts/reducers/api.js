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
 * else if subpathProvided -> get by subpath (endpoint/subpath)
 * else  if id provided-> get by id (endpoint/id)
 */
export function queryApiGet({ endpoint, id, subPath, token, name }) {
  if (!token) {
    throw new Error(`Token required for ${endpoint}`);
  }
  const queryApiGetActions = makeAbortableActions(
    `API_GET_${(name || endpoint).toUpperCase()}`
  );
  let url = `${restApiEndpoint}/api/${endpoint}`;

  if (subPath) {
    url = `${url}/${subPath}`;
  } else if (id) {
    url = `${url}/${id}`;
  }
  return makeFetchThunk({
    url,
    options: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    },
    requestFn: queryApiGetActions.request,
    receiveFn: queryApiGetActions.receive,
  });
}

export const createQueryApiGetReducer = (endpoint) =>
  wrapLogReducer(makeAPIReducer(`API_GET_${endpoint.toUpperCase()}`));

/*
 * API Endpoint reducer
 * Use to query any get endpoint
 * if id is undefined -> List  results
 * else -> get by id
 */
export function queryApiPost({ endpoint, query, token, name }) {
  if (!token) {
    throw new Error(`Token required for ${endpoint}`);
  }
  const queryApiPostActions = makeAbortableActions(
    `API_POST_${(name || endpoint).toUpperCase()}`
  );
  return makeFetchThunk({
    url: `${restApiEndpoint}/api/${endpoint}`,
    options: {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
      method: 'POST',
    },
    requestFn: queryApiPostActions.request,
    receiveFn: queryApiPostActions.receive,
  });
}

export const createQueryApiPostReducer = (endpoint) =>
  wrapLogReducer(makeAPIReducer(`API_POST_${endpoint.toUpperCase()}`));
