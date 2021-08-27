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
            aoi: 3068,
            name: 'Wesley Heights',
            completed: false,
            progress: 60,
          },
        ],
      }
    );

    // Batch message should be displayed
    cy.get('[data-cy=batch-progress-message').should(
      'include.text',
      'Batch prediction in progress: 60%'
    );

    // Clicking on run button display confirmation modal to abort previous one

    // Close modal

    // Open again and abort

    // Clicking in the batch message show modal with status

    // Aborting show confirmation

    // Batch message is cleared

    // Now let one full batch run

    // On finish, visit project page and inspect batch there
  });
});
