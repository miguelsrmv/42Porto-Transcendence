import { prisma } from '../../utils/prisma';
import { GameArea } from './gameArea';
import { Player } from './player';
import { MatchMode, Character } from '@prisma/client';
import { gameSettings } from './settings';
import { gameRunningState } from './types';

const gameTypeToMatchMode: Record<string, MatchMode> = {
  'Classic Pong': MatchMode.CLASSIC,
  'Crazy Pong': MatchMode.CRAZY,
};

const characterNameToCharacter: Record<string, Character> = {
  Mario: Character.MARIO,
  Pikachu: Character.PIKACHU,
  Yoshi: Character.YOSHI,
  Bowser: Character.BOWSER,
  Sonic: Character.SONIC,
  Kirby: Character.KIRBY,
  Mewtwo: Character.MEWTWO,
  Link: Character.LINK,
  Samus: Character.SAMUS,
  'Captain Falcon': Character.CAPFALCON,
  Snake: Character.SNAKE,
  'Donkey Kong': Character.DK,
};

function getCharacters(settings: gameSettings) {
  let character1: Character;
  let character2: Character;
  if (!settings.character1) {
    character1 = Character.NONE;
  } else {
    character1 = characterNameToCharacter[settings.character1.name];
  }
  if (!settings.character2) {
    character2 = Character.NONE;
  } else {
    character2 = characterNameToCharacter[settings.character2.name];
  }
  return [character1, character2];
}

// TODO: review filter later
function filterGameSettings(settings: gameSettings) {
  return JSON.stringify({
    playType: settings.playType,
    alias1: settings.alias1,
    alias2: settings.alias2,
    paddleColour1: settings.paddleColour1,
    paddleColour2: settings.paddleColour2,
    background: settings.background,
  });
}

// TODO: Deal with function being called twice
async function createMatch(winningPlayer: Player, gameArea: GameArea) {
  const gameMode = gameTypeToMatchMode[gameArea.settings.gameType] ?? MatchMode.CLASSIC;
  const [character1, character2] = getCharacters(gameArea.settings);
  await prisma.match.create({
    data: {
      user1Id: gameArea.leftPlayer.id,
      user2Id: gameArea.rightPlayer.id,
      user1Character: character1,
      user2Character: character2,
      winnerId: winningPlayer.id,
      user1Score: gameArea.stats.left.goals,
      user2Score: gameArea.stats.right.goals,
      mode: gameMode,
      settings: filterGameSettings(gameArea.settings),
    },
  });
}

export async function endGame(winningPlayer: Player, gameArea: GameArea) {
  if (gameArea.isEnding) return;
  gameArea.isEnding = true;
  gameArea.stop();
  const gameEndMsg = {
    type: 'game_end',
    winningPlayer: winningPlayer.side,
    ownSide: 'left',
    stats: gameArea.stats,
  };
  await createMatch(winningPlayer, gameArea);
  if (gameArea.leftPlayer.socket.readyState === WebSocket.OPEN)
    gameArea.leftPlayer.socket.send(JSON.stringify(gameEndMsg));
  gameEndMsg.ownSide = 'right';
  if (gameArea.rightPlayer.socket.readyState === WebSocket.OPEN)
    gameArea.rightPlayer.socket.send(JSON.stringify(gameEndMsg));
}
