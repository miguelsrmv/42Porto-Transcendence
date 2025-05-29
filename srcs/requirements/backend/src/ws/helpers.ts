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
      alias: p.alias,
      avatar: p.avatar,
      scoreQuarterFinals: p.scoreQuarterFinals,
      scoreSemiFinals: p.scoreSemiFinals,
      scoreFinals: p.scoreFinals,
    };
  }) as tournamentPlayer[];
}
