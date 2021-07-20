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
        max_inference: 10000000,
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
});
