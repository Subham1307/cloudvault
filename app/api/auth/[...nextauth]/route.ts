import { AUTH_CONFIG } from "@/lib/auth";
import NextAuth from "next-auth";
const handlers  = NextAuth(AUTH_CONFIG)

export const GET = handlers;
export const POST = handlers;