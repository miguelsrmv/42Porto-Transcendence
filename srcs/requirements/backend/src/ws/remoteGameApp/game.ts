import WebSocket from 'ws';
import { background, gameSettings, leanGameSettings } from './settings';
import { getBackgroundList } from './backgroundData';

const classicPongSessions: GameSession[] = [];
const crazyPongSessions: GameSession[] = [];

// TODO: Add gameState
interface GameSession {
  players: { [id: string]: WebSocket };
  settings: gameSettings;
}

// To be able to print
interface GameSessionSerializable {
  players: string[]; // just the player IDs
  settings: gameSettings;
}

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

function mergePlayer1IntoGameSettings(playerSettings: leanGameSettings): gameSettings {
  return {
    playType: playerSettings.playType,
    gameType: playerSettings.gameType,
    alias1: playerSettings.alias,
    alias2: '',
    paddleColour1: playerSettings.paddleColour,
    paddleColour2: '',
    character1: playerSettings.character,
    character2: null,
    background: getRandomBackground(),
  };
}

function foundSession(ws: WebSocket, playerSettings: leanGameSettings): boolean {
  if (playerSettings.gameType === 'Classic Pong') {
    for (const session of classicPongSessions.values()) {
      if (Object.keys(session.players).length === 1) {
        session.players[playerSettings.playerID] = ws;
        session.settings = mergePlayer2IntoGameSettings(session.settings, playerSettings);

        // For testing purposes
        const serializableSession: GameSessionSerializable = {
          players: Object.keys(session.players), // only the IDs
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
    for (const session of crazyPongSessions.values()) {
      if (Object.keys(session.players).length === 1) {
        session.players[playerSettings.playerID] = ws;
        session.settings = mergePlayer2IntoGameSettings(session.settings, playerSettings);

        // For testing purposes
        const serializableSession: GameSessionSerializable = {
          players: Object.keys(session.players), // only the IDs
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
    players: { [playerSettings.playerID]: ws },
    settings: mergePlayer1IntoGameSettings(playerSettings),
  };

  // For testing purposes
  const serializableSession: GameSessionSerializable = {
    players: Object.keys(newSession.players), // only the IDs
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
