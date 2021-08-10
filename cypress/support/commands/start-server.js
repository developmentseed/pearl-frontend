const {
  restApiEndpoint,
} = require('../../../app/assets/scripts/config/testing').default;

/**
 * Intercepts general API routes
 */
Cypress.Commands.add('startServer', () => {
  cy.intercept(
    {
      url: restApiEndpoint + '/health',
    },
    { healthy: true, message: 'Good to go' }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api',
    },
    {
      version: '1.0.0',
      limits: {
        live_inference: 10000000,
        max_inference: 100000000,
        instance_window: 600,
      },
    }
  );

  cy.intercept(
    {
      url: restApiEndpoint + '/api/mosaic',
    },
    { mosaics: ['naip.latest'] }
  );

  cy.intercept(
    {
      url:
        'https://dev.virtualearth.net/REST/v1/Locations/38.89497406962095,-77.01622009277345?*',
    },
    { fixture: 'geocoder/dc.json' }
  ).as('reverseGeocodeCity');
  cy.intercept(
    {
      url:
        'https://dev.virtualearth.net/REST/v1/Locations/40.36315736436661,-77.7938461303711?*',
    },
    { fixture: 'geocoder/rural.json' }
  ).as('reverseGeocodeRural');
});
