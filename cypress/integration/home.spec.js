// / <reference types="Cypress" />
describe('The Home Page', () => {
  before(() => {
    cy.startServer();
    cy.visit('/');
  });

  it('successfully loads', () => {
    cy.get('body');
  });
});
