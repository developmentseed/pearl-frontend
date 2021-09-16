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

describe('Test keyboard shortcuts', () => {
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

    cy.visit('/project/1');
  });
  it('Does not capture 
  it('Prediction layer opacity changes', () => {
    cy.wait(['@fetchAoi2', '@fetchCheckpoint2']);
    // Check ready for retrain status
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );

    // Open layer panel for visual test
    cy.get('#layer-control').click({ force: true });

    /* a  */
    cy.get('body').trigger('keydown', { keyCode: 65 });
    // prediction opacity should be 0

    /* f  */
    cy.get('body').trigger('keydown', { keyCode: 70 });
    // prediction opacity should be 1

    /* s  */
    cy.get('body').trigger('keydown', { keyCode: 83 });
    cy.get('body').trigger('keydown', { keyCode: 83 });
    cy.get('body').trigger('keydown', { keyCode: 83 });
    cy.get('body').trigger('keydown', { keyCode: 83 });
    cy.get('body').trigger('keydown', { keyCode: 83 });
    // prediction opacity should be 0.5

    /* d  */
    cy.get('body').trigger('keydown', { keyCode: 68 });
    cy.get('body').trigger('keydown', { keyCode: 68 });
    cy.get('body').trigger('keydown', { keyCode: 68 });
    cy.get('body').trigger('keydown', { keyCode: 68 });
    cy.get('body').trigger('keydown', { keyCode: 68 });
    // prediction opacity should be 1
  });

  it('Hide and show layers panel', () => {
    cy.wait(['@fetchAoi2', '@fetchCheckpoint2']);
    // Check ready for retrain status
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );
    cy.get('[data-cy=layers-panel]').should('not.be.visible');

    cy.get('body').trigger('keydown', { keyCode: 76 });
    cy.get('[data-cy=layers-panel]').should('be.visible');
  });
  it('Hide and collapse panels', () => {
    cy.wait(['@fetchAoi2', '@fetchCheckpoint2']);
    // Check ready for retrain status
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );

    /* i */
    cy.get('body').trigger('keydown', { keyCode: 73 });
    cy.get('[data-cy=primary-panel]').should('not.be.visible');
    cy.get('body').trigger('keydown', { keyCode: 73 });
    cy.get('[data-cy=primary-panel]').should('be.visible');

    /* o */
    cy.get('body').trigger('keydown', { keyCode: 79 });
    cy.get('[data-cy=secondary-panel]').should('not.be.visible');
    cy.get('body').trigger('keydown', { keyCode: 79 });
    cy.get('[data-cy=secondary-panel]').should('be.visible');
  });
});
