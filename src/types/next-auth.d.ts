import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      robloxId?: string
      username?: string
      displayName?: string
      avatarUrl?: string | null
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}
