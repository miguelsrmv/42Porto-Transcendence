import WebSocket from 'ws';

export async function handleSocketConnection(socket: WebSocket) {
  socket.on('message', (message) => {
    console.log('Received message:', message.toString());
    socket.send('Hi from server');
  });

  socket.on('close', () => {
    console.log('Client disconnected'); 
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}
