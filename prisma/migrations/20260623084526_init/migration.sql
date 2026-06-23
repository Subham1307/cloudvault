/*
  Warnings:

  - The primary key for the `blocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `blocks` table. All the data in the column will be lost.
  - You are about to drop the column `blockId` on the `file_version_blocks` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `hash` to the `file_version_blocks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "file_version_blocks" DROP CONSTRAINT "file_version_blocks_blockId_fkey";

-- DropIndex
DROP INDEX "blocks_hash_idx";

-- DropIndex
DROP INDEX "blocks_hash_key";

-- DropIndex
DROP INDEX "file_version_blocks_blockId_idx";

-- DropIndex
DROP INDEX "file_version_blocks_versionId_idx";

-- AlterTable
ALTER TABLE "blocks" DROP CONSTRAINT "blocks_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "blocks_pkey" PRIMARY KEY ("hash");

-- AlterTable
ALTER TABLE "file_version_blocks" DROP COLUMN "blockId",
ADD COLUMN     "hash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt";

-- CreateIndex
CREATE INDEX "file_version_blocks_hash_idx" ON "file_version_blocks"("hash");

-- AddForeignKey
ALTER TABLE "file_version_blocks" ADD CONSTRAINT "file_version_blocks_hash_fkey" FOREIGN KEY ("hash") REFERENCES "blocks"("hash") ON DELETE RESTRICT ON UPDATE CASCADE;
