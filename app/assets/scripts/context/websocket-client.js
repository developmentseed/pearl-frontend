import config from '../config';
import logger from '../utils/logger';
import { actions } from '../reducers/predictions';
class WebsocketClient extends WebSocket {
  constructor({ token, onConnected, dispatchPredictions }) {
    super(config.websocketEndpoint + `?token=${token}`);

    this.isConnected = false;
    this.dispatchPredictions = dispatchPredictions;

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
          if (onConnected) onConnected();
          break;
        case 'info#disconnected':
          this.isConnected = false;
          break;
        case 'model#prediction':
          dispatchPredictions({
            type: actions.RECEIVE_PREDICTION,
            data: eventData.data,
          });
          break;
        case 'model#prediction#complete':
          dispatchPredictions({
            type: actions.COMPLETE_PREDICTION,
          });
          break;
        default:
          logger('Unknown websocket message:');
          logger(event);
          break;
      }
    });
  }

  /**
   * Send message to start a prediction run
   * @param {String} name
   * @param {Object} polygon
   */
  requestPrediction(name, polygon) {
    const message = {
      action: 'model#prediction',
      data: {
        name,
        polygon,
      },
    };
    this.send(JSON.stringify(message));
    this.dispatchPredictions({ type: actions.START_PREDICTION });
  }

  /**
   * Send message to terminate
   * @param {String} name
   * @param {Object} polygon
   */
  terminateInstance() {
    const message = {
      action: 'instance#terminate',
    };
    this.send(JSON.stringify(message));
  }
}

export default WebsocketClient;
