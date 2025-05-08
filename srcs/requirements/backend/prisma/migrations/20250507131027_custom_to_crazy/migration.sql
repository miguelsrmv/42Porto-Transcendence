/*
  Warnings:

  - You are about to drop the column `custom` on the `Leaderboard` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Leaderboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "classic" INTEGER NOT NULL DEFAULT 0,
    "crazy" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Leaderboard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Leaderboard" ("classic", "id", "playerId") SELECT "classic", "id", "playerId" FROM "Leaderboard";
DROP TABLE "Leaderboard";
ALTER TABLE "new_Leaderboard" RENAME TO "Leaderboard";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
