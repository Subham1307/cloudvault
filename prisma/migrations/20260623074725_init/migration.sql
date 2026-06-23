-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "storageLimit" BIGINT NOT NULL,
    "storageUsed" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_versions" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "size" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocks" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "refCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_version_blocks" (
    "versionId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "blockOrder" INTEGER NOT NULL,

    CONSTRAINT "file_version_blocks_pkey" PRIMARY KEY ("versionId","blockOrder")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "files_userId_idx" ON "files"("userId");

-- CreateIndex
CREATE INDEX "file_versions_fileId_idx" ON "file_versions"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "file_versions_fileId_versionNumber_key" ON "file_versions"("fileId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_hash_key" ON "blocks"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_s3Key_key" ON "blocks"("s3Key");

-- CreateIndex
CREATE INDEX "blocks_hash_idx" ON "blocks"("hash");

-- CreateIndex
CREATE INDEX "file_version_blocks_blockId_idx" ON "file_version_blocks"("blockId");

-- CreateIndex
CREATE INDEX "file_version_blocks_versionId_idx" ON "file_version_blocks"("versionId");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_versions" ADD CONSTRAINT "file_versions_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_version_blocks" ADD CONSTRAINT "file_version_blocks_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "file_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_version_blocks" ADD CONSTRAINT "file_version_blocks_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
