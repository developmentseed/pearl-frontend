import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { BOUNDS_PADDING } from './constants';

function CenterMap({ aoiRef }) {
  const map = useMap();
  const CenterControl = L.Control.extend({
    onAdd: function () {
      const container = L.DomUtil.create('div', 'leaflet-control  leaflet-bar');

      const button = L.DomUtil.create('a', 'centerMap', container);
      button.setAttribute('role', 'button');
      button.setAttribute('href', '#');
      button.setAttribute('title', 'Center Map');
      button.onclick = () =>
        map.fitBounds(aoiRef.getBounds(), { padding: BOUNDS_PADDING });

      return container;
    },
    // Don't need to do anything on remove
    onRemove: () => {},
  });
  useEffect(() => {
    const center = new CenterControl({ position: 'topleft' });
    center.addTo(map);
  }, [map]);
  return null;
}

export default CenterMap;
