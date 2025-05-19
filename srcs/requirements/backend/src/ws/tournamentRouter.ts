import { FastifyRequest } from 'fastify';
import WebSocket from 'ws';
import { ClientMessage, PlayerInput, ServerMessage } from './remoteGameApp/types';
import {
  attributePlayerToTournament,
  getPlayerTournament,
  removePlayerTournament,
} from './tournamentManagement';
import { areGameSettingsValid } from './remoteGameRouter';
import { leanGameSettings } from './remoteGameApp/settings';
import { initializeRemoteGame } from './remoteGameApp/game';
import { isPlayerInput } from './remoteGameApp/helpers';

async function joinGameHandler(
  socket: WebSocket,
  userId: string,
  playerSettings: leanGameSettings,
) {
  if (getPlayerTournament(socket)) return;
  if (!areGameSettingsValid(socket, userId, playerSettings)) return;
  await attributePlayerToTournament(socket, playerSettings);
  const playerTournament = getPlayerTournament(socket);
  if (playerTournament && playerTournament.isFull()) {
    playerTournament.broadcastSettingsToSessions();
    for (const session of playerTournament.sessions) initializeRemoteGame(session);
    // TODO: Create tournament in the Blockchain
    // { alias, userID, character, gameType, tournamentID }
    // TODO: Add tournamentID to User (Classic and Crazy tournaments)
    const gameStartMsg: ServerMessage = { type: 'game_start' };
    playerTournament.broadcastToAll(JSON.stringify(gameStartMsg));
  }
}

function stopGameHandler(socket: WebSocket) {
  const playerLeft: ServerMessage = { type: 'player_left' };
  const playerTournament = getPlayerTournament(socket);
  const gameSession = playerTournament?.getPlayerSession(socket);
  if (!gameSession || !gameSession.gameArea) return;
  gameSession.gameArea.stop();
  removePlayerTournament(socket);
  const iterator = gameSession.players.entries();
  const { value } = iterator.next();
  const socket2 = value?.[0];
  if (!socket2) return;
  if (socket2.readyState === WebSocket.OPEN) socket2.send(JSON.stringify(playerLeft));
  // TODO: set other player as winner (score to 5 ?)
  // TODO: Update data on Blockchain
  // { gameType, user1ID, score1, user2ID, score2, tournamentID }
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

  socket.on('close', () => {
    removePlayerTournament(socket);
    clearInterval(keepAlive);
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}
