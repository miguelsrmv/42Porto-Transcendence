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
import { isPlayerInput } from './remoteGameApp/helpers';
import { contractSigner } from '../api/services/blockchain.services';

async function joinGameHandler(
  socket: WebSocket,
  userId: string,
  playerSettings: leanGameSettings,
) {
  if (getPlayerTournament(socket)) return;
  if (!areGameSettingsValid(socket, userId, playerSettings)) return;
  await attributePlayerToTournament(socket, playerSettings);
  const playerTournament = getPlayerTournament(socket);
  if (playerTournament && playerTournament.isFull()) await playerTournament.start();
}

async function stopGameHandler(socket: WebSocket) {
  const playerLeft: ServerMessage = { type: 'player_left' };
  const playerTournament = getPlayerTournament(socket);
  const gameSession = playerTournament?.getPlayerSession(socket);
  if (!playerTournament || !gameSession || !gameSession.gameArea) return;
  const gameArea = gameSession.gameArea;
  gameArea.stop();
  const playerWhoLeft = gameArea.getPlayerByWebSocket(socket);
  removePlayerTournament(socket);
  const playerWhoStayed = gameArea.getOtherPlayer(playerWhoLeft);
  if (playerWhoStayed.socket.readyState === WebSocket.OPEN)
    playerWhoStayed.socket.send(JSON.stringify(playerLeft));
  await gameArea.tournament!.updateSessionScore(gameArea.session, playerWhoStayed.id);
  // TODO: Add tournament tree info
  gameArea.session.broadcastEndGameMessage(playerWhoStayed);
  // TODO: Check if order of users matter
  const tx = await contractSigner.saveScoreAndAddWinner(
    playerTournament.id,
    gameSession.gameType,
    playerWhoStayed.id,
    5, // hard-coded win
    playerWhoLeft.id,
    playerWhoLeft.score,
  );
  await tx.wait();
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
      await stopGameHandler(socket);
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
