export interface tournamentPlayer {
  userAlias: string; // Tournament Alias
  quarterFinalScore: string | null; // Null before first game starts
  semiFinalScore: string | null; // Null if lost at quarterFinals
  finalScore: string | null; // Null if lost at semifinals
  avatarPath: string;
}
