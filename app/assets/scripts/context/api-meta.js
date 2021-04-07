import React, {
  useContext,
  useMemo,
  createContext,
  useState,
  useEffect,
} from 'react';
import T from 'prop-types';
import { useRestApiClient } from './auth';

const ApiMetaContext = createContext({});

export function ApiMetaProvider(props) {
  const [apiLimits, setApiLimits] = useState(null);

  return (
    <ApiMetaContext.Provider
      value={{
        apiLimits,
        setApiLimits,
      }}
    >
      {props.children}
    </ApiMetaContext.Provider>
  );
}

ApiMetaProvider.propTypes = {
  children: T.node,
};

// Check if consumer function is used properly
const useApiMetaContext = (fnName) => {
  const context = useContext(ApiMetaContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <ApiMetaContext> component's context.`
    );
  }

  return context;
};

export const useApiMeta = () => {
  const { apiLimits, setApiLimits } = useApiMetaContext('useApiMeta');
  const { restApiClient } = useRestApiClient();

  useEffect(() => {
    restApiClient.getApiMeta().then((data) => {
      setApiLimits(data && data.limits);
    });
  }, []);

  return useMemo(
    () => ({
      apiLimits,
    }),
    [apiLimits]
  );
};
