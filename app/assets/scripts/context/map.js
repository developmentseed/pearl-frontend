import React, { createContext, useState } from 'react';
import T from 'prop-types';

export const MapContext = createContext({});
export function MapProvider(props) {
  const [map, setMap] = useState();
  const [layerIds, setLayerIds] = useState({});
  return (
    <MapContext.Provider
      value={{
        map,
        setMap,

        layerIds, setLayerIds
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
}
