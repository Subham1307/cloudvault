import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand, GetObjectCommand, S3Client} from "@aws-sdk/client-s3"
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
    
    // create a readable stream from the s3 objects
    const stream = new ReadableStream({
        async start(controller) {
            try {
                for (const s3Key of ordered_s3Keys) {
                    const command = new GetObjectCommand({
                        Bucket : BUCKET,
                        Key : s3Key,
                    });
                    const s3Res = await s3Client.send(command);
                    for await (const chunk of s3Res.Body as AsyncIterable<Uint8Array>) {
                        controller.enqueue(chunk);
                    }
                }
            } catch (error) {
                controller.error(error);
            } finally {
                controller.close();
            }
        }
    });
    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': fileVersion.size.toString(),
        },
        status: 200,
    });
}

export async function DELETE(request: NextRequest, response: NextResponse) {
    const session = await getServerSession(AUTH_CONFIG as NextAuthOptions);
    if(!session){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('filename');
    const versionNumberString = searchParams.get('versionNumber');
    if(!filename || !versionNumberString || isNaN(parseInt(versionNumberString))) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const versionNumber = parseInt(versionNumberString);
    const userId = session.user.id as string; 
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
    const fileVersion = await prisma.fileVersion.findUnique({
        where: {
            fileId_versionNumber: {
                fileId: file.id,
                versionNumber: versionNumber,
            }
        },
        include: {
            blocks: true,
        }
    });
    if(!fileVersion) {
        return NextResponse.json({ error: "File version not found" }, { status: 404 });
    }
    const hashesToBeModified = fileVersion.blocks.map(block => block.hash);
    // delete fileversions and reduce refcount in a transaction
    const orphanedS3Keys = await prisma.$transaction(async (tx) => {
        await tx.fileVersion.delete({
            where: {
                id: fileVersion.id,
            }
        });
        await tx.block.updateMany({
            where: { hash: { in: hashesToBeModified } },
            data: { refCount: { decrement: 1 } },
        });
        const orphanedS3Keys = await tx.block.findMany({
            where: { 
                refCount: 0,
                hash: { in: hashesToBeModified }
            },
            select: { s3Key: true },
        });
        // clean up refcount of 0 blocks
        await tx.block.deleteMany({
            where: { 
                refCount: 0,
                hash: { in: hashesToBeModified }
            }
        });
        const remainingVersions = await tx.fileVersion.count({
            where: { fileId: file.id }
        })
        if (remainingVersions === 0) {
            await tx.file.delete({ where: { id: file.id } });
        }
        return orphanedS3Keys;
    });
    // clean up the s3 objects
    console.log(`Deleting ${orphanedS3Keys.length} s3 objects`);
    console.log(orphanedS3Keys);
    const results = await Promise.allSettled(orphanedS3Keys.map( ({s3Key}) => 
        s3Client.send(new DeleteObjectCommand({
                Bucket: BUCKET,
                Key: s3Key,
            }))
    ));
    for (const result of results) {
        if (result.status === "fulfilled") {
            console.log(`Deleted s3 object ${result.value}`);
        } else {
            console.error(`Error deleting s3 object ${result.reason}`);
        }
    }
    return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
}