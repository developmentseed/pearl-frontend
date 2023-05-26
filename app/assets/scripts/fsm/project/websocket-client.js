import config from '../../config';
import ReconnectingWebSocket from 'reconnecting-websocket';

export class WebsocketClient extends ReconnectingWebSocket {
  constructor(token) {
    super(config.websocketEndpoint + `?token=${token}`);
  }

  sendMessage(message) {
    this.send(JSON.stringify(message));
  }
}
