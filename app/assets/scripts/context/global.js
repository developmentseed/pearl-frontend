import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import T from 'prop-types';
import { initialApiRequestState } from '../reducers/reduxeed';
import {
  createRestApiHealthReducer,
  queryRestApiHealth,
  createQueryApiGetReducer,
  queryApiGet,
} from '../reducers/api';
import { createQueryApiPostReducer } from '../reducers/api';
import RestApiClient from './rest-api-client';
import { AuthContext } from './auth';

const GlobalContext = createContext({});
export function GlobalContextProvider(props) {
  const { apiToken } = useContext(AuthContext);
  const [tourStep, setTourStep] = useState(0);

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
    const visited = localStorage.getItem('site-tour');
    if (visited !== null) {
      setTourStep(Number(visited));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('site-tour', tourStep);
  }, [tourStep]);

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
          restApiClient,
          modelsList,
          projectsList,
          projectCheckpoints,

          mosaicList,

          dispatchProject,
          currentProject,

          currentProjectName,
          setCurrentProjectName,

          tourStep,
          setTourStep,
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
