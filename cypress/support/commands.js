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
    'authState',
    JSON.stringify({
      isLoading: false,
      error: false,
      isAuthenticated: true,
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

  // GET /api/models
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

  // GET /api/project
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/project',
      headers: authHeaders,
    },
    {
      body: {
        total: 3,
        projects: [
          { id: 1, name: 'Untitled', created: '2021-01-19T12:47:07.838Z' },
          { id: 2, name: 'Untitled', created: '2021-02-19T12:47:07.838Z' },
          { id: 3, name: 'Untitled', created: '2021-03-19T12:47:07.838Z' },
        ],
      },
    }
  );

  // GET /api/project/1
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/project/1',
      headers: authHeaders,
    },
    {
      body: {
        id: 1,
        name: 'Untitled',
        model_id: 1,
        mosaic: 'naip.latest',
        created: '2021-03-19T12:47:07.838Z',
      },
    }
  );
});
