export type attackIdentifier =
  | 'Super Shroom'
  | 'Egg Barrage'
  | 'Spin Dash'
  | 'Thunder Wave'
  | 'Confusion'
  | 'Magic Mirror'
  | 'Mini'
  | 'Giant Punch';

export interface character {
  name: string;
  attack: attackIdentifier;
  characterSelectPicturePath: string;
  characterAvatarPicturePath: string;
  accentColour: string;
  selectHelpMessage: string;
}

export interface background {
  name: string;
  imagePath: string;
}

export type playType = 'Remote Play' | 'Tournament Play';

export type gameType = 'Classic Pong' | 'Crazy Pong';

export interface gameSettings {
  playType: playType;
  gameType: gameType;
  alias1: string;
  alias2: string;
  avatar1: string;
  avatar2: string;
  paddleColour1: string;
  paddleColour2: string;
  character1: character | null;
  character2: character | null;
  background: background;
}

export interface leanGameSettings {
  playerID: string;
  playType: playType;
  gameType: gameType;
  alias: string;
  paddleColour: string;
  character: character | null;
}

export interface playerSettings {
  playerID: string;
  alias: string;
  paddleColour: string;
  character: character | null;
}