/// <reference types="cypress" />

const { startMockWsServer } = require('./cypress-mock-websocket-server');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  startMockWsServer(config);
};
