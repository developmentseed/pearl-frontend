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
import useFetch from '../utils/use-fetch';

const GlobalContext = createContext({});

export function GlobalContextProvider(props) {
  const [tourStep, setTourStep] = useState(0);

  const apiLimits = useFetch('', {
    authRequired: false,
    mutator: (body) => {
      return body && body.limits;
    },
  });

  const [mosaicList, dispatchMosaicList] = useReducer(
    createQueryApiGetReducer('mosaic'),
    initialApiRequestState
  );

  useEffect(() => {
    queryApiGet({ endpoint: 'mosaic' })(dispatchMosaicList);
    const visited = localStorage.getItem('site-tour');
    if (visited !== null) {
      setTourStep(Number(visited));
    }
  }, []);

  return (
    <>
      <GlobalContext.Provider
        value={{
          apiLimits: apiLimits.isReady && !apiLimits.hasError && apiLimits.data,

          mosaicList,

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

export const useApiLimits = () => {
  const { apiLimits } = useGlobalContext('useApiLimits');

  return useMemo(
    () => ({
      apiLimits,
    }),
    [apiLimits]
  );
};

export default GlobalContext;
