import { PlayerInfo } from './gameSession';
import { gameType, leanGameSettings, playerSettings, playType } from './remoteGameApp/settings';
import { PlayerInput, ServerMessage, tournamentPlayer } from './remoteGameApp/types';
import WebSocket from 'ws';

export function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function isPlayerInput(direction: string) {
  return Object.values(PlayerInput).includes(direction as PlayerInput);
}

export function isGameType(type: string) {
  const types: gameType[] = ['Classic Pong', 'Crazy Pong'];
  return types.includes(type as gameType);
}

export function isPlayType(type: string) {
  const types: playType[] = ['Remote Play', 'Tournament Play'];
  return types.includes(type as playType);
}

function isValidHexColor(hex: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hex);
}

export function areGameSettingsValid(
  socket: WebSocket,
  userId: string,
  playerSettings: leanGameSettings,
) {
  if (playerSettings.playerID !== userId) {
    sendErrorMessage(socket, `Request user does not match settings playerId`);
    closeSocket(socket);
    return false;
  }
  if (!isGameType(playerSettings.gameType) || !isPlayType(playerSettings.playType)) {
    sendErrorMessage(
      socket,
      `gameType: '${playerSettings.gameType}' or playType: '${playerSettings.playType}' not valid`,
    );
    closeSocket(socket);
    return false;
  }
  if (playerSettings.gameType === 'Crazy Pong' && !playerSettings.character) {
    sendErrorMessage(socket, `Crazy Pong matches must have a character`);
    closeSocket(socket);
    return false;
  }
  // TODO: validate character
  if (!isValidHexColor(playerSettings.paddleColour)) playerSettings.paddleColour = '#000000';
  const newAlias = playerSettings.alias.trim();
  playerSettings.alias = newAlias;
  if (newAlias.length === 0) playerSettings.alias = 'empty';
  return true;
}

export function sendErrorMessage(ws: WebSocket, message: string) {
  const errorMessage = JSON.stringify({ type: 'error', message: message } as ServerMessage);
  if (ws.readyState === WebSocket.OPEN) ws.send(errorMessage);
}

export function playerInfoToPlayerSettings(player: PlayerInfo): playerSettings {
  return {
    playerID: player.id,
    alias: player.alias,
    character: player.character,
    paddleColour: player.paddleColour,
  };
}

export function closeSocket(ws: WebSocket) {
  if (ws.readyState !== WebSocket.CLOSED) {
    ws.close();
  }
}

export function playerInfoToTournamentPlayer(players: PlayerInfo[]) {
  return players.map((p) => {
    return {
      id: p.id,
      userAlias: p.alias,
      avatarPath: p.avatar,
      quarterFinalScore: p.scoreQuarterFinals?.toString() ?? '',
      semiFinalScore: p.scoreSemiFinals?.toString() ?? '',
      finalScore: p.scoreFinals?.toString() ?? '',
    };
  }) as tournamentPlayer[];
}
