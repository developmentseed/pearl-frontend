import config from '../config';

class WebsocketClient extends WebSocket {
  constructor(token) {
    super(config.websocketEndpoint + `?token=${token}`);
  }
}

export default WebsocketClient;
