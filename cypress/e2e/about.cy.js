describe('The About Page', () => {
  it('successfully loads', () => {
    cy.mockApiRoutes();
    cy.visit('/about');
    cy.get('body');
    cy.get('header');
  });
});
