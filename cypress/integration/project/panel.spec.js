const {
  restApiEndpoint,
} = require('../../../app/assets/scripts/config/testing').default;

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

describe('Panel functions', () => {
  beforeEach(() => {
    cy.startServer();
    cy.fakeLogin();
    cy.setWebsocketWorkflow('retrain');

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
  it('Clear or submit samples modal', () => {
    cy.visit('/project/1');

    // Wait for data loading
    cy.wait(['@fetchAoi2', '@fetchCheckpoint2']);

    // Check ready for retrain status
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );

    cy.get('[data-cy=global-loading]').should('not.exist');

    // Can go to refine
    cy.get('#refine-tab-trigger').click();
    cy.get('[data-cy=primary-panel]').should('contain', 'Refinement Tools');

    // Go back to retrain
    cy.get('#retrain-tab-trigger').click();
    cy.get('[data-cy=primary-panel]').should(
      'contain',
      'Sample Selection Tools'
    );

    const baseFeature = [
      [470, 250],
      [490, 230],
      [510, 250],
      [490, 270],
    ];

    // Select Barren class
    cy.get('[data-cy="Barren-class-button"').click();

    // Draw with freehand tool
    cy.get('[data-cy=retrain-draw-freehand').click();
    const feature1 = baseFeature;
    cy.get('#app-container')
      .trigger('mousedown', ...feature1[0])
      .trigger('mousemove', ...feature1[1])
      .trigger('mousemove', ...feature1[2])
      .trigger('mousemove', ...feature1[3])
      .trigger('mouseup', ...feature1[3]);

    //attempt switch to refine
    cy.get('#refine-tab-trigger').click();

    cy.get('[data-cy="clear-samples-modal"').should('be.visible');

    // Clear samples
    cy.get('[data-cy="clear-continue"').click();

    // Should have switched to refine
    cy.get('[data-cy=primary-panel]').should('contain', 'Refinement Tools');
  });
});
