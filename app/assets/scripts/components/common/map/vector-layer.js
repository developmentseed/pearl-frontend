import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import {} from 'leaflet.vectorgrid';
import usePrevious from '../../../utils/use-previous';

function VectorLayer(props) {
  const { url, token, pane, opacity } = props;
  const map = useMap();
  const [layer, setLayer] = useState(null);

  const previousUrl = usePrevious(url);

  useEffect(() => {
    const options = {
      fetchOptions: {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      },
      pane: pane || 'mapPane',
      vectorTileLayerStyles: {
        data: {
          color: '#9bc2c4',
          fill: true,
          fillColor: '#9bc2c4',
          fillOpacity: 1,
          radius: 5,
        },
      },
    };

    const layer = L.vectorGrid.protobuf(url, options);
    layer.on('add', (v) => setLayer(v.target));
    layer.addTo(map);

    return () => {
      layer.remove();
    };
  }, []);

  useEffect(() => {
    if (!layer || previousUrl === url) return;

    layer.remove();

    const options = {
      fetchOptions: {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      },
      pane: pane || 'mapPane',
      vectorTileLayerStyles: {
        data: {
          color: '#9bc2c4',
          fill: true,
          fillColor: '#9bc2c4',
          fillOpacity: 1,
          radius: 5,
        },
      },
    };

    const layer = L.vectorGrid.protobuf(url, options);
    layer.on('add', (v) => setLayer(v.target));
    layer.addTo(map);
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
