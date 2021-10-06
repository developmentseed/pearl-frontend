const {
  restApiEndpoint,
} = require('../../../../app/assets/scripts/config/testing').default;

export default function () {
  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/batch*',
      method: 'GET',
    },
    { total: 0, batch: [] }
  ).as('getBatchList');
}
