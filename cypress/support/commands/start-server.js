const {
  restApiEndpoint,
} = require('../../../app/assets/scripts/config/testing').default;

/**
 * Intercepts general API routes
 */
Cypress.Commands.add('startServer', () => {
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/health',
    },
    { healthy: true, message: 'Good to go' }
  );

  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api',
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
      host: restApiEndpoint,
      path: '/api/mosaic',
    },
    { mosaics: ['naip.latest'] }
  );
});
