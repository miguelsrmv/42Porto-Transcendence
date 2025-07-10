import type { playType } from '../features/game/gameSettings/gameSettings.types.ts';

export function showHowToPlay(playType: playType): void {
  const howToPlayElement = document.getElementById('how-to');
  if (!howToPlayElement) {
    console.log("Couldn't find how-to element");
    return;
  }

  if (howToPlayElement.dataset.listenerAdded === 'true') {
    return;
  }

  howToPlayElement.addEventListener('click', () => {
    const message = getHelperTextFromPlayType(playType);
    alert(message);
  });

  howToPlayElement.dataset.listenerAdded = 'true';
}

function getHelperTextFromPlayType(playType: playType): string {
  let message;

  switch (playType) {
    case 'Local Play':
    case 'Local Tournament Play':
      message =
        'Player 1: Use W/S to move your paddle. On Crazy Pong, use Space Bar to activate your power.\n\nPlayer 2: Use Up/Down to move your paddle. On Crazy Pong, use Enter to activate your power.';
      break;
    case 'Remote Play':
    case 'Remote Tournament Play':
      message =
        'Use Up/Down to move your paddle. On Crazy Pong, use Space Bar to activate your power.';
      break;
  }

  return message;
}
