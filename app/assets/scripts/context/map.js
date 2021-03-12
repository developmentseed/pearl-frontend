import React, { createContext, useState, useEffect } from 'react';
import T from 'prop-types';
import usePrevious from '../utils/use-previous';

export const MapContext = createContext({});

/**
 * Explore View Modes
 */
export const viewModes = {
  BROWSE_MODE: 'BROWSE_MODE',
  CREATE_AOI_MODE: 'CREATE_AOI_MODE',
  EDIT_AOI_MODE: 'EDIT_AOI_MODE',
  EDIT_CLASS_MODE: 'EDIT_CLASS_MODE',
};

export function MapProvider(props) {
  const [map, setMap] = useState();
  const [mapLayers, setMapLayers] = useState({});

  //L.LatLngBounds object, set when aoi is confirmed
  const [aoiBounds, setAoiBounds] = useState(null);

  const [aoiRef, setAoiRef] = useState(null);

  //Current AOI square area
  const [aoiArea, setAoiArea] = useState(null);

  const [viewMode, setViewMode] = useState(viewModes.BROWSE_MODE);
  const previousViewMode = usePrevious(viewMode);

  useEffect(() => {
    if (!aoiRef) {
      setAoiArea(null);
    }
  }, [aoiRef]);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,

        mapLayers,
        setMapLayers,

        aoiBounds,
        setAoiBounds,

        previousViewMode,
        viewMode,
        setViewMode,
        aoiRef,
        setAoiRef,
        aoiArea,
        setAoiArea,
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
}

MapProvider.propTypes = {
  children: T.node,
};
