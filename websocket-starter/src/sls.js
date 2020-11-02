/**
 * Connect
 */
on('connect', async (data, socket) => {
  console.log(`connect ${socket.id}`);
  console.log('data', data);
  return 'connected';
});

/**
 * Disconnect
 */
on('disconnect', async (data, socket) => {
  console.log(`disconnect ${socket.id}`);
  console.log('data', data);
  return 'closed';
});

/**
 * Message
 */
on('message', async (data, socket) => {
  console.log('message', socket, data);
  console.log('sending to: ', socket.id);
  await socket.send(
    JSON.stringify({ status: 'sending data', data: data || 'hello websocket' }),
    socket.id,
  );
});

/**
 * Default
 */
on('default', async (data, socket) => {
  console.log('message', socket, data);
  console.log('sending to: ', socket.id);
  await socket.send(
    JSON.stringify({
      status: 'sending default data',
      data: data || 'hello websocket',
    }),
    socket.id,
  );
});
