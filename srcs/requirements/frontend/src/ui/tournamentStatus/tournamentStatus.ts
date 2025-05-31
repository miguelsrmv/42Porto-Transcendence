/**
 * Imports necessary types for tournament player and phase.
 */
import { tournamentPlayer, TournamentPhase } from './tournamentStatus.types.js';

/**
 * Displays the tournament status by populating the tournament tree with participant data.
 *
 * @param participants - Array of tournament players.
 */
export function showTournamentStatus(participants: tournamentPlayer[]): void {
  const tournamentBlock = document.getElementById('tournament-tree') as HTMLTemplateElement;
  if (!tournamentBlock) {
    console.log("Couldn't find tournamentBlock");
    return;
  }

  const clone = tournamentBlock.content.cloneNode(true) as DocumentFragment;

  fillParticipants(clone, participants, TournamentPhase.Quarter);
  fillParticipants(clone, participants, TournamentPhase.Semi);
  fillParticipants(clone, participants, TournamentPhase.Final);

  const waitingGameModal = document.getElementById('waiting-game-modal') as HTMLDivElement;
  if (!waitingGameModal) {
    console.log("Couldn't find tournamentBlock");
    return;
  }

  waitingGameModal.innerText = '';
  waitingGameModal.appendChild(clone);
}

/**
 * Displays the tournament final results by populating the tournament tree with participant data.
 *
 * @param participants - Array of tournament players.
 */
export function showTournamentResults(participants: tournamentPlayer[]): void {
  const tournamentBlock = document.getElementById('tournament-tree') as HTMLTemplateElement;
  if (!tournamentBlock) {
    console.log("Couldn't find tournamentBlock");
    return;
  }

  const clone = tournamentBlock.content.cloneNode(true) as DocumentFragment;

  fillParticipants(clone, participants, TournamentPhase.Quarter);
  fillParticipants(clone, participants, TournamentPhase.Semi);
  fillParticipants(clone, participants, TournamentPhase.Final);

  const tournamentModal = document.getElementById('tournament-modal') as HTMLDivElement;
  if (!tournamentModal) {
    console.log("Couldn't find tournament modal");
    return;
  }

  const tournamentResults = document.getElementById('tournament-results') as HTMLDivElement;
  if (!tournamentResults) {
    console.log("Couldn't find tournament results");
    return;
  }

  tournamentResults.appendChild(clone);
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

  hideFutureMatches(phase, trimmedParticipants);

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
 * Hides boxes from events still to happen
 * @param participants - Array of tournament players.
 * @param phase - The current tournament phase.
 */
function hideFutureMatches(phase: TournamentPhase, trimmedParticipants: tournamentPlayer[]): void {
  if (trimmedParticipants.length) return;

  let phaseToHide;
  if (phase === TournamentPhase.Semi) phaseToHide = 'semifinals';
  else if (phase === TournamentPhase.Final) phaseToHide = 'finals';
  else return;

  const elementToHide = document.getElementById(phaseToHide);
  if (!elementToHide) {
    console.log(`Couldn't find ${phaseToHide} element`);
    return;
  }

  elementToHide.classList.add('hidden');
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
    return participants.filter((participant) => participant.semiFinalScore !== null);
  } else if (phase === TournamentPhase.Final) {
    return participants.filter((participant) => participant.finalScore !== null);
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
