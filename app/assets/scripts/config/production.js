// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    environment: 'production',
    appTitle: 'MS LULC',
    appDescription: 'Microsoft Land Use/Land Classification project.',
    restApiEndpoint: 'https://api.lulc.ds.io',
    websocketEndpoint: 'ws://localhost:1999',
  },
};
