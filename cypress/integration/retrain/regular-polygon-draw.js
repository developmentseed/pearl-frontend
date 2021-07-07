describe('Regular Polygon Draw', () => {
  beforeEach(() => {
    cy.startServer();
  });

  it('successfully loads', () => {
    cy.fakeLogin();
    cy.mockRegularProject();
    cy.mockWebsocket([
      [
        {
          message: 'model#status',
          data: {
            is_aborting: false,
            processing: false,
            aoi: 631,
            checkpoint: 292,
          },
        },
      ],
      [
        {
          message: 'model#checkpoint#progress',
          data: { checkpoint: 292, processed: 0, total: 1 },
        },
        { message: 'model#checkpoint#complete', data: { checkpoint: 292 } },
      ],
    ]);

    cy.visit('/project/1');
  });
});
