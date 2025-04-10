-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "Tournament_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tournament" ("createdAt", "createdById", "currentRound", "id", "maxParticipants", "name", "settings", "status", "updatedAt") SELECT "createdAt", "createdById", "currentRound", "id", "maxParticipants", "name", "settings", "status", "updatedAt" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
