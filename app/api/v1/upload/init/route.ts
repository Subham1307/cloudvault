import { NextRequest, NextResponse } from "next/server";
import getRedisClient from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { generateS3PreSignedUrl } from "@/actions/aws";
import crypto from "crypto";
import { REDIS_HASH_KEY, REDIS_SESSION_KEY } from "@/constants/constant";
import { getServerSession, NextAuthOptions } from "next-auth";
import { AUTH_CONFIG } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(AUTH_CONFIG as NextAuthOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    console.log(body);
    const { filename, fileSize, mimeType, chunkHashes } = body;

    // Validate request
    if (!filename || !fileSize || !chunkHashes || !Array.isArray(chunkHashes)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const redis = await getRedisClient();

    const existingHashes: string[] = [];
    const pendingHashes: string[] = [];
    const uploads: { hash: string; presignedUrl: string; base64EncodedHash: string }[] = [];

    // Check Redis for all hashes
    const cacheKeys = chunkHashes.map((hash: string) => REDIS_HASH_KEY + hash);
    let cacheResults: (string | null)[] = [];
    if (cacheKeys.length > 0) {
      cacheResults = await redis.mGet(cacheKeys);
    }

    // Separate hashes into found in cache and not found
    const hashesToCheckInDB: string[] = [];

    chunkHashes.forEach((hash: string, index: number) => {
      if (cacheResults[index]) {
        existingHashes.push(hash);
      } else {
        hashesToCheckInDB.push(hash);
      }
    });

    // Check DB for hashes not found in cache
    if (hashesToCheckInDB.length > 0) {
      const dbBlocks = await prisma.block.findMany({
        where: { hash: { in: hashesToCheckInDB } },
        select: { hash: true }
      });

      const dbFoundHashes = new Set(dbBlocks.map(b => b.hash));

      for (const hash of hashesToCheckInDB) {
        if (dbFoundHashes.has(hash)) {
          existingHashes.push(hash);
        } else {
          pendingHashes.push(hash);
        }
      }
    }

    // Generate Presigned URLs for pending hashes
    const uploadResults = await Promise.all(
      pendingHashes.map(async (hash) => {
        const presignedUrl = await generateS3PreSignedUrl(hash)
        const base64EncodedHash = Buffer.from(hash, 'hex').toString('base64')
        return { hash, presignedUrl, base64EncodedHash }
      })
    )
    uploads.push(...uploadResults)

    // Create a Session in Redis
    const sessionId = crypto.randomBytes(16).toString("hex");
    const sessionData = {
      userId: session.user.id as string,
      filename,
      fileSize,
      mimeType,
      allHashes: chunkHashes, // Preserve chunk order
      pendingHashes,
      existingHashes,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    // Store session with 1 hour TTL
    await redis.setEx(REDIS_SESSION_KEY + sessionId, 3600, JSON.stringify(sessionData));

    // Calculate stats
    const totalChunks = chunkHashes.length;
    const newChunks = pendingHashes.length;
    const deduplicatedChunks = existingHashes.length;

    return NextResponse.json({
      sessionId,
      uploads
    });

  } catch (error) {
    console.error("Error in /init:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}