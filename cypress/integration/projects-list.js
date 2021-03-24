// / <reference types="Cypress" />
describe('Projects list', () => {
  it('Load page', () => {
    cy.startServer();
    cy.fakeLogin();

    cy.visit('/profile/projects');

    // Check if project list is populated
    cy.get('article#1').should('exist');
    cy.get('article#2').should('exist');
    cy.get('article#3').should('exist');
    cy.get('article#4').should('not.exist');
  });
});
