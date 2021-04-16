// / <reference types="Cypress" />
describe('Projects list', () => {
  it('Load page', () => {
    cy.startServer();
    cy.fakeLogin();

    cy.visit('/profile/projects');

    // FIXME: Actually check if project list is populated
    cy.get('body').should('exist')  });
});
