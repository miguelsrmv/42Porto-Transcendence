-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "settings" TEXT NOT NULL,
    "maxParticipants" INTEGER NOT NULL DEFAULT 8,
    "currentRound" INTEGER NOT NULL DEFAULT 1
);
