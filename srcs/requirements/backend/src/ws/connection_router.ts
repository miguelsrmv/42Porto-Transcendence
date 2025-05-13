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
import { FastifyRequest } from 'fastify';

export function broadcastMessageTo(p1socket: WebSocket, p2socket: WebSocket, message: string) {
  if (p1socket.readyState === WebSocket.OPEN) p1socket.send(message);
  if (p2socket.readyState === WebSocket.OPEN) p2socket.send(message);
}

// TODO: Rename function
async function messageTypeHandler(message: ClientMessage, socket: WebSocket, userId: string) {
  switch (message.type) {
    case 'join_game': {
      const playerSettings = message.playerSettings;
      if (playerSettings.playerID !== userId) {
        console.log(
          `UserId: ${userId} does not match the request playerId: ${playerSettings.playerID}`,
        );
        const errorMessage = { type: 'error', message: '401 Unauthorized' };
        if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(errorMessage));
        return;
      }
      if (playerIsInASession(playerSettings.playerID)) {
        return;
      }
      await attributePlayerToSession(socket, playerSettings);
      const playerSession = getGameSession(socket);
      if (playerSession && isSessionFull(playerSession)) {
        // TODO: error handling for no game session returned
        const matchSettings = playerSession.settings;
        const response: ServerMessage = { type: 'game_setup', settings: matchSettings };
        const [ws1, ws2] = Array.from(playerSession.players.keys());
        const [id1, id2] = Array.from(playerSession.players.values());
        broadcastMessageTo(ws1, ws2, JSON.stringify(response));
        initializeRemoteGame(id1, id2, ws1, ws2, matchSettings);
        const gameStartMsg: ServerMessage = { type: 'game_start' };
        broadcastMessageTo(ws1, ws2, JSON.stringify(gameStartMsg));
      }
      break;
    }
  }
}

let pingInterval: NodeJS.Timeout;

// TODO: Review on message event handling
export async function handleSocketConnection(socket: WebSocket, request: FastifyRequest) {
  socket.on('open', () => {
    pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.ping(); // send a ping frame
      }
    }, 30000); // every 30 seconds
    console.log('New client connection on /ws');
    socket.send('You have connected to the ft_transcendence server');
  });

  socket.on('message', async (message) => {
    console.log('Received message:', message.toString());
    await messageTypeHandler(JSON.parse(message.toString()), socket, request.user.id);
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
