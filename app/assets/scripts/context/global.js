import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import T from 'prop-types';
import { initialApiRequestState } from './reducers/reduxeed';
import { createQueryApiGetReducer, queryApiGet } from './reducers/api';
import { createQueryApiPostReducer } from './reducers/api';
import { useAuth } from './auth';
import useAsync from '../utils/use-async';

const GlobalContext = createContext({});
export function GlobalContextProvider(props) {
  const { apiToken, restApiClient } = useAuth();
  const [tourStep, setTourStep] = useState(0);

  const models = useAsync(() => restApiClient.getModels(), false);

  const [mosaicList, dispatchMosaicList] = useReducer(
    createQueryApiGetReducer('mosaic'),
    initialApiRequestState
  );

  const [currentProjectName, setCurrentProjectName] = useState(null);

  const [currentProject, dispatchProject] = useReducer(
    createQueryApiPostReducer('project'),
    initialApiRequestState
  );

  useEffect(() => {
    queryApiGet({ endpoint: 'mosaic' })(dispatchMosaicList);
    const visited = localStorage.getItem('site-tour');
    if (visited !== null) {
      setTourStep(Number(visited));
    }
  }, []);

  useEffect(() => {
    /*
     * Request user data when api token is available
     */
    if (!apiToken) {
      return;
    }

    // fetch models when apiToken is available
    models.execute();
  }, [apiToken]);

  return (
    <>
      <GlobalContext.Provider
        value={{
          models,

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

// Check if consumer function is used properly
export const useGlobalContext = (fnName) => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <GlobalContext> component's context.`
    );
  }

  return context;
};

export const useModels = () => {
  const { models } = useGlobalContext('useModels');

  return useMemo(
    () => ({
      models,
    }),
    [models]
  );
};

export default GlobalContext;
