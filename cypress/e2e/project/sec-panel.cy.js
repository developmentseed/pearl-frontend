const restApiEndpoint = Cypress.config('restApiEndpoint');

const instance = {
  id: 1,
  project_id: 1,
  aoi_id: 2,
  checkpoint_id: 2,
  last_update: '2021-07-12T09:59:04.442Z',
  created: '2021-07-12T09:58:57.459Z',
  active: true,
  token: 'app_client',
  status: {
    phase: 'Running',
  },
};
const aoiNoStats = {
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
  px_stats: {},

  shares: [],
};

describe('Panel functions', () => {
  beforeEach(() => {
    cy.mockApiRoutes();
    cy.fakeLogin();
    cy.setWebsocketWorkflow('websocket-workflow/retrain.json');

    /**
     * GET /project/:id/instance/:id
     */
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/instance/1',
      },
      instance
    );
  });
  it('Renders px stats chart on load', () => {
    cy.visit('/project/1');
    cy.wait(['@fetchAoi2', '@fetchCheckpoint2']);
    cy.get('[data-cy=checkpoint_class_distro]').should(
      'not.contain',
      'Class distribution metrics are not available'
    );
  });
  it('Renders px stats chart on load', () => {
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/aoi/2',
      },
      aoiNoStats
    ).as('fetchAoiNoStat');

    cy.visit('/project/1');
    cy.wait(['@fetchAoiNoStat', '@fetchCheckpoint2']);
    cy.get('[data-cy=checkpoint_class_distro]').should(
      'contain',
      'Class distribution metrics are not available'
    );
  });
});
