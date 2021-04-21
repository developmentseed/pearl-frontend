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

  const [predictionLayerSettings, setPredictionLayerSettings] = useState({
    opacity: 1,
    visible: true,
  });

  /*
   * Object tracking user layers to be controlled in frontend.
   * Add objects here to control new layers
   */
  const [userLayers, setUserLayers] = useState({
    predictions: {
      opacity: 1,
      visible: true,
      active: false,
      id: 'predictions',
      name: 'Prediction Results',
    },
    retrainingSamples: {
      opacity: 0.3,
      visible: true,
      active: false,
      id: 'retrainingSamples',
      name: 'Retraining Samples',
    },
    refinementsLayer: {
      opacity: 1,
      visible: true,
      active: false,
      id: 'refinementsLayer',
      name: 'Refinements Layer',
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

        predictionLayerSettings,
        setPredictionLayerSettings,

        userLayers,
        setUserLayers,
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

export const usePredictionLayer = () => {
  const { predictionLayerSettings, setPredictionLayerSettings } = useMapContext(
    'usePredictionLayer'
  );
  return useMemo(
    () => ({
      predictionLayerSettings,
      setPredictionLayerSettings,
    }),
    [predictionLayerSettings, setPredictionLayerSettings]
  );
};
