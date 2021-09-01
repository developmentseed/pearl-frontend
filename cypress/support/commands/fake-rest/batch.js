import sortBy from 'lodash.sortby';
import { getQueryElement } from './utils';

const {
  restApiEndpoint,
} = require('../../../../app/assets/scripts/config/testing').default;

const paginatedBatchList = (req) => {
  let total = 25;
  const page = getQueryElement('page', req.url) || 0;
  const limit = parseInt(getQueryElement('limit', req.url) || 10);

  function fakeItem(i) {
    return {
      id: i,
      uid: 1,
      project_id: 1,
      created: new Date(Date.parse('2001-02-01')).setUTCDate(-i),
      updated: new Date(Date.parse('2001-02-01')).setUTCDate(i + 1),
      aoi: i,
      name: `AOI ${i}`,
      aborted: false,
      completed: i !== 1,
      progress: i === 1 ? 60 : 100,
      instance: 1,
    };
  }

  // Create all projects
  let all = new Array(total).fill(null).map((_, i) => {
    return fakeItem(i + 1);
  });

  // Apply sorting
  all = sortBy(all, (req.query && req.query.sort) || 'id');

  // Apply order
  if (req.query && req.query.order && req.query.order === 'asc') {
    all = all.reverse();
  }

  // Get page
  let batch = [];
  for (let i = page * limit; i < Math.min(page * limit + limit, total); i++) {
    batch.push(all[i]);
  }

  // Return response
  req.reply({
    total,
    batch,
  });
};

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

  cy.intercept(
    {
      url: restApiEndpoint + '/api/project/1/batch*',
      method: 'GET',
    },
    paginatedBatchList
  ).as('getBatchList');
}
