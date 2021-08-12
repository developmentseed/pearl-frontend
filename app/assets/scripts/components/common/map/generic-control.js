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

      //container.style.backgroundColor = theme.baseDark;
      //container.style.backgroundImage = "url(https://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)";
      container.style.backgroundSize = '30px 30px';
      container.style.width = '30px';
      container.style.height = '30px';

      container.className = 'generic-leaflet-control';

      container.id = id;

      container.onclick = onClick;
      setCntrl(container);

      /*L.DomEvent.on(container, 'mousewheel', L.DomEvent.stopPropagation);
      L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);*/
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
// http://www.coffeegnome.net/creating-contr…button-leaflet
