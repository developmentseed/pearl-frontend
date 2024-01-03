const restApiEndpoint = Cypress.config('restApiEndpoint');

const model1 = {
  id: 1,
  created: 1636558577692,
  active: true,
  imagery_source_id: 1,
  uid: 4,
  name: 'Midwest 7 Class',
  meta: {
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
};

const model2 = {
  id: 2,
  created: 1675854437985,
  active: true,
  imagery_source_id: 2,
  uid: 41,
  name: 'srm-rm-model-02',
  meta: {
    imagery: 'sentinel-2',
    f1_score: {
      Agua: 0.5,
      Bosque: 0.5,
      Pastos: 0.5,
      Selvas: 0.5,
      Urbano: 0.5,
      Agricultura: 0.5,
      'Suelo desnudo': 0.5,
      'Sin vegetación aparente': 0.5,
    },
    description: 'Sentinel Model test',
    f1_weighted: 0.6,
    label_sources: 'RM',
    class_distribution: {
      Agua: 0.5,
      Bosque: 0.5,
      Pastos: 0.5,
      Selvas: 0.5,
      Urbano: 0.5,
      Agricultura: 0.5,
      'Suelo desnudo': 0.5,
      'Sin vegetación aparente': 0.5,
    },
    imagery_resolution: '14',
  },
  classes: [
    { name: 'Bosque', color: '#14d921' },
    { name: 'Selvas', color: '#9aec3f' },
    { name: 'Pastos', color: '#d8ec49' },
    { name: 'Agricultura', color: '#f3e48b' },
    { name: 'Urbano', color: '#f3f5f2' },
    { name: 'Sin vegetación aparente', color: '#54d4d1' },
    { name: 'Agua', color: '#2237d9' },
    { name: 'Suelo desnudo', color: '#842ff8' },
  ],
  bounds: [-180, -90, 180, 90],
  storage: true,
};

Cypress.Commands.add('mockModelApiRoutes', () => {
  // Models
  cy.intercept(
    {
      url: restApiEndpoint + '/api/model',
    },
    {
      body: {
        total: 2,
        models: [model1, model2],
      },
    }
  );
  cy.intercept(
    {
      url: restApiEndpoint + '/api/model/1',
    },
    {
      body: {
        ...model1,
      },
    }
  );
  cy.intercept(
    {
      url: restApiEndpoint + '/api/model/2',
    },
    {
      body: {
        ...model2,
      },
    }
  );
});
