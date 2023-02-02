import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';
import { useAuth } from '../context/auth';
import logger from '../utils/logger';

const ModelContext = createContext(null);

const hardcodedModels = {
  data: [
    {
      id: 7,
      created: 1639490735004,
      active: true,
      uid: 4,
      name: 'Fort Collins',
      meta: {
        name: 'Fort Collins',
        imagery_id: 'naip.latest',
        imagery: 'NAIP',
        f1_score: {
          Tree: 0.59,
          Grass: 0.88,
          Roads: 0.59,
          Water: 0.92,
          'Bare Soil': 0,
          Buildings: 0.5,
          'Other Impervious': 0.79,
        },
        description: 'Fort Collins',
        f1_weighted: 0.77,
        label_sources: 'UVM',
        training_area: 61991.82,
        training_data_aoi:
          'https://mvpmodels.blob.core.windows.net/fort-collins/fort-collins_aoi.geojson',
        class_distribution: {
          Tree: 0.61,
          Grass: 0.18,
          Roads: 0.03,
          Water: 0.05,
          'Bare Soil': 0,
          Buildings: 0.04,
          'Other Impervious': 0.09,
        },
        imagery_resolution: '100 cm',
      },
      classes: [
        {
          name: 'Tree',
          color: '#6CA966',
        },
        {
          name: 'Grass',
          color: '#D0F3AB',
        },
        {
          name: 'Bare Soil',
          color: '#D2AD74',
        },
        {
          name: 'Water',
          color: '#486DA2',
        },
        {
          name: 'Buildings',
          color: '#F10100',
        },
        {
          name: 'Roads',
          color: '#320000',
        },
        {
          name: 'Other Impervious',
          color: '#BFB5B5',
        },
      ],
      bounds: [
        -105.1914325851629,
        40.434569900658694,
        -104.93366659251376,
        40.69043130618214,
      ],
      storage: true,
      overlapsAoi: false,
    },
    {
      id: 6,
      created: 1638901027087,
      active: true,
      uid: 4,
      name: 'Hamilton County / Indianapolis',
      meta: {
        name: 'Hamilton County / Indianapolis',
        imagery_id: 'naip.latest',
        imagery: 'NAIP',
        f1_score: {
          Tree: 0.85,
          Grass: 0.72,
          Roads: 0.78,
          Water: 0.84,
          'Bare Soil': 0.16,
          Buildings: 0.7,
          'Other Impervious': 0.77,
        },
        description: 'Hamilton County / Indianapolis Combined',
        f1_weighted: 0.77,
        label_sources: 'UVM',
        training_area: 149029.32,
        training_data_aoi:
          'https://mvpmodels.blob.core.windows.net/hamilton-county-indianapolis-combined/hamilton_county_indianapolis_aoi.geojson',
        class_distribution: {
          Tree: 0.43,
          Grass: 0.28,
          Roads: 0.06,
          Water: 0.01,
          'Bare Soil': 0.01,
          Buildings: 0.09,
          'Other Impervious': 0.13,
        },
        imagery_resolution: '100 cm',
      },
      classes: [
        {
          name: 'Tree',
          color: '#6CA966',
        },
        {
          name: 'Grass',
          color: '#D0F3AB',
        },
        {
          name: 'Bare Soil',
          color: '#D2AD74',
        },
        {
          name: 'Water',
          color: '#486DA2',
        },
        {
          name: 'Buildings',
          color: '#F10100',
        },
        {
          name: 'Roads',
          color: '#FFC300',
        },
        {
          name: 'Other Impervious',
          color: '#FF5733',
        },
      ],
      bounds: [
        -86.3166653762649,
        39.058168783530014,
        -84.3063451600684,
        39.87826140400843,
      ],
      storage: true,
      overlapsAoi: false,
    },
    {
      id: 5,
      created: 1636558577692,
      active: true,
      uid: 4,
      name: 'Midwest 7 Class',
      meta: {
        name: 'Midwest 7 Class',
        imagery_id: 'sentinel',
        imagery: 'NAIP',
        f1_score: {
          tree: 0.77,
          grass: 0.72,
          roads: 0.8,
          water: 0.63,
          'bare soil': 0.16,
          buildings: 0.73,
          'other impervious': 0.73,
        },
        description: 'Midwest Combined multi-year',
        f1_weighted: 0.738,
        label_sources: 'uvm',
        training_area: 20802.340261,
        training_data_aoi:
          'https://mvpmodels.blob.core.windows.net/midwest-multi-year/midwest_aoi.geojson',
        class_distribution: {
          tree: 0.43,
          grass: 0.28,
          roads: 0.06,
          water: 0.01,
          'bare soil': 0.01,
          buildings: 0.09,
          'other impervious': 0.13,
        },
        imagery_resolution: '100 cm',
      },
      classes: [
        {
          name: 'tree',
          color: '#6CA966',
        },
        {
          name: 'grass',
          color: '#D0F3AB',
        },
        {
          name: 'bare soil',
          color: '#D2AD74',
        },
        {
          name: 'water',
          color: '#486DA2',
        },
        {
          name: 'buildings',
          color: '#F10100',
        },
        {
          name: 'roads',
          color: '#FFC300',
        },
        {
          name: 'other impervious',
          color: '#FF5733',
        },
      ],
      bounds: [
        -83.25599304179488,
        41.246646145864226,
        -81.37080774185067,
        42.44198353133044,
      ],
      storage: true,
      overlapsAoi: false,
    },
    {
      id: 4,
      created: 1618915419451,
      active: true,
      uid: 7,
      name: 'East Coast NAIP 4 Class',
      meta: {
        name: 'East Coast NAIP 4 Class',
        imagery_id: 'sentinel',
        imagery: 'NAIP 2013, 2014, 2015, 2016, 2017',
        f1_score: {
          Tree: 0.9,
          'Water / Wetland': 0.55,
          'Built Environment': 0.56,
          'Low Vegetation / Barren': 0.72,
        },
        description:
          'New York, Maryland, Virginia, West Virginia, Pennsylvania, Delaware',
        f1_weighted: 0.87,
        label_sources: 'Chesapeake Conservancy',
        training_area: 283475,
        training_data_aoi:
          'https://mvpmodels.blob.core.windows.net/cc6-ne-combined/cc6ne_states.geojson',
        class_distribution: {
          Tree: 0.63,
          'Water / Wetland': 0.05,
          'Built Enviornment': 0.03,
          'Low Vegetation / Barren': 0.29,
        },
        imagery_resolution: '100 cm',
        classes_description:
          'https://chesapeakeconservancy.org/wp-content/uploads/2020/03/LC_Class_Descriptions.pdf',
      },
      classes: [
        {
          name: 'Water / Wetland',
          color: '#486DA2',
        },
        {
          name: 'Tree',
          color: '#6CA966',
        },
        {
          name: 'Low Vegetation / Barren',
          color: '#D0F3AB',
        },
        {
          name: 'Built Environment',
          color: '#BFB5B5',
        },
      ],
      bounds: [-81, 36, -74, 44],
      storage: true,
      overlapsAoi: false,
    },
    {
      id: 3,
      created: 1618915133241,
      active: true,
      uid: 7,
      name: 'East Coast NAIP 9 Class',
      meta: {
        name: 'East Coast NAIP 9 Class',
        imagery_id: 'naip.latest',
        imagery: 'NAIP 2013, 2014, 2015, 2016, 2017',
        f1_score: {
          Tree: 0.89,
          Water: 0.56,
          Barren: 0,
          Shrubland: 0,
          Structure: 0.21,
          'Low Vegetation': 0.72,
          'Impervious Road': 0.39,
          'Emergent Wetlands': 0,
          'Impervious Surface': 0.25,
        },
        description:
          'New York, Maryland, Virginia, West Virginia, Pennsylvania, Delaware',
        f1_weighted: 0.85,
        label_sources: 'Chesapeake Conservancy',
        training_area: 283475,
        training_data_aoi:
          'https://mvpmodels.blob.core.windows.net/cc6-ne-combined/cc6ne_states.geojson',
        class_distribution: {
          Tree: 0.63,
          Water: 0.048,
          Barren: 0.003,
          Shrubland: 0.001,
          Structure: 0.005,
          'Low Vegetation': 0.28,
          'Impervious Road': 0.01,
          'Emergent Wetlands': 0.005,
          'Impervious Surface': 0.02,
        },
        imagery_resolution: '100 cm',
        classes_description:
          'https://chesapeakeconservancy.org/wp-content/uploads/2020/03/LC_Class_Descriptions.pdf',
      },
      classes: [
        {
          name: 'Water',
          color: '#486DA2',
        },
        {
          name: 'Emergent Wetlands',
          color: '#00A884',
        },
        {
          name: 'Tree',
          color: '#6CA966',
        },
        {
          name: 'Shrubland',
          color: '#ABC964',
        },
        {
          name: 'Low Vegetation',
          color: '#D0F3AB',
        },
        {
          name: 'Barren',
          color: '#D2AD74',
        },
        {
          name: 'Structure',
          color: '#F10100',
        },
        {
          name: 'Impervious Surface',
          color: '#BFB5B5',
        },
        {
          name: 'Impervious Road',
          color: '#320000',
        },
      ],
      bounds: [-180, -90, 180, 90],
      storage: true,
      overlapsAoi: false,
    },
  ],
  status: 'success',
  isReady: true,
  hasError: false,
};

export function ModelProvider(props) {
  const { restApiClient } = useAuth();

  // Disable models fetch temporarily
  // const models = useFetch('model', {
  //   mutator: (body) => (body ? body.models : []),
  // });

  const models = hardcodedModels;

  const [selectedModel, setSelectedModel] = useState(null);

  const value = {
    models,
    selectedModel,
    setSelectedModel: async function (modelId) {
      try {
        const model = await restApiClient.getModel(modelId);
        setSelectedModel(model);
      } catch (error) {
        logger(`Could not fetch model ${modelId}`);
        logger(error);
      }
    },
  };

  return (
    <ModelContext.Provider value={value}>
      {props.children}
    </ModelContext.Provider>
  );
}

ModelProvider.propTypes = {
  children: T.node,
};

// Check if consumer function is used properly
const useModelContext = (fnName) => {
  const context = useContext(ModelContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <ModelContext> component's context.`
    );
  }

  return context;
};

export const useModel = () => {
  const { models, selectedModel, setSelectedModel } = useModelContext(
    'useModel'
  );

  return useMemo(
    () => ({
      models,
      selectedModel,
      setSelectedModel,
    }),
    [selectedModel, models]
  );
};
