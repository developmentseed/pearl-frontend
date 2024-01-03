import { interceptApiRoute } from './utils';

import modelIndex from './fixtures/model/index.json';
import model1 from './fixtures/model/1.json';
import model2 from './fixtures/model/2.json';

Cypress.Commands.add('mockModelApiRoutes', () => {
  interceptApiRoute('model', 'GET', modelIndex);
  interceptApiRoute('model/1', 'GET', model1);
  interceptApiRoute('model/2', 'GET', model2);
});
