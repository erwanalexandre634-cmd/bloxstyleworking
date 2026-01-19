import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      robloxId?: string | null
      username?: string | null
      displayName?: string | null
      avatarUrl?: string | null
      bio?: string | null
      outfitsCount?: number
      likesReceived?: number
      followersCount?: number
      followingCount?: number
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    robloxId?: string | null
    username?: string | null
    displayName?: string | null
    avatarUrl?: string | null
  }
}
