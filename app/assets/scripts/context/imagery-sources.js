import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';

const ImagerySourceContext = createContext(null);

export function ImagerySourceProvider(props) {
  const [selectedImagerySource, setSelectedImagerySource] = useState(null);
  const [selectedMosaic, setSelectedMosaic] = useState(null);
  const [
    selectedImagerySourceMosaics,
    setSelectedImagerySourceMosaics,
  ] = useState([]);

  const value = {
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
      setSelectedMosaic,
    ]
  );
};
