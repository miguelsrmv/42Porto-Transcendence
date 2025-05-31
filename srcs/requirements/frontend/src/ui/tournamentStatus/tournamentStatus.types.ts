/**
 * Represents a player in a tournament.
 *
 * @interface tournamentPlayer
 * @property {string} userAlias - Tournament Alias.
 * @property {string | null} quarterFinalScore - Score in the quarter-finals. Null before the first game starts.
 * @property {string | null} semiFinalScore - Score in the semi-finals. Null if lost at quarter-finals.
 * @property {string | null} finalScore - Score in the finals. Null if lost at semi-finals.
 * @property {string} avatarPath - Path to the player's avatar image.
 */
export interface tournamentPlayer {
  userAlias: string; // Tournament Alias
  quarterFinalScore: string | null; // Null before first game starts
  semiFinalScore: string | null; // Null if lost at quarterFinals
  finalScore: string | null; // Null if lost at semifinals
  avatarPath: string;
}

/**
 * Enum representing the phases of a tournament.
 *
 * @enum {string} TournamentPhase
 * @property {string} Quarter - Represents the quarter-finals phase.
 * @property {string} Semi - Represents the semi-finals phase.
 * @property {string} Final - Represents the finals phase.
 */
export enum TournamentPhase {
  Quarter = 'TournamentPlayer',
  Semi = 'QFWinner',
  Final = 'SFWinner',
}
