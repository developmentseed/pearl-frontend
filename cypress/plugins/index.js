/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = () => {
  const WebSocket = require('ws');

  const wss = new WebSocket.Server({ port: 1999 });

  let queueStep = 0;
  let queue = [];

  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(messageString) {
      // Handle ping/pong
      if (messageString.indexOf('ping#') === 0) {
        ws.send(`pong#${parseInt(messageString.split('#')[1])}`);
      } else {
        try {
          const message = JSON.parse(messageString);
          if (message.type === 'cy:set_queue') {
            queue = message.messageQueue;
            queueStep = 0;
          } else if (queue[queueStep]) {
            queue[queueStep].forEach((message) => {
              ws.send(JSON.stringify(message));
            });
            queueStep += 1;
          }
        } catch (err) {
          console.log(err);
        }
      }

      console.log('WS received: %s', messageString);
    });

    // Send info#connect right away
    ws.send(JSON.stringify({ message: 'info#connected' }));
  });
};
