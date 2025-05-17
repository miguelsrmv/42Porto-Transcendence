/*
  Warnings:

  - You are about to drop the column `classic` on the `Leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `crazy` on the `Leaderboard` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Leaderboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Leaderboard" ("id", "userId") SELECT "id", "userId" FROM "Leaderboard";
DROP TABLE "Leaderboard";
ALTER TABLE "new_Leaderboard" RENAME TO "Leaderboard";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
