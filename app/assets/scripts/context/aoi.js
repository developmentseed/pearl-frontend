import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react';
import T from 'prop-types';
import logger from '../utils/logger';

const AoiContext = createContext(null);

export const actions = {
  SET_AOI: 'SET_AOI',
};

export function AoiProvider(props) {
  const [currentAoi, dispatchCurrentAoi] = useReducer(aoiReducer);
  const [aoiRef, setAoiRef] = useState(null);
  const [aoiName, setAoiName] = useState(null);

  const value = {
    currentAoi,
    dispatchCurrentAoi,
    aoiRef,
    setAoiRef,
    aoiName,
    setAoiName,
  };

  return (
    <AoiContext.Provider value={value}>{props.children}</AoiContext.Provider>
  );
}

AoiProvider.propTypes = {
  children: T.node,
};

function aoiReducer(state, action) {
  switch (action.type) {
    case actions.SET_AOI:
      return {
        ...action.data,
      };
    default:
      logger('Undefined AOI action.');
      throw new Error('Unexpected error.');
  }
}

// Check if consumer function is used properly
const useCheckContext = (fnName) => {
  const context = useContext(AoiContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <AoiContext> component's context.`
    );
  }

  return context;
};

export const useAoi = () => {
  const {
    aoiRef,
    setAoiRef,
    aoiName,
    setAoiName,
    currentAoi,
    dispatchCurrentAoi,
  } = useCheckContext('useAoi');

  return useMemo(
    () => ({
      aoiRef,
      setAoiRef,
      aoiName,
      setAoiName,
      currentAoi,
      dispatchCurrentAoi,
      setCurrentAoi: (data) =>
        dispatchCurrentAoi({ type: actions.SET_AOI, data }),
    }),
    [aoiRef, aoiName, currentAoi, dispatchCurrentAoi]
  );
};
