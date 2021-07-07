Cypress.Commands.add('mockWebsocket', (messageQueue) => {
  const socket = new WebSocket(`ws://localhost:1999`);

  socket.addEventListener('open', function () {
    socket.send(
      JSON.stringify({
        type: 'cy:set_queue',
        messageQueue,
      })
    );
  });
  socket.addEventListener('error', function (event) {
    console.log(event);
  });
});
