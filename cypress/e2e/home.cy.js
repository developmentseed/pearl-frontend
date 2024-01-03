// / <reference types="Cypress" />
describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.mockCommonApiRoutes();
    cy.visit('/');
    cy.get('body');
  });
});
