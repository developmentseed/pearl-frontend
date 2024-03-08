import { sortBy } from 'lodash';
import { getQueryElement } from '../../support/commands/mock-api-routes/utils';
const format = require('date-fns/format').default;

const restApiEndpoint = Cypress.config('restApiEndpoint');

describe('Batch predictions', () => {
  beforeEach(() => {
    cy.mockCommonApiRoutes();
    cy.mockModelApiRoutes();
    cy.mockProjectEndpoints();

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
          aoi: { id: i, name: `AOI ${i}` },
          mosaic: { id: i, name: `Mosaic ${i}` },
          abort: false,
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
        aoi: {
          id: 1,
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

  it('on new project, show different button large on large AOI', () => {
    cy.fakeLogin();

    cy.visit('/project/new');

    cy.get('[data-cy=project-name-modal]').should('be.visible');
    cy.get('[data-cy=new-project-name-modal-input]')
      .should('be.focused')
      .type('Project name');
    cy.get('[data-cy=create-project-button]').click();

    // Set AOI
    cy.get('[data-cy=draw-first-aoi-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 400, 400)
      .trigger('mouseup');

    cy.get('[data-cy=proceed-anyway-button]').should('exist').click();
    cy.wait('@reverseGeocodeCity');

    // Select imagery source
    cy.get('[data-cy=imagery-selector-label]').should('exist').click();
    cy.get('[data-cy=select-imagery-2-card]').should('exist').click();

    cy.get('[data-cy=imagery-selector-label]').should(
      'have.text',
      'Sentinel-2'
    );

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Select Mosaic'
    );

    // Select mosaic
    cy.get('[data-cy=mosaic-selector-label]').should('exist').click();

    cy.wait('@registerPlanetaryComputerMosaic');

    cy.get('[data-cy="create-mosaic-button"]')
      .should('exist')
      .should('be.visible')
      .click();

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Select Model'
    );

    // Open the Model selection modal
    cy.get('[data-cy=select-model-label]').should('exist').click();

    // Finally select a model
    cy.get('[data-cy=select-model-2-card]').should('exist').click();

    // No batch message should be displayed
    cy.get('[data-cy=batch-progress-message').should('not.exist');

    // Request batch prediction run
    cy.get('[data-cy=prime-button]')
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
            id: 1,
            created: 1630056802895,
            updated: 1630056976364,
            aoi: 1,
            name: 'Wesley Heights',
            abort: false,
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
      aoi: {
        id: 1,
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
      'Starting batch prediction...'
    );

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

    // TODO fix label and disable state
    // // Concurrent batch runs are not allowed
    // cy.get('[data-cy=prime-button]').should(
    //   'have.attr',
    //   'data-disabled',
    //   'true'
    // );

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
      .should('include.text', 'Wesley Heights')
      .should('include.text', 'Abort job');

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
        aoi: 1,
        progress: 100,
        completed: true,
      }
    );

    // New runs are allowed
    cy.get('[data-cy=prime-button]').should(
      'have.attr',
      'data-disabled',
      'false'
    );

    cy.get('[data-cy=batch-progress-message').should('not.exist');

    // TODO secondary panel was disabled and need to be reinstated
    // // Check if sec panel is mounted with a pixel distro chart
    // cy.get('[data-cy=checkpoint_class_distro]').should('exist');
    // cy.get('[data-cy=batch-progress-message').should('not.exist');
    // cy.get('[data-cy=add-aoi-button]').should('exist').click();
    // cy.get('[data-cy=checkpoint_class_distro]').should('not.exist');
  });

  // TODO Edit AOI and retrain are not enabled. The following test should be
  // reinstated when they are.
  // it('Inference and retrain can happen during batch', () => {
  // const instance = {
  //   id: 1,
  //   project_id: 1,
  //   aoi_id: 2088,
  //   checkpoint_id: 2,
  //   last_update: '2021-07-12T09:59:04.442Z',
  //   created: '2021-07-12T09:58:57.459Z',
  //   active: true,
  //   token: 'app_client',
  //   status: {
  //     phase: 'Running',
  //   },
  // };
  //   cy.mockCommonApiRoutes();
  //   /**
  //    * GET /project/:id/instance/:id
  //    */
  //   cy.intercept(
  //     {
  //       url: restApiEndpoint + '/api/project/1/instance/1',
  //     },
  //     instance
  //   );

  //   cy.intercept(
  //     {
  //       url: restApiEndpoint + '/api/project/1/aoi',
  //     },
  //     {
  //       fixture: 'aois-with-batch.json',
  //     }
  //   ).as('loadAoisWithBatch');
  //   cy.intercept(
  //     {
  //       url: restApiEndpoint + '/api/project/1/aoi/2088',
  //     },
  //     {
  //       fixture: 'aoi-2088.json',
  //     }
  //   ).as('batchAoi');

  //   cy.fakeLogin();

  //   cy.visit('/project/1');
  //   cy.wait('@loadAoisWithBatch');
  //   cy.wait(['@batchAoi', '@fetchCheckpoint2']);

  //   cy.get('[data-cy=predict-tab]').click();
  //   // Edit AOI to treat as new one
  //   cy.get('[data-cy=aoi-edit-button]').should('exist').click();
  //   cy.get('[data-cy=aoi-edit-confirm-button]').should('exist').click();

  //   cy.get('[data-cy=proceed-anyway-button]').should('exist').click();
  //   cy.wait('@reverseGeocodeCity');

  //   // Ready to Run Batch Prediction
  //   cy.get('[data-cy=prime-button]').should(
  //     'have.text',
  //     'Run Batch Prediction'
  //   );

  //   // Mock batch list
  //   cy.intercept(
  //     {
  //       url: restApiEndpoint + '/api/project/1/batch*',
  //       method: 'GET',
  //     },
  //     {
  //       total: 1,
  //       batch: [
  //         {
  //           id: 1,
  //           created: 1630056802895,
  //           updated: 1630056976364,
  //           aoi: 1,
  //           name: 'Wesley Heights',
  //           abort: false,
  //           completed: false,
  //           progress: 0,
  //         },
  //       ],
  //     }
  //   ).as('batchList1');

  //   // Mock batch job
  //   const batchJob = {
  //     id: 1,
  //     uid: 1,
  //     project_id: 1,
  //     created: 1630056802895,
  //     updated: 1630056802895,
  //     aoi: null,
  //     name: 'Wesley Heights',
  //     bounds: {
  //       type: 'Polygon',
  //       coordinates: [
  //         [
  //           [-77.13016844644744, 38.88544827129372],
  //           [-77.04706107549731, 38.88544827129372],
  //           [-77.04706107549731, 38.974905373957455],
  //           [-77.13016844644744, 38.974905373957455],
  //           [-77.13016844644744, 38.88544827129372],
  //         ],
  //       ],
  //     },
  //     abort: false,
  //     completed: false,
  //     progress: 0,
  //     instance: 1,
  //   };

  //   // Mock batch start
  //   cy.intercept(
  //     {
  //       url: restApiEndpoint + '/api/project/1/batch/1',
  //       method: 'GET',
  //     },
  //     batchJob
  //   ).as('batch0');

  //   // Run job
  //   cy.get('[data-cy=prime-button]').click();

  //   // Wait for requests executed on batch prediction start
  //   cy.wait('@postBatch');
  //   cy.wait('@batchList1');
  //   cy.wait('@batch0');

  //   // Update progress in batch request mock
  //   cy.intercept(
  //     {
  //       url: restApiEndpoint + '/api/project/1/batch/1',
  //       method: 'GET',
  //     },
  //     {
  //       ...batchJob,
  //       progress: 10,
  //     }
  //   ).as('batch10');
  //   cy.wait('@batch10');

  //   // Only one batch operation allowed at a time
  //   cy.get('[data-cy=prime-button]').should(
  //     'have.attr',
  //     'data-disabled',
  //     'true'
  //   );

  //   cy.get('[data-cy=add-aoi-button]').should('exist').click();

  //   cy.get('#map')
  //     .trigger('mousedown', 150, 150)
  //     .trigger('mousemove', 400, 400)
  //     .trigger('mouseup');
  //   cy.get('[data-cy=proceed-anyway-button]').should('exist').click();
  //   cy.wait('@reverseGeocodeCity');

  //   // Should be able to run inference on non batch AOI
  //   cy.get('.listed-aoi').contains('Rockville').click();
  //   cy.get('[data-cy=confirm-clear-aoi]').should('exist').click();
  //   cy.get('[data-cy=prime-button]').should(
  //     'have.attr',
  //     'data-disabled',
  //     'false'
  //   );
  // });

  it('in project page, display completed and running batch jobs', () => {
    cy.fakeLogin();

    cy.visit('/profile/projects/1');

    cy.wait('@getBatchList');

    // Check available columns
    cy.get('th')
      .should('have.length', 7)
      .should('include.text', 'Id')
      .should('include.text', 'AOI Name')
      .should('include.text', 'AOI Size (KM2)')
      .should('include.text', 'Started')
      .should('include.text', 'Mosaic')
      .should('include.text', 'Status')
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

  it('project profile page lists different statuses', () => {
    cy.fakeLogin();

    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/batch*',
        method: 'GET',
      },
      {
        total: 3,
        batch: [
          {
            id: 1,
            created: 1630056802895,
            updated: 1630056976364,
            aoi: 1,
            name: 'Wesley Heights',
            abort: false,
            completed: false,
            progress: 8,
          },
          {
            id: 2,
            created: 1630056802895,
            updated: 1630056976364,
            aoi: 1,
            name: 'Wesley Heights',
            abort: true,
            completed: false,
            progress: 0,
          },
          {
            id: 3,
            created: 1630056802895,
            updated: 1630056976364,
            aoi: 1,
            name: 'Wesley Heights',
            abort: false,
            completed: true,
            progress: 100,
          },
        ],
      }
    ).as('batchList2');

    cy.visit('/profile/projects/1');
    cy.wait('@batchList2');
    cy.get('tbody').find('tr').should('have.length', 3);
    // check statuses
    cy.get('tbody tr:nth-child(1) td').should('include.text', 'In Progress');
    cy.get('tbody tr:nth-child(2) td').should('include.text', 'Aborted');
    cy.get('tbody tr:nth-child(3) td').should('include.text', 'Completed');
    // abort job
    cy.get('[data-cy=abort-batch-job-btn]').should('exist').click();
    // check if the status is updated
    cy.get('tbody tr:nth-child(1) td').should('include.text', 'Aborted');
  });

  it('Abort batch job from the project page', () => {
    cy.fakeLogin();

    cy.visit('/project/new');

    cy.get('[data-cy=project-name-modal]').should('be.visible');
    cy.get('[data-cy=new-project-name-modal-input]')
      .should('be.focused')
      .type('Project name');
    cy.get('[data-cy=create-project-button]').click();

    // Set AOI
    cy.get('[data-cy=draw-first-aoi-button]').click();
    cy.get('#map')
      .trigger('mousedown', 150, 150)
      .trigger('mousemove', 400, 400)
      .trigger('mouseup');

    cy.get('[data-cy=proceed-anyway-button]').should('exist').click();
    cy.wait('@reverseGeocodeCity');

    // Select imagery source
    cy.get('[data-cy=imagery-selector-label]').should('exist').click();
    cy.get('[data-cy=select-imagery-2-card]').should('exist').click();

    cy.get('[data-cy=imagery-selector-label]').should(
      'have.text',
      'Sentinel-2'
    );

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Select Mosaic'
    );

    // Select mosaic
    cy.get('[data-cy=mosaic-selector-label]').should('exist').click();

    cy.wait('@registerPlanetaryComputerMosaic');

    cy.get('[data-cy="create-mosaic-button"]')
      .should('exist')
      .should('be.visible')
      .click();

    // Check session status message
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Select Model'
    );

    // Open the Model selection modal
    cy.get('[data-cy=select-model-label]').should('exist').click();

    // Finally select a model
    cy.get('[data-cy=select-model-2-card]').should('exist').click();

    // No batch message should be displayed
    cy.get('[data-cy=batch-progress-message').should('not.exist');

    // Request model run
    cy.get('[data-cy=prime-button]')
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
            id: 1,
            created: 1630056802895,
            updated: 1630056976364,
            aoi: 1,
            name: 'Wesley Heights',
            abort: false,
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
      aoi: {
        id: 1,
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

    // Open progress modal
    cy.get('[data-cy=batch-progress-message')
      .should('include.text', 'Starting batch prediction...')
      .click();
    // abort btn is disabled as the progress is 0% yet
    cy.get('[data-cy=abort-batch-job-btn]')
      .should('exist')
      .should('be.disabled');

    // update progress to 1%
    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/batch/1',
        method: 'GET',
      },
      { ...batchJob, progress: 1 }
    );
    // click in the abort job button
    cy.get('[data-cy=abort-batch-job-btn]')
      .should('exist')
      .should('not.be.disabled')
      .click();

    cy.intercept(
      {
        url: restApiEndpoint + '/api/project/1/batch/1',
        method: 'GET',
      },
      { ...batchJob, abort: true }
    );

    // Confirm modal is closed
    cy.get('[data-cy=batch-progress-modal-content]').should('not.exist');
    // confirm progress message is hidden
    cy.get('[data-cy=batch-progress-message').should('not.exist');
    cy.get('[data-cy=session-status]').should(
      'have.text',
      'Session Status: Ready for prediction run'
    );
    cy.get('[data-cy=prime-button]')
      .should('exist')
      .should('not.be.disabled')
      .should('have.text', 'Run Batch Prediction');
  });
});
