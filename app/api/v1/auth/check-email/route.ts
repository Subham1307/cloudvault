import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    console.log("check-email route : ", request);
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    console.log("email : ", email);
    if(!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
        where: { email: email }
    });
    console.log("user : ", user);
    if(!user) {
        return NextResponse.json({ user :"new-user" }, { status: 200 });
    }
    if(user.provider === "google") {
        return NextResponse.json({ user :"google" }, { status: 200 });
    }
    if(user.provider === "credentials") {
        return NextResponse.json({ user :"credentials" }, { status: 200 });
    }
    return NextResponse.json({ user :"unknown" }, { status: 200 });
}