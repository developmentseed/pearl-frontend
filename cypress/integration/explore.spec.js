// / <reference types="Cypress" />
describe('The Explore Page', () => {
  before(() => {
    cy.visit('/explore');
  });

  it('successfully loads', () => {
    cy.get('body');
    cy.get('header');
  });
});
