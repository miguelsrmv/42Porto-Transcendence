/*
  Warnings:

  - A unique constraint covering the columns `[user2Id,user1Id,tournamentId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tournamentType` to the `TournamentParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TournamentParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "tournamentType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "character" TEXT,
    CONSTRAINT "TournamentParticipant_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TournamentParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TournamentParticipant" ("alias", "character", "id", "tournamentId", "userId") SELECT "alias", "character", "id", "tournamentId", "userId" FROM "TournamentParticipant";
DROP TABLE "TournamentParticipant";
ALTER TABLE "new_TournamentParticipant" RENAME TO "TournamentParticipant";
CREATE UNIQUE INDEX "TournamentParticipant_tournamentId_userId_key" ON "TournamentParticipant"("tournamentId", "userId");
CREATE UNIQUE INDEX "TournamentParticipant_tournamentId_alias_key" ON "TournamentParticipant"("tournamentId", "alias");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Match_user2Id_user1Id_tournamentId_key" ON "Match"("user2Id", "user1Id", "tournamentId");
