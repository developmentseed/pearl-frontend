describe('Delete a project', () => {
  beforeEach(() => {
    cy.startServer();
    cy.fakeLogin();
    cy.visit('/profile/projects/1');
  });

  it('Loads project page', () => {
    cy.get('[data-cy=project-name]').should('contain', 'Untitled');
  });

  it('Can delete project', () => {
    cy.get('[data-cy=delete-project-button]').should('exist').click();
    cy.get('[data-cy=confirm-delete-project-modal]').should('exist');
    cy.get('[data-cy=confirm-project-delete]').click();
    cy.get('[data-cy=confirm-delete-project-modal]').should('not.exist');
    cy.wait('@deleteProject');
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/profile/projects');
    });
  });
});
