import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';
import useFetch from '../utils/use-fetch';

const ModelContext = createContext(null);

export function ModelProvider(props) {
  // Disable models fetch temporarily
  const models = useFetch('model', {
    mutator: (body) => (body ? body.models : []),
  });

  const [selectedModel, setSelectedModel] = useState(null);

  const value = {
    models,
    selectedModel,
    setSelectedModel,
  };

  return (
    <ModelContext.Provider value={value}>
      {props.children}
    </ModelContext.Provider>
  );
}

ModelProvider.propTypes = {
  children: T.node,
};

// Check if consumer function is used properly
const useModelContext = (fnName) => {
  const context = useContext(ModelContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <ModelContext> component's context.`
    );
  }

  return context;
};

export const useModel = () => {
  const { models, selectedModel, setSelectedModel } = useModelContext(
    'useModel'
  );

  return useMemo(
    () => ({
      models,
      selectedModel,
      setSelectedModel,
    }),
    [selectedModel, models, setSelectedModel]
  );
};
