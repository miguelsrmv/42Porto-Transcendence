import WebSocket from 'ws';
import { ClientMessage, PlayerInput } from './remoteGameApp/types';
import { FastifyRequest } from 'fastify';
import { leanGameSettings } from './remoteGameApp/settings';
import { areGameSettingsValid, closeSocket, isPlayerInput, sendErrorMessage } from './helpers';
import { GameSessionManager } from './gameSessionManager';

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
  await sessionManager.attributePlayerToSession(socket, playerSettings);
}

function movementHandler(socket: WebSocket, direction: string) {
  if (!isPlayerInput(direction)) {
    sendErrorMessage(socket, `Not a valid player movement: ${direction}`);
    return;
  }
  const gameSession = sessionManager.getSessionBySocket(socket);
  if (!gameSession || !gameSession.gameArea) return;
  const ownPlayer =
    gameSession.gameArea.leftPlayer.socket === socket
      ? gameSession.gameArea.leftPlayer
      : gameSession.gameArea.rightPlayer;
  ownPlayer.input = direction as PlayerInput;
}

function powerUpHandler(socket: WebSocket) {
  const gameSession = sessionManager.getSessionBySocket(socket);
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
    await messageTypeHandler(JSON.parse(message.toString()), socket, request.user.id);
  });

  socket.on('close', async () => {
    await sessionManager.removePlayerBySocket(socket);
    clearInterval(keepAlive);
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}
