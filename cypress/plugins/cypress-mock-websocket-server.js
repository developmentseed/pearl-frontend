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
function startMockWsServer() {
  /* eslint no-console: 0 */

  // Load workflow fixtures
  // TODO load file via parameter
  const workflows = {
    retrain: require('../fixtures/websocket-workflow/retrain.json'),
    'retrain-one-sample-aborted': require('../fixtures/websocket-workflow/retrain-one-sample-aborted.json'),
    'base-model-prediction': require('../fixtures/websocket-workflow/base-model-prediction.json'),
    'run-prediction-aborted': require('../fixtures/websocket-workflow/run-prediction-aborted.json'),
  };

  // Init websocket messages queue
  let step = 0;
  let queue = [];

  // Start websocket server
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ port: 1999 });
  console.log('\n\nWebsocket plugin server started.\n');

  function sendServerMessages(ws) {
    while (queue[step] && queue[step].type === 'server') {
      ws.send(JSON.stringify(queue[step].payload));
      console.log(
        `\nWorkflow step ${step + 1}/${queue.length} (server message)`
      );
      step += 1;
    }
  }

  // Setup listeners
  wss.on('connection', function connection(ws, req) {
    // Configure message handling for the Cypress client and return
    if (req.url === '/?token=cypress') {
      ws.on('message', function incoming(messageString) {
        const message = JSON.parse(messageString);
        if (message.type === 'cy:setup_workflow') {
          // Internal cypress message to set the workflow
          queue = workflows[message.data];
          if (!queue) {
            throw Error('Websocket workflow not found!');
          }
          step = 0;
          console.log('\nA new websocket workflow was set.\n');
        } else {
          console.log('\nUnexpected Cypress message!!\n');
        }
      });
      return;
    }

    // Configure message handling for the app client
    ws.on('message', function incoming(messageString) {
      // Keep ping/pong flow
      if (messageString.indexOf('ping#') === 0) {
        ws.send(`pong#${parseInt(messageString.split('#')[1])}`);
        return;
      }

      // Print message
      console.log(
        `\nWorkflow step ${step + 1}/${queue.length} (client message)`
      );

      // Parse message payload
      const message = JSON.parse(messageString);

      // Check if workflow ended
      if (!queue[step]) {
        console.log(
          '\n  Message sent by client after workflow ended: ',
          messageString,
          '\n'
        );
        return;
      }

      // Check if payload is expected
      if (!isEqual(queue[step].payload, message)) {
        console.log('\nUnexpected websocket message data:');
        console.log('  Expected: ', JSON.stringify(queue[step].payload));
        console.log('  Received: ', JSON.stringify(message), '\n');
        ws.send(
          JSON.stringify({
            message: 'error',
            data: { error: 'Processing error' },
          })
        );
        return;
      }

      // Move queue pointer to next message
      step += 1;

      // Send server messages, if any
      sendServerMessages(ws);
    });

    // Check if client is reconnecting
    if (step > 0 && step < queue.length) {
      if (queue[step] && queue[step].type === 'reconnect') {
        // If this is the right step update counter
        console.log('\n App client reconnected\n');
        step += 1;
      } else {
        // Or print error
        console.log(
          `\n Error: app client reconnected, but expected step was:\n${JSON.stringify(
            queue[step]
          )}\n`
        );
      }
    }

    // On connection, check if there are message to be sent by the server
    sendServerMessages(ws);
  });
}

/**
 * Adds a command to set a message sequence to be send by the
 * mock websocket server. Please refer to plugins/index.
 */
function setup() {
  Cypress.Commands.add('setWebsocketWorkflow', (workflowName) => {
    const socket = new WebSocket(`ws://localhost:1999?token=cypress`);

    socket.addEventListener('open', function () {
      socket.send(
        JSON.stringify({
          type: 'cy:setup_workflow',
          data: workflowName,
        })
      );
      socket.close();
    });
  });
}

module.exports = {
  setup,
  startMockWsServer,
};
