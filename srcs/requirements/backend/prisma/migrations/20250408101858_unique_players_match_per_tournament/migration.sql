/*
  Warnings:

  - A unique constraint covering the columns `[player1Id,player2Id,tournamentId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Match_player1Id_player2Id_tournamentId_key" ON "Match"("player1Id", "player2Id", "tournamentId");
