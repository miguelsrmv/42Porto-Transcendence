import { prisma } from '../../utils/prisma';
import { GameArea } from './gameArea';
import { Player } from './player';
import { Character } from '@prisma/client';
import { gameSettings } from './settings';
import { gameTypeToGameMode } from '../../utils/helpers';
import { updateLeaderboardRemote } from '../../api/services/leaderboard.services';
import { contractSigner } from '../../api/services/blockchain.services';

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

export function getCharacters(settings: gameSettings) {
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
    background: settings.background.name,
  });
}

export async function createMatchPlayerLeft(winningPlayer: Player, gameArea: GameArea) {
  const gameMode = gameTypeToGameMode(gameArea.settings.gameType);
  const [character1, character2] = getCharacters(gameArea.settings);
  await prisma.match.create({
    data: {
      user1Id: gameArea.leftPlayer.id,
      user2Id: gameArea.rightPlayer.id,
      user1Character: character1,
      user2Character: character2,
      winnerId: winningPlayer.id,
      user1Score: gameArea.leftPlayer === winningPlayer ? 5 : gameArea.stats.left.goals,
      user2Score: gameArea.rightPlayer === winningPlayer ? 5 : gameArea.stats.right.goals,
      mode: gameMode,
      settings: filterGameSettings(gameArea.settings),
    },
  });
}

async function createMatch(winningPlayer: Player, gameArea: GameArea) {
  const gameMode = gameTypeToGameMode(gameArea.settings.gameType);
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
  if (gameArea.tournament) {
    await gameArea.tournament!.updateSessionScore(gameArea.session, winningPlayer.id);
    gameArea.session.broadcastEndGameMessage(winningPlayer);
    await gameArea.tournament.removePlayer(gameArea.getOtherPlayer(winningPlayer).socket);
    try {
      const tx = await contractSigner.saveScoreAndAddWinner(
        gameArea.tournament!.id,
        gameArea.settings.gameType,
        gameArea.leftPlayer.id,
        BigInt(gameArea.leftPlayer.score),
        gameArea.rightPlayer.id,
        BigInt(gameArea.rightPlayer.score),
      );
      await tx.wait();
    } catch (err) {
      console.log(`Error calling saveScoreAndAddWinner in gameEnd: ${err}`);
    }
  } else {
    await createMatch(winningPlayer, gameArea);
    await updateLeaderboardRemote(winningPlayer, gameArea.getOtherPlayer(winningPlayer));
    gameArea.session.broadcastEndGameMessage(winningPlayer);
    await gameArea.session.clear();
  }
}
