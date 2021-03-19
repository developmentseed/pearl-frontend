import React, { createContext, useEffect, useReducer } from 'react';
import T from 'prop-types';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import config from '../config';
import logger from '../utils/logger';
import history from '../history';

export const AuthContext = createContext({});

/**
 * Inner provider to be wrapped by Auth0 provider
 */
function InnerAuthProvider(props) {
  const {
    isAuthenticated,
    error: auth0Error,
    user,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();
  const [authState, dispatchAuthState] = useReducer(authReducer, {});

  useEffect(() => {
    const lsAuthState = window.localStorage.getItem('authState');
    if (lsAuthState) {
      dispatchAuthState({
        type: actions.LOAD_AUTH_STATE,
        data: JSON.parse(lsAuthState),
      });
    }
  }, []);

  /**
   * Disable Auth0 hooks when testing.
   */
  if (!window.Cypress) {
    /* eslint-disable react-hooks/rules-of-hooks */
    useEffect(() => {
      if (isLoading) return;

      async function getApiToken() {
        try {
          const token = await getAccessTokenSilently({
            audience: config.audience,
          });
          dispatchAuthState({
            type: actions.RECEIVE_LOGIN,
            data: {
              user,
              apiToken: token,
            },
          });
        } catch (error) {
          logger('login error');
          logger(error);
        }
      }

      if (isAuthenticated !== authState.isAuthenticated) {
        if (isAuthenticated) {
          dispatchAuthState({
            type: actions.REQUEST_LOGIN,
          });
          getApiToken();
        } else {
          dispatchAuthState({
            type: actions.LOGOUT,
          });
        }
      }
    }, [isLoading, isAuthenticated, auth0Error]); // eslint-disable-line react-hooks/exhaustive-deps
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

InnerAuthProvider.propTypes = {
  children: T.node,
};

/**
 * AuthProvider
 */
export function AuthProvider(props) {
  const onRedirectCallback = (appState) => {
    history.replace(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={config.auth0Domain}
      clientId={config.clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <InnerAuthProvider>{props.children}</InnerAuthProvider>
    </Auth0Provider>
  );
}

AuthProvider.propTypes = {
  children: T.node,
};

const actions = {
  LOAD_AUTH_STATE: 'LOAD_AUTH_STATE',
  REQUEST_LOGIN: 'REQUEST_LOGIN',
  RECEIVE_LOGIN: 'RECEIVE_LOGIN',
  LOGOUT: 'LOGOUT',
};

const initialState = {
  isLoading: false,
  error: false,
  isAuthenticated: false,
};

const authReducer = function (state, action) {
  const { type, data } = action;
  let newState;

  logger(type);
  logger(data);
  switch (type) {
    case actions.LOAD_AUTH_STATE: {
      return data;
    }
    case actions.REQUEST_LOGIN: {
      newState = {
        ...initialState,
        isLoading: true,
      };
      break;
    }
    case actions.RECEIVE_LOGIN: {
      newState = {
        isLoading: false,
        error: false,
        isAuthenticated: true,
        ...data,
      };
      break;
    }
    case actions.LOGOUT: {
      newState = {
        ...initialState,
        isAuthenticated: false,
      };
      break;
    }
    default:
      throw new Error('Unexpected error.');
  }

  // Persist auth state to local storage it not using Cypress
  if (!window.Cypress) {
    logger({ newState });
    window.localStorage.setItem('authState', JSON.stringify(newState));
  }

  return newState;
};
