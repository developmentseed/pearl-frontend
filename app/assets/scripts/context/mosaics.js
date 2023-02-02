import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';
// import { useAuth } from '../context/auth';
// import useFetch from '../utils/use-fetch';

const MosaicsContext = createContext(null);

// Mimic a hook returning a mosaics list
const hardcodedMosaicList = {
  status: 'success',
  isReady: true,
  hasError: false,
  fetch: () => {},
  data: [
    {
      id: 'naip.latest',
      tilejson: '2.2.0',
      name: 'NAIP',
      version: '1.0.0',
      scheme: 'xyz',
      tiles: [
        'https://planetarycomputer.microsoft.com/api/data/v1/mosaic/tiles/87b72c66331e136e088004fba817e3e8/WebMercatorQuad/{z}/{x}/{y}@1x?assets=image&asset_bidx=image%7C1%2C2%2C3&collection=naip',
      ],
      minzoom: 0,
      maxzoom: 24,
      bounds: [-180, -85.0511287798066, 180, 85.0511287798066],
      center: [0, 0, 0],
    },
    {
      id: 'sentinel',
      tilejson: '2.2.0',
      name: 'Sentinel',
      version: '1.0.0',
      scheme: 'xyz',
      tiles: [
        'https://planetarycomputer.microsoft.com/api/data/v1/mosaic/tiles/82ebdc445544365e45be4db6d22536ec/%7Bz%7D/%7Bx%7D/%7By%7D?assets=B04&assets=B03&assets=B02&color_formula=Gamma+RGB+3.2+Saturation+0.8+Sigmoidal+RGB+25+0.35&collection=sentinel-2-l2a',
      ],
      minzoom: 0,
      maxzoom: 24,
      bounds: [-180, -85.0511287798066, 180, 0],
      center: [0, 0, 0],
    },
  ],
};

export function MosaicProvider(props) {
  // Disable mosaics fetch temporarily
  // const mosaics = useFetch('mosaics', {
  //   mutator: (body) => (body ? body.mosaics : []),
  // });

  const mosaics = hardcodedMosaicList;

  const [selectedMosaic, setSelectedMosaic] = useState(null);

  const value = {
    mosaics,
    selectedMosaic,
    setSelectedMosaic,
  };

  return (
    <MosaicsContext.Provider value={value}>
      {props.children}
    </MosaicsContext.Provider>
  );
}

MosaicProvider.propTypes = {
  children: T.node,
};

// Check if consumer function is used properly
const useMosaicsContext = (fnName) => {
  const context = useContext(MosaicsContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <MosaicsContext> component's context.`
    );
  }

  return context;
};

export const useMosaics = () => {
  const { mosaics, selectedMosaic, setSelectedMosaic } = useMosaicsContext(
    'useMosaics'
  );

  return useMemo(
    () => ({
      mosaics,
      selectedMosaic,
      setSelectedMosaic,
    }),
    [selectedMosaic, mosaics]
  );
};
