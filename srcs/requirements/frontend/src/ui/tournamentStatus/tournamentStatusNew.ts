import { tournamentPlayer } from './tourmanetStatusNew.types.js';

export function showTournamentStatus(participants: tournamentPlayer[]): Node | undefined {
  const tournamentBlock = document.getElementById('tournament-tree') as HTMLTemplateElement;
  if (!tournamentBlock) {
    console.log("Couldn't find tournamentBlock");
    return;
  }

  const clone = tournamentBlock.content.cloneNode(true) as DocumentFragment;

  fillWithParticipants(clone, participants);
  return clone;
}

function fillWithParticipants(
  tournamentBlock: DocumentFragment,
  participants: tournamentPlayer[],
): void {
  fillQFparticipants(tournamentBlock, participants);
}

function fillQFparticipants(
  tournamentBlock: DocumentFragment,
  participants: tournamentPlayer[],
): void {
  for (let i = 0; i < 8; i++) {
    const playerEl = tournamentBlock.querySelector(
      `.TournamentPlayer${i + 1}`,
    ) as HTMLParagraphElement;
    if (!playerEl) {
      console.log(`Couldn't find Tournament Player ${i + 1}`);
      return;
    }

    playerEl.innerText = participants[i].userAlias;

    const scoreEl = tournamentBlock.querySelector(
      `.TournamentPlayer${i + 1}Score`,
    ) as HTMLParagraphElement;
    if (!scoreEl) {
      console.log(`Couldn't find Tournament Player ${i + 1} Score`);
      return;
    }
  }

  function fillSFparticipants(
    tournamentBlock: DocumentFragment,
    participants: tournamentPlayer[],
  ): void {
    fillParticipants(tournamentBlock, participants, 4, 6);
  }

  function fillFinalParticipants(
    tournamentBlock: DocumentFragment,
    participants: tournamentPlayer[],
  ) {
    fillParticipants(tournamentBlock, participants, 7, 8);
  }

  function fillParticipants(
    tournamentBlock: DocumentFragment,
    participants: tournamentPlayer[],
    startingIndex: number,
    endingIndex: number,
  ): void {
    // TODO: Uncomment and adjust variable name once I know what gets sent
    // if (participants[i].score != null) {
    //   scoreEl.innerText = participants[i].score;
    //   if (
    //     (i % 2 && participants[i].score > participants[i + 1].score) ||
    //     (!(i % 2) && participants[i].score < participants[i + 1].score)
    //   ) {
    //     playerEl.classList.add('text-green-500');
    //     scoreEl.classList.add('text-green-500');
    //   }
    // }
  }
}
