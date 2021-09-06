const {
  restApiEndpoint,
} = require('../../../app/assets/scripts/config/testing').default;

describe('Create new project', () => {
  beforeEach(() => {
    cy.startServer();
    cy.fakeLogin();

    /**
     * GET /project/:id/instance
     */
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/instance/?status=active',
      },
      {
        total: 0,
        instances: [],
      }
    );
  });

  it('Can set name from modal', () => {
    cy.visit('/project/new');

    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Waiting for model run'
    );

    cy.get('[data-cy=project-name-modal]').should('be.visible');
    cy.get('[data-cy=modal-project-input]').clear().type('Project name');
    cy.get('[data-cy=create-project-button]').click({ force: true });

    cy.get('[data-cy=project-name]').should('have.text', 'Project name');
    cy.get('[data-cy=project-name-edit]').click();
    cy.get('[data-cy=project-input]').clear().type('New name');
    cy.get('[data-cy=project-name-confirm]').click({ force: true });
  });

  it('New project', () => {
    cy.setWebsocketWorkflow('base-model-prediction');

    cy.visit('/project/new');

    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Waiting for model run'
    );

    // Set project name
    cy.get('[data-cy=modal-project-input]').type('Project name');
    cy.get('[data-cy=create-project-button]').should('exist').click();

    // Set AOI
    cy.get('[data-cy=aoi-edit-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 200, 200)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeCity');

    // Set model
    cy.get('[data-cy=select-model-label]').should('exist').click();
    cy.get('[data-cy=select-model-1-card]').should('exist').click();

    // Set no instances available
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
          active_gpus: 15,
        },
      }
    ).as('fetchAvailableInstancesCount');

    // Request model run
    cy.get('[data-cy=run-button').click();

    // Wait for outbound request
    cy.wait('@fetchAvailableInstancesCount');

    // Should display modal
    cy.get('#no-instance-available-error')
      .should(
        'contain',
        'No instance available to run the model, please try again later.'
      )
      .click();

    // Set no instances available
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
    ).as('fetchAvailableInstancesCount');

    // Request model run
    cy.get('[data-cy=run-button').click();

    // Wait for outbound request
    cy.wait('@fetchAvailableInstancesCount');

    // Should display modal
    cy.get('#no-instance-available-error').should('not.exist');
  });

  it('new project, instance creation fails', () => {
    // Set mock WS workflow in case creation succeeds (it shouldn't here)
    cy.setWebsocketWorkflow('base-model-prediction');

    // Visit page
    cy.visit('/project/new');

    // Set project name
    cy.get('[data-cy=modal-project-input]')
      .should('exist')
      .clear()
      .type('Project name');
    cy.get('[data-cy=create-project-button]').should('exist').click();

    // Draw AOI
    cy.get('[data-cy=aoi-edit-button]').should('exist').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 200, 200)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeCity');

    // Select model
    cy.get('[data-cy=select-model-label]').should('exist').click();
    cy.get('[data-cy=select-model-1-card]').should('exist').click();

    const instance = {
      id: 1,
      project_id: 1,
      aoi_id: 2,
      checkpoint_id: 2,
      last_update: '2021-07-12T09:59:04.442Z',
      created: '2021-07-12T09:58:57.459Z',
      active: true,
      status: {
        phase: 'Pending',
      },
      token: 'app_client',
    };

    // Mock instance creation pending status
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/instance/1',
      },
      instance
    );

    // Run
    cy.get('[data-cy=run-button').click();

    // Get to prediction halt point
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Creating Instance...'
    );

    // Set no instances available
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/instance/1',
      },
      {
        ...instance,
        status: {
          phase: 'Failed',
        },
      }
    );

    // Get to prediction halt point
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Instance creation failed.'
    );

    // Show toast
    cy.get('#a-toast').should(
      'contain',
      'Could not create instance, please try again later.'
    );
  });
});
