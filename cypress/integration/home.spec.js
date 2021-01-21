// / <reference types="Cypress" />
describe('The Home Page', () => {
  before(() => {
    cy.visit('/home');
  });

  it('successfully loads', () => {
    cy.get('main');
    cy.get('h1');
  });
});
