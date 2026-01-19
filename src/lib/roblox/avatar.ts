import { redis } from "../redis"
import type { RobloxAvatar } from "./types"

const AVATAR_API = "https://avatar.roblox.com"
const CACHE_TTL = 60 * 15 // 15 minutes

export async function getUserAvatar(userId: string): Promise<RobloxAvatar> {
  const cacheKey = `avatar:${userId}`

  // Check cache
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached as string)
  }

  const response = await fetch(
    `${AVATAR_API}/v1/users/${userId}/avatar`,
    { next: { revalidate: 300 } }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch avatar: ${response.status}`)
  }

  const data = await response.json()

  // Cache result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data))

  return data
}

export async function getCurrentlyWearing(userId: string): Promise<number[]> {
  const cacheKey = `wearing:${userId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached as string)
  }

  const response = await fetch(
    `${AVATAR_API}/v1/users/${userId}/currently-wearing`,
    { next: { revalidate: 300 } }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch currently wearing: ${response.status}`)
  }

  const data = await response.json()
  const assetIds = data.assetIds || []

  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(assetIds))

  return assetIds
}
