describe('Login', function () {
  beforeEach(function () {
    cy.loginByAuth0Api(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password')
    );
  });

  it('Shows homepage', function () {
    cy.visit('/');
  });
});
