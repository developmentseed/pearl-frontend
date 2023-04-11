const restApiEndpoint = Cypress.config('restApiEndpoint');

const instance = {
  id: 1,
  project_id: 1,
  timeframe_id: 2,
  checkpoint_id: 2,
  last_update: '2021-07-12T09:59:04.442Z',
  created: '2021-07-12T09:58:57.459Z',
  active: true,
  token: 'app_client',
  status: {
    phase: 'Running',
  },
  type: 'cpu',
};

describe('Retrain existing project', () => {
  beforeEach(() => {
    cy.mockApiRoutes();
    cy.fakeLogin();

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

  it('fail to load existing project if no instances are available', () => {
    // No instances available
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
          total_cpus: 15,
          active_cpus: 15,
        },
      }
    );

    cy.visit('/project/1');

    // Should display modal
    cy.get('#no-instance-available-error')
      .should('contain', 'No instances available, please try again later.')
      .click();

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/profile/projects/1');
    });

    cy.visit('/project/1');

    // Malformed object
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
          total_cpus: 15,
          active_cpus: 20,
        },
      }
    );

    // Should display modal
    cy.get('#no-instance-available-error')
      .should('contain', 'No instances available, please try again later.')
      .click();

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/profile/projects/1');
    });
  });

  it('successfully loads', () => {
    cy.setWebsocketWorkflow('websocket-workflow/retrain.json');

    cy.visit('/project/1');

    // Check ready for retrain status
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );

    cy.get('[data-cy=global-loading]').should('not.exist');

    // Check if retrain button panel is disabled (no samples added yet)
    cy.get('[data-cy=prime-button]').should(
      'have.attr',
      'data-disabled',
      'true'
    );

    // Save checkpoint is enabled
    cy.get('[data-cy=save-checkpoint-button]').should('not.be.disabled');

    // Base feature to perform map edit actions
    const baseFeature = [
      [470, 250],
      [490, 230],
      [510, 250],
      [490, 270],
    ];

    // Helper function to move feature around
    function translateFeature(feature, xDiff = 0, yDiff = 0) {
      return feature.map(([x, y]) => [x + xDiff, y + yDiff]);
    }

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

    // Check if retrain button panel is enabled after a sampled is added
    cy.get('[data-cy=prime-button]').should(
      'have.attr',
      'data-disabled',
      'false'
    );

    // Draw complete polygon with polygon draw
    const feature2 = translateFeature(baseFeature, 0, 50);
    cy.get('[data-cy=retrain-draw-polygon').click();
    cy.get('#app-container')
      .trigger('mousedown', ...feature2[0])
      .trigger('mousedown', ...feature2[1])
      .trigger('mousedown', ...feature2[2])
      .trigger('mousedown', ...feature2[3])
      .trigger('mousedown', ...feature2[0])
      .trigger('mouseup');

    // Draw incomplete than switch to other tool, should clear
    const feature3 = translateFeature(baseFeature, 0, 100);
    cy.get('#app-container')
      .trigger('mousedown', ...feature3[0])
      .trigger('mousedown', ...feature3[1])
      .trigger('mousedown', ...feature3[2])
      .trigger('mousedown', ...feature3[3])
      .trigger('mouseup');
    cy.get('[data-cy=retrain-draw-freehand').click();
    cy.get('[data-cy=retrain-draw-polygon').click();
    cy.get('#app-container')
      .trigger('mousedown', ...feature3[0])
      .trigger('mousedown', ...feature3[1])
      .trigger('mousedown', ...feature3[2])
      .trigger('mousedown', ...feature3[3])
      .trigger('mousedown', ...feature3[0])
      .trigger('mouseup');

    // Polygon draw with different class
    const feature4 = translateFeature(baseFeature, 0, 150);
    cy.get('[data-cy=retrain-draw-polygon').click();
    cy.get('[data-cy=Tree-class-button').click();
    cy.get('#app-container')
      .trigger('mousedown', ...feature4[0])
      .trigger('mousedown', ...feature4[1])
      .trigger('mousedown', ...feature4[2])
      .trigger('mousedown', ...feature4[3])
      .trigger('mousedown', ...feature4[0])
      .trigger('mouseup');

    // Add another feature
    const feature5 = translateFeature(baseFeature, 120, 0);
    cy.get('#app-container')
      .trigger('mousedown', ...feature5[0])
      .trigger('mousedown', ...feature5[1])
      .trigger('mousedown', ...feature5[2])
      .trigger('mousedown', ...feature5[3])
      .trigger('mousedown', ...feature5[0])
      .trigger('mouseup');

    // Delete polygon features
    cy.get('[data-cy=eraser-button').click();
    cy.get('[data-cy=Barren-class-button').click();
    cy.get('#app-container').click(...feature1[0]);
    cy.get('#app-container').click(...feature5[0]); // should not be able to delete
    cy.get('[data-cy=Tree-class-button').click();
    cy.get('#app-container').click(...feature4[0]); // should be able to delete

    // Add some points
    const feature6 = translateFeature(baseFeature, 120, 70);
    cy.get('[data-cy=add-point-sample-button').click();
    cy.get('[data-cy="Impervious Surface-class-button"').click();
    cy.get('#app-container')
      .click(...feature6[0])
      .click(...feature6[1]);
    cy.get('[data-cy="Impervious Road-class-button"').click();
    cy.get('#app-container')
      .click(...feature6[2])
      .click(...feature6[3]);

    // Set class for the import
    cy.get('[data-cy=Structure-class-button').click();

    // Open import modal
    cy.get('[data-cy=open-import-samples-modal-button').click();
    cy.get('#import-samples-modal').should('exist');

    // Open select file dialog
    cy.get('[data-cy=select-samples-geojson-button]').should('exist').click();

    // Apply file to input
    cy.get('[data-cy=samples-upload-input]').attachFile('samples.geojson');
    cy.get('#import-samples-modal').within(() => {
      cy.contains('Selected:').should('exist');
      cy.contains('samples.geojson').should('exist');
    });

    // Proceed importing
    cy.get('[data-cy=import-samples-geojson-button').click();
    cy.get('#import-samples-modal').should('not.exist');

    // Import another file
    cy.get('[data-cy=open-import-samples-modal-button').click();
    cy.get('#import-samples-modal').within(() => {
      cy.contains('Selected:').should('not.exist');
      cy.contains('samples.geojson').should('not.exist');
    });
    cy.get('[data-cy=samples-upload-input]').attachFile(
      'aoi-upload/aoi-outside-usa.geojson'
    );
    cy.get('[data-cy=import-samples-geojson-button').click();
    cy.get('#import-samples-modal').should('not.exist');

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
          total_cpus: 15,
          active_cpus: 15,
        },
      }
    ).as('fetchAvailableInstancesCount');

    // Request model run
    cy.get('[data-cy=prime-button]').click();

    // Wait for outbound request
    cy.wait('@fetchAvailableInstancesCount');

    // Should display modal
    cy.get('#no-instance-available-error')
      .should('contain', 'No instances available, please try again later.')
      .click();

    // Make instances available
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
          total_cpus: 15,
          active_cpus: 5,
        },
      }
    ).as('fetchAvailableInstancesCount');

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

    // Request model run
    cy.get('[data-cy=prime-button]').click();

    // Wait for outbound request
    cy.wait('@fetchAvailableInstancesCount');

    // Should display modal
    cy.get('#no-instance-available-error').should('not.exist');

    // Instance is failed
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
    );

    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );

    // Save checkpoint is enabled
    cy.get('[data-cy=save-checkpoint-button]').should('not.be.disabled');
  });

  it('abort retrain', () => {
    cy.setWebsocketWorkflow(
      'websocket-workflow/retrain-one-sample-aborted.json'
    );

    cy.visit('/project/1');

    // Check ready for retrain status
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );

    const pointSample = [470, 250];
    cy.get('[data-cy="Barren-class-button"').click();
    cy.get('[data-cy=add-point-sample-button').click();
    cy.get('#app-container').click(...pointSample);

    // Set 1 instance available
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
          total_cpus: 1,
          active_cpus: 0,
        },
      }
    ).as('fetchAvailableInstancesCount');

    // Request model run
    cy.get('[data-cy=prime-button]').should('exist').click();

    // Prediction is halted
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Received image 3 of 6...'
    );

    // Abort
    cy.get('[data-cy=abort-prime-button]').should('exist').click();

    // Reset WS workflow
    cy.setWebsocketWorkflow(
      'websocket-workflow/retrain-one-sample-aborted.json'
    );

    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );

    // Retrain again
    cy.get('[data-cy="Barren-class-button"').click();
    cy.get('[data-cy=add-point-sample-button').click();
    cy.get('#app-container').click(...pointSample);

    // Request model run
    cy.get('[data-cy=prime-button]').click();

    // Prediction is halted
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Received image 3 of 6...'
    );

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
          total_cpus: 1,
          active_cpus: 1,
        },
      }
    ).as('fetchAvailableInstancesCount');

    // Abort
    cy.get('[data-cy=abort-prime-button]').should('exist').click();

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/profile/projects/1');
    });
  });

  it('load existing checkpoint, can predict new AOI', () => {
    cy.visit('/project/1');

    // Check ready for retrain status
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for retrain run'
    );
    cy.get('[data-cy=predict-tab]').click();

    cy.get('[data-cy=add-aoi-button]').click();

    // Draw AOI
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 300, 300)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeCity');
    cy.get('[data-cy=selected-aoi-header]').contains('Judiciary Square');

    cy.get('[data-cy=prime-button]').should('be.enabled');
  });
});
