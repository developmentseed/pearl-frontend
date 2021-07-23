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

    // Base feature to perform map edit actions
    const baseFeature = [
      [470, 300],
      [500, 250],
      [550, 300],
      [500, 350],
    ];

    // Helper function to move feature around
    function translateFeature(feature, xDiff = 0, yDiff = 0) {
      return feature.map(([x, y]) => [x + xDiff, y + yDiff]);
    }

    // Draw sample with freehand tool
    cy.get('[data-cy=retrain-draw-freehand').click();
    const feature1 = baseFeature;
    cy.get('#app-container')
      .trigger('mousedown', ...feature1[0])
      .trigger('mousemove', ...feature1[1])
      .trigger('mousemove', ...feature1[2])
      .trigger('mousemove', ...feature1[3])
      .trigger('mouseup', ...feature1[3]);

    // Draw sample with polygon tool
    const feature2 = translateFeature(feature1, 0, 120);
    cy.get('[data-cy=retrain-draw-polygon').click();
    cy.get('#app-container')
      .trigger('mousedown', ...feature2[0])
      .trigger('mousedown', ...feature2[1])
      .trigger('mousedown', ...feature2[2])
      .trigger('mousedown', ...feature2[3])
      .trigger('mousedown', ...feature2[0])
      .trigger('mouseup');

    // Draw sample with freehand tool
    // const feature3 = translateFeature(feature1, 100, 0);
    // cy.get('[data-cy=retrain-draw-freehand').click();
    // cy.get('#app-container')
    //   .trigger('mousedown', ...feature3[0])
    //   .trigger('mousemove', ...feature3[1])
    //   .trigger('mousemove', ...feature3[2])
    //   .trigger('mousemove', ...feature3[3])
    //   .trigger('mouseup', ...feature3[3]);

    cy.get('[data-cy=run-button').click();
  });
});
