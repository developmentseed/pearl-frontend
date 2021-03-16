import React, { createContext, useEffect, useReducer } from 'react';
import T from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';

export const AuthContext = createContext({});

export function AuthProvider(props) {
  const { isAuthenticated, user, isLoading } = useAuth0(initialState);
  const [authState, dispatchAuthState] = useReducer(authReducer, {});

  if (window.Cypress) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      dispatchAuthState({
        type: actions.RECEIVE_LOGIN,
        data: localStorage('auth0Cypress'),
      });
    }, []);
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

AuthProvider.propTypes = {
  children: T.node,
};

const actions = {
  REQUEST_LOGIN: 'REQUEST_LOGIN',
  RECEIVE_LOGIN: 'RECEIVE_LOGIN',
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
