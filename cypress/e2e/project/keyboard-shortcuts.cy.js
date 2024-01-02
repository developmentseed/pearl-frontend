const restApiEndpoint = Cypress.config('restApiEndpoint');

/* eslint-disable camelcase */
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
/* eslint-enable camelcase */

describe('Test keyboard shortcuts', () => {
  beforeEach(() => {
    cy.mockCommonApiEndpoints();
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

    cy.visit('/project/1');
  });
  it('Stops shortcuts during input', () => {
    cy.wait(['@fetchAoi2', '@fetchCheckpoint2']);
    // Check ready for retrain status
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );

    cy.get('[data-cy=project-name]').click();
    cy.get('[data-cy=project-input]').type('l');
    cy.get('[data-cy=layers-panel]').should('not.be.visible');
  });

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
    cy.get('body').trigger('keydown', { key: 'a' });
    cy.get('[data-cy="Prediction Results"]')
      .invoke('attr', 'data-opacity')
      .should('eq', '0');
    // prediction opacity should be 0

    /* f  */
    cy.get('body').trigger('keydown', { key: 'f' });
    // prediction opacity should be 1
    cy.get('[data-cy="Prediction Results"]')
      .invoke('attr', 'data-opacity')
      .should('eq', '1');
    //

    /* s  */
    cy.get('body').trigger('keydown', { key: 's' });
    cy.get('body').trigger('keydown', { key: 's' });
    cy.get('body').trigger('keydown', { key: 's' });
    cy.get('body').trigger('keydown', { key: 's' });
    cy.get('body').trigger('keydown', { key: 's' });
    cy.get('[data-cy="Prediction Results"]')
      .invoke('attr', 'data-opacity')
      .should('eq', '0.5');
    // prediction opacity should be 0.5

    /* d  */
    cy.get('body').trigger('keydown', { key: 'd' });
    cy.get('body').trigger('keydown', { key: 'd' });
    cy.get('body').trigger('keydown', { key: 'd' });
    cy.get('body').trigger('keydown', { key: 'd' });
    cy.get('body').trigger('keydown', { key: 'd' });
    cy.get('[data-cy="Prediction Results"]')
      .invoke('attr', 'data-opacity')
      .should('eq', '1');

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

    cy.get('body').trigger('keydown', { key: 'l' });
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
    cy.get('body').trigger('keydown', { key: 'i' });
    cy.get('[data-cy=primary-panel]').should('not.be.visible');
    cy.get('body').trigger('keydown', { key: 'i' });
    cy.get('[data-cy=primary-panel]').should('be.visible');

    /* o */
    cy.get('body').trigger('keydown', { key: 'o' });
    cy.get('[data-cy=secondary-panel]').should('not.be.visible');
    cy.get('body').trigger('keydown', { key: 'o' });
    cy.get('[data-cy=secondary-panel]').should('be.visible');
  });
});
