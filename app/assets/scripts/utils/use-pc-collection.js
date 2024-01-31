import useSWR from 'swr';
import config from '../config';
import get from 'lodash.get';
import { endOfDay, subDays } from 'date-fns';
const { planetaryComputerStacApi } = config;

const imagerySourceCollectionIds = {
  NAIP: 'naip',
  'Sentinel-2': 'sentinel-2-l2a',
};

export const usePlanetaryComputerCollection = (imagerySourceName) =>
  useSWR(imagerySourceCollectionIds[imagerySourceName], (collectionId) =>
    fetch(`${planetaryComputerStacApi}/collections/${collectionId}`)
      .then((res) => res.json())
      .then((data) => {
        const temporalExtentInterval = get(
          data,
          'extent.temporal.interval[0]',
          [null, null]
        );

        let acquisitionStart = temporalExtentInterval[0];
        let acquisitionEnd = temporalExtentInterval[1];

        // If no end date is set, set it to yesterday
        if (acquisitionEnd === null) {
          acquisitionEnd = endOfDay(subDays(new Date(), 1)).toISOString();
        }

        // If no start date is set, set it to 90 days ago
        if (acquisitionStart === null) {
          // Subtract 90 days to get 90 days ago
          acquisitionStart = endOfDay(subDays(new Date(), 90)).toISOString();
        }

        return {
          acquisitionStart,
          acquisitionEnd,
        };
      })
  );
