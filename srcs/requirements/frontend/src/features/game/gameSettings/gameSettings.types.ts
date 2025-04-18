import { background } from '../backgroundData/backgroundData.types.js';
import { character } from '../characterData/characterData.types.js';

export type playType = 'Local Play' | 'Remote Play' | 'Tournament Play';

export type gameType = 'Classic Pong' | 'Crazy Pong';

export interface gameSettings {
  playType: playType;
  gameType: gameType;
  alias1?: string | null;
  alias2?: string | null;
  paddleColour1: string;
  paddleColour2?: string | null;
  character1?: character | null;
  character2?: character | null;
  background: background;
}
