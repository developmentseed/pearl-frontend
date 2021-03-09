import config from '../config';

class WebsocketClient extends WebSocket {
  constructor(token) {
    super(config.websocketEndpoint + `?token=${token}`);
  }

  setupListeners() {
    this.addEventListener('open', () => {
      console.log('ws opened.');
    });

    this.addEventListener('close', () => console.log('ws closed.'));
  }
}

export default WebsocketClient;
