import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { initialApiRequestState } from './reducers/reduxeed';
import T from 'prop-types';
import logger from '../utils/logger';
import aoiPatchReducer from './reducers/aoi_patch';
import { wrapLogReducer } from './reducers/utils';

const AoiContext = createContext(null);

export const actions = {
  SET_AOI: 'SET_AOI',
};

export function AoiProvider(props) {
  const [currentAoi, dispatchCurrentAoi] = useReducer(aoiReducer);

  const [aoiPatch, dispatchAoiPatch] = useReducer(
    wrapLogReducer(aoiPatchReducer),
    initialApiRequestState
  );

  const [aoiPatchList, setAoiPatchList] = useState([]);

  return (
    <AoiContext.Provider
      value={{
        currentAoi,
        dispatchCurrentAoi,

        aoiPatch,
        dispatchAoiPatch,

        aoiPatchList,
        setAoiPatchList,
      }}
    >
      {props.children}
    </AoiContext.Provider>
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
  const { currentAoi, dispatchCurrentAoi } = useCheckContext('useAoi');

  return useMemo(
    () => ({
      currentAoi,
      dispatchCurrentAoi,
      setCurrentAoi: (data) =>
        dispatchCurrentAoi({ type: actions.SET_AOI, data }),
    }),
    [currentAoi, dispatchCurrentAoi]
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
