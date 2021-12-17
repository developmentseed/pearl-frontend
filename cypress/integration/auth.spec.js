const {
  restApiEndpoint,
} = require('../../app/assets/scripts/config/testing').default;

describe('The app header', () => {
  beforeEach(() => {
    cy.startServer();
  });

  it('shows the account button when logged in', () => {
    cy.fakeLogin();
    cy.visit('/');
    cy.get('body');
    cy.get('[data-cy=account-button]').should('exist');
    cy.get('[data-cy=login-button]').should('not.exist');
  });

  it('admin user can see link and access Model admin page', () => {
    cy.fakeLogin('admin');
    cy.visit('/');
    cy.get('body');
    cy.get('[data-cy=account-button]').should('exist').click();
    cy.get('[data-cy=manage-models-link]').should('exist').click();
    cy.get('body').should('contain', 'Models');
  });

  it('normal user does not see the Manage models link', () => {
    cy.fakeLogin();
    cy.visit('/');
    cy.get('body');
    cy.get('[data-cy=account-button]').should('exist').click();
    cy.get('[data-cy=manage-models-link]').should('not.exist');
  });

  it('invalid route displays uhoh page', () => {
    cy.visit('/invalid-route');
    cy.get('body').should('contain', 'Page not found.');
  });

  it('/project/new is protected', () => {
    cy.visit('/project/new');
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/');
    });
    cy.get('#a-toast').should('contain', 'Please sign in to view this page.');
  });

  it('/project/:id is protected', () => {
    cy.visit('/project/1');
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/');
    });
    cy.get('#a-toast').should('contain', 'Please sign in to view this page.');
  });

  it('/profile/maps is protected', () => {
    cy.visit('/profile/maps');
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/');
    });
    cy.get('#a-toast').should('contain', 'Please sign in to view this page.');
  });

  it('/profile/projects is protected', () => {
    cy.visit('/profile/projects');
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/');
    });
    cy.get('#a-toast').should('contain', 'Please sign in to view this page.');
  });

  it('/profile/projects/:id is protected', () => {
    cy.visit('/profile/projects/:1');
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/');
    });
    cy.get('#a-toast').should('contain', 'Please sign in to view this page.');
  });

  it('when a generic 401 status happens, redirect to login', () => {
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
    cy.get('#a-toast').should('contain', 'Please sign in to view this page.');
  });
});
