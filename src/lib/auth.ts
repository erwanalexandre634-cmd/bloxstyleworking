import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Roblox from "next-auth/providers/roblox"
import { prisma } from "./db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Roblox({
      clientId: process.env.ROBLOX_CLIENT_ID!,
      clientSecret: process.env.ROBLOX_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile"
        }
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Récupérer les infos Roblox depuis la DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            robloxId: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        })
        if (dbUser) {
          session.user.robloxId = dbUser.robloxId.toString()
          session.user.username = dbUser.username
          session.user.displayName = dbUser.displayName
          session.user.avatarUrl = dbUser.avatarUrl
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "roblox" && profile) {
        // Créer ou mettre à jour l'utilisateur
        const robloxProfile = profile as {
          sub: string
          name: string
          nickname: string
          preferred_username: string
          picture: string
        }

        await prisma.user.upsert({
          where: { robloxId: BigInt(robloxProfile.sub) },
          update: {
            username: robloxProfile.preferred_username,
            displayName: robloxProfile.name || robloxProfile.nickname,
            avatarUrl: robloxProfile.picture,
            lastLoginAt: new Date()
          },
          create: {
            id: user.id!,
            robloxId: BigInt(robloxProfile.sub),
            username: robloxProfile.preferred_username,
            displayName: robloxProfile.name || robloxProfile.nickname,
            avatarUrl: robloxProfile.picture
          }
        })
      }
      return true
    }
  },
  pages: {
    signIn: "/login"
  }
})
