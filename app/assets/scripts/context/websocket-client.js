import config from '../config';
import logger from '../utils/logger';
const { actions: predictionsActions } = require('./reducers/predictions');
const { actions: checkpointActions } = require('../context/checkpoint');

class WebsocketClient extends WebSocket {
  constructor({
    token,
    onConnected,
    dispatchPredictions,
    dispatchCurrentCheckpoint,
    loadCheckpointList,
  }) {
    super(config.websocketEndpoint + `?token=${token}`);
    this.isConnected = false;
    this.dispatchPredictions = dispatchPredictions;
    this.hasRunOnConnect = false;

    /**
     * Add listener to process messages received
     */
    this.addEventListener('message', (event) => {
      if (!event.data) {
        logger('Websocket message with no data', event);
        return;
      }

      // Parse message data
      const eventData = JSON.parse(event.data);

      // On connected, request a prediction
      switch (eventData.message) {
        case 'info#connected':
          this.isConnected = true;
          if (onConnected && !this.hasRunOnConnect) {
            this.hasRunOnConnect = true;
            onConnected();
          }
          break;
        case 'info#disconnected':
          this.isConnected = false;
          break;
        case 'model#aoi':
          dispatchCurrentCheckpoint({
            type: checkpointActions.RECEIVE_AOI_INFO,
            data: {
              id: eventData.data.checkpoint_id,
              name: eventData.data.name,
            },
          });
          dispatchPredictions({
            type: predictionsActions.RECEIVE_AOI_META,
            data: {
              id: eventData.data.id,
            },
          });
          break;

        case 'model#checkpoint':
          dispatchCurrentCheckpoint({
            type: checkpointActions.RECEIVE_METADATA,
            data: eventData.data,
          });
          break;

        case 'model#prediction':
          dispatchPredictions({
            type: predictionsActions.RECEIVE_PREDICTION,
            data: eventData.data,
          });
          break;
        case 'model#prediction#complete':
          loadCheckpointList();
          dispatchPredictions({
            type: predictionsActions.COMPLETE_PREDICTION,
          });
          break;
        case 'error':
          dispatchPredictions({
            type: predictionsActions.FAILED_PREDICTION,
          });
          break;
        default:
          logger('Unknown websocket message:');
          logger(event);
          break;
      }
    });
  }
}

export default WebsocketClient;
