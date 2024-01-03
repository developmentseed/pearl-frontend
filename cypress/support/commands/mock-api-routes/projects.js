import { interceptApiRoute } from './utils';

import projectIndex from './fixtures/project/index.json';
import project1Get from './fixtures/project/1/get.json';
import project1Post from './fixtures/project/1/post.json';
import project1Patch from './fixtures/project/1/patch.json';
import project1InstanceIndex from './fixtures/project/1/instance/index.json';
import project1Instance1 from './fixtures/project/1/instance/1.json';
import project1CheckpointIndex from './fixtures/project/1/checkpoint/index.json';
import project1Checkpoint1 from './fixtures/project/1/checkpoint/1.json';
import project1Checkpoint2 from './fixtures/project/1/checkpoint/2.json';
import project1Checkpoint3 from './fixtures/project/1/checkpoint/3.json';
import project1AoiIndex from './fixtures/project/1/aoi/index.json';
import project1Aoi1Get from './fixtures/project/1/aoi/1/get.json';
import project1Aoi1Post from './fixtures/project/1/aoi/1/post.json';
import project1Aoi2 from './fixtures/project/1/aoi/2/get.json';
import project1Aoi3 from './fixtures/project/1/aoi/3/get.json';

/**
 * Mock a project scenario: an instance is running with checkpoint 2 and AOI 2 applied.
 */
Cypress.Commands.add('mockProjectEndpoints', () => {
  interceptApiRoute('project', 'POST', project1Post, 'postProject');
  interceptApiRoute('project/1', 'GET', project1Get, 'getProject');
  interceptApiRoute(
    'project/?page=*&limit=20',
    'GET',
    projectIndex,
    'getProjects'
  );
  interceptApiRoute('project/1', 'PATCH', project1Patch, 'patchProjectName');
  interceptApiRoute('project/1/aoi', 'GET', project1AoiIndex, 'loadAois');
  interceptApiRoute('project/1/aoi', 'POST', project1Aoi1Post);
  interceptApiRoute('project/1/checkpoint', 'GET', project1CheckpointIndex);
  interceptApiRoute('project/1/instance', 'GET', project1InstanceIndex);
  interceptApiRoute('project/1/instance/1', 'GET', project1Instance1);
  interceptApiRoute('project/1/checkpoint/1', 'GET', project1Checkpoint1);
  interceptApiRoute(
    'project/1/checkpoint/2',
    'GET',
    project1Checkpoint2,
    'fetchCheckpoint2'
  );
  interceptApiRoute('project/1/checkpoint/3', 'GET', project1Checkpoint3);
  interceptApiRoute('project/1/aoi/1', 'GET', project1Aoi1Get);
  interceptApiRoute('project/1/aoi/2', 'GET', project1Aoi2, 'fetchAoi2');
  interceptApiRoute('project/1/aoi/3', 'GET', project1Aoi3);
  interceptApiRoute(
    'project/1',
    'DELETE',
    {
      statusCode: 200,
      body: {},
    },
    'deleteProject'
  );
});
