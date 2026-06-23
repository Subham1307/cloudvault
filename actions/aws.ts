'use server'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const BUCKET = process.env.S3_BUCKET || "cloudvault-chunks";

export async function generateS3PreSignedUrl(chunkHash: string, mimeType: string) {
    // Convert hex string hash to base64 as required by AWS ChecksumSHA256
    const base64EncodedHash = Buffer.from(chunkHash, 'hex').toString('base64');

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: `blocks/${chunkHash}`,
      ContentType: mimeType,
      ChecksumAlgorithm: "SHA256",
      ChecksumSHA256: base64EncodedHash,
    });

    return await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
      signableHeaders: new Set(["x-amz-checksum-sha256"]),
    });
}