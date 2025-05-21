/*
  Warnings:

  - You are about to drop the column `alias` on the `TournamentParticipant` table. All the data in the column will be lost.
  - You are about to drop the column `character` on the `TournamentParticipant` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TournamentParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "tournamentType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "TournamentParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TournamentParticipant" ("id", "tournamentId", "tournamentType", "userId") SELECT "id", "tournamentId", "tournamentType", "userId" FROM "TournamentParticipant";
DROP TABLE "TournamentParticipant";
ALTER TABLE "new_TournamentParticipant" RENAME TO "TournamentParticipant";
CREATE UNIQUE INDEX "TournamentParticipant_tournamentId_userId_key" ON "TournamentParticipant"("tournamentId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
