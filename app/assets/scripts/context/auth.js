import React, { createContext, useEffect, useReducer } from 'react';
import T from 'prop-types';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import config from '../config';

export const AuthContext = createContext({});

/**
 * Inner provider to be wrapped by Auth0 provider
 */
function InnerAuthProvider(props) {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const [authState, dispatchAuthState] = useReducer(authReducer, {});

  if (window.Cypress) {
    const auth0Cypress = localStorage.getItem('auth0Cypress');
    if (auth0Cypress) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        dispatchAuthState({
          type: actions.RECEIVE_LOGIN,
          data: JSON.parse(auth0Cypress),
        });
      }, []);
    }
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (isLoading) {
        dispatchAuthState({
          type: actions.REQUEST_LOGIN,
        });
      } else if (isAuthenticated) {
        dispatchAuthState({
          type: actions.RECEIVE_LOGIN,
          data: {
            user,
          },
        });
      } else {
        dispatchAuthState({
          type: actions.LOGOUT,
        });
      }
    }, [isAuthenticated, user, isLoading]);
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
  const onRedirectCallback = () => {
    window.location = window.location.pathname;
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
  const { data } = action;
  switch (action.type) {
    case actions.REQUEST_LOGIN:
      return {
        ...initialState,
        isLoading: true,
      };
    case actions.RECEIVE_LOGIN:
      return {
        isLoading: false,
        error: false,
        isAuthenticated: true,
        ...data,
      };
    case actions.LOGOUT:
      return {
        ...initialState,
        isAuthenticated: false,
      };
    default:
      throw new Error('Unexpected error.');
  }
};
