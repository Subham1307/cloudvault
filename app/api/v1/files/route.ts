import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
    const session = await getServerSession(AUTH_CONFIG);
    if(!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const files = await prisma.file.findMany({
        where: { userId: session.user.id },
        include: { versions: true },
    });
    const result = files.map(file => {
        return {
            id: file.id,
            filename: file.filename,
            versions: file.versions.map(version => {
                return {
                    id: version.id,
                    versionNumber: version.versionNumber,
                    size: version.size.toString(),
                    createdAt: version.createdAt,
                }
            }),
        }
    });
    return NextResponse.json(result);
}