const {
  restApiEndpoint,
} = require('../../../../app/assets/scripts/config/testing').default;

/**
 * Mock a project scenario: an instance is running with checkpoint 2 and AOI 2 applied.
 */
export default function () {
  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/batch',
      method: 'POST',
    },
    {
      id: 1,
      uid: 1,
      project_id: 1,
      created: 1630056802895,
      updated: 1630056802895,
      aoi: null,
      name: 'Wesley Heights',
      bounds: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.13016844644744, 38.88544827129372],
            [-77.04706107549731, 38.88544827129372],
            [-77.04706107549731, 38.974905373957455],
            [-77.13016844644744, 38.974905373957455],
            [-77.13016844644744, 38.88544827129372],
          ],
        ],
      },
      abort: false,
      completed: false,
      progress: 0,
      instance: 1,
    }
  ).as('postBatch');
}
