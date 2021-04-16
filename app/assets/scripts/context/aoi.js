import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react';
import T from 'prop-types';
import logger from '../utils/logger';
import aoiPatchReducer from './reducers/aoi_patch';
import { wrapLogReducer } from './reducers/utils';
import { initialApiRequestState } from './reducers/reduxeed';

const AoiContext = createContext(null);

export const actions = {
  SET_AOI: 'SET_AOI',
};

export function AoiProvider(props) {
  const [currentAoi, dispatchCurrentAoi] = useReducer(aoiReducer);
  const [aoiRef, setAoiRef] = useState(null);
  const [aoiName, setAoiName] = useState(null);

  const [aoiPatch, dispatchAoiPatch] = useReducer(
    wrapLogReducer(aoiPatchReducer),
    initialApiRequestState
  );

  const [aoiPatchList, setAoiPatchList] = useState([]);

  const value = {
    currentAoi,
    dispatchCurrentAoi,
    aoiRef,
    setAoiRef,
    aoiName,
    setAoiName,

    aoiPatch,
    dispatchAoiPatch,

    aoiPatchList,
    setAoiPatchList,
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

export const useAoiPatch = () => {
  const {
    aoiPatch,
    dispatchAoiPatch,
    aoiPatchList,
    setAoiPatchList,
  } = useCheckContext('useAoiPatch');

  return useMemo(
    () => ({
      aoiPatch,
      dispatchAoiPatch,
      aoiPatchList,
      setAoiPatchList,
    }),
    [aoiPatch, dispatchAoiPatch, aoiPatchList, setAoiPatchList]
  );
};
