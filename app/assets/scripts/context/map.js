import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';

export const MapContext = createContext({});

export function MapProvider(props) {
  const [mapRef, setMapRef] = useState();
  const [mapLayers, setMapLayers] = useState({});

  const [predictionLayerSettings, setPredictionLayerSettings] = useState({
    opacity: 1,
    visible: true,
  });

  return (
    <MapContext.Provider
      value={{
        mapRef,
        setMapRef,

        mapLayers,
        setMapLayers,

        predictionLayerSettings,
        setPredictionLayerSettings,
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
