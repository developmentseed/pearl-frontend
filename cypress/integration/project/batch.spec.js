const {
  restApiEndpoint,
} = require('../../../app/assets/scripts/config/testing').default;

describe('Batch predictions', () => {
  beforeEach(() => {
    cy.startServer();
  });

  it('on new project, show different button large on large aoi', () => {
    cy.fakeLogin();

    cy.visit('/project/new');

    cy.get('[data-cy=project-name-modal]').should('be.visible');
    cy.get('[data-cy=modal-project-input]').clear().type('Project name');
    cy.get('[data-cy=create-project-button]').click();

    // Set AOI
    cy.get('[data-cy=aoi-edit-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 400, 400)
      .trigger('mouseup');

    cy.get('[data-cy=proceed-anyway-button]').should('exist').click();
    cy.wait('@reverseGeocodeCity');

    // Set model
    cy.get('[data-cy=select-model-label]').should('exist').click();
    cy.get('[data-cy=select-model-1-card]').should('exist').click();

    // No batch message should be displayed
    cy.get('[data-cy=batch-progress-message').should('not.exist');

    // Request model run
    cy.get('[data-cy=run-button')
      .should('have.text', 'Run Batch Prediction')
      .click();

    // Mock running batch
    cy.intercept(
      {
        url: restApiEndpoint + `/api/project/1/batch?completed=false`,
      },
      {
        total: 1,
        batch: [
          {
            count: 1,
            id: 1,
            abort: false,
            created: 1630056802895,
            updated: 1630056976364,
            aoi: 1,
            name: 'Wesley Heights',
            completed: false,
            progress: 60,
          },
        ],
      }
    );

    // Batch message should be displayed
    cy.get('[data-cy=batch-progress-message')
      .should('include.text', 'Batch prediction in progress: 60%')
      .click();

    // Modal is open and include AOI details
    cy.get('[data-cy=batch-progress-modal-content]')
      .should('include.text', 'AOI Size: 71.67')
      .should('include.text', 'AOI Name: Wesley Heights');

    // Close modal
    cy.get('[data-cy=close-batch-prediction-modal').should('exist').click();

    // Confirm modal is hidden
    cy.get('[data-cy=batch-progress-modal-content]').should('not.exist');
  });

  it('in project page, display completed and running batch jobs', () => {
    cy.fakeLogin();

    cy.visit('/profile/projects/1');

    cy.wait('@getBatchList');

    // Check available columns
    cy.get('th')
      .should('have.length', 5)
      .should('include.text', 'Id')
      .should('include.text', 'AOI Name')
      .should('include.text', 'Status')
      .should('include.text', 'Started')
      .should('include.text', 'Download');

    // Check if page is well-formed
    cy.get('tbody').find('tr').should('have.length', 5);
    cy.get('tbody tr:nth-child(1) td')
      .should('include.text', 'AOI 1')
      .should('include.text', 'In Progress (60%)');

    // Check if next page works
    cy.get('[data-cy=next-page-button').click();
    cy.get('tbody').find('tr').should('have.length', 5);
    cy.get('tbody tr:nth-child(3) td').should('include.text', 'AOI 8');

    // Check if page button works
    cy.get('[data-cy=page-5-button').click();
    cy.get('tbody').find('tr').should('have.length', 5);
    cy.get('tbody tr:nth-child(3) td').should('include.text', 'AOI 13');
  });
});
