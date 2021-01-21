// / <reference types="Cypress" />
describe('The About Page', () => {
  before(() => {
    cy.visit('/about');
  });

  it('successfully loads', () => {
    cy.get('main');
    cy.get('h1');
  });
});
