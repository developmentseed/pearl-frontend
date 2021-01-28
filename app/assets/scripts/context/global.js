import React, { createContext, useEffect, useReducer, useState } from 'react';
import T from 'prop-types';
import { fetchJSON, initialApiRequestState } from '../reducers/reduxeed';
import {
  createRestApiHealthReducer,
  queryRestApiHealth,
} from '../reducers/api';
import config from '../config';
import { useAuth0 } from '@auth0/auth0-react';

const { restApiEndoint } = config;

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
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [restApiHealth, dispatchRestApiStatus] = useReducer(
    createRestApiHealthReducer,
    initialApiRequestState
  );

  useEffect(() => {
    queryRestApiHealth()(dispatchRestApiStatus);
  }, []);

  const [gpuInstance, setGpuInstance] = useState(null);

  useEffect(() => {
    async function getWebsocketConnection() {
      const token = await getAccessTokenSilently({
        audience: 'http://localhost:2000',
      });

      // Create or get model with id=1
      try {
        const res = await fetchJSON(`${restApiEndoint}/api/model/1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res);
      } catch (error) {
        if (error.statusCode === 404) {
          await fetchJSON(`${restApiEndoint}/api/model`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(currentModel),
          });
        }
      }

      // Get GPU instance
      try {
        const { body } = await fetchJSON(`${restApiEndoint}/api/instance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            model_id: 1,
          }),
        });
        setGpuInstance(body);
      } catch (error) {
        console.log('Unexpected error');
        console.log(error);
      }
    }

    const { isReady, hasError } = restApiHealth;
    if (isReady() && !hasError() && isAuthenticated) {
      getWebsocketConnection();
    }
  }, [restApiHealth, isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (!gpuInstance || !gpuInstance.token) return;

    const ws = new WebSocket(
      config.websocketEndpoint + `?token=${gpuInstance.token}`
    );

    ws.addEventListener('open', () => {
      console.log('ws opened.');
      ws.close();
    });
    ws.addEventListener('close', () => console.log('ws closed.'));
  }, [gpuInstance]);

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
