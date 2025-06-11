export function editGridLayout(): void {
  const settingsMenu = document.getElementById('settings-columns');
  if (!settingsMenu) {
    console.log("Couldn't find settings menu");
    return;
  }

  settingsMenu.classList.remove('flex', 'flex-row', 'h-full', 'overflow-hidden');
  settingsMenu.classList.add('grid', 'grid-cols-4', 'items-start');

  editPlayerAlias(settingsMenu);
  showOtherPlayers(settingsMenu);
  resizeGrid(settingsMenu);
}

function editPlayerAlias(settingsMenu: HTMLElement): void {
  for (let i: number = 1; i <= 2; i++) {
    const player = settingsMenu.querySelector(`#player-${i}-alias`) as HTMLInputElement;
    if (!player) {
      console.log(`Couldn't find player-${i}-alias`);
      return;
    }
    player.placeholder = `Player ${i}`;
  }
}

function showOtherPlayers(settingsMenu: HTMLElement): void {
  for (let i: number = 3; i <= 8; i++) {
    const player = settingsMenu.querySelector(`#player-${i}-settings`);
    if (!player) {
      console.log(`Couldn't find player-${i}-settings`);
      return;
    }
    player.classList.remove('hidden');
  }
}

function resizeGrid(settingsMenu: HTMLElement) {
  for (let i: number = 1; i <= 8; i++) {
    const player = settingsMenu.querySelector(`#player-${i}-settings`);
    if (!player) {
      console.log(`Couldn't find player-${i}-settings`);
      return;
    }
    player.classList.remove('p-6');
    player.classList.add('p-2');

    const playerNameSection = player.querySelector(`#player-${i}-name`);
    if (!playerNameSection) {
      console.log(`Couldn't find player-${i}-name`);
      return;
    }
    playerNameSection.classList.add('flex', 'flex-row', 'gap-2', 'justify-between', 'items-center');

    const playerAlias = player.querySelector(`#player-${i}-alias-label`);
    if (!playerAlias) {
      console.log(`Couldn't find player-${i}-alias-label`);
      return;
    }
    playerAlias.classList.remove('mb-6');

    const playerPaddleSection = player.querySelector(`#player-${i}-paddle-colour`);
    if (!playerPaddleSection) {
      console.log(`Couldn't find player-${i}-colour`);
      return;
    }
    playerPaddleSection.classList.remove('mt-6');
    playerPaddleSection.classList.add(
      'flex',
      'flex-row',
      'gap-2',
      'justify-between',
      'items-center',
      'w-3/4',
    );

    const playerPaddleLabel = player.querySelector(`#player-${i}-paddle-colour-input-label`);
    if (!playerPaddleLabel) {
      console.log(`Couldn't find player-${i}-paddle-colour-input-label`);
      return;
    }
    playerPaddleLabel.classList.remove('mb-2', 'block');

    const playerPaddleInput = player.querySelector(`#player-${i}-paddle-colour-input`);
    if (!playerPaddleInput) {
      console.log(`Couldn't find player-${i}-paddle-colour-input`);
      return;
    }
    playerPaddleInput.classList.remove('w-1/2');
    playerPaddleInput.classList.add('w-1/3');

    const playerCharacter = player.querySelector(`#player-${i}-character`);
    if (!playerCharacter) {
      console.log(`Couldn't find player-${i}-character`);
      return;
    }
    playerCharacter.classList.remove('flex-col', 'mt-6');
    playerCharacter.classList.add('flex-row', 'w-3/4', 'justify-between', 'items-center', 'gap-2');

    const prevCharacter = player.querySelector(`#prev-character-${i}`) as HTMLButtonElement;
    if (!prevCharacter) {
      console.log(`Couldn't find prev-character-${i}`);
      return;
    }

    prevCharacter.innerText = '<';

    const nextCharacter = player.querySelector(`#next-character-${i}`) as HTMLButtonElement;
    if (!nextCharacter) {
      console.log(`Couldn't find next-character-${i}`);
      return;
    }

    nextCharacter.innerText = '>';

    const characterDisplay = player.querySelector(`#character-display-${i}`);
    if (!characterDisplay) {
      console.log(`Couldn't find character-display-${i}`);
      return;
    }

    characterDisplay.classList.remove('w-48', 'h-48', 'p-3');
    characterDisplay.classList.add('w-12', 'h-12');

    const characterSelect = player.querySelector(`#character-select-${i}`);
    if (!characterSelect) {
      console.log(`Couldn't find character-select-${i}`);
      return;
    }

    characterSelect.classList.remove('gap-6');

    const helperText = player.querySelector(`#character-helper-text-${i}`);
    if (!helperText) {
      console.log(`Couldn't find character-helper-text-${i}`);
      return;
    }

    helperText.classList.add('text-xs');
    playerCharacter.after(helperText);
  }
}
