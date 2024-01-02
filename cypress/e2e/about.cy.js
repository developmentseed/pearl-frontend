describe('The About Page', () => {
  it('successfully loads', () => {
    cy.mockCommonApiEndpoints();
    cy.visit('/about');
    cy.get('body');
    cy.get('header');
  });
});
