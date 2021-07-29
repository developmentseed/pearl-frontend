describe('The About Page', () => {
  it('successfully loads', () => {
    cy.startServer();
    cy.visit('/about');
    cy.get('body');
    cy.get('header');
  });
});
