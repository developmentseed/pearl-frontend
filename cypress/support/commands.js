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
  const apiEndpoint = (route) => `http://localhost:2000/${route}`;
  cy.server();
  cy.route('GET', apiEndpoint('health'), 'fixture:server/health.json');
  cy.route('GET', apiEndpoint('api'), 'fixture:server/api.json');
  cy.route('GET', apiEndpoint('api/mosaic'), 'fixture:server/api/mosaic.json');
});
