/// <reference types="cypress" />

// Use babel to enable import/export statements, used in config.js
require('@babel/register')({
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
});

const appConfig = require('../../app/assets/scripts/config').default;

const { startMockWsServer } = require('cypress-websocket-server');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, cypressConfig) => {
  startMockWsServer(cypressConfig);

  // Pass app config to Cypress tests
  return {
    ...cypressConfig,
    restApiEndpoint: appConfig.restApiEndpoint,
    apiToken: appConfig.apiToken,
  };
};
