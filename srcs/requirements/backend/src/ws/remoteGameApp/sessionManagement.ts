import WebSocket from 'ws';
import { background, gameSettings, leanGameSettings } from './settings';
import { getBackgroundList } from './backgroundData';
import { GameSession, GameSessionSerializable } from './types';

const classicPongSessions: GameSession[] = [];
const crazyPongSessions: GameSession[] = [];

// TODO: generate just a random background name?
function getRandomBackground(): background {
  const backgroundList = getBackgroundList();
  return backgroundList[Math.floor(Math.random() * backgroundList.length)];
}

function mergePlayer2IntoGameSettings(
  matchSettings: gameSettings,
  playerSettings: leanGameSettings,
): gameSettings {
  return {
    ...matchSettings,
    alias2: playerSettings.alias,
    paddleColour2: playerSettings.paddleColour,
    character2: playerSettings.character,
  };
}

// TODO: Remove placeholders
function mergePlayer1IntoGameSettings(playerSettings: leanGameSettings): gameSettings {
  return {
    playType: playerSettings.playType,
    gameType: playerSettings.gameType,
    alias1: playerSettings.alias,
    alias2: 'playerPlaceholder',
    paddleColour1: playerSettings.paddleColour,
    paddleColour2: '#ff0000',
    character1: playerSettings.character,
    character2: playerSettings.character,
    background: getRandomBackground(),
  };
}

// TODO: clean up code, smaller function to add player to session
function foundSession(ws: WebSocket, playerSettings: leanGameSettings): boolean {
  if (playerSettings.gameType === 'Classic Pong') {
    for (const session of classicPongSessions) {
      if (session.players.size === 1) {
        session.players.set(ws, playerSettings.playerID);
        session.settings = mergePlayer2IntoGameSettings(session.settings, playerSettings);

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
        session.settings = mergePlayer2IntoGameSettings(session.settings, playerSettings);

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

function createSession(ws: WebSocket, playerSettings: leanGameSettings) {
  const newSession: GameSession = {
    players: new Map<WebSocket, string>([[ws, playerSettings.playerID]]),
    settings: mergePlayer1IntoGameSettings(playerSettings),
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

export function attributePlayerToSession(ws: WebSocket, playerSettings: leanGameSettings) {
  if (!foundSession(ws, playerSettings)) {
    createSession(ws, playerSettings);
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

export function playerIsInASession(playerSocket: WebSocket): boolean {
  const gameSessions = classicPongSessions.concat(crazyPongSessions);
  gameSessions.forEach((session) => {
    if (session.players.get(playerSocket)) {
      return true;
    }
  });
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
