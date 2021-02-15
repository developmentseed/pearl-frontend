import { useEffect } from 'react';
import * as GeoSearch from 'leaflet-geosearch';
import config from '../../../config';
import { useMap } from 'react-leaflet';

const { bingApiKey } = config;

function GeoCoder() {
  const map = useMap();

  useEffect(() => {
    const search = new GeoSearch.GeoSearchControl({
      showMarker: false,
      autoClose: true,
      resetButton: null,
      provider: new GeoSearch.BingProvider({
        params: {
          key: bingApiKey,
        },
      }),
    });
    map.addControl(search);
  }, [map]);
  return null;
}

export default GeoCoder;
