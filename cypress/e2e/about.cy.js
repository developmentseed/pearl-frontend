describe('The About Page', () => {
  it('successfully loads', () => {
    cy.mockCommonApiRoutes();
    cy.visit('/about');
    cy.get('body');
    cy.get('header');
  });
});
