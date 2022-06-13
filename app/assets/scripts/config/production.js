// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    environment: 'production',
    restApiEndpoint: 'https://api.lulc.ds.io',
    websocketEndpoint: 'wss://socket.lulc.ds.io',
    auth0Domain: 'pearl-landcover.us.auth0.com',
    auth0ClientId: 'OQtYR72fGdgrogeokjr9CBl4vg1P6SYP',
    tileUrlTemplate: 'https://planetarycomputer.microsoft.com/api/data/v1/mosaic/tiles/87b72c66331e136e088004fba817e3e8/{z}/{x}/{y}?asset_bidx=image|1%2C2%2C3&assets=image&collection=naip',
    appInsightsKey: '0291f153-9634-463e-8aa0-34700141d37c',
  },
};
