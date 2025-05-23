import WebSocket from 'ws';
import { background, gameType, leanGameSettings } from './remoteGameApp/settings';
import { getBackgroundList } from './remoteGameApp/backgroundData';
import { prisma } from '../utils/prisma';
import app from '../app';
import { GameSession } from './gameSession';

const classicPongSessions: GameSession[] = [];
const crazyPongSessions: GameSession[] = [];

export function getRandomBackground(): background {
  const backgroundList = getBackgroundList();
  return backgroundList[Math.floor(Math.random() * backgroundList.length)];
}

export async function getAvatarFromPlayer(playerID: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: playerID } });
  if (!user) app.log.error('User not found in getAvatarFromPlayer');
  return user.avatarUrl;
}

function gameTypeToSessions(type: gameType) {
  if (type === 'Classic Pong') return classicPongSessions;
  else return crazyPongSessions;
}

async function foundSession(ws: WebSocket, playerSettings: leanGameSettings) {
  for (const session of gameTypeToSessions(playerSettings.gameType)) {
    if (session.players.length === 1) {
      await session.setPlayer(ws, playerSettings);

      console.log(
        `Player matched to a ${playerSettings.gameType} GameSession: `,
        JSON.stringify(session.print()),
      );
      return true;
    }
  }
  return false;
}

async function createSession(ws: WebSocket, playerSettings: leanGameSettings) {
  const newSession = new GameSession(playerSettings.gameType, playerSettings.playType);
  await newSession.setPlayer(ws, playerSettings);

  gameTypeToSessions(playerSettings.gameType).push(newSession);
  console.log(
    `New ${playerSettings.gameType} GameSession created: `,
    JSON.stringify(newSession.print()),
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

export function getGameSession(playerSocket: WebSocket): GameSession | undefined {
  const allSessions = classicPongSessions.concat(crazyPongSessions);
  return allSessions.find((session) => session.players.some((p) => p.socket === playerSocket));
}

export function playerIsInASession(playerId: string): boolean {
  const allSessions = classicPongSessions.concat(crazyPongSessions);
  return allSessions.some((session) => session.players.some((p) => p.id === playerId));
}

export async function removePlayerBySocket(socket: WebSocket) {
  const playerSession = getGameSession(socket);
  if (playerSession) await playerSession.removePlayer(socket);
}

export function removeSession(sessionToRemove: GameSession) {
  const sessions = gameTypeToSessions(sessionToRemove.gameType);
  const index = sessions.indexOf(sessionToRemove);
  if (index !== -1) sessions.splice(index, 1);
}
