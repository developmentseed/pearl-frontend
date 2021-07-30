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

    // Select Barren class
    cy.get('[data-cy="Barren-class-button"').click();

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

    // Add another feature
    const feature5 = translateFeature(baseFeature, 120, 0);
    cy.get('#app-container')
      .trigger('mousedown', ...feature5[0])
      .trigger('mousedown', ...feature5[1])
      .trigger('mousedown', ...feature5[2])
      .trigger('mousedown', ...feature5[3])
      .trigger('mousedown', ...feature5[0])
      .trigger('mouseup');

    // Delete polygon features
    cy.get('[data-cy=eraser-button').click();
    cy.get('[data-cy=Barren-class-button').click();
    cy.get('#app-container').click(...feature1[0]);
    cy.get('#app-container').click(...feature5[0]); // should not be able to delete
    cy.get('[data-cy=Tree-class-button').click();
    cy.get('#app-container').click(...feature4[0]); // should be able to delete

    // Add some points
    const feature6 = translateFeature(baseFeature, 120, 70);
    cy.get('[data-cy=add-point-sample-button').click();
    cy.get('[data-cy="Impervious Surface-class-button"').click();
    cy.get('#app-container')
      .click(...feature6[0])
      .click(...feature6[1]);
    cy.get('[data-cy="Impervious Road-class-button"').click();
    cy.get('#app-container')
      .click(...feature6[2])
      .click(...feature6[3]);

    // Set class for the import
    cy.get('[data-cy=Structure-class-button').click();

    // Open import modal
    cy.get('[data-cy=open-upload-samples-modal-button').click();

    // Open select file dialog
    cy.get('[data-cy=select-samples-file-button').click();

    // Apply file to input
    cy.get('[data-cy=samples-upload-input]').attachFile('samples.geojson');

    // Proceed importing
    cy.get('[data-cy=import-samples-button').click();

    // Retrain
    cy.get('[data-cy=run-button').click();
  });
});
