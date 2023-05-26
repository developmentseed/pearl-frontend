// / <reference types="Cypress" />

/**
 *
 * This spec runs a test against a live API by creating an AOI and requesting
 * a prediction n times.
 *
 * The preparation steps are:
 *
 * - Define API URLs (Rest and Websocket) in config/local.js file
 * - Start serving the app locally as described in the README
 * - Open Cypress dashboard with `yarn cy:open:stress`
 * - Start this spec in the dashboard
 *
 * By default the spec will create a new project on every run. Please enter
 * the project id in the section below to use an existing project.
 *
 */

const predictionsToRun = 5;
const timeout = 30000;
const projectId = 'new'; // replace with a project id, if necessary
const model = 'NAIP 9';
const mapBounds = [
  [150, 150],
  [200, 200],
];

describe('Stress testing for live API', () => {
  it('successfully loads', () => {
    let currentPrediction = 1;

    cy.fakeLogin('admin', { flags: { gpu: true } });
    cy.timeout(timeout);

    if (projectId === 'new') {
      cy.visit('/project/new');

      // Set project name
      cy.get('[data-cy=new-project-name-modal-input]')
        .should('be.focused')
        .type('Cypress Automated Test');
      cy.get('[data-cy=create-project-button]').should('exist').click();

      // Draw AOI
      cy.get('[data-cy=aoi-edit-button]').should('exist').click();
      cy.get('#map')
        .trigger('mousedown', ...mapBounds[0])
        .trigger('mousemove', ...mapBounds[1])
        .trigger('mouseup');

      // Open the Model selection modal
      cy.get('[data-cy=select-model-label]').should('exist').click();

      // Filter a model and get no results
      cy.get('#modelsFilter').should('exist').clear().type(model);
      cy.get('#select-model-modal article').first().should('exist').click();

      // Check session status message
      cy.get('[data-cy=session-status]').should(
        'have.text',
        'Session Status: Ready for prediction run'
      );

      cy.get('[data-cy=run-button]').click();

      cy.get('[data-cy=global-loading]').contains('Fetching classes');

      cy.get('[data-cy=session-status]').should(
        'have.text',
        'Session Status: Running prediction'
      );

      expectImage(1);
    } else {
      cy.visit(`/project/${projectId}`);
      runPrediction();
    }

    let predictionImageCount;
    function expectImage(i) {
      cy.get('[data-cy=session-status]')
        .should(($status) => {
          let currentItem = 0;
          const statusText = $status.text();

          // Prediction has finished, proceed
          if (statusText === 'Session Status: Ready for retrain run') {
            return;
          }

          // Prediction is running, wait for next prediction image
          currentItem = parseInt(
            $status
              .text()
              .split(' of ')[0]
              .replace('Session Status: Received image ', '')
          );
          expect(currentItem).to.be.gte(i);
        })
        .then((status) => {
          if (!predictionImageCount) {
            predictionImageCount = parseInt(
              status.text().split('of ')[1].replace('...')
            );
          }
          if (i < predictionImageCount) {
            expectImage(i + 1);
          } else {
            cy.get('[data-cy=session-status]').should(
              'have.text',
              'Session Status: Ready for retrain run'
            );

            currentPrediction += 1;
            if (currentPrediction < predictionsToRun) {
              runPrediction();
            }
          }
        });
    }

    function runPrediction() {
      // Go to the Predict tab
      cy.get('[data-cy=predict-tab]').click();
      // add new AOI
      cy.get('[data-cy=add-aoi-button]').click();
      cy.get('#map')
        .trigger('mousedown', 100, 100)
        .trigger('mousemove', 400, 400)
        .trigger('mouseup');

      cy.get('[data-cy=run-button]').should('be.enabled').click();

      expectImage(1);
    }
  });
});
