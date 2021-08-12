const {
  restApiEndpoint,
} = require('../../../app/assets/scripts/config/testing').default;

/**
 * Mock a project scenario: an instance is running with checkpoint 2 and AOI 2 applied.
 */
Cypress.Commands.add('mockRegularProject', () => {
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
      url: restApiEndpoint + '/api/project/1',
    },
    {
      body: {
        id: 1,
        name: 'Untitled',
        model_id: 1,
        mosaic: 'naip.latest',
        created: '2021-03-19T12:47:07.838Z',
        checkpoints: [],
      },
    }
  ).as('getProject');

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/?page=*&limit=20',
    },
    {
      body: {
        total: 2,
        projects: [
          {
            id: 1,
            name: 'Untitled',
            model_id: 1,
            mosaic: 'naip.latest',
            created: '2021-03-19T12:47:07.838Z',
            checkpoints: [],
            aois: [],
          },
          {
            id: 2,
            name: 'Project 2',
            model_id: 1,
            mosaic: 'naip.latest',
            created: '2021-03-20T12:47:07.838Z',
            checkpoints: [],
            aois: [],
          },
        ],
      },
    }
  ).as('getProjects');

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1',
      method: 'PATCH',
    },
    {
      body: {
        id: 1,
        name: 'New name',
        model_id: 1,
        mosaic: 'naip.latest',
        created: '2021-03-19T12:47:07.838Z',
      },
    }
  ).as('patchProjectName');

  cy.intercept(
    {
      url: restApiEndpoint + '/api/model/1',
    },
    {
      body: {
        id: 1,
        created: '2021-03-09T10:56:35.438Z',
        active: true,
        uid: 1,
        name: 'NAIP Supervised',
        model_type: 'pytorch_example',
        model_inputshape: [256, 256, 4],
        model_zoom: 17,
        storage: true,
        classes: [
          { name: 'No Data', color: '#62a092' },
          { name: 'Water', color: '#0000FF' },
          { name: 'Emergent Wetlands', color: '#008000' },
          { name: 'Tree Canopy', color: '#80FF80' },
          { name: 'Shrubland', color: '#806060' },
          { name: 'Low Vegetation', color: '#07c4c5' },
          { name: 'Barren', color: '#027fdc' },
          { name: 'Structure', color: '#f76f73' },
          { name: 'Impervious Surface', color: '#ffb703' },
          { name: 'Impervious Road', color: '#0218a2' },
        ],
        meta: {},
        bounds: [null, null, null, null],
      },
    }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/aoi',
    },
    {
      body: {
        total: 2,
        project_id: 1,
        aois: [
          {
            id: 1,
            name: 'Seneca Rocks',
            bookmarked: true,
            bounds: {
              type: 'Polygon',
              coordinates: [
                [
                  [-79.389824867, 38.828040665],
                  [-79.372229576, 38.828040665],
                  [-79.372229576, 38.846058444],
                  [-79.389824867, 38.846058444],
                  [-79.389824867, 38.828040665],
                ],
              ],
            },
            created: '2021-04-30T18:11:51.705Z',
            storage: false,
            checkpoint_id: '1',
            checkpoint_name: 'Seneca Rocks',
            classes: [
              { name: 'Water / Wetland', color: '#486DA2' },
              { name: 'Emergent Wetlands', color: '#00A884' },
              { name: 'Tree', color: '#6CA966' },
              { name: 'Shrubland', color: '#ABC964' },
              { name: 'Low Vegetation', color: '#D0F3AB' },
              { name: 'Barren', color: '#D2AD74' },
              { name: 'Structure', color: '#F10100' },
              { name: 'Impervious Surface', color: '#BFB5B5' },
              { name: 'Impervious Road', color: '#320000' },
            ],
            px_stats: {
              0: 0.002208709716796875,
              1: 0.0003598531087239583,
              2: 0.00007502237955729167,
              3: 0,
            },
            shares: [],
          },
          {
            id: 2,
            name: 'Seneca Rocks',
            bookmarked: true,
            bounds: {
              type: 'Polygon',
              coordinates: [
                [
                  [-79.389824867, 38.828040665],
                  [-79.372229576, 38.828040665],
                  [-79.372229576, 38.846058444],
                  [-79.389824867, 38.846058444],
                  [-79.389824867, 38.828040665],
                ],
              ],
            },
            created: '2021-04-30T18:05:26.309Z',
            storage: true,
            checkpoint_id: '2',
            checkpoint_name: 'Seneca Rocks',
            classes: [
              { name: 'Water / Wetland', color: '#486DA2' },
              { name: 'Emergent Wetlands', color: '#00A884' },
              { name: 'Tree', color: '#6CA966' },
              { name: 'Shrubland', color: '#ABC964' },
              { name: 'Low Vegetation', color: '#D0F3AB' },
              { name: 'Barren', color: '#D2AD74' },
              { name: 'Structure', color: '#F10100' },
              { name: 'Impervious Surface', color: '#BFB5B5' },
              { name: 'Impervious Road', color: '#320000' },
            ],
            px_stats: {
              0: 0.002208709716796875,
              1: 0.0003598531087239583,
              2: 0.00007502237955729167,
              3: 0,
            },
            shares: [],
          },
        ],
      },
    }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/checkpoint',
    },
    {
      total: 2,
      project_id: 1,
      checkpoints: [
        {
          id: 2,
          parent: 1,
          name: 'Seneca Rocks',
          created: '2021-04-30T18:11:51.509Z',
          storage: true,
          bookmarked: true,
        },
        {
          id: 1,
          parent: null,
          name: 'Seneca Rocks',
          created: '2021-04-30T18:05:26.176Z',
          storage: true,
          bookmarked: true,
        },
      ],
    }
  );

  // An instance is running
  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/instance/?status=active',
    },
    {
      total: 1,
      instances: [
        {
          id: 1,
          uid: 123,
          active: true,
          created: '2021-03-18T18:42:42.224Z',
          token: 'app_client',
        },
      ],
    }
  );

  // Get instance details
  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/instance/1',
    },
    {
      id: 1,
      project_id: 1,
      aoi_id: 2,
      checkpoint_id: 2,
      last_update: '2021-07-12T09:59:04.442Z',
      created: '2021-07-12T09:58:57.459Z',
      active: true,
      status: {},
      token: 'app_client',
    }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/checkpoint/1',
    },
    {
      id: 1,
      project_id: 1,
      parent: null,
      name: 'Seneca Rocks',
      bookmarked: false,
      classes: [
        { name: 'Water / Wetland', color: '#486DA2' },
        { name: 'Emergent Wetlands', color: '#00A884' },
        { name: 'Tree', color: '#6CA966' },
        { name: 'Shrubland', color: '#ABC964' },
        { name: 'Low Vegetation', color: '#D0F3AB' },
        { name: 'Barren', color: '#D2AD74' },
        { name: 'Structure', color: '#F10100' },
        { name: 'Impervious Surface', color: '#BFB5B5' },
        { name: 'Impervious Road', color: '#320000' },
      ],
      created: '2021-04-30T18:05:26.176Z',
      storage: true,
      analytics: [
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
      ],
      retrain_geoms: [
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
      ],
      input_geoms: [
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
      ],
    }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/checkpoint/2',
    },
    {
      id: 2,
      project_id: 1,
      parent: 1,
      name: 'Seneca Rocks',
      bookmarked: true,
      classes: [
        { name: 'Water / Wetland', color: '#486DA2' },
        { name: 'Emergent Wetlands', color: '#00A884' },
        { name: 'Tree', color: '#6CA966' },
        { name: 'Shrubland', color: '#ABC964' },
        { name: 'Low Vegetation', color: '#D0F3AB' },
        { name: 'Barren', color: '#D2AD74' },
        { name: 'Structure', color: '#F10100' },
        { name: 'Impervious Surface', color: '#BFB5B5' },
        { name: 'Impervious Road', color: '#320000' },
      ],
      created: '2021-04-30T18:05:26.176Z',
      storage: true,
      analytics: [
        { counts: 50, f1score: 1, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
      ],
      retrain_geoms: [
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
      ],
      input_geoms: [
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
      ],
    }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/checkpoint/3',
    },
    {
      id: 3,
      project_id: 1,
      parent: 2,
      name: 'Seneca Rocks',
      bookmarked: true,
      classes: [
        { name: 'Water / Wetland', color: '#486DA2' },
        { name: 'Emergent Wetlands', color: '#00A884' },
        { name: 'Tree', color: '#6CA966' },
        { name: 'Shrubland', color: '#ABC964' },
        { name: 'Low Vegetation', color: '#D0F3AB' },
        { name: 'Barren', color: '#D2AD74' },
        { name: 'Structure', color: '#F10100' },
        { name: 'Impervious Surface', color: '#BFB5B5' },
        { name: 'Impervious Road', color: '#320000' },
      ],
      created: '2021-04-30T18:05:26.176Z',
      storage: true,
      analytics: [
        { counts: 50, f1score: 1, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
        { counts: 0, f1score: 0, percent: 0 },
      ],
      retrain_geoms: [
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
        { type: 'MultiPoint', coordinates: [] },
      ],
      input_geoms: [
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
        { type: 'GeometryCollection', geometries: [] },
      ],
    }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/aoi/1',
    },
    {
      id: 1,
      name: 'Seneca Rocks',
      created: '2021-04-30T18:05:26.309Z',
      storage: true,
      bookmarked: true,
      project_id: 1,
      checkpoint_id: '1',
      patches: [],
      classes: [
        { name: 'Water / Wetland', color: '#486DA2' },
        { name: 'Emergent Wetlands', color: '#00A884' },
        { name: 'Tree', color: '#6CA966' },
        { name: 'Shrubland', color: '#ABC964' },
        { name: 'Low Vegetation', color: '#D0F3AB' },
        { name: 'Barren', color: '#D2AD74' },
        { name: 'Structure', color: '#F10100' },
        { name: 'Impervious Surface', color: '#BFB5B5' },
        { name: 'Impervious Road', color: '#320000' },
      ],
      bounds: {
        type: 'Polygon',
        coordinates: [
          [
            [-79.389824867, 38.828040665],
            [-79.372229576, 38.828040665],
            [-79.372229576, 38.846058444],
            [-79.389824867, 38.846058444],
            [-79.389824867, 38.828040665],
          ],
        ],
      },

      px_stats: {
        0: 0.002208709716796875,
        1: 0.0003598531087239583,
        2: 0.00007502237955729167,
        3: 0,
      },

      shares: [],
    }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/aoi/2',
    },
    {
      id: 2,
      name: 'Seneca Rocks',
      created: '2021-04-30T18:05:26.309Z',
      storage: true,
      bookmarked: true,
      project_id: 1,
      checkpoint_id: '1',
      patches: [],
      classes: [
        { name: 'Water / Wetland', color: '#486DA2' },
        { name: 'Emergent Wetlands', color: '#00A884' },
        { name: 'Tree', color: '#6CA966' },
        { name: 'Shrubland', color: '#ABC964' },
        { name: 'Low Vegetation', color: '#D0F3AB' },
        { name: 'Barren', color: '#D2AD74' },
        { name: 'Structure', color: '#F10100' },
        { name: 'Impervious Surface', color: '#BFB5B5' },
        { name: 'Impervious Road', color: '#320000' },
      ],
      bounds: {
        type: 'Polygon',
        coordinates: [
          [
            [-79.389824867, 38.828040665],
            [-79.372229576, 38.828040665],
            [-79.372229576, 38.846058444],
            [-79.389824867, 38.846058444],
            [-79.389824867, 38.828040665],
          ],
        ],
      },
      px_stats: {
        0: 0.002208709716796875,
        1: 0.0003598531087239583,
        2: 0.00007502237955729167,
        3: 0,
      },

      shares: [],
    }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/aoi/3',
    },
    {
      id: 3,
      name: 'Seneca Rocks',
      created: '2021-04-30T18:05:26.309Z',
      storage: true,
      bookmarked: true,
      project_id: 1,
      checkpoint_id: '3',
      patches: [],
      classes: [
        { name: 'Water / Wetland', color: '#486DA2' },
        { name: 'Emergent Wetlands', color: '#00A884' },
        { name: 'Tree', color: '#6CA966' },
        { name: 'Shrubland', color: '#ABC964' },
        { name: 'Low Vegetation', color: '#D0F3AB' },
        { name: 'Barren', color: '#D2AD74' },
        { name: 'Structure', color: '#F10100' },
        { name: 'Impervious Surface', color: '#BFB5B5' },
        { name: 'Impervious Road', color: '#320000' },
      ],
      bounds: {
        type: 'Polygon',
        coordinates: [
          [
            [-79.389824867, 38.828040665],
            [-79.372229576, 38.828040665],
            [-79.372229576, 38.846058444],
            [-79.389824867, 38.846058444],
            [-79.389824867, 38.828040665],
          ],
        ],
      },
      px_stats: {
        0: 0.002208709716796875,
        1: 0.0003598531087239583,
        2: 0.00007502237955729167,
        3: 0,
      },

      shares: [],
    }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/aoi/*/tiles',
    },
    {
      tilejson: '2.2.0',
      name: 'aoi-1',
      version: '1.0.0',
      schema: 'xyz',
      tiles: [
        '/api/project/1/aoi/1/tiles/{z}/{x}/{y}?colormap=%7B%220%22%3A%22%23486DA2%22%2C%221%22%3A%22%236CA966%22%2C%222%22%3A%22%23D0F3AB%22%2C%223%22%3A%22%23BFB5B5%22%7D',
      ],
      minzoom: 15,
      maxzoom: 17,
      bounds: [
        -77.04711914062497,
        38.89744587262309,
        -77.03613281249997,
        38.90385833966774,
      ],
      center: [-77.04162597656247, 38.900652106145415, 15],
    }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/aoi/*/tiles/**',
    },
    { fixture: 'tiles/png-tile.png' }
  );
  cy.intercept(
    {
      method: 'DELETE',
      url: restApiEndpoint + '/api/project/1',
    },
    {
      statusCode: 200,
      body: {},
    }
  ).as('deleteProject');
});
