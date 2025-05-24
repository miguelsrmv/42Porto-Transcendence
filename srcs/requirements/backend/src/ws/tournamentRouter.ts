import { FastifyRequest } from 'fastify';
import WebSocket from 'ws';
import { ClientMessage, PlayerInput } from './remoteGameApp/types';
import {
  attributePlayerToTournament,
  getPlayerTournament,
  playerIsInATournament,
  removePlayerTournament,
} from './tournamentManagement';
import { areGameSettingsValid } from './helpers';
import { leanGameSettings } from './remoteGameApp/settings';
import { isPlayerInput } from './helpers';

async function joinGameHandler(
  socket: WebSocket,
  userId: string,
  playerSettings: leanGameSettings,
) {
  if (playerIsInATournament(userId)) {
    if (socket.readyState === WebSocket.OPEN)
      socket.send(JSON.stringify({ type: 'error', message: 'Player already in a tournament' }));
    socket.close();
    return;
  }
  console.log('Player not in the tournament yet');
  if (
    !areGameSettingsValid(socket, userId, playerSettings) ||
    playerSettings.playType !== 'Tournament Play'
  )
    return;
  await attributePlayerToTournament(socket, playerSettings);
  const playerTournament = getPlayerTournament(socket);
  if (playerTournament && playerTournament.isFull()) await playerTournament.start();
}

function movementHandler(socket: WebSocket, direction: string) {
  if (!isPlayerInput(direction)) {
    console.log(`Not a valid player movement: ${direction}`);
    return;
  }
  const playerTournament = getPlayerTournament(socket);
  const gameSession = playerTournament?.getPlayerSession(socket);
  if (!gameSession || !gameSession.gameArea) return;
  const ownPlayer =
    gameSession.gameArea.leftPlayer.socket === socket
      ? gameSession.gameArea.leftPlayer
      : gameSession.gameArea.rightPlayer;
  ownPlayer.input = direction as PlayerInput;
}

function powerUpHandler(socket: WebSocket) {
  const playerTournament = getPlayerTournament(socket);
  const gameSession = playerTournament?.getPlayerSession(socket);
  if (!gameSession || !gameSession.gameArea) return;
  const ownPlayer =
    gameSession.gameArea.leftPlayer.socket === socket
      ? gameSession.gameArea.leftPlayer
      : gameSession.gameArea.rightPlayer;
  ownPlayer.attack?.attack();
}

async function messageTypeHandlerTournament(
  message: ClientMessage,
  socket: WebSocket,
  userId: string,
) {
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

export async function handleSocketConnectionTournament(socket: WebSocket, request: FastifyRequest) {
  console.log('New client connection on /ws/tournaments');
  let clientLastActive = Date.now() / 1000;
  const keepAlive = setInterval(() => {
    const currentTime = Date.now() / 1000;
    if (currentTime - clientLastActive > 30) socket.close();
  }, 15000); // every 15 seconds
  socket.on('message', async (message) => {
    clientLastActive = Date.now() / 1000;
    console.log('Received message:', message.toString());
    await messageTypeHandlerTournament(JSON.parse(message.toString()), socket, request.user.id);
  });

  socket.on('close', async () => {
    await removePlayerTournament(socket);
    clearInterval(keepAlive);
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}
