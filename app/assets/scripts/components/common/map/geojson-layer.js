import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import {} from 'leaflet.vectorgrid';

function GeoJSONLayer(props) {
  const { data, style, opacity, pointToLayer, pane } = props;
  const map = useMap();
  const [layer, setLayer] = useState(null);

  useEffect(() => {
    const geolayer = L.geoJSON(data, {
      pointToLayer,
      pane: pane || 'overlayPane',
    });
    geolayer.on('add', () => {
      setLayer(geolayer);
      geolayer.setStyle(style);
    });

    geolayer.addTo(map);
    return () => {
      geolayer.clearLayers();
      geolayer.remove();
      setLayer(null);
    };
  }, []);

  useEffect(() => {
    if (layer) {
      layer.clearLayers();
      const geolayer = L.geoJSON(data, {
        pointToLayer,
        pane: pane || 'overlayPane',
      });

      geolayer.on('add', () => {
        setLayer(geolayer);
        geolayer.setStyle(style);
      });
      geolayer.addTo(map);
      return () => {
        geolayer.clearLayers();
        geolayer.remove();
        setLayer(null);
      };
    }
  }, [data]);

  useEffect(() => {
    if (layer) {
      layer.setStyle({
        fillOpacity: opacity,
      });
    }
  }, [opacity, layer]);

  return null;
}

export default GeoJSONLayer;
