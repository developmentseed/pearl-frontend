// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    environment: 'testing',
    restApiEndpoint: 'http://localhost:2000',
    websocketEndpoint: 'ws://localhost:1999',
    auth0Domain: 'lulc-test.auth0.com',
    instanceCreationTimeout: 5000,
    instanceCreationCheckInterval: 500,
  },
};
