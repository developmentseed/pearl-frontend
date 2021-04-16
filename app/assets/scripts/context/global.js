import React, { createContext, useEffect, useReducer, useState } from 'react';
import T from 'prop-types';
import { initialApiRequestState } from './reducers/reduxeed';
import { createQueryApiGetReducer, queryApiGet } from './reducers/api';
import { createQueryApiPostReducer } from './reducers/api';
import { useAuth } from './auth';

const GlobalContext = createContext({});
export function GlobalContextProvider(props) {
  const { apiToken } = useAuth();
  const [tourStep, setTourStep] = useState(0);

  /* User data Reducers */
  const [modelsList, dispatchModelsList] = useReducer(
    createQueryApiGetReducer('model'),
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

    queryApiGet({ token: apiToken, endpoint: 'model' })(dispatchModelsList);
  }, [apiToken]);

  return (
    <>
      <GlobalContext.Provider
        value={{
          modelsList,

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
