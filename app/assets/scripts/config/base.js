// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    reduxeedLogs: false,
    appTitle: 'PEARL',
    appLongTitle: 'Planetary Computer Land Cover Mapping',
    appDescription:
      'Microsoft Planetary Computer Land Use/Land Classification Mapping tool',
    restApiEndpoint: 'https://api.lulc-staging.ds.io',
    websocketEndpoint: 'wss://socket.lulc-staging.ds.io',
    websocketPingPongInterval: 3000,
    stacCatalogEndpoint: 'https://planetarycomputer.microsoft.com/api/data/v1/',
    auth0Domain: 'pearl-landcover-staging.us.auth0.com',
    auth0ClientId: 'BTwFngSNG0pz1nNXsOFtfN0TUAtPENLu',
    minSampleCount: 1,
    bingApiKey:
      'ArLmu8JG2PHK_-_zo7yS1WbvDz7PgsoVEgcqFTg8uaH-lsXLcjADCAtnyQB054uq',
    bingSearchUrl: 'https://dev.virtualearth.net/REST/v1',
    reverseGeocodeRadius: 1,
    tileUrlTemplate:
      'https://planetarycomputer.microsoft.com/api/data/v1/mosaic/tiles/87b72c66331e136e088004fba817e3e8/{z}/{x}/{y}?asset_bidx=image|1%2C2%2C3&assets=image&collection=naip',
    appInsightsKey: '07b5adb4-0447-4c6f-881a-a23e108bc861',
    instanceCreationTimeout: 10 * 60 * 60 * 1000,
    instanceCreationCheckInterval: 5000,
    minimumAoiArea: 1000000,
    mapboxAccessToken:
      'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJjbGdtajZjMXgwNjczM3JvZTg4bm42bjNtIn0.MJclBE_ARI264ZaotMoEjw',
  },
};
