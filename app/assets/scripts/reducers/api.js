import config from '../config';
import {
  makeAbortableActions,
  makeFetchThunk,
  makeAbortableAPIReducer,
  wrapLogReducer,
} from './reduxeed';
const { restApiEndoint } = config;

/**
 * REST API HEALTH
 */
const restApiHealthActions = makeAbortableActions('REST_API_HEALTH');

export function queryRestApiHealth() {
  return makeFetchThunk({
    url: `${restApiEndoint}/health`,
    requestFn: restApiHealthActions.request,
    receiveFn: restApiHealthActions.receive,
  });
}

export const createRestApiHealthReducer = wrapLogReducer(
  makeAbortableAPIReducer('REST_API_HEALTH')
);
