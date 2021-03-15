// / <reference types="Cypress" />
describe('The About Page', () => {
  before(() => {
    cy.visit('/about');
  });

  it('successfully loads', () => {
    cy.get('body');
    cy.get('header');
  });
});
