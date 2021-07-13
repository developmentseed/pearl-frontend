/* eslint no-console: 0 */
const isEqual = require('lodash.isequal');

//
// This a plugin to mock WebSocket exchange between the client and API.
//
// It will setup a message workflow on the  websocket server that will
// respond to the client using messages defined in a fixtures file.
//
// The following command will load file fixtures/websocket-workflow/retrain.json:
//
//   cy.setWebsocketWorkflow('retrain');
//
// Please note the fixture file has to be defined manually in 'workflows' objects bellow.
//
// After setting up the workflow, the server will:
//
// - Respond to ping/pong messages
// - Validate if client message follow expect order in fixture file and
// log errors to console
// - Send expected messages in sequence
//

// Load workflow fixtures
const workflows = {
  retrain: require('../fixtures/websocket-workflow/retrain.json'),
};

// Start websocket server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 1999 });
console.log('WS mock server started');

// Init websocket messages queue
let step = 0;
let queue = [];

// Helper function to print queue
function logQueue() {
  console.log(`queue step: `, step);
  console.log(queue);
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(messageString) {
    console.log('WS received: %s', messageString);

    // Keep ping/pong flow
    if (messageString.indexOf('ping#') === 0) {
      ws.send(`pong#${parseInt(messageString.split('#')[1])}`);
      return;
    }

    // Handle message and response
    try {
      // If not ping/pong, parse JSON
      const message = JSON.parse(messageString);

      // Sets expected WS messages sequence
      if (message.type === 'cy:set_workflow') {
        queue = workflows[message.data];
        step = 0;
        return;
      }

      // Validate received message and return expected messages to the client
      if (!queue[step] || queue[step].type !== 'send') {
        console.log('Unexpected websocket message type: ', messageString);
        logQueue();
      }

      if (!isEqual(queue[step].data, message.data)) {
        console.log('Unexpected websocket message data: ', messageString);
        logQueue();
      }

      // Update counter
      step += 1;

      // Send next if type is 'send'
      while (queue[step] && queue[step].type === 'receive') {
        ws.send(JSON.stringify(queue[step].data));
        step += 1;
      }
    } catch (err) {
      // Check errors
      console.log(err); // eslint-disable
      expect(err).to.not.exist();
    }
  });

  // Send info#connect right away
  ws.send(JSON.stringify({ message: 'info#connected' }));
});
