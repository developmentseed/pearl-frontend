const {
  restApiEndpoint,
} = require('../../../../app/assets/scripts/config/testing').default;

/**
 * Mock a project scenario: an instance is running with checkpoint 2 and AOI 2 applied.
 */
export default function () {
  /**
   * POST /project
   */
  cy.intercept(
    {
      url: restApiEndpoint + '/api/project',
      method: 'POST',
    },
    {
      id: 1,
      uid: 1,
      name: 'A test project',
      model_id: 1,
      mosaic: 'naip.latest',
      created: '2021-08-12T13:59:25.070Z',
    }
  ).as('postProject');

  /**
   * GET /project/:id
   */
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

  /**
   * GET /project
   */
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

  /**
   * PATCH /project/:id
   */
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

  /**
   * GET /project/:id/aoi
   */
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
            name: 'Seneca Rocks #1',
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
  ).as('loadAois');

  /**
   * GET /project/:id/checkpoint
   */
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

  /**
   * GET /project/:id/instance
   */
  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/instance/?status=active&type=cpu',
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
          type: 'cpu',
        },
      ],
    }
  );

  /**
   * GET /project/:id/instance/:id
   */
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
      status: {
        phase: 'Running',
      },
      token: 'app_client',
      type: 'cpu',
    }
  );

  /**
   * GET /project/:id/checkpoint/1
   */
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

  /**
   * GET /project/:id/checkpoint/2
   */
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
  ).as('fetchCheckpoint2');

  /**
   * GET /project/:id/checkpoint/3
   */
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

  /**
   * GET /project/1/aoi/1
   */
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

  /**
   * GET /project/1/aoi/2
   */
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
  ).as('fetchAoi2');

  /**
   * GET /project/1/aoi/3
   */
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

  //
  // GET /project/1/aoi/*/tiles
  //
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

  //
  // GET /project/1/aoi/*/tiles/**
  //
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
}
