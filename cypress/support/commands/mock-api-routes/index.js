const restApiEndpoint = Cypress.config('restApiEndpoint');

const { addModelEndpoints } = require('./models');
const { addProjectEndpoints } = require('./projects');

/**
 * This mocks API routes required by the specs
 */
Cypress.Commands.add('mockApiRoutes', () => {
  addProjectEndpoints();
  addModelEndpoints();

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/batch*',
      method: 'GET',
    },
    { total: 0, batch: [] }
  ).as('getBatchList');

  cy.intercept(
    {
      hostname: 'dc.services.visualstudio.com',
    },
    {}
  );

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
        total_cpus: 15,
        active_cpus: 5,
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

  cy.intercept(
    {
      url: restApiEndpoint + '/api/mosaic/naip.latest',
    },

    {
      tilejson: '2.2.0',
      name: 'mosaic',
      version: '1.0.0',
      scheme: 'xyz',
      tiles: [
        'http://lulc-helm-tiles/mosaic/naip.latest/tiles/{z}/{x}/{y}@1x?',
      ],
      minzoom: 12,
      maxzoom: 18,
      bounds: [
        -124.81903735821528,
        24.49673997373884,
        -66.93084562551495,
        49.44192498524237,
      ],
      center: [-95.87494149186512, 36.9693324794906, 12],
    }
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

  cy.intercept(
    { url: restApiEndpoint + '/api/imagery' },
    {
      body: {
        total: 2,
        imagery_sources: [
          {
            id: 1,
            created: 1675835884757,
            updated: 1675835884757,
            name: 'NAIP',
            bounds: {
              type: 'Polygon',
              coordinates: [
                [
                  [-180, -85.0511287798066],
                  [-180, 85.0511287798066],
                  [180, 85.0511287798066],
                  [180, -85.0511287798066],
                  [-180, -85.0511287798066],
                ],
              ],
              bounds: [-180, -85.0511287798066, 180, 85.0511287798066],
            },
          },
          {
            id: 2,
            created: 1675866091377,
            updated: 1675866091377,
            name: 'Sentinel-2',
            bounds: {
              type: 'Polygon',
              coordinates: [
                [
                  [-180, -85.0511287798066],
                  [-180, 85.0511287798066],
                  [180, 85.0511287798066],
                  [180, -85.0511287798066],
                  [-180, -85.0511287798066],
                ],
              ],
              bounds: [-180, -85.0511287798066, 180, 85.0511287798066],
            },
          },
        ],
      },
    }
  );

  cy.intercept(
    { url: restApiEndpoint + '/api/mosaic' },
    {
      body: {
        total: 2,
        mosaics: [
          {
            id: '87b72c66331e136e088004fba817e3e8',
            name: 'naip.latest',
            params: {
              assets: 'image',
              asset_bidx: 'image|1,2,3,4',
              collection: 'naip',
            },
            imagery_source_id: 1,
            created: 1677597442954,
            updated: 1677597442954,
            mosaic_ts_start: null,
            mosaic_ts_end: null,
          },
          {
            id: '2849689f57f1b3b9c1f725abb75aa411',
            name: 'Sentinel-2 Dec 2019 - March 2020',
            params: {
              assets: ['B04', 'B03', 'B02'],
              collection: 'sentinel-2-l2a',
              color_formula:
                'Gamma+RGB+3.2+Saturation+0.8+Sigmoidal+RGB+25+0.35',
            },
            imagery_source_id: 2,
            created: 1677597442954,
            updated: 1677597442954,
            mosaic_ts_start: 1575158400000,
            mosaic_ts_end: 1585612800000,
          },
          {
            id: 'dce67bf58e5c9dbcf9393776f13f9ebd',
            name: 'Sentinel-2 Dec 2020 - March 2021',
            params: {
              assets: ['B04', 'B03', 'B02'],
              collection: 'sentinel-2-l2a',
              color_formula:
                'Gamma+RGB+3.2+Saturation+0.8+Sigmoidal+RGB+25+0.35',
            },
            imagery_source_id: 2,
            created: 1677597442954,
            updated: 1677597442954,
            mosaic_ts_start: 1606780800000,
            mosaic_ts_end: 1617148800000,
          },
          {
            id: 'da05434b9b6a177a6999078221e19481',
            name: 'Sentinel-2 Dec 2021 - March 2022',
            params: {
              assets: ['B04', 'B03', 'B02'],
              collection: 'sentinel-2-l2a',
              color_formula:
                'Gamma+RGB+3.2+Saturation+0.8+Sigmoidal+RGB+25+0.35',
            },
            imagery_source_id: 2,
            created: 1677597442954,
            updated: 1677597442954,
            mosaic_ts_start: 1638316800000,
            mosaic_ts_end: 1648684800000,
          },
          {
            id: '9406dbfba1d5416dc521857008180079',
            name: 'Sentinel-2 Dec 2022 - Feb 2023',
            params: {
              assets: ['B04', 'B03', 'B02'],
              collection: 'sentinel-2-l2a',
              color_formula:
                'Gamma+RGB+3.2+Saturation+0.8+Sigmoidal+RGB+25+0.35',
            },
            imagery_source_id: 2,
            created: 1677597442954,
            updated: 1677597442954,
            mosaic_ts_start: 1669852800000,
            mosaic_ts_end: 1677542400000,
          },
        ],
      },
    }
  );
});
