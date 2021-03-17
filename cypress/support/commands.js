/**
 * Command login(username, password)
 */
Cypress.Commands.add('loginByAuth0Api', (username, password) => {
  cy.log(`Logging in as ${username}`);
  const client_id = Cypress.env('auth0_client_id');
  const audience = Cypress.env('auth0_audience');
  const scope = Cypress.env('auth0_scope');

  cy.request({
    method: 'POST',
    url: `https://${Cypress.env('auth0_domain')}/oauth/token`,
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
