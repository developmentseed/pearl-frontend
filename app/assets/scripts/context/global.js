import React, { createContext, useEffect, useReducer, useState } from 'react';
import T from 'prop-types';
import { initialApiRequestState } from '../reducers/reduxeed';
import {
  createRestApiHealthReducer,
  queryRestApiHealth,
  createQueryApiGetReducer,
  queryApiGet,
} from '../reducers/api';
import config from '../config';
import { useAuth0 } from '@auth0/auth0-react';

const GlobalContext = createContext({});
export function GlobalContextProvider(props) {
  const { isAuthenticated, getAccessTokenWithPopup } = useAuth0();
  const [apiToken, setApiToken] = useState();

  const [restApiHealth, dispatchRestApiStatus] = useReducer(
    createRestApiHealthReducer,
    initialApiRequestState
  );

  /* User data Reducers */
  const [modelsList, dispatchModelsList] = useReducer(
    createQueryApiGetReducer('model'),
    initialApiRequestState
  );

  const [projectsList, dispatchProjectsList] = useReducer(
    createQueryApiGetReducer('project'),
    initialApiRequestState
  );

  useEffect(() => {
    queryRestApiHealth()(dispatchRestApiStatus);
  }, []);

  useEffect(() => {
    /*
     * Request api acces token via Auth0
     */
    async function getApiToken() {
      const token = await getAccessTokenWithPopup({
        audience: config.audience,
      }).catch((err) =>
        /* eslint-disable-next-line no-console */
        console.error(err)
      );

      if (token) {
        setApiToken(token);
      }
    }

    const { isReady, hasError } = restApiHealth;
    if (isReady() && !hasError() && isAuthenticated) {
      getApiToken();
    }
  }, [restApiHealth, isAuthenticated]); // eslint-disable-line

  useEffect(() => {
    /*
     * Request user data when api token is available
     */
    if (!apiToken) {
      return;
    }

    queryApiGet({ token: apiToken, endpoint: 'model' })(dispatchModelsList);
    queryApiGet({ token: apiToken, endpoint: 'project' })(dispatchProjectsList);
  }, [apiToken]);

  return (
    <>
      <GlobalContext.Provider
        value={{
          restApiHealth,
          apiToken,
          modelsList,
          projectsList,
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
