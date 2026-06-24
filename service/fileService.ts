import { PrismaClient } from "@prisma/client/extension";

// Prisma's transaction client type — same shape as PrismaClient but scoped
// to the transaction. Using this type (not PrismaClient) is what guarantees
// callers can only pass a real `tx`, not accidentally the global client.
type TxClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;
export async function handleFileCreate(tx: TxClient, userId: string, filename: string, fileSize: number, mimeType: string, allHashes: string[], pendingHashes: string[], existingHashes: string[]) {
    // create the file
    const file = await tx.file.create({
        data: {
            userId: userId,
            filename: filename,
        },
    });
    // create the file version
    const fileVersion = await tx.fileVersion.create({
        data: {
            fileId: file.id,
            versionNumber: 1,
            size: fileSize,
        },
    });
    // create the file version blocks
    const fileVersionBlocks = await tx.fileVersionBlock.createMany({
        data: allHashes.map((hash, index) => ({
            versionId: fileVersion.id,
            blockOrder: index,
            hash: hash,
        })),
    });
    // update refCount if it already exists, else set to 1 - for pending hashes. increament refCount for existing hashes.
    for(const hash of pendingHashes) {
        const block = await tx.block.findUnique({
            where: {
                hash: hash,
            },
        });
        if(!block) {
            await tx.block.create({
                data: {
                    hash: hash,
                    s3Key: `blocks/${hash}`,
                    size: fileSize,
                    refCount: 1,
                },
            });
        }
        else {
            await tx.block.update({
                where: {
                    hash: hash,
                },
                data: {
                    refCount: {
                        increment: 1,
                    },
                },
            });
        }
    }
    // increament refCount for existing hashes.
    for(const hash of existingHashes) {
        const block = await tx.block.findUnique({
            where: {
                hash: hash,
            },
        });
        if(block) {
            await tx.block.update({
                where: {
                    hash: hash,
                },
                data: {
                refCount: {
                    increment: 1,
                },
                },
            });
        }
    }
}

export async function handleFileUpdate(tx: TxClient, userId: string, filename: string, fileSize: number, mimeType: string, allHashes: string[], pendingHashes: string[], existingHashes: string[]) {
    // update the file
    
}