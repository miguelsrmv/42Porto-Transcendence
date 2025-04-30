import WebSocket from 'ws';
import {
  attributePlayerToSession,
  getGameSession,
  isSessionFull,
  playerIsInASession,
  removePlayer,
} from './remoteGameApp/sessionManagement';
import { ClientMessage, ServerMessage } from './remoteGameApp/types';
import { initializeRemoteGame } from './remoteGameApp/game';

// TODO: Change name or remove
export function broadcastMessage(p1socket: WebSocket, p2socket: WebSocket, message: string) {
  if (p1socket.readyState === WebSocket.OPEN) p1socket.send(message);
  if (p2socket.readyState === WebSocket.OPEN) p2socket.send(message);
}

// TODO: send who triggered animation

function messageTypeHandler(message: ClientMessage, socket: WebSocket) {
  switch (message.type) {
    case 'join_game': {
      const playerSettings = message.playerSettings;
      if (playerIsInASession(playerSettings.playerID)) {
        // TODO: send error saying player is in session?
        return;
      }
      attributePlayerToSession(socket, playerSettings);
      const playerSession = getGameSession(socket);
      if (playerSession && isSessionFull(playerSession)) {
        // TODO: error handling for no game session returned
        const matchSettings = playerSession.settings;
        const response = { type: 'game_setup', settings: matchSettings } as ServerMessage;
        const [ws1, ws2] = Array.from(playerSession.players.keys());
        broadcastMessage(ws1, ws2, JSON.stringify(response));
        initializeRemoteGame(ws1, ws2, matchSettings);
        const gameStartMsg = { type: 'game_start' };
        broadcastMessage(ws1, ws2, JSON.stringify(gameStartMsg));
      }
      break;
    }
  }
}

let pingInterval: NodeJS.Timeout;

export async function handleSocketConnection(socket: WebSocket) {
  socket.on('open', () => {
    pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.ping(); // send a ping frame
      }
    }, 30000); // every 30 seconds
    console.log('New client connection on /ws');
    socket.send('You have connected to the ft_transcendence server');
  });

  socket.on('message', (message) => {
    console.log('Received message:', message.toString());
    messageTypeHandler(JSON.parse(message.toString()), socket);
  });

  socket.on('close', () => {
    removePlayer(socket);
    clearInterval(pingInterval);
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}
