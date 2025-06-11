/**
 * @file avatarDefaultData.ts
 * @brief Provides data and functions related to game avatarDefault images.

 * This file contains the path to avatarDefault images and a list of available avatarDefaults
 * with their respective image paths. It also provides a function to retrieve the list
 * of avatarDefaults.
 */

import { avatar } from './avatarData.types.js';

/**
 * @brief Path to the avatarDefault selection images.
 *
 * This constant defines the base path where all avatarDefault images are stored.
 */
const avatarDefaultPicturePath = '../../../../static/avatar/default/';
/**
 * @brief List of available avatarDefaults.
 *
 * This constant array contains objects representing each avatarDefault, including its name
 * and the path to its image file.
 */
export const avatarList: avatar[] = [
  { name: 'Bayonetta', imagePath: `${avatarDefaultPicturePath}bayonetta.png` },
  { name: 'Corrin', imagePath: `${avatarDefaultPicturePath}corrin.png` },
  { name: 'Dr Mario', imagePath: `${avatarDefaultPicturePath}dr_mario.png` },
  { name: 'Ice Climbers', imagePath: `${avatarDefaultPicturePath}ice_climbers.png` },
  { name: 'Ken', imagePath: `${avatarDefaultPicturePath}ken.png` },
  { name: 'Lucario', imagePath: `${avatarDefaultPicturePath}lucario.png` },
  { name: 'Mega Man', imagePath: `${avatarDefaultPicturePath}mega_man.png` },
  { name: 'Olimar', imagePath: `${avatarDefaultPicturePath}olimar.png` },
  { name: 'Piranha Plant', imagePath: `${avatarDefaultPicturePath}piranha_plant.png` },
  { name: 'Rob', imagePath: `${avatarDefaultPicturePath}rob.png` },
  { name: 'Shulk', imagePath: `${avatarDefaultPicturePath}shulk.png` },
  { name: 'Wario', imagePath: `${avatarDefaultPicturePath}wario.png` },
  { name: 'Zero Suit Samus', imagePath: `${avatarDefaultPicturePath}zero_suit_samus.png` },
  { name: 'Bowser Jr', imagePath: `${avatarDefaultPicturePath}bowser_jr.png` },
  { name: 'Daisy', imagePath: `${avatarDefaultPicturePath}daisy.png` },
  { name: 'Duck Hunt', imagePath: `${avatarDefaultPicturePath}duck_hunt.png` },
  { name: 'Ike', imagePath: `${avatarDefaultPicturePath}ike.png` },
  { name: 'King Dedede', imagePath: `${avatarDefaultPicturePath}king_dedede.png` },
  { name: 'Lucas', imagePath: `${avatarDefaultPicturePath}lucas.png` },
  { name: 'Meta Knight', imagePath: `${avatarDefaultPicturePath}meta_knight.png` },
  { name: 'Pac Man', imagePath: `${avatarDefaultPicturePath}pac_man.png` },
  { name: 'Pit', imagePath: `${avatarDefaultPicturePath}pit.png` },
  { name: 'Rosalina And Luma', imagePath: `${avatarDefaultPicturePath}rosalina_and_luma.png` },
  { name: 'Simon', imagePath: `${avatarDefaultPicturePath}simon.png` },
  { name: 'Wii Fit Trainer', imagePath: `${avatarDefaultPicturePath}wii_fit_trainer.png` },
  { name: 'Bowser', imagePath: `${avatarDefaultPicturePath}bowser.png` },
  { name: 'Dark Pit', imagePath: `${avatarDefaultPicturePath}dark_pit.png` },
  { name: 'Falco', imagePath: `${avatarDefaultPicturePath}falco.png` },
  { name: 'Incineroar', imagePath: `${avatarDefaultPicturePath}incineroar.png` },
  { name: 'King K Rool', imagePath: `${avatarDefaultPicturePath}king_k_rool.png` },
  { name: 'Lucina', imagePath: `${avatarDefaultPicturePath}lucina.png` },
  { name: 'Mewtwo', imagePath: `${avatarDefaultPicturePath}mewtwo.png` },
  { name: 'Palutena', imagePath: `${avatarDefaultPicturePath}palutena.png` },
  { name: 'Pokemon Trainer', imagePath: `${avatarDefaultPicturePath}pokemon_trainer.png` },
  { name: 'Roy', imagePath: `${avatarDefaultPicturePath}roy.png` },
  { name: 'Snake', imagePath: `${avatarDefaultPicturePath}snake.png` },
  { name: 'Wolf', imagePath: `${avatarDefaultPicturePath}wolf.png` },
  { name: 'Captain Falcon', imagePath: `${avatarDefaultPicturePath}captain_falcon.png` },
  { name: 'Dark Samus', imagePath: `${avatarDefaultPicturePath}dark_samus.png` },
  { name: 'Fox', imagePath: `${avatarDefaultPicturePath}fox.png` },
  { name: 'Inkling', imagePath: `${avatarDefaultPicturePath}inkling.png` },
  { name: 'Kirby', imagePath: `${avatarDefaultPicturePath}kirby.png` },
  { name: 'Luigi', imagePath: `${avatarDefaultPicturePath}luigi.png` },
  { name: 'Mii Fighter', imagePath: `${avatarDefaultPicturePath}mii_fighter.png` },
  { name: 'Peach', imagePath: `${avatarDefaultPicturePath}peach.png` },
  { name: 'Richter', imagePath: `${avatarDefaultPicturePath}richter.png` },
  { name: 'Ryu', imagePath: `${avatarDefaultPicturePath}ryu.png` },
  { name: 'Sonic', imagePath: `${avatarDefaultPicturePath}sonic.png` },
  { name: 'Yoshi', imagePath: `${avatarDefaultPicturePath}yoshi.png` },
  { name: 'Chrom', imagePath: `${avatarDefaultPicturePath}chrom.png` },
  { name: 'Diddy Kong', imagePath: `${avatarDefaultPicturePath}diddy_kong.png` },
  { name: 'Ganondorf', imagePath: `${avatarDefaultPicturePath}ganondorf.png` },
  { name: 'Isabelle', imagePath: `${avatarDefaultPicturePath}isabelle.png` },
  { name: 'Link', imagePath: `${avatarDefaultPicturePath}link.png` },
  { name: 'Mario', imagePath: `${avatarDefaultPicturePath}mario.png` },
  { name: 'Mr Game And Watch', imagePath: `${avatarDefaultPicturePath}mr_game_and_watch.png` },
  { name: 'Pichu', imagePath: `${avatarDefaultPicturePath}pichu.png` },
  { name: 'Ridley', imagePath: `${avatarDefaultPicturePath}ridley.png` },
  { name: 'Samus', imagePath: `${avatarDefaultPicturePath}samus.png` },
  { name: 'Toon Link', imagePath: `${avatarDefaultPicturePath}toon_link.png` },
  { name: 'Young Link', imagePath: `${avatarDefaultPicturePath}young_link.png` },
  { name: 'Cloud', imagePath: `${avatarDefaultPicturePath}cloud.png` },
  { name: 'Donkey Kong', imagePath: `${avatarDefaultPicturePath}donkey_kong.png` },
  { name: 'Greninja', imagePath: `${avatarDefaultPicturePath}greninja.png` },
  { name: 'Jigglypuff', imagePath: `${avatarDefaultPicturePath}jigglypuff.png` },
  { name: 'Little Mac', imagePath: `${avatarDefaultPicturePath}little_mac.png` },
  { name: 'Marth', imagePath: `${avatarDefaultPicturePath}marth.png` },
  { name: 'Ness', imagePath: `${avatarDefaultPicturePath}ness.png` },
  { name: 'Pikachu', imagePath: `${avatarDefaultPicturePath}pikachu.png` },
  { name: 'Robin', imagePath: `${avatarDefaultPicturePath}robin.png` },
  { name: 'Sheik', imagePath: `${avatarDefaultPicturePath}sheik.png` },
  { name: 'Villager', imagePath: `${avatarDefaultPicturePath}villager.png` },
  { name: 'Zelda', imagePath: `${avatarDefaultPicturePath}zelda.png` },
  { name: 'UploadYourOwn', imagePath: `${avatarDefaultPicturePath}uploadYourOwn.png` },
] as const;

/**
 * @brief Retrieves the list of available avatars
 *
 * @return An array of avatar objects, each containing the name and image path of an avatar
 */
export function getAvatarList(): avatar[] {
  return avatarList;
}
