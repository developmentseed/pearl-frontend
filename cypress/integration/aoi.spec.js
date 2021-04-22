describe('Loads AOIs', () => {
  it('Load an aoi on page load', () => {
    cy.startServer();
    cy.fakeLogin();

    cy.visit('/project/1');

    cy.get('path.leaflet-interactive').should('exist');
  });

  // This doesn't work because of GlobalLoading. We should refactor when possible.
  // it('Can draw a new aoi', () => {
  //   cy.startServer();
  //   cy.fakeLogin();

  //   cy.visit('/project/1');

  //   cy.get('[data-cy=aoi-selection-trigger]').click();
  //   cy.get('[data-cy=add-aoi-button]').click();

  //   // Should not be an aoi on the map
  //   cy.get('path.leaflet-interactive').should('not.exist');
  //   cy.get('[data-cy=leaflet-map]')
  //     .trigger('mousedown', 100, 100)
  //     .trigger('mousemove', 200, 200)
  //     .trigger('mouseup');
  //   cy.get('path.leaflet-interactive').should('exist');
  // });
});
