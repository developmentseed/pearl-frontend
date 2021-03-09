import React, { createContext, useState } from 'react';
import T from 'prop-types';

export const MapContext = createContext({});
export function MapProvider(props) {
  const [map, setMap] = useState();
  const [mapLayers, setMapLayers] = useState({});
  return (
    <MapContext.Provider
      value={{
        map,
        setMap,

        mapLayers,
        setMapLayers,
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
}

MapProvider.propTypes = {
  children: T.node,
};
