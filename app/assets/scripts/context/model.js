import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';

const ModelContext = createContext(null);

export function ModelProvider(props) {
  const [selectedModel, setSelectedModel] = useState(null);

  const value = {
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
  const { selectedModel, setSelectedModel } = useModelContext('useModel');

  return useMemo(
    () => ({
      selectedModel,
      setSelectedModel,
    }),
    [selectedModel]
  );
};
