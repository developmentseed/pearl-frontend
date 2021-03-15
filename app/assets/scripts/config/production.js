// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    environment: 'production',
    appTitle: 'MS LULC',
    appDescription: 'Microsoft Land Use/Land Classification project.',
    restApiEndpoint: 'https://api.lulc.ds.io',
    websocketEndpoint: 'ws://localhost:1999',
    auth0Domain: 'dev-y5qeoqlh.us.auth0.com',
    clientId: 'cnTAr7SyMGYu4qDLaw5rEGy4G0sn4Htn',
    audience: 'https://api.lulc.ds.io',
    bingApiKey:
      'ArLmu8JG2PHK_-_zo7yS1WbvDz7PgsoVEgcqFTg8uaH-lsXLcjADCAtnyQB054uq',
    tileUrlTemplate:
    'https://api.lulc.ds.io/api/mosaic/{LAYER_NAME}/tiles/{z}/{x}/{y}.png?bidx=1%2C2%2C3'
  },
};
