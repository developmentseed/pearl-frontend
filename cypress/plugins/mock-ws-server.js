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

// Init websocket messages queue
let step = 0;
let queue = [];

// Start websocket server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 1999 });
console.log('Cypress websocket: server started.');

// Setup listeners
wss.on('connection', function connection(ws) {
  console.log('Cypress websocket: client connected.');
  ws.on('message', function incoming(messageString) {
    // Keep ping/pong flow
    if (messageString.indexOf('ping#') === 0) {
      ws.send(`pong#${parseInt(messageString.split('#')[1])}`);
      return;
    }

    // Print message
    console.log(`Workflow step ${step + 1}/${queue.length}`);

    // Parse message payload
    const message = JSON.parse(messageString);

    // Internal cypress message to set the workflow
    if (message.type === 'cy:set_workflow') {
      queue = workflows[message.data];
      step = 0;
      return;
    }

    // Check if workflow ended
    if (!queue[step]) {
      console.log(
        '  Message sent by client after workflow ended: ',
        messageString
      );
      return;
    }

    // Check if payload is expected
    if (!isEqual(queue[step].payload, message)) {
      console.log('Unexpected websocket message data:');
      console.log('  Expected: ', JSON.stringify(queue[step].payload));
      console.log('  Received: ', JSON.stringify(message));
    }

    // Update step counter
    step = step + 1;

    // Send next if type is 'send'
    while (queue[step] && queue[step].type === 'receive') {
      ws.send(JSON.stringify(queue[step].payload));
      step += 1;
    }
  });

  // Send info#connect right away
  ws.send(JSON.stringify({ message: 'info#connected' }));
});
