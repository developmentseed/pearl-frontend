describe('Create new project', () => {
  beforeEach(() => {
    cy.startServer();
  });

  it('Can set name from modal', () => {
    cy.fakeLogin();
    cy.mockRegularProject();

    //cy.setWebsocketWorkflow('retrain');
    cy.visit('/project/new');

    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Waiting for model run'
    );

    cy.get('[data-cy=project-name-modal]').should('be.visible');
    cy.get('[data-cy=modal-project-input]').clear().type('Project name');
    cy.get('[data-cy=create-project-button]').click({ force: true });

    cy.get('[data-cy=project-name]').should('have.text', 'Project name');
    cy.get('[data-cy=project-name-edit]').click();
    cy.get('[data-cy=project-input]').clear().type('New name');
    cy.get('[data-cy=project-name-confirm]').click({ force: true });
  });
});
