import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@devseed-ui/button';
import collecticon from '@devseed-ui/collecticons';
import { css } from 'styled-components';

function CenterMap({ aoiRef }) {
  const map = useMap();
  const CenterControl = L.Control.extend({
    onAdd: function () {
      const container = L.DomUtil.create('div', 'leaflet-control  leaflet-bar');

      const button = L.DomUtil.create('a', 'centerMap', container)
      button.setAttribute('role',  'button')
      button.setAttribute('href', '#')
      button.setAttribute('title', 'Center Map')
      button.onclick = () => map.fitBounds(aoiRef.getBounds())

      return container;
    },
    onRemove: function (map) {},
  });
  useEffect(() => {
    const center = new CenterControl({ position: 'topleft' });
    center.addTo(map);
  }, [map]);
  return null;
}

export default CenterMap;
