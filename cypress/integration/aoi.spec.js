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
  });

  it('Can geocode a rural non addressable area', () => {
    map = Cypress.map;
    map.panTo(
      { lon: 40.35813437224801, lat: -77.78670843690634 },
      { animate: false }
    );
    map.setZoom(14);
    cy.wait(1000);
    cy.get('[data-cy=aoi-edit-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 300, 300)
      .trigger('mouseup');
  });
});
