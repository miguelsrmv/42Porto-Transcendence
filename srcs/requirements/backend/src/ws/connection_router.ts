import WebSocket from 'ws';
import { attributePlayerToSession } from './remoteGameApp/game';
import { leanGameSettings } from './remoteGameApp/settings';

export async function handleSocketConnection(socket: WebSocket) {
  socket.on('open', () => {
    console.log('New client connection on /ws');
    socket.send('You have connected to the ft_transcendence server');
  });

  // TODO: add types for messages (client and server)
  socket.on('message', (message) => {
    console.log('Received message:', message.toString());
    const playerSettings = JSON.parse(message.toString()) as leanGameSettings;
    attributePlayerToSession(socket, playerSettings);
    socket.send('Hi from server');
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}
