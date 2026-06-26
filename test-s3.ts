import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as crypto from "crypto";

// Load from .env manually for standalone script
import * as dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

const BUCKET = process.env.S3_BUCKET || "cloudvault-chunks";

async function testUpload() {
  const dummyData = Buffer.from("hello world test upload", "utf-8");
  const hashBuffer = crypto.createHash("sha256").update(dummyData).digest();
  const chunkHash = hashBuffer.toString("hex");
  const base64EncodedHash = hashBuffer.toString("base64");

  console.log("Bucket:", BUCKET);
  console.log("Region:", process.env.AWS_REGION);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: `blocks/${chunkHash}`,
    ContentType: "application/octet-stream",
    ChecksumAlgorithm: "SHA256",
    ChecksumSHA256: base64EncodedHash,
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
      signableHeaders: new Set(["x-amz-checksum-sha256", "content-type"]),
    });
    console.log("Generated URL:", presignedUrl);

    console.log("Attempting upload...");
    const res = await fetch(presignedUrl, {
      method: "PUT",
      body: dummyData,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    if (res.ok) {
      console.log("Upload SUCCESS! HTTP", res.status);
    } else {
      console.log("Upload FAILED! HTTP", res.status);
      const text = await res.text();
      console.log("Error from AWS S3:\n", text);
    }
  } catch (e) {
    console.error("Exception:", e);
  }
}

testUpload();
