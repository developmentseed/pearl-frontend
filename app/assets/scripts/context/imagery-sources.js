import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';

const ImagerySourceContext = createContext(null);

// Mimic a hook returning a mosaics list
const hardcodedImagerySourcesList = {
  status: 'success',
  isReady: true,
  hasError: false,
  fetch: () => {},
  data: [
    {
      id: 'naip.latest',
      name: 'NAIP',
      bounds: [-180, -85.0511287798066, 180, 85.0511287798066],
    },
    {
      id: 'sentinel-2',
      name: 'Sentinel',
      bounds: [-180, -85.0511287798066, 180, 85.0511287798066],
    },
  ],
};

const hardcodedMosaicList = {
  status: 'success',
  isReady: true,
  hasError: false,
  fetch: () => {},
  data: [
    {
      id: 1,
      imagery_source_id: 'naip.latest',
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
      id: 2,
      imagery_source_id: 'sentinel-2',
      tilejson: '2.2.0',
      name: 'Jun - Aug, 2022',
      version: '1.0.0',
      scheme: 'xyz',
      tiles: [
        'https://planetarycomputer.microsoft.com/api/data/v1/mosaic/tiles/82ebdc445544365e45be4db6d22536ec/%7Bz%7D/%7Bx%7D/%7By%7D?assets=B04&assets=B03&assets=B02&color_formula=Gamma+RGB+3.2+Saturation+0.8+Sigmoidal+RGB+25+0.35&collection=sentinel-2-l2a',
      ],
      minzoom: 0,
      maxzoom: 24,
      bounds: [-180, -85.0511287798066, 180, 85.0511287798066],
      center: [0, 0, 0],
    },
    {
      id: 3,
      imagery_source_id: 'sentinel-2',
      tilejson: '2.2.0',
      name: 'Mar - May, 2022',
      version: '1.0.0',
      scheme: 'xyz',
      tiles: [
        'https://planetarycomputer.microsoft.com/api/data/v1/mosaic/tiles/82ebdc445544365e45be4db6d22536ec/%7Bz%7D/%7Bx%7D/%7By%7D?assets=B04&assets=B03&assets=B02&color_formula=Gamma+RGB+3.2+Saturation+0.8+Sigmoidal+RGB+25+0.35&collection=sentinel-2-l2a',
      ],
      minzoom: 0,
      maxzoom: 24,
      bounds: [-180, -85.0511287798066, 180, 85.0511287798066],
      center: [0, 0, 0],
    },
  ],
};

export function ImagerySourceProvider(props) {
  const imagerySources = hardcodedImagerySourcesList;
  const mosaics = hardcodedMosaicList;

  const [selectedImagerySource, setSelectedImagerySource] = useState(null);
  const [selectedMosaic, setSelectedMosaic] = useState(null);
  const [
    selectedImagerySourceMosaics,
    setSelectedImagerySourceMosaics,
  ] = useState([]);

  const value = {
    imagerySources,
    selectedImagerySource,
    setSelectedImagerySource: (imagerySource) => {
      // TODO: Once the API for imagery source and mosaics is ready and
      // stable, we should look into reorganize this logic into a reducer.

      if (!imagerySource) {
        // This block resets the imagery source

        // Update selected imagery source
        setSelectedImagerySource(imagerySource);
        // Clear selected mosaic, if any
        setSelectedMosaic(null);
        // Clear available mosaics
        setSelectedImagerySourceMosaics([]);
      } else if (
        !selectedImagerySource ||
        selectedImagerySource.id !== imagerySource.id
      ) {
        // This block updates imagery source, if it has changed

        // Update imagery source
        setSelectedImagerySource(imagerySource);
        // Clear selected mosaic
        setSelectedMosaic(null);
        // Update mosaics
        setSelectedImagerySourceMosaics(
          mosaics.data.filter((m) => m.imagery_source_id === imagerySource.id)
        );
      } else {
        // Do nothing when imagery source hasn't changed
      }
    },
    selectedImagerySourceMosaics,
    selectedMosaic,
    setSelectedMosaic,
  };

  return (
    <ImagerySourceContext.Provider value={value}>
      {props.children}
    </ImagerySourceContext.Provider>
  );
}

ImagerySourceProvider.propTypes = {
  children: T.node,
};

// Check if consumer function is used properly
const useImagerySourceContext = (fnName) => {
  const context = useContext(ImagerySourceContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <ImagerySourceContext> component's context.`
    );
  }

  return context;
};

export const useImagerySource = () => {
  const {
    imagerySources,
    selectedImagerySource,
    setSelectedImagerySource,
    selectedImagerySourceMosaics,
    selectedMosaic,
    setSelectedMosaic,
  } = useImagerySourceContext('useImagerySource');

  return useMemo(
    () => ({
      imagerySources,
      selectedImagerySource,
      setSelectedImagerySource,
      selectedImagerySourceMosaics,
      selectedMosaic,
      setSelectedMosaic,
    }),
    [
      imagerySources,
      selectedImagerySource,
      selectedImagerySourceMosaics,
      selectedMosaic,
    ]
  );
};
