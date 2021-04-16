import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import {} from 'leaflet.vectorgrid';
import usePrevious from '../../../utils/use-previous';

function VectorLayer(props) {
  const { url, token, pane, opacity, classes } = props;
  const classArray = Object.keys(classes);
  const map = useMap();
  const [layer, setLayer] = useState(null);

  const previousUrl = usePrevious(url);

  const options = {
    fetchOptions: {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    },
    pane: pane || 'mapPane',
    interactive: true,
    vectorTileLayerStyles: {
      data: function (properties) {
        const klass = properties.class;
        return {
          color: classes[classArray[klass - 1]].color,
          fill: true,
          fillColor: classes[classArray[klass - 1]].color,
          fillOpacity: 1,
          radius: 5
        }
      }
    },
  };

  useEffect(() => {
    const l = L.vectorGrid.protobuf(url, options);
    l.on('add', () => {
      setLayer(l);
    });
    l.addTo(map);

    return () => {
      l.remove();
    };
  }, []);

  useEffect(() => {
    if (!layer || previousUrl === url) return;

    layer.remove();

    const l = L.vectorGrid.protobuf(url, options);
    l.on('add', () => setLayer(l));
    l.addTo(map);
  }, [url, layer]);

  useEffect(() => {
    if (!layer) {
      return;
    }
    layer.setOpacity(opacity);
  }, [opacity, layer]);

  return null;
}

export default VectorLayer;
