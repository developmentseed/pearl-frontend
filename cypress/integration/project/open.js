describe('Open existing project', () => {
  beforeEach(() => {
    cy.startServer();
  });

  it('successfully loads', () => {
    cy.fakeLogin();
    cy.mockRegularProject();

    cy.setWebsocketWorkflow('retrain');
    cy.visit('/project/1');

    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready to go'
    );

    cy.get('[data-cy=project-name]').should('have.text', 'Untitled');
    cy.get('[data-cy=project-name-edit]').click();
    cy.get('[data-cy=project-input]').clear().type('New name');
    cy.get('[data-cy=project-name-confirm]').click({ force: true });
    cy.wait('@patchProjectName').then(({ response: { body } }) => {
      assert(body.name === 'New name');
    });

    cy.get('[data-cy=global-loading]').should('not.exist');
  });
});
