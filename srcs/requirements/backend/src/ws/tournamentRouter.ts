import { FastifyRequest } from 'fastify';
import WebSocket from 'ws';
import { ClientMessage, PlayerInput } from './remoteGameApp/types';
import { areGameSettingsValid, closeSocket, sendErrorMessage } from './helpers';
import { leanGameSettings } from './remoteGameApp/settings';
import { isPlayerInput } from './helpers';
import { TournamentManager } from './tournamentManager';
import { playerManager } from './playerManager';

const tournamentManager = new TournamentManager();

async function joinGameHandler(
  socket: WebSocket,
  userId: string,
  playerSettings: leanGameSettings,
) {
  if (tournamentManager.isPlayerInATournament(userId)) {
    sendErrorMessage(socket, 'Player already in a tournament');
    closeSocket(socket);
    return;
  }
  if (!areGameSettingsValid(socket, userId, playerSettings)) return;
  if (playerSettings.playType !== 'Tournament Play') {
    sendErrorMessage(socket, 'Attempting to join a Remote Game through the wrong route');
    closeSocket(socket);
    return;
  }
  playerManager.register(playerSettings.playerID, socket);
  await tournamentManager.attributePlayerToTournament(socket, playerSettings);
}

function movementHandler(socket: WebSocket, direction: string) {
  if (!isPlayerInput(direction)) {
    console.log(`Not a valid player movement: ${direction}`);
    return;
  }
  const playerId = playerManager.getPlayerId(socket);
  if (!playerId) return;
  const playerTournament = tournamentManager.getPlayerTournament(playerId);
  const gameSession = playerTournament?.getPlayerSession(playerId);
  if (!gameSession || !gameSession.gameArea) return;
  const ownPlayer = gameSession.gameArea.getPlayerById(playerId);
  ownPlayer.input = direction as PlayerInput;
}

async function powerUpHandler(socket: WebSocket) {
  const playerId = playerManager.getPlayerId(socket);
  if (!playerId) return;
  const playerTournament = tournamentManager.getPlayerTournament(playerId);
  const gameSession = playerTournament?.getPlayerSession(playerId);
  if (!gameSession || !gameSession.gameArea) return;
  const ownPlayer = gameSession.gameArea.getPlayerById(playerId);
  await ownPlayer.attack?.attack();
}

async function readyForNextRoundHandler(socket: WebSocket) {
  const playerId = playerManager.getPlayerId(socket);
  if (!playerId) return;
  const playerTournament = tournamentManager.getPlayerTournament(playerId);
  if (!playerTournament) return;
  await playerTournament.setReadyForNextRound(socket);
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
      await powerUpHandler(socket);
      break;
    }
    case 'ready_for_next_game': {
      await readyForNextRoundHandler(socket);
      break;
    }
  }
}

export async function handleSocketConnectionTournament(socket: WebSocket, request: FastifyRequest) {
  console.log('New client connection on /ws/tournaments');
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
      await messageTypeHandlerTournament(JSON.parse(message.toString()), socket, request.user.id);
    } catch (err) {
      console.error('Error handling message:', err);
      // closeSocket(socket);
    }
  });

  socket.on('close', async () => {
    try {
      const playerId = playerManager.getPlayerId(socket);
      if (!playerId) return;
      await tournamentManager.removePlayerTournament(playerId);
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
