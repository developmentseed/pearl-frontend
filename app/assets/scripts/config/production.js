// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    environment: 'production',
    appTitle: 'MS LULC',
    appDescription: 'Microsoft Land Use/Land Classification project.',
    restApiEndpoint: 'https://api.lulc.ds.io',
    websocketEndpoint: 'wss://socket.lulc.ds.io',
    auth0Domain: 'dev-y5qeoqlh.us.auth0.com',
    clientId: 'cnTAr7SyMGYu4qDLaw5rEGy4G0sn4Htn',
    audience: 'https://api.lulc.ds.io',
    minSampleCount: 2,
    bingApiKey:
      'ArLmu8JG2PHK_-_zo7yS1WbvDz7PgsoVEgcqFTg8uaH-lsXLcjADCAtnyQB054uq',
    tileUrlTemplate:
      'https://tiles.lulc.ds.io/mosaic/{LAYER_NAME}/tiles/{z}/{x}/{y}.png?bidx=1%2C2%2C3',
  },
};
