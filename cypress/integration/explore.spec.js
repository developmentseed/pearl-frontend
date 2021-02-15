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

  // TODO re-enable this test when staging API is available for testing
  // it('Display select model modal on click', () => {
  //   cy.get('[data-cy=show-select-model-button]');
  //
  //   // Ideally we should use data-cy prop, but the Model doesn't support it.
  //   // Ticketed here: https://github.com/developmentseed/ui-library-seed/issues/175
  //   cy.get('[id=select-model-modal]').should('exist');
  // });
});
