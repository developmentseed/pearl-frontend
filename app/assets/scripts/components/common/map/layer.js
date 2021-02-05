import { useEffect, useRef } from 'react';
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

  const layer = useRef();

  useEffect(() => {
    if (layer.current) {
      map.removeLayer(layer.current);
    }
    let l = leaflet[type](source, options || {});
    l.addTo(map);
    layer.current = l;
  }, [source]);

  useEffect(() => {
    const { current } = layer;
    if (current) {
      current.setStyle && current.setStyle(options);
    }
  }, [options]);
  return null;
}

Layer.propTypes = {
  type: T.string,
  source: T.oneOfType([T.string, T.object, T.arra]),
  map: T.object,
  options: T.object,
};
export default Layer;
