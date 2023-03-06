const restApiEndpoint = Cypress.config('restApiEndpoint');

const instance = {
  id: 1,
  project_id: 1,
  aoi_id: null,
  checkpoint_id: null,
  last_update: '2021-07-12T09:59:04.442Z',
  created: '2021-07-12T09:58:57.459Z',
  active: true,
  token: 'app_client',
  status: {
    phase: 'Pending',
  },
};

describe('Test running GPUs', () => {
  it('Run project on GPU', () => {
    cy.mockApiRoutes();
    cy.fakeLogin('user', { gpu: true });

    // Active instances list
    cy.intercept(
      {
        url:
          restApiEndpoint + '/api/project/1/instance/?status=active&type=cpu',
      },
      {
        total: 0,
        instances: [],
      }
    );

    // POST /project/:id/instance
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/instance',
        method: 'POST',
      },
      instance
    );

    // Visit page
    cy.visit('/project/new');

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Set Project Name'
    );

    // Set project name
    cy.get('[data-cy=new-project-name-modal-input]')
      .should('be.focused')
      .type('Project name');
    cy.get('[data-cy=create-project-button]').should('exist').click();

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Set AOI'
    );

    // Draw AOI
    cy.get('[data-cy=aoi-edit-button]').should('exist').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 200, 200)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeCity');

    // Re-enter edit mode
    cy.get('[data-cy=aoi-edit-button]').click();

    // Panel prime button should be in AOI Confirm mode
    cy.get('[data-cy=panel-aoi-confirm]')
      .should('exist')
      .should('not.be.disabled')
      .click();

    // Set model
    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Select Model'
    );

    // Open the Model selection modal
    cy.get('[data-cy=select-model-label]').should('exist').click();

    // Finally select a model
    cy.get('[data-cy=select-model-1-card]').should('exist').click();

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for prediction run'
    );

    cy.get('[data-cy=toggle-instance-type-button]').should('exist').click();

    // Set mock WS workflow in case creation succeeds (it shouldn't here)
    cy.setWebsocketWorkflow('websocket-workflow/base-model-prediction.json');

    /**
     * GET /project/:id/instance
     */
    cy.intercept(
      {
        url:
          restApiEndpoint + '/api/project/1/instance/?status=active&type=gpu',
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
            type: 'gpu',
          },
        ],
      }
    ).as('getActiveGpus');

    // Instance is running
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/instance/1',
      },
      {
        ...instance,
        type: 'gpu',
        status: {
          phase: 'Running',
        },
      }
    ).as('fetchInstanceStatus');

    cy.intercept({
      url: restApiEndpoint + '/api/project/1/instance/1',
    });

    // Request prediction
    cy.get('[data-cy=run-button]').click();

    cy.wait('@getActiveGpus');

    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );
  });
});
