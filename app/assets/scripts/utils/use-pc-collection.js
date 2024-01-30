import useSWR from 'swr';
import config from '../config';
import get from 'lodash.get';
const { planetaryComputerDataApi, planetaryComputerStacApi } = config;

const imagerySourceCollectionIds = {
  NAIP: 'naip',
  'Sentinel-2': 'sentinel-2-l2a',
};

export const usePlanetaryComputerCollection = (imagerySourceName) =>
  useSWR(imagerySourceCollectionIds[imagerySourceName], (collectionId) =>
    Promise.all([
      fetch(
        `${planetaryComputerDataApi}/mosaic/info?collection=${collectionId}`
      )
        .then((res) => res.json())
        .then((res) => res.mosaics),
      fetch(
        `${planetaryComputerStacApi}/collections/${collectionId}`
      ).then((res) => res.json()),
    ]).then(([mosaicPresets, collectionInfo]) => ({
      mosaicPresets,
      temporalExtent: get(collectionInfo, 'extent.temporal.interval[0]'),
    }))
  );
