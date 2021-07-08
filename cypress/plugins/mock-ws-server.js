/* eslint no-console: 0 */

//
// This a helper to mock WebSocket exchange between the client and API.
// Unless it is a ping/pong message, the server doesn't analyse what was
// send by the client, it will just respond by sending one or more messages
// of the current batch in the message sequece defined by cy.setWsSequence(messageSequence).
//
// An example:
//
// const batch1 = [
//   {
//     message: 'model#status',
//     data: {
//       is_aborting: false,
//       processing: false,
//       aoi: 631,
//       checkpoint: 292,
//     },
//   },
// ];
//
// const batch2 = [
//   {
//     message: 'model#checkpoint#progress',
//     data: { checkpoint: 292, processed: 0, total: 1 },
//   },
//   { message: 'model#checkpoint#complete', data: { checkpoint: 292 } },
// ];
//
// const messageSequence = [batch1, batch2];
//
// cy.setWsSequence(messageSequence)
//
// After every client message receibed, the mock server will send the current batch
// messages in sequence, and wait move the pointer to the next batch.
//
// Ping/pong messages are not affected by this workflow.
//

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 1999 });

let queueStep = 0;
let queue = [];

console.log('server configured');

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(messageString) {
    // Handle ping/pong
    if (messageString.indexOf('ping#') === 0) {
      ws.send(`pong#${parseInt(messageString.split('#')[1])}`);
    } else {
      try {
        const message = JSON.parse(messageString);
        if (message.type === 'cy:set_message_sequence') {
          queue = message.messageSequence;
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
