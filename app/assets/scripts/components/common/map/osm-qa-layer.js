import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import {} from 'leaflet.vectorgrid';
import config from '../../../config';

const { restApiEndpoint } = config;
const osmQaPbfTilesUrl = `${restApiEndpoint}/api/tiles/qa-latest/{z}/{x}/{y}.mvt`;

const hiddenStyle = { weight: 0 };

export const defaultClassTagmaps = [
  {
    name: 'Water / Wetland',
    color: '#0000FF',
    tagmap: [
      { key: 'landuse', value: 'reservoir' },
      { key: 'landuse', value: 'pond' },
      { key: 'leisure', value: 'swimming_area' },
      { key: 'leisure', value: 'swimming_pool' },
      { key: 'natural', value: 'bay' },
      { key: 'natural', value: 'water' },
      { key: 'natural', value: 'riverbank' },
      { key: 'natural', value: 'coastline' },
      { key: 'amenity', value: 'fountain' },
      { key: 'waterway', value: 'river' },
      { key: 'waterway', value: 'riverbank' },
      { key: 'waterway', value: 'stream' },
    ],
  },

  {
    name: 'Structure',
    color: '#f76f73',
    tagmap: [
      { key: 'building', value: '.*' },
      { key: 'amenity', value: 'bar' },
      { key: 'amenity', value: 'hospital' },
      { key: 'amenity', value: 'pub' },
      { key: 'amenity', value: 'restaurant' },
      { key: 'amenity', value: 'school' },
      { key: 'amenity', value: 'university' },
      { key: 'amenity', value: 'animal_shelter' },
      { key: 'amenity', value: 'arts_centre' },
      { key: 'amenity', value: 'bank' },
      { key: 'amenity', value: 'bar' },
      { key: 'amenity', value: 'brothel' },
      { key: 'amenity', value: 'cafe' },
      { key: 'amenity', value: 'car_rental' },
      { key: 'amenity', value: 'car_wash' },
      { key: 'amenity', value: 'casino' },
      { key: 'amenity', value: 'cinema' },
      { key: 'amenity', value: 'clinic' },
      { key: 'amenity', value: 'college' },
      { key: 'amenity', value: 'community_centre' },
      { key: 'amenity', value: 'courthouse' },
      { key: 'amenity', value: 'crematorium' },
      { key: 'amenity', value: 'crypt' },
      { key: 'amenity', value: 'dentist' },
      { key: 'amenity', value: 'dive_centre' },
      { key: 'amenity', value: 'driving_school' },
      { key: 'amenity', value: 'embassy' },
      { key: 'amenity', value: 'fast_food' },
      { key: 'amenity', value: 'ferry_terminal' },
      { key: 'amenity', value: 'fire_station' },
      { key: 'amenity', value: 'food_court' },
      { key: 'amenity', value: 'fuel' },
      { key: 'amenity', value: 'grave_yard' },
      { key: 'amenity', value: 'gym' },
      { key: 'amenity', value: 'hospital' },
      { key: 'amenity', value: 'internet_cafe' },
    ],
  },
  {
    name: 'Water',
    color: '#0000FF',
    tagmap: [
      { key: 'landuse', value: 'reservoir' },
      { key: 'landuse', value: 'pond' },
      { key: 'leisure', value: 'swimming_area' },
      { key: 'leisure', value: 'swimming_pool' },
      { key: 'natural', value: 'bay' },
      { key: 'natural', value: 'water' },
      { key: 'natural', value: 'riverbank' },
      { key: 'natural', value: 'coastline' },
      { key: 'amenity', value: 'fountain' },
      { key: 'waterway', value: 'river' },
      { key: 'waterway', value: 'riverbank' },
      { key: 'waterway', value: 'stream' },
    ],
  },
  {
    name: 'No Data',
    color: '#62a092',
    tagmap: [],
  },
  {
    name: 'Impervious Road',
    color: '#0218a2',
    tagmap: [
      { key: 'highway', value: '.*' },
      { key: 'amenity', value: 'parking' },
      { key: 'parking', value: 'surface' },
    ],
  },
  {
    name: 'Emergent Wetlands',
    color: '#008000',
    tagmap: [
      { key: 'natural', value: 'mud' },
      { key: 'natural', value: 'wetland' },
    ],
  },
  {
    name: 'Impervious Surface',
    color: '#ffb703',
    tagmap: [
      { key: 'building', value: '.*' },
      { key: 'highway', value: '.*' },
      { key: 'amenity', value: 'bar' },
      { key: 'amenity', value: 'hospital' },
      { key: 'amenity', value: 'pub' },
      { key: 'amenity', value: 'restaurant' },
      { key: 'amenity', value: 'school' },
      { key: 'amenity', value: 'university' },
      { key: 'amenity', value: 'animal_shelter' },
      { key: 'amenity', value: 'arts_centre' },
      { key: 'amenity', value: 'bank' },
      { key: 'amenity', value: 'bar' },
      { key: 'amenity', value: 'brothel' },
      { key: 'amenity', value: 'cafe' },
      { key: 'amenity', value: 'car_rental' },
      { key: 'amenity', value: 'car_wash' },
      { key: 'amenity', value: 'casino' },
      { key: 'amenity', value: 'cinema' },
      { key: 'amenity', value: 'clinic' },
      { key: 'amenity', value: 'college' },
      { key: 'amenity', value: 'community_centre' },
      { key: 'amenity', value: 'courthouse' },
      { key: 'amenity', value: 'crematorium' },
      { key: 'amenity', value: 'crypt' },
      { key: 'amenity', value: 'dentist' },
      { key: 'amenity', value: 'dive_centre' },
      { key: 'amenity', value: 'driving_school' },
      { key: 'amenity', value: 'embassy' },
      { key: 'amenity', value: 'fast_food' },
      { key: 'amenity', value: 'ferry_terminal' },
      { key: 'amenity', value: 'fire_station' },
      { key: 'amenity', value: 'food_court' },
      { key: 'amenity', value: 'fuel' },
      { key: 'amenity', value: 'grave_yard' },
      { key: 'amenity', value: 'gym' },
      { key: 'amenity', value: 'hospital' },
      { key: 'amenity', value: 'internet_cafe' },
    ],
  },
  {
    name: 'Tree',
    color: '#80FF80',
    tagmap: [
      { key: 'natural', value: 'tree' },
      { key: 'natural', value: 'tree_row' },
      { key: 'natural', value: 'wood' },
      { key: 'landuse', value: 'forest' },
    ],
  },
  {
    name: 'Shrubland',
    color: '#806060',
    tagmap: [
      { key: 'landuse', value: 'scrub' },
      { key: 'natural', value: 'fell' },
      { key: 'natural', value: 'grassland' },
      { key: 'natural', value: 'heath' },
      { key: 'natural', value: 'scrub' },
    ],
  },
  {
    name: 'Barren',
    color: '#027fdc',
    tagmap: [
      { key: 'natural', value: 'beach' },
      { key: 'natural', value: 'sand' },
      { key: 'natural', value: 'shingle' },
      { key: 'natural', value: 'bare_rock' },
      { key: 'natural', value: 'scree' },
      { key: 'natural', value: 'glacier' },
    ],
  },
  {
    name: 'Low Vegetation',
    color: '#07c4c5',
    tagmap: [],
  },
  {
    name: 'Tundra',
    color: '#ffffff',
    tagmap: [],
  },
  {
    name: 'Mountain',
    color: '#a4afbf',
    tagmap: [],
  },
];

function getFeatureId(feature) {
  return feature.properties && feature.properties['@id'];
}

function OsmQaLayer(props) {
  const map = useMap();

  const [layer, setLayer] = useState(null);

  useEffect(() => {
    if (layer) {
      layer.remove();
    }

    const classes = Object.keys(props.classes).map((name) => {
      return {
        ...props.classes[name],
        tagmap: defaultClassTagmaps.find((c) => c.name === name)?.tagmap || [],
      };
    });

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

    l.on('click', function (e) {
      const feature = e.layer;
      const featureClass = getFeatureClass(feature.properties);
      if (featureClass) {
        l.setFeatureStyle(getFeatureId(feature), hiddenStyle);
      }
      L.DomEvent.stop(e);
    });

    l.addTo(map);

    setLayer(l);

    return () => {
      l.remove();
    };
  }, [props.classes]);

  return null;
}

export default OsmQaLayer;
