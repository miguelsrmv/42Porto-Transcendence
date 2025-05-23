import WebSocket from 'ws';
import { background, leanGameSettings } from './settings';
import { getBackgroundList } from './backgroundData';
import { GameSessionSerializable } from './types';
import { prisma } from '../../utils/prisma';
import app from '../../app';
import { GameSession } from '../gameSession';
import { Player } from './player';

const classicPongSessions: GameSession[] = [];
const crazyPongSessions: GameSession[] = [];

export const DEFAULT_AVATAR_PATH = '../../../../static/avatar/default/mario.png';
export function getRandomBackground(): background {
  const backgroundList = getBackgroundList();
  return backgroundList[Math.floor(Math.random() * backgroundList.length)];
}

export async function getAvatarFromPlayer(playerID: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: playerID } });
  if (!user) app.log.error('User not found in getAvatarFromPlayer');
  return user.avatarUrl;
}

function gameTypeToSessions(type: string) {
  if (type === 'Classic Pong') return classicPongSessions;
  else return crazyPongSessions;
}

async function foundSession(ws: WebSocket, playerSettings: leanGameSettings) {
  for (const session of gameTypeToSessions(playerSettings.gameType)) {
    if (session.players.size === 1) {
      session.players.set(ws, playerSettings.playerID);
      await session.mergePlayer2IntoGameSettings(playerSettings);

      // For testing purposes
      const serializableSession: GameSessionSerializable = {
        players: [...session.players.values()], // only the IDs
        settings: session.settings,
      };

      console.log(
        `Player matched to a ${playerSettings.gameType} GameSession: `,
        JSON.stringify(serializableSession),
      );
      return true;
    }
  }
  return false;
}

async function createSession(ws: WebSocket, playerSettings: leanGameSettings) {
  const newSession = new GameSession(ws, playerSettings);
  await newSession.updateAvatar1(playerSettings.playerID);

  // For testing purposes
  const serializableSession: GameSessionSerializable = {
    players: [...newSession.players.values()], // only the IDs
    settings: newSession.settings,
  };

  gameTypeToSessions(playerSettings.gameType).push(newSession);
  console.log(
    `New ${playerSettings.gameType} GameSession created: `,
    JSON.stringify(serializableSession),
  );
}

export async function attributePlayerToSession(ws: WebSocket, playerSettings: leanGameSettings) {
  if (!(await foundSession(ws, playerSettings))) {
    await createSession(ws, playerSettings);
  }
}

export function getClassicPongSessions(): GameSession[] {
  return classicPongSessions;
}

export function getCrazyPongSessions(): GameSession[] {
  return crazyPongSessions;
}

export function getGameSession(playerSocket: WebSocket): GameSession | null {
  const gameSessions = classicPongSessions.concat(crazyPongSessions);
  for (const session of gameSessions) {
    if (session.players.get(playerSocket)) {
      return session;
    }
  }
  return null;
}

export function playerIsInASession(playerId: string): boolean {
  const gameSessions = classicPongSessions.concat(crazyPongSessions);
  for (const session of gameSessions) {
    for (const value of session.players.values()) {
      if (value === playerId) {
        return true;
      }
    }
  }
  return false;
}

export function removePlayer(player: Player) {
  const playerSession = getGameSession(player.socket);
  if (playerSession) playerSession.players.delete(player.socket);
}

export function removePlayerBySocket(socket: WebSocket) {
  const playerSession = getGameSession(socket);
  if (playerSession) playerSession.players.delete(socket);
}

export function removeSession(sessionToRemove: GameSession) {
  const sessions = gameTypeToSessions(sessionToRemove.settings.gameType);
  const index = sessions.indexOf(sessionToRemove);
  if (index !== -1) {
    sessions.splice(index, 1);
  }
}

// function printSessions() {
//   const gameSessions = classicPongSessions.concat(crazyPongSessions);
//   const serializedSessions = gameSessions.map(({ players, settings }) => ({
//     players: [...players.values()],
//     settings,
//   }));
//   console.log(JSON.stringify(serializedSessions));
// }
