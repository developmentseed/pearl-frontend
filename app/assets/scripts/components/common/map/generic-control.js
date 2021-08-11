import { useEffect } from 'react';
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
      const container = L.DomUtil.create('button');

      //container.style.backgroundColor = theme.baseDark;
      //container.style.backgroundImage = "url(https://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)";
      container.style.backgroundSize = '30px 30px';
      container.style.width = '30px';
      container.style.height = '30px';
      container.className='generic-leaflet-control'
      container.id=id

      container.onclick = function () {
        console.log('buttonClicked');
      };

      return container;
    },
  });

  useEffect(() => {
    map.addControl(new GenericControl());
  }, [map]);
  return null;
}

export default GenericControl;
// http://www.coffeegnome.net/creating-contr…button-leaflet
