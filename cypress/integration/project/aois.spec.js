const restApiEndpoint = Cypress.config('restApiEndpoint');

describe('Loads AOIs', () => {
  let map;

  beforeEach(() => {
    cy.startServer();
    cy.fakeLogin();
    cy.visit('/project/new');

    cy.get('[data-cy=new-project-name-modal-input]')
      .should('be.focused')
      .type('Project name');
    cy.get('[data-cy=create-project-button]').click({ force: true });
  });

  it('Can draw an aoi', () => {
    map = Cypress.map;
    map.setZoom(14);

    cy.get('[data-cy=aoi-edit-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 300, 300)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeCity');
    cy.get('[data-cy=selected-aoi-header]').contains('Judiciary Square');
  });

  it('Try to draw a tiny AOI and check if alert modal is visible', () => {
    map = Cypress.map;
    map.setZoom(14);

    cy.get('[data-cy=aoi-edit-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 170, 170)
      .trigger('mouseup');
    cy.get('#confirm-area-size').contains('Area is too tiny');
    cy.get('[data-cy=proceed-anyway-button]').should('not.exist');
    cy.get('[data-cy=keep-editing-button]').should('exist').click();
  });

  it('Can geocode a rural non addressable area', () => {
    map = Cypress.map;
    map.flyTo({ lat: 40.35813437224801, lon: -77.78670843690634 }, 14, {
      animate: false,
    });
    cy.get('[data-cy=aoi-edit-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 300, 300)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeRural');
    cy.get('[data-cy=selected-aoi-header]').contains('Huntingdon County');
  });

  it('Can upload an AOI', () => {
    // Open import modal
    cy.get('[data-cy=upload-aoi-modal-button]').click();

    // Open select file dialog
    cy.get('[data-cy=select-aoi-file-button').click();

    // Apply large AOI file to input
    cy.get('[data-cy=aoi-upload-input]').attachFile(
      'aoi-upload/really-large-area.geojson'
    );

    // Check warning
    cy.get('[data-cy=import-aoi-warning-text').should(
      'include.text',
      'Area is too large, please upload another file.'
    );

    // Open select file dialog
    cy.get('[data-cy=select-aoi-file-button').click();

    // Load empty collection file
    cy.get('[data-cy=aoi-upload-input]').attachFile(
      'aoi-upload/aoi-empty-collection.geojson'
    );

    // Check warning
    cy.get('[data-cy=import-aoi-warning-text').should(
      'include.text',
      'File is empty or does not conform a valid area, please upload another file.'
    );

    // Open select file dialog
    cy.get('[data-cy=select-aoi-file-button').click();

    // Load invalid area file
    cy.get('[data-cy=aoi-upload-input]').attachFile(
      'aoi-upload/aoi-zero-area.geojson'
    );

    // Check warning
    cy.get('[data-cy=import-aoi-warning-text').should(
      'include.text',
      'File is empty or does not conform a valid area, please upload another file.'
    );

    // Importing should not be allowed
    cy.get('[data-cy=import-aoi-button').should('be.disabled');

    // Open select file dialog again
    cy.get('[data-cy=select-aoi-file-button').click();

    // Apply valid file to input
    cy.get('[data-cy=aoi-upload-input]').attachFile(
      'aoi-upload/no-live-inferencing.geojson'
    );

    // Proceed importing
    cy.get('[data-cy=import-aoi-button').should('be.enabled').click();

    // Check if area is ok
    cy.get('[data-cy=selected-aoi-header]').should(
      'include.text',
      '81.11  km2'
    );

    cy.get('[data-cy=panel-aoi-confirm]')
      .should('exist')
      .should('not.be.disabled');

    // Set AOI
    cy.get('[data-cy=aoi-edit-confirm-button').click();

    // Confirm large area
    cy.get('[data-cy=proceed-anyway-button').should('exist').click();

    // Open import modal again
    cy.get('[data-cy=upload-aoi-modal-button]').click();

    // Open select file dialog again
    cy.get('[data-cy=select-aoi-file-button').click();

    // Apply valid file to input
    cy.get('[data-cy=aoi-upload-input]').attachFile(
      'aoi-upload/live-inferencing.geojson'
    );

    // No warning is displayed
    cy.get('[data-cy=import-aoi-warning-text').should('not.exist');

    // Proceed importing
    cy.get('[data-cy=import-aoi-button').should('be.enabled').click();

    cy.get('[data-cy=selected-aoi-header]').should('include.text', '6.56  km2');

    cy.get('[data-cy=panel-aoi-confirm]')
      .should('exist')
      .should('not.be.disabled');

    // Set AOI
    cy.get('[data-cy=aoi-edit-confirm-button').click();
  });
});

describe('Load AOIs and draw a third one', () => {
  beforeEach(() => {
    cy.startServer();
  });

  it('Should show the confirmation modal if switching to another AOI before running prediction', () => {
    cy.fakeLogin();
    cy.setWebsocketWorkflow('websocket-workflow/load-aoi.json');

    // Load project
    cy.visit('/project/1');
    cy.wait('@loadAois');
    cy.get('[data-cy=global-loading]').should('not.exist');

    // go to the Predict tab
    cy.get('[data-cy=predict-tab]').click();
    // add new AOI
    cy.get('[data-cy=add-aoi-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 300, 300)
      .trigger('mouseup');
    // check that we have 2 AOIs besides the one we are creating
    cy.get('.listed-aoi').should('have.length', 2);
    // try to switch to the first AOI and check if the confirmation modal is shown
    cy.get('.listed-aoi').eq(1).contains('Seneca Rocks #1').click();
    cy.get('[data-cy=confirm-clear-aoi-modal]').should('exist');
    // cancel the AOI switch
    cy.get('[data-cy=cancel-clear-aoi]').should('exist').click();
    // check if the AOIs were not changed
    cy.get('.listed-aoi').should('have.length', 2);
    cy.get('[data-cy=confirm-clear-aoi-modal]').should('not.exist');

    // try to switch again
    cy.get('.listed-aoi').eq(1).contains('Seneca Rocks #1').click();
    cy.get('[data-cy=confirm-clear-aoi-modal]').should('exist');
    // confirm that we are clearing the third AOI
    cy.get('[data-cy=confirm-clear-aoi]').should('exist').click();
    cy.wait('@fetchAoi2');
    cy.get('[data-cy=global-loading]').should('not.exist');
    cy.get('[data-cy=predict-tab]').click();
    cy.get('.listed-aoi').should('have.length', 1);
    cy.get('[data-cy=confirm-clear-aoi-modal]').should('not.exist');
  });
});

describe('Can delete AOIs', () => {
  beforeEach(() => {
    cy.startServer();
  });

  it('Displays delete button on header', () => {
    cy.fakeLogin();
    cy.setWebsocketWorkflow('websocket-workflow/retrain.json');

    cy.visit('/project/1');
    cy.wait('@loadAois');

    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/aoi/1',
        method: 'DELETE',
      },
      {
        statusCode: 200,
        body: {},
      }
    ).as('deleteAoi');

    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/aoi',
      },
      {
        fixture: 'aois.1.json',
      }
    ).as('loadAois1');

    cy.get('[data-cy=predict-tab]').click();
    cy.get('[data-cy=delete-current-aoi-button]');
    cy.get('[data-cy=delete-current-aoi-button]').click();
    cy.get('[data-cy=confirm-delete-aoi-modal]').should('exist');
    cy.get('[data-cy=confirm-aoi-delete]').should('exist').click();
    cy.get('[data-cy=confirm-delete-aoi-modal]').should('not.exist');
    cy.get('.aoi-delete-button').should('have.length', 0);
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/aoi',
      },
      {
        fixture: 'aois.0.json',
      }
    ).as('loadAois0');
    cy.get('[data-cy=predict-tab]').click();

    cy.get('[data-cy=delete-current-aoi-button]').click();
    cy.get('[data-cy=confirm-delete-aoi-modal]').should('exist');
    cy.get('[data-cy=confirm-aoi-delete]').should('exist').click();
  });

  it('Can delete frontend only aoi', () => {
    cy.fakeLogin();
    cy.setWebsocketWorkflow('websocket-workflow/retrain.json');

    cy.visit('/project/1');
    cy.wait('@loadAois');

    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/aoi/*',
        method: 'DELETE',
      },
      {
        statusCode: 200,
        body: {},
      }
    ).as('deleteAnyAoi');

    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/aoi',
      },
      {
        fixture: 'aois.1.json',
      }
    ).as('loadAois1');

    cy.get('[data-cy=predict-tab]').click();
    cy.get('[data-cy=add-aoi-button]').click();

    // Draw AOI
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 300, 300)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeCity');

    cy.get('[data-cy=delete-current-aoi-button]').click();

    cy.get('[data-cy=confirm-delete-aoi-modal]').should('not.exist');
    cy.get('@deleteAnyAoi').should('not.exist');
    cy.get('@loadAois1').should('not.exist');
  });
});
