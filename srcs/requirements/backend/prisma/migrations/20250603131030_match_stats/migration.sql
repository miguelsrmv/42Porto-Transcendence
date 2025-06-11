/*
  Warnings:

  - Added the required column `stats` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
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
    "stats" TEXT NOT NULL,
    CONSTRAINT "Match_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("createdAt", "id", "mode", "settings", "updatedAt", "user1Character", "user1Id", "user1Score", "user2Character", "user2Id", "user2Score", "winnerId") SELECT "createdAt", "id", "mode", "settings", "updatedAt", "user1Character", "user1Id", "user1Score", "user2Character", "user2Id", "user2Score", "winnerId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
