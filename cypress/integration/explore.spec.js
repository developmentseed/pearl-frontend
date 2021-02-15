// / <reference types="Cypress" />
describe('The Explore Page', () => {
  before(() => {
    cy.visit('/explore');
  });

  it('successfully loads', () => {
    cy.get('body');
    cy.get('header');
  });

  it('Renders 2 panels', () => {
    cy.get('[data-cy=primary-panel]').should('exist');
    cy.get('[data-cy=secondary-panel]').should('exist');
  });

  it('Renders a map', () => {
    cy.get('[data-cy=leaflet-map]').should('exist');
  });

  it('Display select model modal on click', () => {
    cy.get('[data-cy=show-select-model-button]').click();

    // Ideally we should use data-cy prop, but the Model doesn't support it.
    // Ticketed here: https://github.com/developmentseed/ui-library-seed/issues/175
    cy.get('[id=select-model-modal]').should('exist');
  });

  it('Can query a location', () => {
    cy.window()
      .its('map')
      .then((m) => {
        m.on('moveend', () => {
          const obj = m.getCenter();
          /* Actual map center may be off by some insignificant amount, just check
           * if it is in a range */
          expect(obj.lat).to.within(40.7, 40.72);
          expect(obj.lng).to.within(-74.1, -74);
        });
        cy.get('.geosearch input').type('New York{enter}', { force: true });
      });
  });
});
