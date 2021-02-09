import { useEffect } from 'react';
import * as GeoSearch from 'leaflet-geosearch';

function GeoCoder({ map }) {
  useEffect(() => {
    const search = new GeoSearch.GeoSearchControl({
      showMarker: false,
      provider: new GeoSearch.OpenStreetMapProvider(),
    });
    map.addControl(search);
  }, []);
  return null;
}

export default GeoCoder;
