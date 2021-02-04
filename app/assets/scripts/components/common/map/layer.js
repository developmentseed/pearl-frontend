import { useEffect, useState } from 'react';
import leaflet from 'leaflet';
import T from 'prop-types';

/* Leaflet layer
 * @param type - Leaflet layer type name
 * @param source - Data for layer. Tile url for raster layers, geojson object or url for vector layers
 * @param map - reference to map, passed by parent MapComponent
 * @param options - options and styles for layer
 */

function Layer(props) {
  const { type, source, map, options } = props;
  const [layer, setLayer] = useState(null);
  useEffect(() => {
    if (map) {
      if (layer) {
        // Source change, remove layer
        map.removeLayer(layer);
      }

      let l = leaflet[type](source, options || {});
      l.addTo(map);
      setLayer(layer);
    }
  }, [map, source]);

  useEffect(() => {
    if (map && layer) {
      layer.setStyle(options);
    }
  }, [map, layer, options]);
  return null;
}

Layer.propTypes = {
  type: T.string,
  source: T.oneOfType([T.string, T.object]),
  map: T.object,
  options: T.object,
};
export default Layer;
