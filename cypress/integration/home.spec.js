// / <reference types="Cypress" />
describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.mockApiRoutes();
    cy.visit('/');
    cy.get('body');
  });
});
