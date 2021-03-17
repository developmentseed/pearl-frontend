// / <reference types="Cypress" />
describe('The Project Page', () => {
  before(() => {
    cy.clearLocalStorage();
    cy.visit('/project/new');
  });

  it('Successfully loads not-logged in state ', () => {
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
    cy.loginByAuth0Api(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password')
    );
    cy.visit('/project/new');

    cy.get('[data-cy=select-model-label]').should(
      'not.have.text',
      'Login to select model'
    );
  });
});
