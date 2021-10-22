import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import {} from 'leaflet.vectorgrid';
import config from '../../../config';

const { restApiEndpoint } = config;
const osmQaPbfTilesUrl = `${restApiEndpoint}/api/tiles/qa-latest/{z}/{x}/{y}.mvt`;

const sampleClasses = [
  {
    name: 'Water',
    color: '#0000FF',
    tagmap: [
      { k: 'landuse', v: 'reservoir' },
      { k: 'landuse', v: 'pond' },
      { k: 'leisure', v: 'swimming_area' },
      { k: 'leisure', v: 'swimming_pool' },
      { k: 'natural', v: 'bay' },
      { k: 'natural', v: 'water' },
      { k: 'natural', v: 'riverbank' },
      { k: 'natural', v: 'coastline' },
      { k: 'amenity', v: 'fountain' },
      { k: 'waterway', v: 'river' },
      { k: 'waterway', v: 'riverbank' },
      { k: 'waterway', v: 'stream' },
    ],
  },

  {
    name: 'Structure',
    color: '#f76f73',
    tagmap: [
      { k: 'building', v: '.*' },
      { k: 'amenity', v: 'bar' },
      { k: 'amenity', v: 'hospital' },
      { k: 'amenity', v: 'pub' },
      { k: 'amenity', v: 'restaurant' },
      { k: 'amenity', v: 'school' },
      { k: 'amenity', v: 'university' },
      { k: 'amenity', v: 'animal_shelter' },
      { k: 'amenity', v: 'arts_centre' },
      { k: 'amenity', v: 'bank' },
      { k: 'amenity', v: 'bar' },
      { k: 'amenity', v: 'brothel' },
      { k: 'amenity', v: 'cafe' },
      { k: 'amenity', v: 'car_rental' },
      { k: 'amenity', v: 'car_wash' },
      { k: 'amenity', v: 'casino' },
      { k: 'amenity', v: 'cinema' },
      { k: 'amenity', v: 'clinic' },
      { k: 'amenity', v: 'college' },
      { k: 'amenity', v: 'community_centre' },
      { k: 'amenity', v: 'courthouse' },
      { k: 'amenity', v: 'crematorium' },
      { k: 'amenity', v: 'crypt' },
      { k: 'amenity', v: 'dentist' },
      { k: 'amenity', v: 'dive_centre' },
      { k: 'amenity', v: 'driving_school' },
      { k: 'amenity', v: 'embassy' },
      { k: 'amenity', v: 'fast_food' },
      { k: 'amenity', v: 'ferry_terminal' },
      { k: 'amenity', v: 'fire_station' },
      { k: 'amenity', v: 'food_court' },
      { k: 'amenity', v: 'fuel' },
      { k: 'amenity', v: 'grave_yard' },
      { k: 'amenity', v: 'gym' },
      { k: 'amenity', v: 'hospital' },
      { k: 'amenity', v: 'internet_cafe' },
    ],
  },
  {
    name: 'Water',
    color: '#0000FF',
    tagmap: [
      { k: 'landuse', v: 'reservoir' },
      { k: 'landuse', v: 'pond' },
      { k: 'leisure', v: 'swimming_area' },
      { k: 'leisure', v: 'swimming_pool' },
      { k: 'natural', v: 'bay' },
      { k: 'natural', v: 'water' },
      { k: 'natural', v: 'riverbank' },
      { k: 'natural', v: 'coastline' },
      { k: 'amenity', v: 'fountain' },
      { k: 'waterway', v: 'river' },
      { k: 'waterway', v: 'riverbank' },
      { k: 'waterway', v: 'stream' },
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
      { k: 'highway', v: '.*' },
      { k: 'amenity', v: 'parking' },
      { k: 'parking', v: 'surface' },
    ],
  },
  {
    name: 'Emergent Wetlands',
    color: '#008000',
    tagmap: [
      { k: 'natural', v: 'mud' },
      { k: 'natural', v: 'wetland' },
    ],
  },
  {
    name: 'Impervious Surface',
    color: '#ffb703',
    tagmap: [
      { k: 'building', v: '.*' },
      { k: 'highway', v: '.*' },
      { k: 'amenity', v: 'bar' },
      { k: 'amenity', v: 'hospital' },
      { k: 'amenity', v: 'pub' },
      { k: 'amenity', v: 'restaurant' },
      { k: 'amenity', v: 'school' },
      { k: 'amenity', v: 'university' },
      { k: 'amenity', v: 'animal_shelter' },
      { k: 'amenity', v: 'arts_centre' },
      { k: 'amenity', v: 'bank' },
      { k: 'amenity', v: 'bar' },
      { k: 'amenity', v: 'brothel' },
      { k: 'amenity', v: 'cafe' },
      { k: 'amenity', v: 'car_rental' },
      { k: 'amenity', v: 'car_wash' },
      { k: 'amenity', v: 'casino' },
      { k: 'amenity', v: 'cinema' },
      { k: 'amenity', v: 'clinic' },
      { k: 'amenity', v: 'college' },
      { k: 'amenity', v: 'community_centre' },
      { k: 'amenity', v: 'courthouse' },
      { k: 'amenity', v: 'crematorium' },
      { k: 'amenity', v: 'crypt' },
      { k: 'amenity', v: 'dentist' },
      { k: 'amenity', v: 'dive_centre' },
      { k: 'amenity', v: 'driving_school' },
      { k: 'amenity', v: 'embassy' },
      { k: 'amenity', v: 'fast_food' },
      { k: 'amenity', v: 'ferry_terminal' },
      { k: 'amenity', v: 'fire_station' },
      { k: 'amenity', v: 'food_court' },
      { k: 'amenity', v: 'fuel' },
      { k: 'amenity', v: 'grave_yard' },
      { k: 'amenity', v: 'gym' },
      { k: 'amenity', v: 'hospital' },
      { k: 'amenity', v: 'internet_cafe' },
    ],
  },
  {
    name: 'Tree Canopy',
    color: '#80FF80',
    tagmap: [
      { k: 'natural', v: 'tree' },
      { k: 'natural', v: 'tree_row' },
      { k: 'natural', v: 'wood' },
      { k: 'landuse', v: 'forest' },
    ],
  },
  {
    name: 'Shrubland',
    color: '#806060',
    tagmap: [
      { k: 'landuse', v: 'scrub' },
      { k: 'natural', v: 'fell' },
      { k: 'natural', v: 'grassland' },
      { k: 'natural', v: 'heath' },
      { k: 'natural', v: 'scrub' },
    ],
  },
  {
    name: 'Barren',
    color: '#027fdc',
    tagmap: [
      { k: 'natural', v: 'beach' },
      { k: 'natural', v: 'sand' },
      { k: 'natural', v: 'shingle' },
      { k: 'natural', v: 'bare_rock' },
      { k: 'natural', v: 'scree' },
      { k: 'natural', v: 'glacier' },
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

function getFeatureClass(props) {
  let featureClass;

  for (let i = 0; i < sampleClasses.length; i++) {
    const sampleClass = sampleClasses[i];

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
    const l = L.vectorGrid
      .protobuf(osmQaPbfTilesUrl, {
        interactive: true,
        vectorTileLayerStyles: {
          osm: (props) => {
            const featureClass = getFeatureClass(props);

            return featureClass
              ? {
                  fillColor: featureClass.color,
                  color: featureClass.color,
                  fill: true,
                }
              : { weight: 0 };
          },
        },
      })
      .on('click', function (e) {
        const feature = e.layer.properties;
        const featureClass = getFeatureClass(feature);
        if (featureClass) {
          alert(featureClass.name);
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
