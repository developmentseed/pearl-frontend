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
});
