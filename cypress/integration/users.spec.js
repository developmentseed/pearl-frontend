const {
  restApiEndpoint,
} = require('../../app/assets/scripts/config/testing').default;
import { paginatedList } from '../support/commands/fake-rest/utils';

describe('The app header', () => {
  beforeEach(() => {
    cy.startServer();
  });

  it('shows the account button when logged in', () => {
    cy.fakeLogin();
    cy.visit('/');
    cy.get('body');
    cy.get('[data-cy=account-button]').should('exist').click();
    cy.get('[data-cy=manage-users-link]').should('not.exist');
  });

  it('admin user can see link and access Model admin page', () => {
    cy.fakeLogin('admin');
    cy.visit('/');
    cy.get('body');
    cy.get('[data-cy=account-button]').should('exist').click();

    cy.intercept(
      {
        url: restApiEndpoint + '/api/user/?*',
        method: 'GET',
      },
      paginatedList('users', (i) => ({
        id: i,
        username: `User ${i}`,
        email: `user${i}@localhost`,
        access: i % 3 === 0 ? 'admin' : 'user',
      }))
    ).as('fetchUsers');

    cy.get('[data-cy=manage-users-link]').should('exist').click();

    cy.wait('@fetchUsers');

    // Check available columns
    cy.get('th')
      .should('have.length', 4)
      .should('include.text', 'Id')
      .should('include.text', 'Username')
      .should('include.text', 'E-mail')
      .should('include.text', 'Admin');

    // Check if page is well-formed
    cy.get('tbody').find('tr').should('have.length', 10);
    cy.get('tbody tr:nth-child(1) td')
      .should('include.text', 'User 1')
      .should('include.text', 'user1@localhost');

    // Confirm admin status is populated
    cy.get('tbody tr:nth-child(1) td:nth-child(4) input').should(
      'not.be.checked'
    );
    cy.get('tbody tr:nth-child(3) td:nth-child(4) input').should('be.checked');

    // Check if next page works
    cy.get('[data-cy=next-page-button').click();
    cy.get('tbody').find('tr').should('have.length', 10);
    cy.get('tbody tr:nth-child(3) td')
      .should('include.text', 'User 13')
      .should('include.text', 'user13@localhost');
  });
});
