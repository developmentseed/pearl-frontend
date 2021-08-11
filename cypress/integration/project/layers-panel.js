describe('Open existing project', () => {
  beforeEach(() => {
    cy.startServer();
  });

  it('successfully loads', () => {
    cy.fakeLogin();
    cy.mockRegularProject();

    cy.setWebsocketWorkflow('retrain');
    cy.visit('/project/1');
  });
});

