import { background } from './settings';

const backgroundPicturePath = '../../../../static/backgrounds/';

const backgroundList: background[] = [
  {
    name: 'Backyard',
    imagePath: `${backgroundPicturePath}Backyard.png`,
  },
  {
    name: 'Beach',
    imagePath: `${backgroundPicturePath}Beach.png`,
  },
  {
    name: 'Cave',
    imagePath: `${backgroundPicturePath}Cave.png`,
  },
  {
    name: 'Checks',
    imagePath: `${backgroundPicturePath}Checks.png`,
  },
  {
    name: 'Desert',
    imagePath: `${backgroundPicturePath}Desert.png`,
  },
  {
    name: 'Forest',
    imagePath: `${backgroundPicturePath}Forest.png`,
  },
  {
    name: 'Machine',
    imagePath: `${backgroundPicturePath}Machine.png`,
  },
  {
    name: 'Nostalgic',
    imagePath: `${backgroundPicturePath}Nostalgic.png`,
  },
  {
    name: 'Pikapika_Platinum',
    imagePath: `${backgroundPicturePath}Pikapika_Platinum.png`,
  },
  {
    name: 'Pokemon_Center',
    imagePath: `${backgroundPicturePath}Pokemon_Center.png`,
  },
  {
    name: 'River',
    imagePath: `${backgroundPicturePath}River.png`,
  },
  {
    name: 'Savanna',
    imagePath: `${backgroundPicturePath}Savanna.png`,
  },
  {
    name: 'Seafloor',
    imagePath: `${backgroundPicturePath}Seafloor.png`,
  },
  {
    name: 'Simple',
    imagePath: `${backgroundPicturePath}Simple.png`,
  },
  {
    name: 'Sky',
    imagePath: `${backgroundPicturePath}Sky.png`,
  },
  {
    name: 'Snow',
    imagePath: `${backgroundPicturePath}Snow.png`,
  },
  {
    name: 'Space',
    imagePath: `${backgroundPicturePath}Space.png`,
  },
  {
    name: 'Torchic',
    imagePath: `${backgroundPicturePath}Torchic.png`,
  },
  {
    name: 'Volcano',
    imagePath: `${backgroundPicturePath}Volcano.png`,
  },
] as const;

export function getBackgroundList(): background[] {
  return backgroundList;
}
