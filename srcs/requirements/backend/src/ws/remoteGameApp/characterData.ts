export interface character {
  name: string;
  attack: attackIdentifier;
  characterSelectPicturePath: string;
  characterAvatarPicturePath: string;
  accentColour: string;
  selectHelpMessage: string;
}

type attackIdentifier =
  | 'Super Shroom'
  | 'Egg Barrage'
  | 'Spin Dash'
  | 'Thunder Wave'
  | 'Confusion'
  | 'Gale Boomerang'
  | 'The Amazing Mirror'
  | 'Giant Punch'
  | 'Morph Ball'
  | 'Falcon Dive'
  | 'Shell Decoy'
  | 'Sabotage';

const characterSelectPicturePath = '../../../../static/character_select/';
const characterAvatarPicturePath = '../../../../static/character_portrait/';

export const characterList: character[] = [
  {
    name: 'Mario',
    attack: 'Super Shroom',
    characterSelectPicturePath: `${characterSelectPicturePath}mario.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}mario.png`,
    accentColour: 'red',
    selectHelpMessage: "Eat one to increase your paddle's size!",
  },
  {
    name: 'Yoshi',
    attack: 'Egg Barrage',
    characterSelectPicturePath: `${characterSelectPicturePath}yoshi.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}yoshi.png`,
    accentColour: 'green',
    selectHelpMessage: 'Fill the field with fake targets!',
  },
  {
    name: 'Donkey Kong',
    attack: 'Giant Punch',
    characterSelectPicturePath: `${characterSelectPicturePath}donkey_kong.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}donkey_kong.png`,
    accentColour: 'orange',
    selectHelpMessage: "Smash your opponent's paddle!",
  },
  {
    name: 'Bowser',
    attack: 'Shell Decoy',
    characterSelectPicturePath: `${characterSelectPicturePath}bowser.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}bowser.png`,
    accentColour: 'lime',
    selectHelpMessage: 'Hide the ball in your shell!',
  },
  {
    name: 'Sonic',
    attack: 'Spin Dash',
    characterSelectPicturePath: `${characterSelectPicturePath}sonic.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}sonic.png`,
    accentColour: 'blue',
    selectHelpMessage: "Increase the ball's speed!",
  },
  {
    name: 'Pikachu',
    attack: 'Thunder Wave',
    characterSelectPicturePath: `${characterSelectPicturePath}pikachu.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}pikachu.png`,
    accentColour: 'yellow',
    selectHelpMessage: "Paralyze your opponent's paddle",
  },
  {
    name: 'Mewtwo',
    attack: 'Confusion',
    characterSelectPicturePath: `${characterSelectPicturePath}mewtwo.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}mewtwo.png`,
    accentColour: 'purple',
    selectHelpMessage: "Mess with your opponent's controls!",
  },
  {
    name: 'Link',
    attack: 'Gale Boomerang',
    characterSelectPicturePath: `${characterSelectPicturePath}link.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}link.png`,
    accentColour: 'cyan',
    selectHelpMessage: "Invert the ball's trajectory!",
  },
  {
    name: 'Kirby',
    attack: 'The Amazing Mirror',
    characterSelectPicturePath: `${characterSelectPicturePath}kirby.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}kirby.png`,
    accentColour: 'pink',
    selectHelpMessage: "Use your enemy's powers!",
  },
  {
    name: 'Samus',
    attack: 'Morph Ball',
    characterSelectPicturePath: `${characterSelectPicturePath}samus.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}samus.png`,
    accentColour: 'amber',
    selectHelpMessage: "Slow down the ball with Samus' morph!",
  },
  {
    name: 'Captain Falcon',
    attack: 'Falcon Dive',
    characterSelectPicturePath: `${characterSelectPicturePath}captain_falcon.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}captain_falcon.png`,
    accentColour: 'indigo',
    selectHelpMessage: 'Speed up your paddle!',
  },
  {
    name: 'Snake',
    attack: 'Sabotage',
    characterSelectPicturePath: `${characterSelectPicturePath}snake.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}snake.png`,
    accentColour: 'zinc',
    selectHelpMessage: "Hide your opponent's paddle!",
  },
];
