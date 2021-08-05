import config from '../../app/assets/scripts/config/testing';
const { restApiEndpoint } = config.default;
describe('Loads AOIs', () => {
  let map;

  beforeEach(() => {
    cy.startServer();
    cy.fakeLogin();
    cy.mockRegularProject();
    cy.visit('/project/new');

    cy.get('[data-cy=modal-project-input]').clear().type('Project name');
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
    cy.get('[data-cy=aoi-selection-trigger]').contains('Judiciary Square');
  });

  it('Can geocode a rural non addressable area', () => {
    map = Cypress.map;
    map.flyTo({ lat: 40.35813437224801, lon: -77.78670843690634 }, 14, {
      animate: false,
    });
    //map.once('moveend', () => {
    cy.get('[data-cy=aoi-edit-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 300, 300)
      .trigger('mouseup');
    cy.wait('@reverseGeocodeRural');
    cy.get('[data-cy=aoi-selection-trigger]').contains('Huntingdon County');
  });
});

describe('Can delete AOIs', () => {
  beforeEach(() => {
    cy.startServer();
  });

  it.only('Displays delete button on header', () => {
    cy.fakeLogin();
    cy.mockRegularProject();

    cy.setWebsocketWorkflow('retrain');

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

    cy.get('[data-cy=delete-current-aoi-button]');
    cy.get('[data-cy=delete-current-aoi-button]').click();
    cy.get('[data-cy=aoi-selection-trigger]').click();
    cy.get('.aoi-delete-button').should('have.length', 1);
  });
});
