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
import toasts from '../components/common/toasts';
import { getLocalStorageItem } from '../utils/local-storage';

const AuthContext = createContext(null);

const actions = {
  REQUEST_LOGIN: 'REQUEST_LOGIN',
  RECEIVE_LOGIN: 'RECEIVE_LOGIN',
  RESET_LOGIN: 'RESET_LOGIN',
  LOGOUT: 'LOGOUT',
};

const initialState = {
  isLoading: true,
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
        isLoading: false,
        isAuthenticated: false,
        ...action.data,
      };
      break;
    }
    default:
      logger('Unexpected action ', action);
      throw new Error('Unexpected error.');
  }

  return newState;
};

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
  const [authState, dispatchAuthState] = useReducer(authReducer, initialState);

  const fetchToken = async () => {
    try {
      dispatchAuthState({
        type: actions.REQUEST_LOGIN,
      });
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

      if (!isAuthenticatedAuth0) {
        dispatchAuthState({ type: actions.RESET_LOGIN });
      } else {
        fetchToken();
      }
    }, [isLoading, isAuthenticatedAuth0, auth0Error]); // eslint-disable-line react-hooks/exhaustive-deps
  } else {
    useEffect(() => {
      const localStorageAuthState = getLocalStorageItem('authState', 'json');

      dispatchAuthState({
        type: actions.LOAD_AUTH_STATE,
        data: {
          ...initialState,
          ...localStorageAuthState,
          isLoading: false,
        },
      });
      return;
    }, []);
  }

  // Remove welcome banner after auth is resolved
  useEffect(() => {
    if (authState.isLoading) return;
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
  }, [authState?.isLoading]);

  const value = {
    ...authState,
    login: () => loginWithRedirect(),
    logout: () => {
      dispatchAuthState({
        type: actions.RESET_LOGIN,
        data: {
          isLoggingOut: true,
        },
      });

      logoutAuth0({
        returnTo: window.location.origin,
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
      clientId={config.auth0ClientId}
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
    login,
    logout,
    isLoggingOut,
  } = useCheckContext('useAuth');

  return useMemo(() => {
    const restApiClient = new RestApiClient({
      apiToken,
    });
    return {
      restApiClient,
      apiToken,
      isLoading,
      user,
      isAuthenticated,
      login,
      logout,
      isLoggingOut,
    };
  }, [apiToken, isLoading, user && user.id, isAuthenticated, isLoggingOut]);
};

/*
 * HOC that requires user to be logged in to view a route
 * Use this to wrap a component passed to a Route to create a
 * Protected Route
 *
 * ex: <Route
 *      component={withAuthenticationRequired(<Some Component>)
 *      path={path}
 *      />
 */
export function withAuthenticationRequired(WrapperComponent) {
  /* eslint-disable react-hooks/rules-of-hooks */
  const { isAuthenticated, isLoading, isLoggingOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoggingOut) {
      toasts.error('Please sign in to view this page.');
      history.push('/');
    }
  }, [isLoading, isAuthenticated, isLoggingOut]);

  if (isLoading || !isAuthenticated || isLoggingOut) return;

  return WrapperComponent;
  /* eslint-enable react-hooks/rules-of-hooks */
}
