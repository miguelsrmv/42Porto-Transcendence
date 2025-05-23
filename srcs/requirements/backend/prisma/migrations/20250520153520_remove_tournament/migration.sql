/*
  Warnings:

  - You are about to drop the `Tournament` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `duration` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `roundNumber` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `Match` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tournament";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT NOT NULL DEFAULT 'CLASSIC',
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "user1Score" INTEGER NOT NULL DEFAULT 0,
    "user2Score" INTEGER NOT NULL DEFAULT 0,
    "user1Character" TEXT,
    "user2Character" TEXT,
    "winnerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settings" TEXT NOT NULL,
    CONSTRAINT "Match_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("createdAt", "id", "mode", "settings", "updatedAt", "user1Character", "user1Id", "user1Score", "user2Character", "user2Id", "user2Score", "winnerId") SELECT "createdAt", "id", "mode", "settings", "updatedAt", "user1Character", "user1Id", "user1Score", "user2Character", "user2Id", "user2Score", "winnerId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE TABLE "new_TournamentParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "tournamentType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "character" TEXT,
    CONSTRAINT "TournamentParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TournamentParticipant" ("alias", "character", "id", "tournamentId", "tournamentType", "userId") SELECT "alias", "character", "id", "tournamentId", "tournamentType", "userId" FROM "TournamentParticipant";
DROP TABLE "TournamentParticipant";
ALTER TABLE "new_TournamentParticipant" RENAME TO "TournamentParticipant";
CREATE UNIQUE INDEX "TournamentParticipant_tournamentId_userId_key" ON "TournamentParticipant"("tournamentId", "userId");
CREATE UNIQUE INDEX "TournamentParticipant_tournamentId_alias_key" ON "TournamentParticipant"("tournamentId", "alias");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
