import React, { createContext, useEffect, useReducer, useState } from 'react';
import T from 'prop-types';
import { fetchJSON, initialApiRequestState } from '../reducers/reduxeed';
import {
  createRestApiHealthReducer,
  queryRestApiHealth,
} from '../reducers/api';
import config from '../config';
import { useAuth0 } from '@auth0/auth0-react';

const { restApiEndpoint } = config;

const GlobalContext = createContext({});

const currentUser = {
  username: 'example',
  email: 'example@example.com',
  password: 'password123',
};

const currentModel = {
  name: 'Example Model',
  active: true,
  model_type: 'keras_example',
  model_finetunelayer: -2,
  model_numparams: 563498,
  model_inputshape: [100, 100, 4],
  classes: [
    { name: 'Water', color: '#0000FF' },
    { name: 'Tree Canopy', color: '#008000' },
    { name: 'Field', color: '#80FF80' },
    { name: 'Built', color: '#806060' },
  ],
  meta: {},
};

/* eslint-disable no-console */
export function GlobalContextProvider(props) {
  const { isAuthenticated, getAccessTokenWithPopup } = useAuth0();

  const [restApiHealth, dispatchRestApiStatus] = useReducer(
    createRestApiHealthReducer,
    initialApiRequestState
  );

  useEffect(() => {
    queryRestApiHealth()(dispatchRestApiStatus);
  }, []);

  useEffect(() => {
    async function getModel() {
      const token = await getAccessTokenWithPopup({
        audience: 'http://localhost:2000',
      });

      // Create or get model with id=1
      try {
        const res = await fetchJSON(`${restApiEndpoint}/api/model/1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res)
      } catch (error) {
        if (error.statusCode === 404) {
          await fetchJSON(`${restApiEndpoint}/api/model`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify(currentModel),
          });
        }
      }
    }

    const { isReady, hasError } = restApiHealth;
    if (isReady() && !hasError() && isAuthenticated) {
      getModel();
    }
  }, [restApiHealth, isAuthenticated]);

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
