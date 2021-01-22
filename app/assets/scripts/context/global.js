import React, { createContext, useEffect, useReducer, useState } from 'react';
import T from 'prop-types';
import { fetchJSON, initialApiRequestState } from '../reducers/reduxeed';
import {
  createRestApiHealthReducer,
  queryRestApiHealth,
} from '../reducers/api';
import config from '../config';

const { restApiEndoint } = config;

const GlobalContext = createContext({});

export function GlobalContextProvider(props) {
  const [restApiHealth, dispatchRestApiStatus] = useReducer(
    createRestApiHealthReducer,
    initialApiRequestState
  );

  const [currentUser] = useState({
    username: 'example',
    email: 'example@example.com',
    password: 'password123',
  });

  useEffect(() => {
    queryRestApiHealth()(dispatchRestApiStatus);
  }, []);

  useEffect(() => {
    async function getWebsocketConnection() {
      try {
        await fetchJSON(`${restApiEndoint}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            username: currentUser.username,
            password: currentUser.password,
          }),
        });
      } catch (error) {
        console.log(error.message);
      }

      try {
        await fetchJSON(`${restApiEndoint}/api/token`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Access Token',
          }),
        });
      } catch (error) {
        console.log(error.message);
      }
    }

    const { isReady, hasError } = restApiHealth;
    if (isReady() && !hasError()) {
      getWebsocketConnection();
    }
  }, [restApiHealth, currentUser]);

  return (
    <>
      <GlobalContext.Provider
        value={{
          restApiHealth,
          currentUser,
        }}
      >
        {props.children}
      </GlobalContext.Provider>
    </>
  );
}

GlobalContextProvider.propTypes = {
  children: T.node,
};

export default GlobalContext;
