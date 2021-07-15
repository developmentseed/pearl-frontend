describe('Loads AOIs', () => {
  let map;

  beforeEach(() => {
    cy.startServer();
    cy.visit('/project/new');
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
    //map.once('moveend', () => {
    cy.get('[data-cy=aoi-edit-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 300, 300)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeRural');
    cy.get('[data-cy=aoi-selection-trigger]').contains('Huntingdon County');
  });
  //});
});
