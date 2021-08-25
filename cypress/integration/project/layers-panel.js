describe('Open existing project', () => {
  beforeEach(() => {
    cy.startServer();
  });

  it('successfully loads', () => {
    cy.fakeLogin();
    cy.visit('/project/1');

    cy.get('#layer-control').click({ force: true });
    cy.get('[data-cy=layers-panel]').should('be.visible');
    cy.get('#layer-control').click({ force: true });
    cy.get('[data-cy=layers-panel]').should('not.be.visible');
  });
});
