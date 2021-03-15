import React, { createContext, useEffect, useReducer, useState } from 'react';
import T from 'prop-types';
import { initialApiRequestState } from '../reducers/reduxeed';
import {
  createRestApiHealthReducer,
  queryRestApiHealth,
  createQueryApiGetReducer,
  queryApiGet,
} from '../reducers/api';
import { createQueryApiPostReducer } from '../reducers/api';
import useLocalStorage from '@rooks/use-localstorage';
import config from '../config';
import { useAuth0 } from '@auth0/auth0-react';
import RestApiClient from './rest-api-client';

const GlobalContext = createContext({});
export function GlobalContextProvider(props) {
  const {
    isAuthenticated,
    getAccessTokenWithPopup,
    isLoading: auth0IsLoading,
  } = useAuth0();
  const [apiToken, setApiToken, removeApiToken] = useLocalStorage();
  const [restApiClient, setRestApiClient] = useState();

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

  const [mosaicList, dispatchMosaicList] = useReducer(
    createQueryApiGetReducer('mosaic'),
    initialApiRequestState
  );

  const [currentProjectName, setCurrentProjectName] = useState(null);

  const [currentProject, dispatchProject] = useReducer(
    createQueryApiPostReducer('project'),
    initialApiRequestState
  );

  const [projectCheckpoints, dispatchProjectCheckpoints] = useReducer(
    createQueryApiGetReducer('checkpoints'),
    initialApiRequestState
  );

  useEffect(() => {
    queryRestApiHealth()(dispatchRestApiStatus);
    queryApiGet({ endpoint: 'mosaic' })(dispatchMosaicList);
  }, []);

  useEffect(() => {
    /*
     * Request api access token via Auth0
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
    if (isReady() && !hasError() && !auth0IsLoading) {
      if (isAuthenticated && !apiToken) {
        // Get API token if user has signed in
        getApiToken();
      } else if (!isAuthenticated && apiToken) {
        // Clear it on sign off
        removeApiToken();
      }
    }
  }, [restApiHealth, isAuthenticated, auth0IsLoading]); // eslint-disable-line

  useEffect(() => {
    /*
     * Request user data when api token is available
     */
    if (!apiToken) {
      return;
    }

    // Create API Client
    const restApiClient = new RestApiClient({ apiToken });
    setRestApiClient(restApiClient);

    queryApiGet({ token: apiToken, endpoint: 'model' })(dispatchModelsList);
    queryApiGet({ token: apiToken, endpoint: 'project' })(dispatchProjectsList);
  }, [apiToken]);

  useEffect(() => {
    if (currentProject.isReady()) {
      const project = currentProject.getData();
      queryApiGet({
        token: apiToken,
        endpoint: 'project',
        name: 'checkpoints',
        subPath: `${project.id}/checkpoint`,
      })(dispatchProjectCheckpoints);
    }
  }, [apiToken, currentProject]);

  return (
    <>
      <GlobalContext.Provider
        value={{
          restApiHealth,
          apiToken,
          restApiClient,
          modelsList,
          projectsList,
          projectCheckpoints,

          mosaicList,

          dispatchProject,
          currentProject,

          currentProjectName,
          setCurrentProjectName,
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
