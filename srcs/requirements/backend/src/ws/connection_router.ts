import WebSocket from 'ws';
import {
  attributePlayerToSession,
  getGameSession,
  isSessionFull,
  playerIsInASession,
  removePlayer,
} from './remoteGameApp/sessionManagement';
import { ClientMessage, PlayerInput, ServerMessage } from './remoteGameApp/types';
import { initializeRemoteGame } from './remoteGameApp/game';
import { FastifyRequest } from 'fastify';
import { leanGameSettings } from './remoteGameApp/settings';

export function broadcastMessageTo(p1socket: WebSocket, p2socket: WebSocket, message: string) {
  if (p1socket.readyState === WebSocket.OPEN) p1socket.send(message);
  if (p2socket.readyState === WebSocket.OPEN) p2socket.send(message);
}

async function joinGameHandler(
  socket: WebSocket,
  userId: string,
  playerSettings: leanGameSettings,
) {
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
    const matchSettings = playerSession.settings;
    const response: ServerMessage = { type: 'game_setup', settings: matchSettings };
    const [ws1, ws2] = Array.from(playerSession.players.keys());
    broadcastMessageTo(ws1, ws2, JSON.stringify(response));
    initializeRemoteGame(playerSession);
    const gameStartMsg: ServerMessage = { type: 'game_start' };
    broadcastMessageTo(ws1, ws2, JSON.stringify(gameStartMsg));
  }
}

function stopGameHandler(socket: WebSocket) {
  const playerLeft: ServerMessage = { type: 'player_left' };
  const gameSession = getGameSession(socket);
  if (!gameSession || !gameSession.gameArea) return;
  gameSession.gameArea.stop();
  removePlayer(socket);
  const iterator = gameSession.players.entries();
  const { value } = iterator.next();
  const socket2 = value?.[0];
  if (!socket2) return;
  if (socket2.readyState === WebSocket.OPEN) socket2.send(JSON.stringify(playerLeft));
  removePlayer(socket2);
}

function movementHandler(socket: WebSocket, direction: string) {
  const gameSession = getGameSession(socket);
  if (!gameSession || !gameSession.gameArea) return;
  const ownPlayer =
    gameSession.gameArea.leftPlayer.socket === socket
      ? gameSession.gameArea.leftPlayer
      : gameSession.gameArea.rightPlayer;
  ownPlayer.input = direction as PlayerInput;
}

function powerUpHandler(socket: WebSocket) {
  const gameSession = getGameSession(socket);
  if (!gameSession || !gameSession.gameArea) return;
  const ownPlayer =
    gameSession.gameArea.leftPlayer.socket === socket
      ? gameSession.gameArea.leftPlayer
      : gameSession.gameArea.rightPlayer;
  ownPlayer.attack?.attack();
}

async function messageTypeHandler(message: ClientMessage, socket: WebSocket, userId: string) {
  switch (message.type) {
    case 'join_game': {
      await joinGameHandler(socket, userId, message.playerSettings);
      break;
    }
    case 'stop_game': {
      stopGameHandler(socket);
      break;
    }
    case 'movement': {
      movementHandler(socket, message.direction);
      break;
    }
    case 'power_up': {
      powerUpHandler(socket);
      break;
    }
  }
}

// TODO: review ping logic
export async function handleSocketConnection(socket: WebSocket, request: FastifyRequest) {
  // NOTE: necessary?
  // const pingInterval = setInterval(() => {
  //   if (socket.readyState === WebSocket.OPEN) {
  //     socket.ping(); // send a ping frame
  //   }
  // }, 30000); // every 30 seconds
  console.log('New client connection on /ws');

  let clientLastActive = Date.now() / 1000;
  const keepAlive = setInterval(() => {
    const currentTime = Date.now() / 1000;
    if (currentTime - clientLastActive > 30) socket.close();
  }, 15000); // every 15 seconds

  socket.on('message', async (message) => {
    clientLastActive = Date.now() / 1000;
    console.log('Received message:', message.toString());
    await messageTypeHandler(JSON.parse(message.toString()), socket, request.user.id);
  });

  socket.on('close', () => {
    removePlayer(socket);
    clearInterval(keepAlive);
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}
