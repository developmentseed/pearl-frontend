import sortBy from 'lodash.sortby';

const restApiEndpoint = Cypress.config('restApiEndpoint');

export const interceptApiRoute = (path, method, response, alias) => {
  const url = `${restApiEndpoint}/api/${path}`;
  if (alias) {
    cy.intercept({ url, method }, response).as(alias);
  } else {
    cy.intercept({ url, method }, response);
  }
};

// Get key/values from query string
export const getQueryElement = (key, url) => {
  const tokens = (url.split('?')[1] || '').split('&');
  const keyValPair = tokens.find((t) => t.includes(key));
  if (keyValPair) {
    return keyValPair.split('=')[1];
  } else {
    return null;
  }
};

/**
 * Helper function to mock paginate request in cy.intercept();
 *
 * @param {function} mockItem A function to generate items in the list.
 *
 */
export const paginatedList = (itemName, mockItem) => (req) => {
  let total = 25;
  const page = getQueryElement('page', req.url) || 0;
  const limit = parseInt(getQueryElement('limit', req.url) || 10);

  // Create all projects
  let all = new Array(total).fill(null).map((_, i) => {
    return mockItem(i + 1);
  });

  // Apply sorting
  all = sortBy(all, (req.query && req.query.sort) || 'id');

  // Apply order
  if (req.query && req.query.order && req.query.order === 'asc') {
    all = all.reverse();
  }

  // Get page
  let items = [];
  for (let i = page * limit; i < Math.min(page * limit + limit, total); i++) {
    items.push(all[i]);
  }

  // Return response
  req.reply({
    total,
    [itemName]: items,
  });
};
