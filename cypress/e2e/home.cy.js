// / <reference types="Cypress" />
describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.mockCommonApiEndpoints();
    cy.visit('/');
    cy.get('body');
  });
});
