-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT,
    "tournamentId" TEXT,
    "allowPowerUps" BOOLEAN NOT NULL DEFAULT false,
    "map" TEXT,
    "rounds" INTEGER NOT NULL DEFAULT 5,
    "ballSpeed" REAL NOT NULL DEFAULT 1,
    CONSTRAINT "GameSettings_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GameSettings_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GameSettings" ("allowPowerUps", "ballSpeed", "id", "map", "matchId", "rounds", "tournamentId") SELECT "allowPowerUps", "ballSpeed", "id", "map", "matchId", "rounds", "tournamentId" FROM "GameSettings";
DROP TABLE "GameSettings";
ALTER TABLE "new_GameSettings" RENAME TO "GameSettings";
CREATE UNIQUE INDEX "GameSettings_matchId_key" ON "GameSettings"("matchId");
CREATE UNIQUE INDEX "GameSettings_tournamentId_key" ON "GameSettings"("tournamentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
