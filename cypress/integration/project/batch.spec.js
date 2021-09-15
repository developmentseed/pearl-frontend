import { sortBy } from 'lodash';
import { getQueryElement } from '../../support/commands/fake-rest/utils';
const format = require('date-fns/format').default;

const {
  restApiEndpoint,
} = require('../../../app/assets/scripts/config/testing').default;

describe('Batch predictions', () => {
  beforeEach(() => {
    cy.startServer();

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
      for (
        let i = page * limit;
        i < Math.min(page * limit + limit, total);
        i++
      ) {
        batch.push(all[i]);
      }

      // Return response
      req.reply({
        total,
        batch,
      });
    };

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
  });

  it('on new project, show different button large on large aoi', () => {
    cy.fakeLogin();

    cy.visit('/project/new');

    cy.get('[data-cy=project-name-modal]').should('be.visible');
    cy.get('[data-cy=modal-project-input]').clear().type('Project name');
    cy.get('[data-cy=create-project-button]').click();

    // Set AOI
    cy.get('[data-cy=aoi-edit-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 400, 400)
      .trigger('mouseup');

    cy.get('[data-cy=proceed-anyway-button]').should('exist').click();
    cy.wait('@reverseGeocodeCity');

    // Set model
    cy.get('[data-cy=select-model-label]').should('exist').click();
    cy.get('[data-cy=select-model-1-card]').should('exist').click();

    // No batch message should be displayed
    cy.get('[data-cy=batch-progress-message').should('not.exist');

    // Request model run
    cy.get('[data-cy=run-button')
      .should('have.text', 'Run Batch Prediction')
      .click();

    // Mock batch job at 0%
    cy.intercept(
      {
        url: restApiEndpoint + `/api/project/1/batch?completed=false`,
      },
      {
        total: 1,
        batch: [
          {
            count: 1,
            id: 1,
            abort: false,
            created: 1630056802895,
            updated: 1630056976364,
            aoi: 1,
            name: 'Wesley Heights',
            completed: false,
            progress: 0,
          },
        ],
      }
    );

    const batchJob = {
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
    };

    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/batch/1',
        method: 'GET',
      },
      batchJob
    );

    // Batch message should be displayed
    cy.get('[data-cy=batch-progress-message').should(
      'include.text',
      'Batch prediction in progress: 0%'
    );

    cy.get('[data-cy=run-button').should('have.attr', 'data-disabled', 'true');

    // Make batch job at 10%
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/batch/1',
        method: 'GET',
      },
      {
        ...batchJob,
        progress: 10,
      }
    );

    cy.get('[data-cy=batch-progress-message').should(
      'include.text',
      'Batch prediction in progress: 10%'
    );

    // Make batch job at 20%
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/batch/1',
        method: 'GET',
      },
      {
        ...batchJob,
        progress: 20,
      }
    );

    cy.get('[data-cy=batch-progress-message')
      .should('include.text', 'Batch prediction in progress: 20%')
      .click();

    // Modal is open and include AOI details
    cy.get('[data-cy=batch-progress-modal-content]')
      .should(
        'include.text',
        `${format(batchJob.created, 'dd/MM/yyyy kk:mm:ss')}`
      )
      .should('include.text', '71.67')
      .should('include.text', 'Wesley Heights');

    // Close modal
    cy.get('#batch-prediction-progress-modal')
      .find('button')
      .first()
      .should('exist')
      .click();

    // Confirm modal is hidden
    cy.get('[data-cy=batch-progress-modal-content]').should('not.exist');

    // Make batch job complete
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/batch/1',
        method: 'GET',
      },
      {
        ...batchJob,
        progress: 100,
        completed: true,
      }
    );

    // New runs are allowed
    cy.get('[data-cy=run-button').should('have.attr', 'data-disabled', 'false');
    cy.get('[data-cy=batch-progress-message').should('not.exist');
  });

  it('in project page, display completed and running batch jobs', () => {
    cy.fakeLogin();

    cy.visit('/profile/projects/1');

    cy.wait('@getBatchList');

    // Check available columns
    cy.get('th')
      .should('have.length', 5)
      .should('include.text', 'Id')
      .should('include.text', 'AOI Name')
      .should('include.text', 'Status')
      .should('include.text', 'Started')
      .should('include.text', 'Download');

    // Check if page is well-formed
    cy.get('tbody').find('tr').should('have.length', 5);
    cy.get('tbody tr:nth-child(1) td')
      .should('include.text', 'AOI 1')
      .should('include.text', 'In Progress (60%)');

    // Check if next page works
    cy.get('[data-cy=next-page-button').click();
    cy.get('tbody').find('tr').should('have.length', 5);
    cy.get('tbody tr:nth-child(3) td').should('include.text', 'AOI 8');

    // Check if page button works
    cy.get('[data-cy=page-4-button').click();
    cy.get('tbody').find('tr').should('have.length', 5);
    cy.get('tbody tr:nth-child(3) td').should('include.text', 'AOI 18');
  });
});
