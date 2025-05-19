import WebSocket from 'ws';
import { background, gameSettings, leanGameSettings } from './settings';
import { getBackgroundList } from './backgroundData';
import { GameSession, GameSessionSerializable } from './types';
import { prisma } from '../../utils/prisma';
import app from '../../app';

const classicPongSessions: GameSession[] = [];
const crazyPongSessions: GameSession[] = [];

const DEFAULT_AVATAR_PATH = '../../../../static/avatar/default/mario.png';
function getRandomBackground(): background {
  const backgroundList = getBackgroundList();
  return backgroundList[Math.floor(Math.random() * backgroundList.length)];
}

export async function mergePlayer2IntoGameSettings(
  matchSettings: gameSettings,
  playerSettings: leanGameSettings,
) {
  return {
    ...matchSettings,
    alias2: playerSettings.alias,
    avatar2: (await getAvatarFromPlayer(playerSettings.playerID)) || DEFAULT_AVATAR_PATH,
    paddleColour2: playerSettings.paddleColour,
    character2: playerSettings.character,
  };
}

async function getAvatarFromPlayer(playerID: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: playerID } });
  if (!user) app.log.error('User not found in getAvatarFromPlayer');
  return user.avatarUrl;
}

export async function mergePlayer1IntoGameSettings(playerSettings: leanGameSettings) {
  return {
    playType: playerSettings.playType,
    gameType: playerSettings.gameType,
    alias1: playerSettings.alias,
    alias2: 'player2',
    avatar1: (await getAvatarFromPlayer(playerSettings.playerID)) || DEFAULT_AVATAR_PATH,
    avatar2: DEFAULT_AVATAR_PATH,
    paddleColour1: playerSettings.paddleColour,
    paddleColour2: '#ff0000',
    character1: playerSettings.character,
    character2: playerSettings.character,
    background: getRandomBackground(),
  };
}

function gameTypeToSessions(type: string) {
  if (type === 'Classic Pong') return classicPongSessions;
  else return crazyPongSessions;
}

async function foundSession(ws: WebSocket, playerSettings: leanGameSettings) {
  for (const session of gameTypeToSessions(playerSettings.gameType)) {
    if (session.players.size === 1) {
      session.players.set(ws, playerSettings.playerID);
      session.settings = await mergePlayer2IntoGameSettings(session.settings, playerSettings);

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
  const newSession: GameSession = {
    players: new Map<WebSocket, string>([[ws, playerSettings.playerID]]),
    settings: await mergePlayer1IntoGameSettings(playerSettings),
    gameArea: null,
  };

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

export function isSessionFull(session: GameSession): boolean {
  if (session.players.size === 2) return true;
  return false;
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

export function removePlayer(playerSocket: WebSocket) {
  const playerSession = getGameSession(playerSocket);
  if (playerSession) playerSession.players.delete(playerSocket);
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
