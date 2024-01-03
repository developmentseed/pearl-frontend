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

const aoi1 = {
  id: 1,
  name: 'Amanalco',
  project_id: 53,
  created: 1678122994960,
  updated: 1678122994960,
  bounds: {
    type: 'Polygon',
    coordinates: [
      [
        [-100.05626678466797, 19.23303922076886],
        [-100.03704071044923, 19.23303922076886],
        [-100.03704071044923, 19.253784196994395],
        [-100.05626678466797, 19.253784196994395],
        [-100.05626678466797, 19.23303922076886],
      ],
    ],
    bounds: [
      -100.05626678466797,
      19.23303922076886,
      -100.03704071044923,
      19.253784196994395,
    ],
  },
  bookmarked: false,
  bookmarked_at: null,
  area: 4641850,
};

describe('Create new project', () => {
  beforeEach(() => {
    cy.mockCommonApiRoutes();
    cy.fakeLogin();

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

    // POST /project/:id/instance
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/aoi',
        method: 'POST',
      },
      {
        ...aoi1,
      }
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
    cy.get('[data-cy=draw-first-aoi-button]').should('exist').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 200, 200)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeCity');

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Select Imagery Source'
    );

    // Select imagery source
    cy.get('[data-cy=imagery-selector-label]').should('exist').click();
    cy.get('[data-cy=select-imagery-1-card]').should('exist').click();

    cy.get('[data-cy=imagery-selector-label]').should('have.text', 'NAIP');

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Select Mosaic'
    );

    // Select mosaic
    cy.get('[data-cy=mosaic-selector-label]').should('exist').click();
    cy.get('[data-cy=select-mosaic-87b72c66331e136e088004fba817e3e8-card]')
      .should('exist')
      .click();

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
  });

  it('Run new project', () => {
    // Set mock WS workflow in case creation succeeds (it shouldn't here)
    cy.setWebsocketWorkflow('websocket-workflow/base-model-prediction.json');

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
    cy.get('[data-cy=prime-button]').should('be.enabled').click();

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
    cy.get('[data-cy=prime-button]').should('exist').click();

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
  });

  it('Abort new project', () => {
    cy.setWebsocketWorkflow('websocket-workflow/run-prediction-aborted.json');

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

    // Request prediction
    cy.get('[data-cy=prime-button]').click();

    // Wait for instance status request
    cy.wait('@fetchInstanceStatus');

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

    // Request prediction
    cy.get('[data-cy=prime-button]').should('exist').click();

    // Wait for instance status request
    cy.wait('@fetchInstanceStatus');

    // Prediction should be finished successfully.
  });

  // TODO reinstate this spec
  // it('Do not allow upload of aoi out of imagery bounds', () => {
  //   // Set mock WS workflow in case creation succeeds (it shouldn't here)
  //   cy.setWebsocketWorkflow('websocket-workflow/base-model-prediction.json');

  //   // Check session status message
  //   cy.get('[data-cy=session-status]').should(
  //     'have.text',
  //     'Session Status: Ready for prediction run'
  //   );

  //   // Open import modal
  //   cy.get('[data-cy=upload-aoi-button]').click();
  //   // Open select file dialog
  //   cy.get('[data-cy=select-aoi-file-button').click();
  //   // Apply valid file to input
  //   cy.get('[data-cy=aoi-upload-input]').attachFile(
  //     'aoi-upload/aoi-outside-usa.geojson'
  //   );
  //   // No warning is displayed
  //   cy.get('[data-cy=import-aoi-warning-text').should(
  //     'contain',
  //     'Area is out of imagery bounds. Please upload another file'
  //   );
  // });
});
