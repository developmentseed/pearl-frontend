// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    environment: 'testing',
    audience: 'http://localhost:2000',
    restApiEndpoint: 'http://localhost:2000',
    websocketEndpoint: 'ws://localhost:1999',
  },
};
