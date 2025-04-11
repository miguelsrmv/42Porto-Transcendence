-- CreateTable
CREATE TABLE "MatchSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "allowPowerUps" BOOLEAN NOT NULL DEFAULT false,
    "map" TEXT,
    "rounds" INTEGER NOT NULL DEFAULT 5,
    "ballSpeed" REAL NOT NULL DEFAULT 1,
    CONSTRAINT "MatchSettings_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchSettings_matchId_key" ON "MatchSettings"("matchId");
