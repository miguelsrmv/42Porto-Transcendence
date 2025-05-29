/**
 * Imports necessary types for tournament player and phase.
 */
import { tournamentPlayer, TournamentPhase } from './tournamentStatusNew.types.js';

/**
 * Displays the tournament status by populating the tournament tree with participant data.
 *
 * @param participants - Array of tournament players.
 * @returns A cloned Node containing the tournament tree, or undefined if the tournament block is not found.
 */
export function showTournamentStatus(participants: tournamentPlayer[]): Node | undefined {
  const tournamentBlock = document.getElementById('tournament-tree') as HTMLTemplateElement;
  if (!tournamentBlock) {
    console.log("Couldn't find tournamentBlock");
    return;
  }

  const clone = tournamentBlock.content.cloneNode(true) as DocumentFragment;

  fillParticipants(clone, participants, TournamentPhase.Quarter);
  fillParticipants(clone, participants, TournamentPhase.Semi);
  fillParticipants(clone, participants, TournamentPhase.Final);

  return clone;
}

/**
 * Populates the tournament block with participant data for a specific phase.
 *
 * @param tournamentBlock - The cloned tournament tree block.
 * @param participants - Array of tournament players.
 * @param phase - The current tournament phase.
 */
function fillParticipants(
  tournamentBlock: DocumentFragment,
  participants: tournamentPlayer[],
  phase: TournamentPhase,
): void {
  const trimmedParticipants: tournamentPlayer[] = getPhaseParticipants(phase, participants);
  const playerElements = tournamentBlock.querySelectorAll(`.${phase}`);
  const scoreElements = tournamentBlock.querySelectorAll(`.${phase}Score`);

  console.log('Trimmed participants: ', trimmedParticipants);
  console.log(phase, ' ', playerElements);

  for (let i = 0; i < trimmedParticipants.length; i++) {
    const playerEl = playerElements[i] as HTMLParagraphElement;
    playerEl.innerText = trimmedParticipants[i].userAlias;

    const scoreEl = scoreElements[i] as HTMLParagraphElement;
    scoreEl.innerText = getMatchScore(trimmedParticipants[i], phase) ?? '';

    if (playerHasWon(trimmedParticipants, i, phase)) {
      playerEl.classList.add('text-green-500');
      scoreEl.classList.add('text-green-500');
    }
  }
}

/**
 * Filters participants based on the current tournament phase.
 *
 * @param phase - The current tournament phase.
 * @param participants - Array of tournament players.
 * @returns An array of participants relevant to the given phase.
 */
function getPhaseParticipants(
  phase: TournamentPhase,
  participants: tournamentPlayer[],
): tournamentPlayer[] {
  if (phase === TournamentPhase.Semi) {
    return participants.filter((participant) => participant.semiFinalScore !== '');
  } else if (phase === TournamentPhase.Final) {
    return participants.filter((participant) => participant.finalScore !== '');
  } else return participants;
}

/**
 * Retrieves the match score for a participant based on the phase identifier.
 *
 * @param participant - A tournament player.
 * @param identifier - The phase identifier.
 * @returns The match score as a string, or null if not available.
 */
function getMatchScore(participant: tournamentPlayer, identifier: string): string | null {
  if (identifier === 'TournamentPlayer') return participant.quarterFinalScore;
  else if (identifier === 'QFWinner') return participant.semiFinalScore;
  else return participant.finalScore;
}

/**
 * Determines if a participant has won their match in the given phase.
 *
 * @param trimmedParticipants - Array of participants relevant to the current phase.
 * @param i - Index of the participant in the array.
 * @param phase - The current tournament phase.
 * @returns True if the participant has won, false otherwise.
 */
function playerHasWon(
  trimmedParticipants: tournamentPlayer[],
  i: number,
  phase: TournamentPhase,
): boolean {
  const player: tournamentPlayer = trimmedParticipants[i];
  const opponent: tournamentPlayer =
    i % 2 ? trimmedParticipants[i - 1] : trimmedParticipants[i + 1];

  const playerScore = getMatchScore(player, phase);
  const opponentScore = getMatchScore(opponent, phase);

  if (playerScore === null || opponentScore === null) return false;
  else return Number(playerScore) > Number(opponentScore);
}
