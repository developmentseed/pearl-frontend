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

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,

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

export const useMap = () => {
  const { map, setMap } = useMapContext('useMap');
  return useMemo(
    () => ({
      map,
      setMap,
    }),
    [map]
  );
};

export const useMapLayers = () => {
  const { mapLayers, setMapLayers } = useMapContext('useMap');
  return useMemo(
    () => ({
      mapLayers,
      setMapLayers,
    }),
    [mapLayers]
  );
};

export const usePredictionLayer = () => {
  const { predictionLayerSettings, setPredictionLayerSettings } = useMapContext(
    'useMap'
  );
  return useMemo(
    () => ({
      predictionLayerSettings,
      setPredictionLayerSettings,
    }),
    [predictionLayerSettings]
  );
};
