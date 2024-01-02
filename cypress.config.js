require('@babel/register')({
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
});

const { defineConfig } = require('cypress');
const appConfig = require('./app/assets/scripts/config').default;
const { startMockWsServer } = require('cypress-websocket-server');

module.exports = defineConfig({
  experimentalFetchPolyfill: true,
  chromeWebSecurity: false,
  defaultCommandTimeout: 7000,
  video: false,
  e2e: {
    baseUrl: 'http://localhost:9000/',
    excludeSpecPattern: [
      '**/gpu.cy.js',
      '**/stress-live-api.cy.js',
      '**/keyboard-shortcuts.cy.js',
      '**/layers-panel.cy.js',
      '**/panel.cy.js',
      '**/retrain.cy.js',
      '**/sec-panel.cy.js',
      '**/aois.cy.js',
      '**/new.cy.js',
    ],
    setupNodeEvents(on, cypressConfig) {
      startMockWsServer(cypressConfig);

      // Pass app config to Cypress tests
      return {
        ...cypressConfig,
        restApiEndpoint: appConfig.restApiEndpoint,
        apiToken: appConfig.apiToken,
      };
    },
  },
});
