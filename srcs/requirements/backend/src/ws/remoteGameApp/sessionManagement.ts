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

async function mergePlayer2IntoGameSettings(
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

// TODO: Remove placeholders
async function mergePlayer1IntoGameSettings(playerSettings: leanGameSettings) {
  return {
    playType: playerSettings.playType,
    gameType: playerSettings.gameType,
    alias1: playerSettings.alias,
    alias2: 'playerPlaceholder',
    avatar1: (await getAvatarFromPlayer(playerSettings.playerID)) || DEFAULT_AVATAR_PATH,
    avatar2: DEFAULT_AVATAR_PATH,
    paddleColour1: playerSettings.paddleColour,
    paddleColour2: '#ff0000',
    character1: playerSettings.character,
    character2: playerSettings.character,
    background: getRandomBackground(),
  };
}

// TODO: remove repeated code (pass respective array of sessions)
async function foundSession(ws: WebSocket, playerSettings: leanGameSettings) {
  if (playerSettings.gameType === 'Classic Pong') {
    for (const session of classicPongSessions) {
      if (session.players.size === 1) {
        session.players.set(ws, playerSettings.playerID);
        session.settings = await mergePlayer2IntoGameSettings(session.settings, playerSettings);

        // For testing purposes
        const serializableSession: GameSessionSerializable = {
          players: [...session.players.values()], // only the IDs
          settings: session.settings,
        };

        console.log(
          'Player matched to a Classic Pong GameSession: ',
          JSON.stringify(serializableSession),
        );
        return true;
      }
    }
  } else if (playerSettings.gameType === 'Crazy Pong') {
    for (const session of crazyPongSessions) {
      if (session.players.size === 1) {
        session.players.set(ws, playerSettings.playerID);
        session.settings = await mergePlayer2IntoGameSettings(session.settings, playerSettings);

        // For testing purposes
        const serializableSession: GameSessionSerializable = {
          players: [...session.players.values()], // only the IDs
          settings: session.settings,
        };

        console.log(
          'Player matched to a Crazy Pong GameSession: ',
          JSON.stringify(serializableSession),
        );
        return true;
      }
    }
  }
  return false;
}

async function createSession(ws: WebSocket, playerSettings: leanGameSettings) {
  const newSession: GameSession = {
    players: new Map<WebSocket, string>([[ws, playerSettings.playerID]]),
    settings: await mergePlayer1IntoGameSettings(playerSettings),
  };

  // For testing purposes
  const serializableSession: GameSessionSerializable = {
    players: [...newSession.players.values()], // only the IDs
    settings: newSession.settings,
  };

  if (playerSettings.gameType === 'Classic Pong') {
    classicPongSessions.push(newSession);
    console.log('New Classic GameSession created: ', JSON.stringify(serializableSession));
  } else if (playerSettings.gameType === 'Crazy Pong') {
    crazyPongSessions.push(newSession);
    console.log('New Crazy GameSession created: ', JSON.stringify(serializableSession));
  }
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

// TODO: Cover case where multiple instances of a WS?
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

// function printSessions() {
//   const gameSessions = classicPongSessions.concat(crazyPongSessions);
//   const serializedSessions = gameSessions.map(({ players, settings }) => ({
//     players: [...players.values()],
//     settings,
//   }));
//   console.log(JSON.stringify(serializedSessions));
// }
