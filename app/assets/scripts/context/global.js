import React, { createContext, useEffect, useReducer, useState } from 'react';
import T from 'prop-types';
import { initialApiRequestState } from '../reducers/reduxeed';
import {
  createRestApiHealthReducer,
  queryRestApiHealth,
  createQueryApiGetReducer,
  queryApiGet,
} from '../reducers/api';
import { createQueryApiPostReducer, queryApiPost } from '../reducers/api';

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

  const [selectedModel, setSelectedModel] = useState(null);
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

  /* Post updates to the API */
  useEffect(() => {
    /*
     * When project name and model have both been set, automatically create a new project
     */

    /* eslint-disable no-console */
    if (currentProject.isReady()) {
      console.error(
        'Project name update not supported by api. Change is front end only'
      );
      return;
    } else if (currentProjectName && selectedModel) {
      queryApiPost({
        endpoint: 'project',
        token: apiToken,
        query: {
          name: currentProjectName,
          model_id: selectedModel.id,
          mosaic: 'naip.latest',
        },
      })(dispatchProject);
    } else {
      if (!currentProjectName) {
        console.error('Project name not set');
      }
      if (!selectedModel) {
        console.error('Model not selected');
      }
    }
    /* eslint-enable no-console */
  }, [currentProjectName, selectedModel]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <GlobalContext.Provider
        value={{
          restApiHealth,
          apiToken,
          modelsList,
          projectsList,
          projectCheckpoints,

          selectedModel,
          setSelectedModel,

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
