/**
 * Adds a command to set a message sequence to be send by the
 * mock websocket server. Please refer to plugins/index.
 */
Cypress.Commands.add('setWebsocketWorkflow', (workflowName) => {
  const socket = new WebSocket(`ws://localhost:1999`);

  socket.addEventListener('open', function () {
    socket.send(
      JSON.stringify({
        type: 'cy:set_workflow',
        data: workflowName,
      })
    );
  });
});
