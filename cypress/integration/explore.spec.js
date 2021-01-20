// / <reference types="Cypress" />
describe('The Explore Page', () => {
  before(() => {
    cy.visit('/explore');
  });

  it('successfully loads', () => {
    cy.get('main');
    cy.get('h1');
  });
});
