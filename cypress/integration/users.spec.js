const restApiEndpoint = Cypress.config('restApiEndpoint');

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
      .should('include.text', 'Username')
      .should('include.text', 'E-mail')
      .should('include.text', 'Admin')
      .should('include.text', 'GPU Allowed');

    // Check if page is well-formed
    cy.get('tbody').find('tr').should('have.length', 15);
    cy.get('tbody tr:nth-child(1) td')
      .should('include.text', 'User 1')
      .should('include.text', 'user1@localhost');

    // Confirm admin status is populated
    cy.get('tbody tr:nth-child(1) td:nth-child(3) input').should(
      'not.be.checked'
    );
    cy.get('tbody tr:nth-child(4) td:nth-child(3) input').should('be.checked');

    // Capture patch on user 25
    cy.intercept(
      {
        url: restApiEndpoint + '/api/user/25',
        method: 'PATCH',
      },
      { status: 200 }
    ).as('patchUser25');

    // Check if next page works
    cy.get('[data-cy=next-page-button').click();
    cy.get('tbody').find('tr').should('have.length', 10);

    // Check if user 25 exist and is not an admin
    cy.get('tbody tr:nth-child(3) td')
      .should('include.text', 'User 25')
      .should('include.text', 'user25@localhost')
      .find('input')
      .should('not.be.checked');

    // Make user 25 to be an admin on new paginated requests
    cy.intercept(
      {
        url: restApiEndpoint + '/api/user/?*',
        method: 'GET',
      },
      paginatedList('users', (i) => ({
        id: i,
        username: `User ${i}`,
        email: `user${i}@localhost`,
        access: i % 3 === 0 || i === 25 ? 'admin' : 'user',
        flags: {
          gpu: false,
        },
      }))
    ).as('fetchUsers');

    // Click admin switch
    cy.get('tbody tr:nth-child(3) td input').first().click({ force: true });

    cy.wait('@patchUser25')
      .its('request.body')
      .should(($body) => expect($body).to.deep.eq({ access: 'admin' }));

    cy.wait('@fetchUsers');

    cy.get('tbody tr:nth-child(3) td:nth-child(3) input').should('be.checked');

    cy.intercept(
      {
        url: restApiEndpoint + '/api/user/?*',
        method: 'GET',
      },
      paginatedList('users', (i) => ({
        id: i,
        username: `User ${i}`,
        email: `user${i}@localhost`,
        access: i % 3 === 0 || i === 25 ? 'admin' : 'user',
        flags: {
          gpu: i === 25,
        },
      }))
    ).as('fetchUsers');

    cy.get('tbody tr:nth-child(3) td:nth-child(4) input')
      .should('not.be.checked')
      .click({ force: true });

    cy.wait('@patchUser25')
      .its('request.body')
      .should(($body) => expect($body).to.deep.eq({ flags: { gpu: true } }));

    cy.get('tbody tr:nth-child(3) input').should('be.checked');
    // cy.get('tbody tr:nth-child(3) td:nth-child(4) input').should('be.checked');
  });
});
