import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';

const ModelContext = createContext(null);

const hardcodedModels = {
  data: [
    {
      id: 1,
      created: 1675341922123,
      active: true,
      uid: 20,
      name: 'mexico-test',
      meta: {
        imagery_id: 'sentinel-2',
        imagery: 'sentinel-2',
        f1_score: {
          Agua: 0.6,
          Bosque: 0.6,
          Pastos: 0.6,
          Selvas: 0.6,
          Urbano: 0.6,
          Agricultura: 0.6,
          'Suelo desnudo': 0.6,
          'Sin vegetación aparente': 0.6,
        },
        description: 'Mexico Sentinel-2 Test Model',
        f1_weighted: 0.6,
        label_sources: 'Open Data',
        class_distribution: {
          Agua: 0.6,
          Bosque: 0.6,
          Pastos: 0.6,
          Selvas: 0.6,
          Urbano: 0.6,
          Agricultura: 0.6,
          'Suelo desnudo': 0.6,
          'Sin vegetación aparente': 0.6,
        },
        imagery_resolution: '10 m',
      },
      classes: [
        { name: 'Bosque', color: '#147536' },
        { name: 'Selvas', color: '#14ad23' },
        { name: 'Pastos', color: '#9ca905' },
        { name: 'Agricultura', color: '#12ec29' },
        { name: 'Urbano', color: '#c03232' },
        { name: 'Sin vegetación aparente', color: '#ffffff' },
        { name: 'Agua', color: '#306acc' },
        { name: 'Suelo desnudo', color: '#d6ae6f' },
      ],
      bounds: [-180, -90, 180, 90],
      storage: true,
    },
    {
      id: 2,
      created: 1636558577692,
      active: true,
      uid: 4,
      name: 'Midwest 7 Class',
      meta: {
        imagery_id: 'naip.latest',
        name: 'Midwest 7 Class',
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
        { name: 'tree', color: '#6CA966' },
        { name: 'grass', color: '#D0F3AB' },
        { name: 'bare soil', color: '#D2AD74' },
        { name: 'water', color: '#486DA2' },
        { name: 'buildings', color: '#F10100' },
        { name: 'roads', color: '#FFC300' },
        { name: 'other impervious', color: '#FF5733' },
      ],
      bounds: [
        -83.25599304179488,
        41.246646145864226,
        -81.37080774185067,
        42.44198353133044,
      ],
      storage: true,
    },
  ],
  status: 'success',
  isReady: true,
  hasError: false,
};

export function ModelProvider(props) {
  // Disable models fetch temporarily
  // const models = useFetch('model', {
  //   mutator: (body) => (body ? body.models : []),
  // });

  const models = hardcodedModels;

  const [selectedModel, setSelectedModel] = useState(null);

  const value = {
    models,
    selectedModel,
    setSelectedModel,
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
    [selectedModel, models, setSelectedModel]
  );
};
