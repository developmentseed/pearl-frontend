// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    wdyrLogs: false,
    reduxeedLogs: false,
    appTitle: 'PEARL',
    appLongTitle: 'Planetary Computer Land Cover Mapping',
    appDescription:
      'Microsoft Planetary Computer Land Use/Land Classification Mapping tool',
    restApiEndpoint: 'https://api.lulc-staging.ds.io',
    websocketEndpoint: 'wss://socket.lulc-staging.ds.io',

    websocketPingPongInterval: 3000,
    auth0Domain: 'pearl-landcover-staging.us.auth0.com',
    auth0ClientId: 'BTwFngSNG0pz1nNXsOFtfN0TUAtPENLu',
    minSampleCount: 1,
    bingApiKey:
      'ArLmu8JG2PHK_-_zo7yS1WbvDz7PgsoVEgcqFTg8uaH-lsXLcjADCAtnyQB054uq',
    bingSearchUrl: 'https://dev.virtualearth.net/REST/v1',
    reverseGeocodeRadius: 1,
    tileUrlTemplate:
      'https://tiles.lulc-staging.ds.io/mosaic/{LAYER_NAME}/tiles/{z}/{x}/{y}?bidx=1%2C2%2C3',
    appInsightsKey: '07b5adb4-0447-4c6f-881a-a23e108bc861',
    instanceCreationTimeout: 30000,
    instanceCreationCheckInterval: 5000,
  },
};
