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
      [470, 250],
      [490, 230],
      [510, 250],
      [490, 270],
    ];

    // Helper function to move feature around
    function translateFeature(feature, xDiff = 0, yDiff = 0) {
      return feature.map(([x, y]) => [x + xDiff, y + yDiff]);
    }

    // Draw with freehand tool
    cy.get('[data-cy=retrain-draw-freehand').click();
    const feature1 = baseFeature;
    cy.get('#app-container')
      .trigger('mousedown', ...feature1[0])
      .trigger('mousemove', ...feature1[1])
      .trigger('mousemove', ...feature1[2])
      .trigger('mousemove', ...feature1[3])
      .trigger('mouseup', ...feature1[3]);

    // Draw complete polygon with polygon draw
    const feature2 = translateFeature(baseFeature, 0, 50);
    cy.get('[data-cy=retrain-draw-polygon').click();
    cy.get('#app-container')
      .trigger('mousedown', ...feature2[0])
      .trigger('mousedown', ...feature2[1])
      .trigger('mousedown', ...feature2[2])
      .trigger('mousedown', ...feature2[3])
      .trigger('mousedown', ...feature2[0])
      .trigger('mouseup');

    // Draw incomplete than switch to other tool, should clear
    const feature3 = translateFeature(baseFeature, 0, 100);
    cy.get('#app-container')
      .trigger('mousedown', ...feature3[0])
      .trigger('mousedown', ...feature3[1])
      .trigger('mousedown', ...feature3[2])
      .trigger('mousedown', ...feature3[3])
      .trigger('mouseup');
    cy.get('[data-cy=retrain-draw-freehand').click();
    cy.get('[data-cy=retrain-draw-polygon').click();
    cy.get('#app-container')
      .trigger('mousedown', ...feature3[0])
      .trigger('mousedown', ...feature3[1])
      .trigger('mousedown', ...feature3[2])
      .trigger('mousedown', ...feature3[3])
      .trigger('mousedown', ...feature3[0])
      .trigger('mouseup');

    // Polygon draw with different class
    const feature4 = translateFeature(baseFeature, 0, 150);
    cy.get('[data-cy=retrain-draw-polygon').click();
    cy.get('[data-cy=Tree-class-button').click();
    cy.get('#app-container')
      .trigger('mousedown', ...feature4[0])
      .trigger('mousedown', ...feature4[1])
      .trigger('mousedown', ...feature4[2])
      .trigger('mousedown', ...feature4[3])
      .trigger('mousedown', ...feature4[0])
      .trigger('mouseup');

    cy.get('[data-cy=run-button').click();
  });
});
