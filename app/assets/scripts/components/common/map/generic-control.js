import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

function GenericControl({ position, onClick, id }) {
  const map = useMap();
  const [cntrl, setCntrl] = useState();

  const GenericControl = L.Control.extend({
    options: {
      position: position || 'topleft',
    },

    onAdd: function () {
      const container = L.DomUtil.create('div');

      container.style.backgroundSize = '30px 30px';
      container.style.width = '30px';
      container.style.height = '30px';

      container.className = 'generic-leaflet-control';

      container.id = id;

      container.onclick = onClick;
      container.ondblclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      setCntrl(container);

      return container;
    },
  });

  useEffect(() => {
    map.addControl(new GenericControl());
  }, [map]);

  useEffect(() => {
    if (cntrl) {
      cntrl.onclick = onClick;
    }
  }, [cntrl, onClick]);
  return null;
}

export default GenericControl;
