// / <reference types="Cypress" />
describe('The Home Page', () => {
  before(() => {
    cy.visit('/');
  });

  it('successfully loads', () => {
    cy.get('body');
    cy.get('header');
  });
});
