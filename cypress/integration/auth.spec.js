const {
  restApiEndpoint,
} = require('../../app/assets/scripts/config/testing').default;

describe('The app header', () => {
  beforeEach(() => {
    cy.startServer();
    cy.fakeLogin();
  });

  it('shows the account button when logged in', () => {
    cy.visit('/');
    cy.get('body');
    cy.get('[data-cy=account-button]').should('exist');
    cy.get('[data-cy=login-button]').should('not.exist');
  });

  it('when a 401 request happens, sign out the user and show the log in button', () => {
    cy.intercept(
      {
        url: restApiEndpoint + '/api/*',
      },
      (req) => {
        req.reply(401, {
          status: 401,
          message: 'Authentication Required',
          messages: [],
        });
      }
    );

    cy.visit('/project/1');

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/');
    });

    cy.get('body');
    cy.get('[data-cy=account-button]').should('not.exist');
    cy.get('[data-cy=login-button]').should('exist');
  });
});
