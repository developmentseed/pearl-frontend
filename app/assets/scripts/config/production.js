// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    environment: 'production',
    wdyrLogs: false,
    reduxeedLogs: false,
    appTitle: 'PEARL',
    appLongTitle: 'Planetary Computer Land Cover Mapping',
    appDescription:
      'Microsoft Planetary Computer Land Use/Land Classification Mapping tool',
    restApiEndpoint: 'https://api.lulc.ds.io',
    websocketEndpoint: 'wss://socket.lulc.ds.io',
    websocketPingPongInterval: 3000,
    auth0Domain: 'dev-y5qeoqlh.us.auth0.com',
    clientId: 'cnTAr7SyMGYu4qDLaw5rEGy4G0sn4Htn',
    minSampleCount: 1,
    bingApiKey:
      'ArLmu8JG2PHK_-_zo7yS1WbvDz7PgsoVEgcqFTg8uaH-lsXLcjADCAtnyQB054uq',
    bingSearchUrl: 'https://dev.virtualearth.net/REST/v1',
    reverseGeocodeRadius: 1,
    tileUrlTemplate:
      'https://tiles.lulc.ds.io/mosaic/{LAYER_NAME}/tiles/{z}/{x}/{y}?bidx=1%2C2%2C3',
    appInsightsKey: '0291f153-9634-463e-8aa0-34700141d37c',
  },
};
