/// <reference types="cypress" />

const { startMockWsServer } = require('cypress-websocket-server');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  startMockWsServer(config);
};
