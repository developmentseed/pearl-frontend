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
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import reverseGeoCode from '../utils/reverse-geocode';

const AoiContext = createContext(null);

export const actions = {
  SET_AOI: 'SET_AOI',
};

export function AoiProvider(props) {
  const [currentAoi, dispatchCurrentAoi] = useReducer(wrapLogReducer(aoiReducer));
  const [aoiRef, setAoiRef] = useState(null);
  const [aoiName, setAoiName] = useState(null);
  const [aoiList, setAoiList] = useState([]);

  const [aoiBounds, setAoiBounds] = useState(null);

  const [aoiPatch, dispatchAoiPatch] = useReducer(
    wrapLogReducer(aoiPatchReducer),
    initialApiRequestState
  );

  const [aoiPatchList, setAoiPatchList] = useState([]);

  /*
   * Wrapping function for reverse geocode
   * @param _aoiBounds - optional bound object. This is passed when this function
   * is called from onDrawEnd context of AoiDrawControl. In this situation, the aoiBounds
   * state variable is may not be updated before the function is executed so we can pass the bounds explicitly.  _aoiBounds takes precedenc over aoiBounds
   *
   * On the front end we assume that any AOI with the same name
   * from the backend, will have the same geometry.
   *
   * To deal with this, any AOI that has the same geocoding as an existing one will be incremented.
   *
   * i.e. Seneca Rocks, Seneca Rocks #1, Seneca Rocks #2...etc
   *
   */
  function updateAoiName(_aoiBounds) {
    const refBounds = _aoiBounds || aoiBounds;

    if (!refBounds) {
      logger(new Error('Aoi bounds not defined', aoiBounds));
    }

    const bounds = [
      refBounds.getWest(),
      refBounds.getSouth(),
      refBounds.getEast(),
      refBounds.getNorth(),
    ];

    showGlobalLoadingMessage('Geocoding AOI...');
    reverseGeoCode(bounds).then((name) => {
      let lastInstance;
      aoiList
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          else if (a.name > b.name) return 1;
          else return 0;
        })
        .forEach((a) => {
          return (lastInstance = a.name.includes(name) ? a.name : lastInstance);
        });
      if (lastInstance) {
        if (lastInstance.includes('#')) {
          const [n, version] = lastInstance.split('#').map((w) => w.trim());
          name = `${n} #${Number(version) + 1}`;
        } else {
          name = `${name} #${1}`;
        }
      }
      setAoiName(name);
      hideGlobalLoading();
    });
  }

  const value = {
    currentAoi,
    dispatchCurrentAoi,
    aoiRef,
    setAoiRef,
    aoiName,
    setAoiName,

    aoiBounds,
    setAoiBounds,

    aoiList,
    setAoiList,

    aoiPatch,
    dispatchAoiPatch,

    aoiPatchList,
    setAoiPatchList,

    updateAoiName,
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
      return action.data;
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

    aoiList,
    setAoiList,
    aoiBounds,
    setAoiBounds,
  } = useCheckContext('useAoi');

  return useMemo(
    () => ({
      aoiRef,
      setAoiRef,
      aoiName,
      setAoiName,
      currentAoi,
      dispatchCurrentAoi,
      aoiList,
      setAoiList,
      aoiBounds,
      setAoiBounds,
      setCurrentAoi: (data) =>
        dispatchCurrentAoi({ type: actions.SET_AOI, data }),
    }),
    [aoiRef, aoiName, currentAoi, dispatchCurrentAoi, aoiList, aoiBounds]
  );
};

export const useAoiName = () => {
  const { updateAoiName, aoiName, aoiList, aoiBounds } = useCheckContext(
    'useAoiName'
  );
  return useMemo(
    () => ({
      updateAoiName,
    }),
    [aoiName, aoiList, aoiBounds]
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
