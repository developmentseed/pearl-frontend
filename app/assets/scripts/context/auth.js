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
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '../utils/local-storage';

const AuthContext = createContext(null);

/**
 * Inner provider to be wrapped by Auth0 provider
 */
function InnerAuthProvider(props) {
  const {
    loginWithRedirect,
    isAuthenticated: isAuthenticatedAuth0,
    error: auth0Error,
    user,
    isLoading,
    getAccessTokenSilently,
    logout: logoutAuth0,
  } = useAuth0();
  const [authState, dispatchAuthState] = useReducer(authReducer, {});

  function resetLogin() {
    dispatchAuthState({
      type: actions.RESET_LOGIN,
    });
  }

  useEffect(() => {
    // Read auth state from local storage, logout on error
    const localStorageAuthState = getLocalStorageItem('authState', 'json');

    // If no auth state is found, reset login
    if (
      !localStorageAuthState ||
      (localStorageAuthState && !localStorageAuthState.apiToken)
    ) {
      resetLogin();
      return;
    }

    // When running Cypress load auth state and bypass API token check
    if (window.Cypress) {
      dispatchAuthState({
        type: actions.LOAD_AUTH_STATE,
        data: localStorageAuthState,
      });
      return;
    }

    // Create new API client to validate API token
    const client = new RestApiClient({
      apiToken: localStorageAuthState.apiToken,
    });

    // Check API token is still valid
    client
      .get('user/me')
      .then(() => {
        // On success finish loading auth data to state
        dispatchAuthState({
          type: actions.LOAD_AUTH_STATE,
          data: localStorageAuthState,
        });
      })
      .catch((err) => {
        logger(err);

        // If still authenticated to Auth0, try to refresh token
        if (isAuthenticatedAuth0) {
          fetchToken();
        } else {
          resetLogin();
        }
      });
  }, []);

  const fetchToken = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: config.restApiEndpoint,
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
      dispatchAuthState({
        type: actions.RESET_LOGIN,
      });
    }
  };

  /**
   * Disable Auth0 hooks when testing.
   */
  if (!window.Cypress) {
    /* eslint-disable react-hooks/rules-of-hooks */
    useEffect(() => {
      if (isLoading) return;

      if (isAuthenticatedAuth0 !== authState.isAuthenticated) {
        if (isAuthenticatedAuth0) {
          dispatchAuthState({
            type: actions.REQUEST_LOGIN,
          });
          fetchToken();
        } else {
          history.push('/');
          dispatchAuthState({
            type: actions.RESET_LOGIN,
          });
        }
      }
    }, [isLoading, isAuthenticatedAuth0, auth0Error]); // eslint-disable-line react-hooks/exhaustive-deps
  }

  const value = {
    ...authState,
    isLoading,
    authStateIsLoading: authState.isLoading,
    refreshAuth: fetchToken,
    login: () => loginWithRedirect(),
    logout: () => {
      logoutAuth0({
        returnTo: window.location.origin,
      });
      dispatchAuthState({
        type: actions.RESET_LOGIN,
      });
    },
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
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
      audience={config.restApiEndpoint}
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
    case actions.RESET_LOGIN: {
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
    // Write auth state to local storage
    try {
      setLocalStorageItem('authState', JSON.stringify(newState));
    } catch (error) {
      logger('Cannot persist auth state to local storage.');
      logger(error);
    }
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
    isLoading,
    authStateIsLoading,
    refreshAuth,
    login,
    logout,
  } = useCheckContext('useAuth');

  return useMemo(() => {
    const restApiClient = new RestApiClient({
      apiToken,
    });
    return {
      restApiClient,
      apiToken,
      isLoading,
      authStateIsLoading,
      user,
      isAuthenticated,
      refreshAuth,
      login,
      logout,
    };
  }, [
    apiToken,
    isLoading,
    authStateIsLoading,
    user && user.id,
    isAuthenticated,
  ]);
};
