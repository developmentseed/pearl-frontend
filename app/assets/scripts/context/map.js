import React, {
  useContext,
  useMemo,
  createContext,
  useState,
  useEffect,
} from 'react';
import T from 'prop-types';
import { useAoiPatch } from './aoi';
export const MapContext = createContext({});

export function MapProvider(props) {
  const [mapRef, setMapRef] = useState();
  const [mapLayers, setMapLayers] = useState({});
  const { aoiPatch } = useAoiPatch();
  const [enableOsmQaLayer, setEnableOsmQaLayer] = useState(false);

  /*
   * Object tracking user layers to be controlled in frontend.
   * Add objects here to control new layers
   */
  const [userLayers, setUserLayers] = useState({
    refinementsLayer: {
      opacity: 1,
      visible: true,
      active: false,
      id: 'refinementsLayer',
      name: 'Refinements Layer',
    },

    retrainingSamples: {
      opacity: 0.3,
      visible: true,
      active: false,
      id: 'retrainingSamples',
      name: 'Retraining Samples',
    },

    predictions: {
      // Prediction layer opacity is handled by shortcut state
      opacity: 1,
      visible: true,
      active: false,
      id: 'predictions',
      name: 'Prediction Results',
    },
  });

  useEffect(() => {
    if (aoiPatch.isReady() && !userLayers.refinementsLayer.active) {
      setUserLayers({
        ...userLayers,
        refinementsLayer: {
          ...userLayers.refinementsLayer,
          active: true,
        },
      });
    }
  }, [aoiPatch]);

  return (
    <MapContext.Provider
      value={{
        mapRef,
        setMapRef,

        mapLayers,
        setMapLayers,

        userLayers,
        setUserLayers,

        enableOsmQaLayer,
        setEnableOsmQaLayer,
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
}

MapProvider.propTypes = {
  children: T.node,
};

// Check if consumer function is used properly
const useMapContext = (fnName) => {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <MapContext> component's context.`
    );
  }

  return context;
};

export const useMapRef = () => {
  const { mapRef, setMapRef } = useMapContext('useMapRef');
  return useMemo(
    () => ({
      mapRef,
      setMapRef,
    }),
    [mapRef, setMapRef]
  );
};

export const useOsmQaLayer = () => {
  const { enableOsmQaLayer, setEnableOsmQaLayer } = useMapContext(
    'useOsmQaLayer'
  );
  return useMemo(
    () => ({
      enableOsmQaLayer,
      setEnableOsmQaLayer,
    }),
    [enableOsmQaLayer, setEnableOsmQaLayer]
  );
};

export const useMapLayers = () => {
  const { mapLayers, setMapLayers } = useMapContext('useMapLayers');
  return useMemo(
    () => ({
      mapLayers,
      setMapLayers,
    }),
    [mapLayers, setMapLayers]
  );
};

export const useUserLayers = () => {
  const { userLayers, setUserLayers } = useMapContext('useUserLayers');
  return useMemo(
    () => ({
      userLayers,
      setUserLayers,
    }),
    [userLayers, setUserLayers]
  );
};
