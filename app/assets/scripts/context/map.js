import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';

export const MapContext = createContext({});

export function MapProvider(props) {
  const [map, setMap] = useState();
  const [mapLayers, setMapLayers] = useState({});

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
      opacity: 1,
      visible: true,
      active: false,
      id: 'retrainingSamples',
      name: 'Retraining Samples',
    },
  });

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,

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

export const useMap = () => {
  const { map, setMap } = useMapContext('useMap');
  return useMemo(
    () => ({
      map,
      setMap,
    }),
    [map, setMap]
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
