import { FastifyRequest } from 'fastify';
import WebSocket from 'ws';
import { contract } from '../api/services/blockchain.services'
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
import { Tournament } from './tournament';

function getTournamentCreateData(tournament: Tournament) {
  const playersData = tournament.sessions.map((session) => {
    if (!session.gameArea) return;
    return [
      {
        userId: session.gameArea.leftPlayer.id,
        alias: session.gameArea.settings.alias1,
        character: session.gameArea.settings.character1?.name,
        gameType: tournament.type,
        tournamentId: tournament.id,
      },
      {
        userId: session.gameArea.rightPlayer.id,
        alias: session.gameArea.settings.alias2,
        character: session.gameArea.settings.character2?.name,
        gameType: tournament.type,
        tournamentId: tournament.id,
      },
    ];
  });
  return playersData;
}

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
    // TODO: Get variables to add to bellow function
    const data = getTournamentCreateData(playerTournament);
    const tx = await contract.joinTournament(data.tournamentId, data.gameType, data.participants);
    await tx.wait();
    // { alias, userID, character, gameType, tournamentID }
    // TODO: Create tournament in the Blockchain
    // TODO: Save tournamentId on each User
    await playerTournament.addTournamentToDB(
      playerTournament.id,
      playerTournament.type,
      playerTournament.getAllPlayerIds(),
    );
    for (const session of playerTournament.sessions) initializeRemoteGame(session);
    const gameStartMsg: ServerMessage = { type: 'game_start' };
    playerTournament.broadcastToAll(JSON.stringify(gameStartMsg));
  }
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
  // TODO: Update data on Blockchain
  const data = {
    gameType: gameArea.settings.gameType,
    user1Id: playerWhoStayed.id,
    score1: 5, // hard-coded win
    user2Id: playerWhoLeft.id,
    score2: playerWhoLeft.score,
    tournamentId: playerTournament.id,
  };
  if (playerWhoStayed.socket.readyState === WebSocket.OPEN)
    playerWhoStayed.socket.send(JSON.stringify(playerLeft));
  // TODO: Advance tournament to next match
  // TODO: set other player as winner (score to 5 ?)
  // TODO: Get variables to add to bellow function
  const tx = await contract.saveScoreAndAddWinner(data.tournamentId, data.gameType, data.user1Id, data.score1, data.user2Id, data.score2);
  await tx.wait();
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
