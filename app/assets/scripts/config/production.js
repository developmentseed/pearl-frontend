// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    environment: 'production',
    restApiEndpoint: 'https://api.lulc.ds.io',
    websocketEndpoint: 'wss://socket.lulc.ds.io',
    auth0Domain: 'pearl-landcover.us.auth0.com',
    auth0ClientId: 'OQtYR72fGdgrogeokjr9CBl4vg1P6SYP',
    tileUrlTemplate:
      'https://tiles.lulc.ds.io/mosaic/{LAYER_NAME}/tiles/{z}/{x}/{y}?asset_bidx=image|1,2,3&assets=image&collection=naip',
    appInsightsKey: '0291f153-9634-463e-8aa0-34700141d37c',
  },
};
