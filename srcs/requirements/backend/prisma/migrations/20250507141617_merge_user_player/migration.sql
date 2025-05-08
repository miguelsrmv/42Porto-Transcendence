/*
  Warnings:

  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `playerId` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `Leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `player1Character` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `player1Id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `player1Score` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `player2Character` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `player2Score` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `TournamentParticipant` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Friendship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user1Id` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2Id` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TournamentParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Player_userId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Player";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Friendship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Friendship" ("createdAt", "friendId", "id", "status", "updatedAt") SELECT "createdAt", "friendId", "id", "status", "updatedAt" FROM "Friendship";
DROP TABLE "Friendship";
ALTER TABLE "new_Friendship" RENAME TO "Friendship";
CREATE UNIQUE INDEX "Friendship_userId_friendId_key" ON "Friendship"("userId", "friendId");
CREATE TABLE "new_Leaderboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "classic" INTEGER NOT NULL DEFAULT 0,
    "crazy" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Leaderboard" ("classic", "crazy", "id") SELECT "classic", "crazy", "id" FROM "Leaderboard";
DROP TABLE "Leaderboard";
ALTER TABLE "new_Leaderboard" RENAME TO "Leaderboard";
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT NOT NULL DEFAULT 'CLASSIC',
    "duration" INTEGER NOT NULL DEFAULT 0,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "user1Score" INTEGER NOT NULL DEFAULT 0,
    "user2Score" INTEGER NOT NULL DEFAULT 0,
    "user1Character" TEXT,
    "user2Character" TEXT,
    "winnerId" TEXT,
    "tournamentId" TEXT,
    "roundNumber" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settings" TEXT NOT NULL,
    CONSTRAINT "Match_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("createdAt", "duration", "id", "mode", "roundNumber", "settings", "tournamentId", "updatedAt", "winnerId") SELECT "createdAt", "duration", "id", "mode", "roundNumber", "settings", "tournamentId", "updatedAt", "winnerId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE UNIQUE INDEX "Match_user1Id_user2Id_tournamentId_key" ON "Match"("user1Id", "user2Id", "tournamentId");
CREATE TABLE "new_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "settings" TEXT NOT NULL,
    "maxParticipants" INTEGER NOT NULL DEFAULT 8,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "currentRound" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Tournament_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tournament" ("createdAt", "createdById", "currentRound", "id", "maxParticipants", "name", "settings", "status", "updatedAt") SELECT "createdAt", "createdById", "currentRound", "id", "maxParticipants", "name", "settings", "status", "updatedAt" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
CREATE TABLE "new_TournamentParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "character" TEXT,
    CONSTRAINT "TournamentParticipant_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TournamentParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TournamentParticipant" ("alias", "character", "id", "tournamentId") SELECT "alias", "character", "id", "tournamentId" FROM "TournamentParticipant";
DROP TABLE "TournamentParticipant";
ALTER TABLE "new_TournamentParticipant" RENAME TO "TournamentParticipant";
CREATE UNIQUE INDEX "TournamentParticipant_tournamentId_userId_key" ON "TournamentParticipant"("tournamentId", "userId");
CREATE UNIQUE INDEX "TournamentParticipant_tournamentId_alias_key" ON "TournamentParticipant"("tournamentId", "alias");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
