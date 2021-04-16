import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import T from 'prop-types';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import config from '../config';
import logger from '../utils/logger';
import history from '../history';
import RestApiClient from '../utils/rest-api-client';

const AuthContext = createContext(null);

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
        isLoading,
        logout: () =>
          dispatchAuthState({
            type: actions.LOGOUT,
          }),
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
    window.localStorage.setItem('authState', JSON.stringify(newState));
  }

  return newState;
};

// Check if consumer function is used properly
const useCheckContext = (fnName) => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <AuthContext> component's context.`
    );
  }

  return context;
};

// Expose current restApiClient to consumer. We should avoid using useContext()
// directly on components.
export const useAuth = () => {
  const {
    apiToken,
    user,
    isAuthenticated,
    logout,
    isLoading,
  } = useCheckContext('useAuth');

  return useMemo(() => {
    const restApiClient = new RestApiClient({
      apiToken,
      handleUnauthorized: () => logout(),
    });
    return { restApiClient, apiToken, isLoading, user, isAuthenticated };
  }, [apiToken, isLoading, user, isAuthenticated]);
};
