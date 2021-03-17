/**
 * Command login(username, password)
 */
Cypress.Commands.add('loginByAuth0Api', (username, password) => {
  cy.log(`Logging in as ${username}`);
  const client_id = Cypress.env('AUTH0_CLIENT_ID');
  const audience = Cypress.env('AUTH0_AUDIENCE');
  const scope = Cypress.env('AUTH0_SCORE');

  cy.request({
    method: 'POST',
    url: `https://${Cypress.env('AUTH0_DOMAIN')}/oauth/token`,
    body: {
      grant_type: 'password',
      username,
      password,
      audience,
      scope,
      client_id,
    },
  }).then(({ body: { access_token, expires_in, id_token } }) => {
    const auth0Cypress = {
      user: JSON.parse(
        Buffer.from(id_token.split('.')[1], 'base64').toString('ascii')
      ),
      access_token,
      expires_in,
    };

    window.localStorage.setItem('auth0Cypress', JSON.stringify(auth0Cypress));
  });
});
