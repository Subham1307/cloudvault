import { REDIS_SESSION_KEY } from "@/constants/constant";
import { prisma } from "@/lib/prisma";
import getRedisClient from "@/lib/redis";
import { handleFileCreate, handleFileUpdate } from "@/service/fileService";
import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.S3_BUCKET!;

export async function POST(request: NextRequest, response: NextResponse) {
  const { sessionId } = await request.json();
  const redis = await getRedisClient();
  const session = await redis.get(REDIS_SESSION_KEY + sessionId);
  if(!session) {
    return NextResponse.json({ error: "File upload was unsuccessful" }, { status: 404 });
  }
  const sessionData = JSON.parse(session);
  const { userId, filename, fileSize, mimeType, allHashes, pendingHashes, existingHashes, status } = sessionData as { userId: string, filename: string, fileSize: number, mimeType: string, allHashes: string[], pendingHashes: string[], existingHashes: string[], status: string };
  if(status !== "pending") {
    return NextResponse.json({ error: "File upload was unsuccessful" }, { status: 404 });
  }
  // check if the chunks were uploaded in S3
  const missingHashes: string[] = [];
  // pending hashes are hashes that are not in db in hash to s3 key mapping, so a presigned url was generated for them.
  // the user is supposed to upload the chunks to s3, and then call this endpoint to complete the upload.
  for(const hash of pendingHashes) {
    const s3Key = `blocks/${hash}`;
    try{
        await s3Client.send(new HeadObjectCommand({
            Bucket: BUCKET,
            Key: s3Key,
        }));
    } catch(error : any) {
        if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
            missingHashes.push(hash);
        } else {
            throw error; // unexpected S3 error
        }
    }
  }
    if(missingHashes.length > 0) {
        return NextResponse.json({ error: "File upload was unsuccessful" }, { status: 404 });
    }
    // do db table updates in a transaction TODO
    const result = await prisma.$transaction(async (tx) => {
        // check if the file already exists
        const existingFile = await tx.file.findUnique({
            where: {
                userId_filename: {
                    userId: userId,
                    filename: filename,
                },
            }
        });
        if(existingFile) {
            await handleFileUpdate(tx, existingFile, fileSize, allHashes, pendingHashes, existingHashes);
        } else {
            await handleFileCreate(tx, userId, filename, fileSize, mimeType, allHashes, pendingHashes, existingHashes);
        }
    });
    
    await redis.del(REDIS_SESSION_KEY + sessionId);
  return NextResponse.json({ message: "File uploaded successfully" }, { status: 200 });
  
}

