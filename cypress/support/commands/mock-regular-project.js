const {
  restApiEndpoint,
} = require('../../../app/assets/scripts/config/testing').default;

/**
 * Mock a regular project
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
            created: '2021-03-09T11:38:37.169Z',
            active: true,
            uid: 1,
            name: 'NAIP Supervised',
            bounds: [null, null, null, null],
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
            bookmarked: false,
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
            shares: [],
          },
          {
            id: 2,
            name: 'Seneca Rocks',
            bookmarked: false,
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
          bookmarked: false,
        },
        {
          id: 1,
          parent: null,
          name: 'Seneca Rocks',
          created: '2021-04-30T18:05:26.176Z',
          storage: true,
          bookmarked: false,
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
          token: '<instance token>',
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
      aoi_id: 1,
      checkpoint_id: 1,
      last_update: '2021-07-12T09:59:04.442Z',
      created: '2021-07-12T09:58:57.459Z',
      active: true,
      status: {},
      token: 'a token',
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
      url: restApiEndpoint + '/api/project/1/aoi/1',
    },
    {
      id: 1,
      name: 'Seneca Rocks',
      created: '2021-04-30T18:05:26.309Z',
      storage: true,
      bookmarked: false,
      project_id: 1,
      checkpoint_id: 1,
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
      shares: [],
    }
  );
});
