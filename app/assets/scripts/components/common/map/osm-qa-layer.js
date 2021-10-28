import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import T from 'prop-types';
import {} from 'leaflet.vectorgrid';
import config from '../../../config';

const { restApiEndpoint } = config;
const osmQaPbfTilesUrl = `${restApiEndpoint}/api/tiles/qa-latest/{z}/{x}/{y}.mvt`;

const hiddenStyle = { weight: 0 };

function getFeatureId(feature) {
  return feature.properties && feature.properties['@id'];
}

function OsmQaLayer({ modelClasses }) {
  const map = useMap();

  const [layer, setLayer] = useState(null);

  useEffect(() => {
    if (layer) {
      layer.remove();
    }

    const classes = Object.keys(modelClasses)
      .map((name) => {
        return {
          ...modelClasses[name],
        };
      })
      .filter((c) => c.tagmap && c.tagmap.length > 0);

    function getFeatureClass(feature) {
      let featureClass;

      for (let i = 0; i < classes.length; i++) {
        const sampleClass = classes[i];

        for (let j = 0; j < sampleClass.tagmap.length; j++) {
          const { key, value } = sampleClass.tagmap[j];

          // Match wildcards or exact match
          if ((value === '.*' && feature[key]) || feature[key] === value) {
            featureClass = sampleClass;
            break;
          }
        }
      }

      return featureClass;
    }

    const l = L.vectorGrid.protobuf(osmQaPbfTilesUrl, {
      pane: 'markerPane',
      maxNativeZoom: 17,
      interactive: true,
      getFeatureId,
      vectorTileLayerStyles: {
        osm: (props) => {
          const featureType = props['@ftype'];

          // Discard non-closed ways
          if (featureType === 'LineString') {
            return hiddenStyle;
          }

          // Get class
          const featureClass = getFeatureClass(props);

          // Hide if doesn't belong to a class
          if (typeof featureClass === 'undefined') {
            return hiddenStyle;
          }

          // Get color
          const { color } = featureClass;

          // Return style
          return featureType !== 'Point'
            ? {
                color,
                fillColor: color,
                fill: true,
              }
            : { radius: 2, color, 'circle-color': color };
        },
      },
    });

    l.addTo(map);

    setLayer(l);

    return () => {
      l.remove();
    };
  }, [modelClasses]);

  return null;
}

OsmQaLayer.propTypes = {
  modelClasses: T.object,
};

export default OsmQaLayer;
