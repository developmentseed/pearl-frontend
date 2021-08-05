describe('Loads AOIs', () => {
  let map;

  beforeEach(() => {
    cy.startServer();
    cy.fakeLogin();
    cy.mockRegularProject();
    cy.visit('/project/new');

    cy.get('[data-cy=modal-project-input]').clear().type('Project name');
    cy.get('[data-cy=create-project-button]').click({ force: true });
  });

  it('Can draw an aoi', () => {
    map = Cypress.map;
    map.setZoom(14);

    cy.get('[data-cy=aoi-edit-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 300, 300)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeCity');
    cy.get('[data-cy=aoi-selection-trigger]').contains('Judiciary Square');
  });

  it('Can geocode a rural non addressable area', () => {
    map = Cypress.map;
    map.flyTo({ lat: 40.35813437224801, lon: -77.78670843690634 }, 14, {
      animate: false,
    });
    cy.get('[data-cy=aoi-edit-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 300, 300)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeRural');
    cy.get('[data-cy=aoi-selection-trigger]').contains('Huntingdon County');
  });

  it('Can upload an AOI', () => {
    // Open import modal
    cy.get('[data-cy=upload-aoi-modal-button]').click();

    // Open select file dialog
    cy.get('[data-cy=select-aoi-file-button').click();

    // Apply large aoi file to input
    cy.get('[data-cy=aoi-upload-input]').attachFile('aoi-upload/aoi-1.json');

    // Importing should not be allowed
    cy.get('[data-cy=import-aoi-button').should('be.disabled');

    // Open select file dialog again
    cy.get('[data-cy=select-aoi-file-button').click();

    // Apply valid file to input
    cy.get('[data-cy=aoi-upload-input]').attachFile('aoi-upload/aoi-2.geojson');

    // Proceed importing
    cy.get('[data-cy=import-aoi-button').click();

    // Set AOI
    cy.get('[data-cy=aoi-edit-confirm-button').click();
  });
});
