import {
  makeAbortableActions,
  makeFetchThunk,
  makeAbortableAPIReducer,
  wrapLogReducer,
} from './reduxeed';
import config from '../config';
const { restApiEndoint } = config;

/**
 * USER SIGN UP
 */
const userSignUpActions = makeAbortableActions('USER_SIGN_UP');

export function queryUserSignUp(payload) {
  return makeFetchThunk({
    url: `${restApiEndoint}/api/user`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    requestFn: userSignUpActions.request,
    receiveFn: userSignUpActions.receive,
  });
}

export const createUserSignUpReducer = wrapLogReducer(
  makeAbortableAPIReducer('USER_SIGN_UP')
);
