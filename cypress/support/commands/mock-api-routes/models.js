const restApiEndpoint = Cypress.config('restApiEndpoint');

export function addModelEndpoints() {
  // Models
  cy.intercept(
    {
      url: restApiEndpoint + '/api/model',
    },
    {
      body: {
        total: 3,
        models: [
          {
            id: 3,
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
          },
          {
            id: 1,
            created: 1675341922123,
            active: true,
            imagery_source_id: 2,
            uid: 20,
            name: 'mexico-test',
            meta: {
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
          },
        ],
      },
    }
  );
  cy.intercept(
    {
      url: restApiEndpoint + '/api/model/1',
    },
    {
      body: {
        id: 1,
        created: '2021-04-20T10:41:12.583Z',
        active: true,
        uid: 11,
        name: 'East Coast NAIP 4 Class',
        imagery_source_id: 1,
        meta: {
          name: 'East Coast NAIP 4 Class',
          imagery: 'NAIP 2013, 2014, 2015, 2016, 2017',
          f1_score: {
            Tree: 0.9,
            'Water / Wetland': 0.55,
            'Built Enviornment': 0.56,
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
            'Built Environment': 0.03,
            'Low Vegetation / Barren': 0.29,
          },
          imagery_resolution: '100 cm',
          classes_description:
            'https://chesapeakeconservancy.org/wp-content/uploads/2020/03/LC_Class_Descriptions.pdf',
        },
        classes: [
          { name: 'Water / Wetland', color: '#486DA2' },
          { name: 'Tree', color: '#6CA966' },
          { name: 'Low Vegetation / Barren', color: '#D0F3AB' },
          { name: 'Built Environment', color: '#BFB5B5' },
        ],
        bounds: [-81, 36, -74, 44],
      },
    }
  );
}
