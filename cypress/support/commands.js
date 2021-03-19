const {
  restApiEndpoint,
} = require('../../app/assets/scripts/config/testing').default;
const apiEndpoint = (route) => `${restApiEndpoint}/${route}`;

/**
 * Fake user login
 */
Cypress.Commands.add('fakeLogin', () => {
  window.localStorage.setItem(
    'auth0Cypress',
    JSON.stringify({
      access_token: 'fake_access_token',
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
  cy.intercept(apiEndpoint('health'), { fixture: 'server/health.json' });
  cy.intercept(apiEndpoint('api/mosaic'), {
    fixture: 'server/api/mosaic.json',
  });
  cy.intercept(apiEndpoint('api/model'), {
    fixture: 'server/api/model.json',
  });
  cy.intercept(apiEndpoint('api'), { fixture: 'server/api.json' });
});
