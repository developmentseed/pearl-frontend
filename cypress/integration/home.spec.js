// / <reference types="Cypress" />
describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.startServer();
    cy.visit('/');
    cy.get('body');
  });
});
