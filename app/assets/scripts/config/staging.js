export default {
  environment: 'staging',
  restApiEndpoint: 'https://api.lulc-staging.ds.io',
  audience: 'https://api.lulc-staging.ds.io',
  NaipTileUrl:
    'https://tiles.lulc-staging.ds.io/mosaic/naip.latest/tiles/{z}/{x}/{y}@1x?bidx=1%2C2%2C3',
  tileUrlTemplate:
    'https://tiles.lulc-staging.ds.io/mosaic/{LAYER_NAME}/tiles/{z}/{x}/{y}@1x?bidx=1%2C2%2C3',
};
