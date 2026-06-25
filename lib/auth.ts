import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
declare module "next-auth" {
    interface Session {
      user: {
        id: string; 
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
    }
}

export const AUTH_CONFIG = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
          }),
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "text", placeholder: "email" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            // Add logic here to look up the user from the credentials supplied
            const user = await prisma.user.findUnique({
                where: {
                    email: credentials?.email as string
                }
            })
            if(user?.provider === "google" || user?.password === null){
                //google user is not allowed to sign in with credentials
                return null;
            }
            if(user != null){
                const passwordMatch = await bcrypt.compare(credentials?.password as string, user.password);
                if(passwordMatch){
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    };
                }
                else{
                    return null;
                }
            }
            else{
                return null;
            }
          }
        })
      ],
      callbacks: {
        async signIn({ user, account }: any) {
            console.log("signIn callback : user : ", user);
            console.log("signIn callback : account : ", account);
            if (account?.provider !== "google") return true;
            if (!user.email) return false;
          
            const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
          
            if (existingUser && existingUser.provider !== "google") {
                // Credentials account already owns this email — block
              return false;
            }
          
            if (!existingUser) {
                const newUser = await prisma.user.create({
                  data: {
                    email: user.email,
                    provider: "google",
                    name: user.name as string,
                    storageLimit: BigInt(1000000000),
                    password: null,
                  },
                });
                user.id = newUser.id;       // ← ADD THIS
            } else {
                user.id = existingUser.id;  // ← ADD THIS
            }
          
            return true;
          },
        async session({ session, token }: any) {
            console.log("session callback : session : ", session);
            console.log("session callback : token : ", token);
            if (session.user) {
                session.user.id = token.uid as string;
            }
            return session
        },
        async jwt({ token, user }: any) {
            console.log("jwt callback : user : ", user);
            console.log("jwt callback : token : ", token);
            if (user) {
                token.uid = user.id;
            }
            return token;
        }
      }
}