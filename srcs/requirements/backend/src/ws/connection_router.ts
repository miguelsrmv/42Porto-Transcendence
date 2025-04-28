import WebSocket from 'ws';
import {
  attributePlayerToSession,
  getGameSession,
  isSessionFull,
  removePlayer,
} from './remoteGameApp/sessionManagement';
import { ClientMessage, GameSession, ServerMessage } from './remoteGameApp/types';

function broadcastMessage(session: GameSession, message: string) {
  for (const [socket] of session.players) {
    if (socket.readyState === WebSocket.OPEN) socket.send(message);
  }
}

function messageTypeHandler(message: ClientMessage, socket: WebSocket) {
  switch (message.type) {
    case 'join_game': {
      const playerSettings = message.playerSettings;
      attributePlayerToSession(socket, playerSettings);
      const playerSession = getGameSession(socket);
      if (playerSession && isSessionFull(playerSession)) {
        // TODO: error handling for no game session returned
        const matchSettings = playerSession.settings;
        const response = { type: 'game_setup', settings: matchSettings } as ServerMessage;
        broadcastMessage(playerSession, JSON.stringify(response));
      }
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
  });

  socket.on('close', () => {
    removePlayer(socket);
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}
