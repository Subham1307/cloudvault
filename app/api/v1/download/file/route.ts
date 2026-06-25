import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, S3Client} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession, NextAuthOptions } from "next-auth";
import { AUTH_CONFIG } from "@/lib/auth";
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.S3_BUCKET!;

export async function GET(request: NextRequest, response: NextResponse) {
    const session = await getServerSession(AUTH_CONFIG as NextAuthOptions);
    if(!session){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('filename');
    const versionNumber = searchParams.get('versionNumber');
    if(!filename || !versionNumber || isNaN(parseInt(versionNumber))) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const versionNumberInt = parseInt(versionNumber);
    const userId = session.user.id as string; // get user id from session and check for ownership
    const file = await prisma.file.findUnique({
        where: { 
            userId_filename: {
                userId: userId,
                filename: filename,
            }
        }
    });
    if(!file) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    const fileVersion = await prisma.fileVersion.findFirst({
        where: {
            fileId: file.id,
            versionNumber: versionNumberInt,
        }
    });
    if(!fileVersion) {
        return NextResponse.json({ error: "File version not found" }, { status: 404 });
    }
    const fileVersionBlocks = await prisma.fileVersionBlock.findMany({
        where: {
            versionId: fileVersion.id,
        },
        orderBy: {
            blockOrder: "asc",
        },
    });
    const ordered_hashes = fileVersionBlocks.map(block => block.hash);
    const ordered_s3Keys = ordered_hashes.map(hash => `blocks/${hash}`);
    // get the signed urls from s3 one by one then promise.all to get the blocks
    const signed_urls = await Promise.all(ordered_s3Keys.map(async (s3Key) => {
        return getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: BUCKET,
            Key: s3Key,
        }));
    }));
    return NextResponse.json({ signed_urls }, { status: 200 });
}