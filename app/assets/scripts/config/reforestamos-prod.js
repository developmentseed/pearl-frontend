// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    environment: 'production',
    restApiEndpoint: 'https://api.lulc-staging.ds.io',
    websocketEndpoint: 'wss://api.lulc-staging.ds.io',
    auth0Domain: 'pearl-landcover.us.auth0.com',
    auth0ClientId: 'mXokXsHo1eabFlWuJyQPpzErqOX3wZ87',
    tileUrlTemplate:
      'https://planetarycomputer.microsoft.com/api/data/v1/mosaic/tiles/87b72c66331e136e088004fba817e3e8/{z}/{x}/{y}?asset_bidx=image|1%2C2%2C3&assets=image&collection=naip',
  },
};
