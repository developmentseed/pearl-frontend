const {
  restApiEndpoint,
} = require('../../../../app/assets/scripts/config/testing').default;

/**
 * Intercepts API routes
 */
Cypress.Commands.add('startServer', () => {
  // Add /projects routes from separate file
  require('./projects')();
  require('./batch')();

  // Fake OSM Tiles
  cy.intercept(
    {
      hostname: 'a.tile.openstreetmap.org',
    },
    { fixture: 'tiles/osm-tile.png' }
  );
  cy.intercept(
    {
      hostname: 'b.tile.openstreetmap.org',
    },
    { fixture: 'tiles/osm-tile.png' }
  );
  cy.intercept(
    {
      hostname: 'c.tile.openstreetmap.org',
    },
    { fixture: 'tiles/osm-tile.png' }
  );

  // Fake Imagery Layer
  cy.intercept(
    {
      url: 'https://tiles.lulc.ds.io/**',
    },
    { fixture: 'tiles/imagery-tile.png' }
  );

  // API Health
  cy.intercept(
    {
      url: restApiEndpoint + '/health',
    },
    { healthy: true, message: 'Good to go' }
  );

  // API Limits
  cy.intercept(
    {
      url: restApiEndpoint + '/api',
    },
    {
      version: '1.0.0',
      limits: {
        live_inference: 10000000,
        max_inference: 100000000,
        instance_window: 600,
        total_gpus: 15,
        active_gpus: 5,
      },
    }
  );

  // Mosaic
  cy.intercept(
    {
      url: restApiEndpoint + '/api/mosaic',
    },
    { mosaics: ['naip.latest'] }
  );

  // Geocoder
  cy.intercept(
    {
      url: 'https://dev.virtualearth.net/REST/v1/Locations/*?*',
    },
    { fixture: 'geocoder/dc.json' }
  ).as('reverseGeocodeCity');
  cy.intercept(
    {
      url:
        'https://dev.virtualearth.net/REST/v1/Locations/40.36315736436661,-77.7938461303711?*',
    },
    { fixture: 'geocoder/rural.json' }
  ).as('reverseGeocodeRural');

  // Models
  cy.intercept(
    {
      url: restApiEndpoint + '/api/model',
    },
    {
      body: {
        models: [
          {
            id: 1,
            created: '2021-04-20T10:41:12.583Z',
            active: true,
            uid: 11,
            name: 'East Coast NAIP 4 Class',
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
          {
            id: 2,
            created: '2021-04-20T10:27:05.987Z',
            active: true,
            uid: 11,
            name: 'East Coast NAIP 9 Class',
            meta: {
              name: 'East Coast NAIP 9 Class',
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
              { name: 'Water', color: '#486DA2' },
              { name: 'Emergent Wetlands', color: '#00A884' },
              { name: 'Tree', color: '#6CA966' },
              { name: 'Shrubland', color: '#ABC964' },
              { name: 'Low Vegetation', color: '#D0F3AB' },
              { name: 'Barren', color: '#D2AD74' },
              { name: 'Structure', color: '#F10100' },
              { name: 'Impervious Surface', color: '#BFB5B5' },
              { name: 'Impervious Road', color: '#320000' },
            ],
            bounds: [-81, 36, -74, 44],
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
});
