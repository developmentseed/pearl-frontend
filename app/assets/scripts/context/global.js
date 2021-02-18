import React, { createContext, useEffect, useReducer, useState } from 'react';
import T from 'prop-types';
import { initialApiRequestState } from '../reducers/reduxeed';
import {
  createRestApiHealthReducer,
  queryRestApiHealth,
} from '../reducers/api';
import config from '../config';
import { useAuth0 } from '@auth0/auth0-react';

const GlobalContext = createContext({});
export function GlobalContextProvider(props) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [apiToken, setApiToken] = useState();

  const [restApiHealth, dispatchRestApiStatus] = useReducer(
    createRestApiHealthReducer,
    initialApiRequestState
  );

  useEffect(() => {
    queryRestApiHealth()(dispatchRestApiStatus);
  }, []);

  useEffect(() => {
    async function getApiToken() {
      const token = await getAccessTokenSilently({
        audience: config.audience,
      });
      try {
        const response = await fetch(
          'https://api.lulc-staging.ds.io/api/model',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = await response.json();
        console.log(`GET /models successful: ${res.models.length} found`); // eslint-disable-line
      } catch (error) {
        console.log(error); // eslint-disable-line
      }
      setApiToken(token);
    }

    const { isReady, hasError } = restApiHealth;
    if (isReady() && !hasError() && isAuthenticated) {
      getApiToken();
    }
  }, [restApiHealth, isAuthenticated]); // eslint-disable-line

  return (
    <>
      <GlobalContext.Provider
        value={{
          restApiHealth,
          apiToken,
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
