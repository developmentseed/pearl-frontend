import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import theme from '../../../styles/theme';

function GenericControl({ position, onClick, id}) {
  const map = useMap();

  const GenericControl = L.Control.extend({
    options: {
      position: position || 'topleft',
    },

    onAdd: function (map) {
      const container = L.DomUtil.create('div');
      const button = L.DomUtil.create('div')

      //container.style.backgroundColor = theme.baseDark;
      //container.style.backgroundImage = "url(https://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)";
      button.style.backgroundSize = '30px 30px';
      button.style.width = '30px';
      button.style.height = '30px';

      button.className='generic-leaflet-control'

      container.id=id

      button.onclick = onClick;

      container.appendChild(button);

      return container;
    },
  });

  useEffect(() => {
    map.addControl(new GenericControl());
  }, [map]);

  useEffect(() => {
    document.getElementById(id).onclick = onClick
  }, [onClick])
  return null;
}

export default GenericControl;
// http://www.coffeegnome.net/creating-contr…button-leaflet
