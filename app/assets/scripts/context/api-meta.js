import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';

const ApiMetaContext = createContext(null);

export function ApiMetaProvider(props) {
  const [apiLimits, setApiLimits] = useState(null);

  const value = {
    apiLimits,
    setApiLimits,
  };

  return (
    <ApiMetaContext.Provider value={value}>
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

  return useMemo(
    () => ({
      apiLimits,
      setApiLimits,
    }),
    [apiLimits]
  );
};
