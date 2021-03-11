import React, { createContext, useState } from 'react';
import T from 'prop-types';

export const MapContext = createContext({});
export function MapProvider(props) {
  const [map, setMap] = useState();
  const [mapLayers, setMapLayers] = useState({});

  //L.LatLngBounds object, set when aoi is confirmed
  const [aoiBounds, setAoiBounds] = useState(null);
  return (
    <MapContext.Provider
      value={{
        map,
        setMap,

        mapLayers,
        setMapLayers,

        aoiBounds,
        setAoiBounds,
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
}

MapProvider.propTypes = {
  children: T.node,
};
