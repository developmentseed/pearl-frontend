export default {
  environment: 'staging',
  restApiEndpoint: 'https://api.lulc-staging.ds.io',
  audience: 'https://api.lulc-staging.ds.io',
  websocketEndpoint: 'wss://socket.lulc-staging.ds.io',
  tileUrlTemplate:
    'https://tiles.lulc-staging.ds.io/mosaic/{LAYER_NAME}/tiles/{z}/{x}/{y}?bidx=1%2C2%2C3',
  appInsightsKey: '07b5adb4-0447-4c6f-881a-a23e108bc861',
};
