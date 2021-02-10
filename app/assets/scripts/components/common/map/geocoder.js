import { useEffect } from 'react';
import * as GeoSearch from 'leaflet-geosearch';
import config from '../../../config';

const { bingApiKey } = config;

function GeoCoder({ map }) {
  useEffect(() => {
    const search = new GeoSearch.GeoSearchControl({
      showMarker: false,

      provider: new GeoSearch.BingProvider({
        params: {
          key: bingApiKey,
        },
      }),
    });
    map.addControl(search);
  }, []);
  return null;
}

export default GeoCoder;
