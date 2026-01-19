import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'

// Custom Roblox OAuth Provider (no official provider in NextAuth v4)
const RobloxProvider = {
  id: 'roblox',
  name: 'Roblox',
  type: 'oauth' as const,
  authorization: {
    url: 'https://apis.roblox.com/oauth/v1/authorize',
    params: {
      scope: 'openid profile',
      response_type: 'code',
    },
  },
  token: {
    url: 'https://apis.roblox.com/oauth/v1/token',
  },
  userinfo: {
    url: 'https://apis.roblox.com/oauth/v1/userinfo',
  },
  clientId: process.env.ROBLOX_CLIENT_ID,
  clientSecret: process.env.ROBLOX_CLIENT_SECRET,
  profile(profile: any) {
    return {
      id: profile.sub,
      name: profile.name || profile.preferred_username,
      email: null,
      image: profile.picture,
      robloxId: profile.sub,
      username: profile.preferred_username,
      displayName: profile.name || profile.nickname,
      avatarUrl: profile.picture,
    }
  },
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [RobloxProvider as any],
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'roblox' && profile) {
        // Update Roblox-specific user data on sign in
        await prisma.user.update({
          where: { id: user.id },
          data: {
            robloxId: (profile as any).sub,
            username: (profile as any).preferred_username,
            displayName: (profile as any).name || (profile as any).nickname,
            avatarUrl: (profile as any).picture,
            lastLoginAt: new Date(),
          },
        })
      }
      return true
    },
    async session({ session, user }) {
      // Add Roblox user data to session
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            username: true,
            displayName: true,
            robloxId: true,
            avatarUrl: true,
            bio: true,
            outfitsCount: true,
            likesReceived: true,
            followersCount: true,
            followingCount: true,
          },
        })

        if (dbUser) {
          session.user = {
            ...session.user,
            ...dbUser,
          }
        }
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      // Update last login time
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
