// / <reference types="Cypress" />
describe('Stress testing for live API', () => {
  it('successfully loads', () => {
    cy.fakeLogin('admin', { flags: { gpu: true } });
    cy.timeout(30000);
    cy.visit('/project/new');
    // cy.visit('/project/224');

    // Set project name
    cy.get('[data-cy=new-project-name-modal-input]')
      .should('be.focused')
      .type('Cypress Automated Test');
    cy.get('[data-cy=create-project-button]').should('exist').click();

    // let map = Cypress.map;
    // map.setZoom(14);

    // Draw AOI
    cy.get('[data-cy=aoi-edit-button]').should('exist').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 200, 200)
      .trigger('mouseup');

    // Open the Model selection modal
    cy.get('[data-cy=select-model-label]').should('exist').click();

    // Filter a model and get no results
    cy.get('#modelsFilter').should('exist').clear().type('NAIP 9');
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

    let totalImages;
    function expectImage(i) {
      cy.get('[data-cy=session-status]')
        .should(($status) => {
          let currentItem = 0;
          try {
            currentItem = parseInt(
              $status
                .text()
                .split(' of ')[0]
                .replace('Session Status: Received image ', '')
            );
          } catch (error) {
            // do nothing
          }
          expect(currentItem).to.be.gte(i);
        })
        .then((status) => {
          if (!totalImages) {
            totalImages = parseInt(
              status.text().split('of ')[1].replace('...')
            );
          }
          if (i < totalImages) {
            expectImage(i + 1);
          } else {
            cy.get('[data-cy=session-status]').should(
              'have.text',
              'Session Status: Ready for retrain run'
            );
          }
        });
    }

    expectImage(1);

    // let i = 1;
    // let totalImages;
    // do {
    //   i++;
    // } while (i < totalImages);

    console.log('terminou');

    // let p = 0;
  });
});
