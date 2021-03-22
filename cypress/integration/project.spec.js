// / <reference types="Cypress" />
describe('The Project Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.startServer();
  });

  it('Successfully loads not-logged in state ', () => {
    cy.visit('/project/new');
    cy.get('body');
    cy.get('header');

    cy.get('[data-cy=primary-panel]').should('exist');
    cy.get('[data-cy=secondary-panel]').should('exist');
    cy.get('[data-cy=leaflet-map]').should('exist');

    cy.get('[data-cy=select-model-label]').should(
      'have.text',
      'Login to select model'
    );
  });

  it('Allow model select after login ', () => {
    cy.fakeLogin();
    cy.visit('/project/new');

    cy.get('[data-cy=select-model-label]').should(
      'not.have.text',
      'Login to select model'
    );
  });
});
