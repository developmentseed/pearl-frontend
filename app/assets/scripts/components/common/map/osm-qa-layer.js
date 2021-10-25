import { useEffect } from 'react';
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
    name: 'Tree Canopy',
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

function getFeatureClass(props) {
  let featureClass;

  for (let i = 0; i < defaultClassTagmaps.length; i++) {
    const sampleClass = defaultClassTagmaps[i];

    for (let j = 0; j < sampleClass.tagmap.length; j++) {
      const { k, v } = sampleClass.tagmap[j];

      // Match wildcards or exact match
      if ((v === '.*' && props[k]) || props[k] === v) {
        featureClass = sampleClass;
        break;
      }
    }
  }

  return featureClass;
}

function OsmQaLayer() {
  const map = useMap();

  useEffect(() => {
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
          if (!featureClass) {
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

    return () => {
      l.remove();
    };
  }, []);

  return null;
}

export default OsmQaLayer;
