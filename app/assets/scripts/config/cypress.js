// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    environment: 'cypress',
    restApiEndpoint: 'http://localhost:2000',
    websocketEndpoint: 'ws://localhost:1999',
    instanceCreationTimeout: 5000,
    instanceCreationCheckInterval: 500,
    minimumAoiArea: 40000,
  },
};
