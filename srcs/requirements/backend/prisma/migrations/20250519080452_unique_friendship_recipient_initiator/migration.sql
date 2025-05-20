/*
  Warnings:

  - A unique constraint covering the columns `[recipientId,initiatorId]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Friendship_recipientId_initiatorId_key" ON "Friendship"("recipientId", "initiatorId");
