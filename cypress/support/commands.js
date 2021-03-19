const {
  restApiEndpoint,
} = require('../../app/assets/scripts/config/testing').default;

const FAKE_API_TOKEN = 'FAKE_API_TOKEN';

const authHeaders = {
  Authorization: `Bearer ${FAKE_API_TOKEN}`,
};

/**
 * Fake user login
 */
Cypress.Commands.add('fakeLogin', () => {
  window.localStorage.setItem(
    'auth0Cypress',
    JSON.stringify({
      apiToken: FAKE_API_TOKEN,
      user: {
        name: 'Test User',
      },
    })
  );
});

/**
 * Stub network requests
 */
Cypress.Commands.add('startServer', () => {
  // GET /health
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/health',
    },
    { fixture: 'server/health.json' }
  );

  // GET /api
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api',
    },
    { fixture: 'server/api.json' }
  );

  // GET /api/mosaic
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/mosaic',
    },
    {
      fixture: 'server/api/mosaic.json',
    }
  );

  // GET /api/models with auth headers
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/model',
      headers: authHeaders,
    },
    {
      fixture: 'server/api/model.json',
    }
  );
});
