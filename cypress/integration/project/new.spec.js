const {
  restApiEndpoint,
} = require('../../../app/assets/scripts/config/testing').default;

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

describe('Create new project', () => {
  beforeEach(() => {
    cy.startServer();
    cy.fakeLogin();

    // Active instances list
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/instance/?status=active',
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
  });

  it('Run new project', () => {
    // Set mock WS workflow in case creation succeeds (it shouldn't here)
    cy.setWebsocketWorkflow('websocket-workflow/base-model-prediction.json');

    // Visit page
    cy.visit('/project/new');

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Set Project Name'
    );

    // Set project name
    cy.get('[data-cy=modal-project-input]')
      .should('exist')
      .clear()
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
    // Filter a model and get no results
    cy.get('#modelsFilter').should('exist').clear().type('test123');
    cy.get('[data-cy=select-model-1-card]').should('not.exist');
    cy.get('.list-container').should('have.text', 'No results found');
    // Filter again and get 2 results
    cy.get('#modelsFilter').should('exist').clear().type('class');
    // Check that the 2 models are recommended
    cy.get('[data-cy=recommended-models-label]').should('exist');
    cy.get('[data-cy=models-list]').within(() => {
      cy.get('.list-container').children().should('have.length', 2);
    });
    // Finally select a model
    cy.get('[data-cy=select-model-1-card]').should('exist').click();

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for prediction run'
    );

    // Instance pending
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/instance/1',
      },
      {
        ...instance,
        status: {
          phase: 'Pending',
        },
      }
    );

    // Run
    cy.get('[data-cy=run-button]').click();

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Running prediction'
    );

    // Instance failed
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

    // Show toast
    cy.get('#a-toast').should(
      'contain',
      'Could not start instance at the moment, please try again later.'
    );

    cy.get('[data-cy=toast-close-button]').click();
    cy.get('[data-cy=toast-close-button]').should('not.exist');

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for prediction run'
    );

    // Instance pending
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/instance/1',
      },
      {
        ...instance,
        status: {
          phase: 'Pending',
        },
      }
    );

    // Run
    cy.get('[data-cy=run-button]').should('exist').click();

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Running prediction'
    );

    // Instance is running
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/instance/1',
      },
      {
        ...instance,
        status: {
          phase: 'Running',
        },
      }
    ).as('fetchInstanceStatus');

    cy.wait('@fetchInstanceStatus');

    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );
  });

  it('Abort new project', () => {
    cy.setWebsocketWorkflow('websocket-workflow/run-prediction-aborted.json');

    // Visit page
    cy.visit('/project/new');

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Set Project Name'
    );

    // Set project name
    cy.get('[data-cy=modal-project-input]')
      .should('exist')
      .clear()
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

    // Select model
    cy.get('[data-cy=select-model-label]').should('exist').click();
    cy.get('[data-cy=select-model-1-card]').should('exist').click();

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for prediction run'
    );

    // Instance pending
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/instance/1',
      },
      {
        ...instance,
        status: {
          phase: 'Running',
        },
      }
    );

    cy.get('[data-cy=run-button]').click();

    // Prediction is halted
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Received image 3 of 6...'
    );

    // Abort
    cy.get('[data-cy=abort-run-button]').should('exist').click();

    // Wait for prediction ready
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for prediction run'
    );

    // Run a prediction to the end
    cy.setWebsocketWorkflow('websocket-workflow/base-model-prediction.json');
    cy.get('[data-cy=run-button]').should('exist').click();
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );
  });

  it('Check model filter based on location', () => {
    // Set mock WS workflow in case creation succeeds (it shouldn't here)
    cy.setWebsocketWorkflow('websocket-workflow/base-model-prediction.json');

    // Visit page
    cy.visit('/project/new');

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Set Project Name'
    );

    // Set project name
    cy.get('[data-cy=modal-project-input]')
      .should('exist')
      .clear()
      .type('Project name');
    cy.get('[data-cy=create-project-button]').should('exist').click();

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Set AOI'
    );

    // Open import modal
    cy.get('[data-cy=upload-aoi-modal-button]').click();
    // Open select file dialog
    cy.get('[data-cy=select-aoi-file-button').click();
    // Apply valid file to input
    cy.get('[data-cy=aoi-upload-input]').attachFile(
      'aoi-upload/aoi-outside-usa.geojson'
    );
    // No warning is displayed
    cy.get('[data-cy=import-aoi-warning-text').should('not.exist');
    // Proceed importing
    cy.get('[data-cy=import-aoi-button').should('be.enabled').click();

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Select Model'
    );

    // Open the Model selection modal
    cy.get('[data-cy=select-model-label]').should('exist').click();
    // There are not recommended models for that aoi region
    cy.get('[data-cy=recommended-models-label]').should('not.exist');
    // Check that the 3 models are available
    cy.get('[data-cy=models-list]').should('exist');
    cy.get('[data-cy=models-list]').within(() => {
      cy.get('.list-container').children().should('have.length', 2);
    });
  });
});
