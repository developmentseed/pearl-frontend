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
    cy.get('[data-cy=global-loading]').should('not.exist');

    // Draw sample with freehand tool
    cy.get('[data-cy=retrain-draw-freehand').click();
    cy.get('#app-container')
      .trigger('mousedown', 470, 300)
      .trigger('mousemove', 500, 250)
      .trigger('mousemove', 550, 300)
      .trigger('mousemove', 500, 350)
      .trigger('mouseup', 500, 350);

    cy.get('[data-cy=run-button').click();
  });
});
