-- AlterTable
ALTER TABLE "Match" ADD COLUMN "player1Character" TEXT;
ALTER TABLE "Match" ADD COLUMN "player2Character" TEXT;

-- AlterTable
ALTER TABLE "TournamentParticipant" ADD COLUMN "character" TEXT;
