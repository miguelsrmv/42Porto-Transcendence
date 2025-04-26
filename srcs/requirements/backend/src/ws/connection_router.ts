import WebSocket from 'ws';
import { attributePlayerToSession, removePlayer } from './remoteGameApp/sessionManagement';
import { ClientMessage } from './remoteGameApp/types';

function messageTypeHandler(message: ClientMessage, socket: WebSocket) {
  switch (message.type) {
    case 'join_game': {
      const playerSettings = message.playerSettings;
      attributePlayerToSession(socket, playerSettings);
      break;
    }
    case 'movement': {
      break;
    }
    case 'power_up': {
      break;
    }
  }
}

export async function handleSocketConnection(socket: WebSocket) {
  socket.on('open', () => {
    console.log('New client connection on /ws');
    socket.send('You have connected to the ft_transcendence server');
  });

  socket.on('message', (message) => {
    console.log('Received message:', message.toString());
    messageTypeHandler(JSON.parse(message.toString()), socket);
    socket.send('Hi from server');
  });

  socket.on('close', () => {
    removePlayer(socket);
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}
