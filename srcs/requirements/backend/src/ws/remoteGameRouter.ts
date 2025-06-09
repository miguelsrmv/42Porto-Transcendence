import WebSocket from 'ws';
import { ClientMessage, PlayerInput } from './remoteGameApp/types';
import { FastifyRequest } from 'fastify';
import { leanGameSettings } from './remoteGameApp/settings';
import { areGameSettingsValid, closeSocket, isPlayerInput, sendErrorMessage } from './helpers';
import { GameSessionManager } from './gameSessionManager';
import { playerManager } from './playerManager';

const sessionManager = new GameSessionManager();

async function joinGameHandler(
  socket: WebSocket,
  userId: string,
  playerSettings: leanGameSettings,
) {
  if (sessionManager.isPlayerInSession(playerSettings.playerID)) {
    sendErrorMessage(socket, 'Player already in a session');
    closeSocket(socket);
    return;
  }
  if (!areGameSettingsValid(socket, userId, playerSettings)) return;
  if (playerSettings.playType !== 'Remote Play') {
    sendErrorMessage(socket, 'Attempting to join a Tournament through the wrong route');
    closeSocket(socket);
    return;
  }
  playerManager.register(playerSettings.playerID, socket);
  await sessionManager.attributePlayerToSession(socket, playerSettings);
}

function movementHandler(socket: WebSocket, direction: string) {
  if (!isPlayerInput(direction)) {
    sendErrorMessage(socket, `Not a valid player movement: ${direction}`);
    return;
  }
  const playerId = playerManager.getPlayerId(socket);
  if (!playerId) return;
  const gameSession = sessionManager.getSessionByPlayerId(playerId);
  if (!gameSession || !gameSession.gameArea) return;
  const ownPlayer = gameSession.gameArea.getPlayerById(playerId);
  ownPlayer.input = direction as PlayerInput;
}

async function powerUpHandler(socket: WebSocket) {
  const playerId = playerManager.getPlayerId(socket);
  if (!playerId) return;
  const gameSession = sessionManager.getSessionByPlayerId(playerId);
  if (!gameSession || !gameSession.gameArea) return;
  const ownPlayer = gameSession.gameArea.getPlayerById(playerId);
  await ownPlayer.attack?.attack();
}

async function messageTypeHandler(message: ClientMessage, socket: WebSocket, userId: string) {
  switch (message.type) {
    case 'join_game': {
      await joinGameHandler(socket, userId, message.playerSettings);
      break;
    }
    case 'movement': {
      movementHandler(socket, message.direction);
      break;
    }
    case 'power_up': {
      await powerUpHandler(socket);
      break;
    }
  }
}

export async function handleSocketConnection(socket: WebSocket, request: FastifyRequest) {
  console.log('New client connection on /ws');
  let clientLastActive = Date.now() / 1000;
  const keepAlive = setInterval(() => {
    const currentTime = Date.now() / 1000;
    if (currentTime - clientLastActive > 30) {
      console.log('Client inactive for too long. Disconnecting...');
      closeSocket(socket);
    }
  }, 15000); // every 15 seconds

  socket.on('message', async (message) => {
    clientLastActive = Date.now() / 1000;
    console.log('Received message:', message.toString());
    try {
      await messageTypeHandler(JSON.parse(message.toString()), socket, request.user.id);
    } catch (err) {
      console.error('Error handling message:', err);
      // closeSocket(socket);
    }
  });

  socket.on('close', async () => {
    try {
      const playerId = playerManager.getPlayerId(socket);
      if (!playerId) return;
      await sessionManager.removePlayerSessionManager(playerId);
      playerManager.unregister(socket);
    } catch (err) {
      console.error('Error closing socket:', err);
    }
    clearInterval(keepAlive);
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}
