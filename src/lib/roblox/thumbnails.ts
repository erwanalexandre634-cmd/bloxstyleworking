import { redis } from "../redis"
import type { RobloxThumbnail } from "./types"

const THUMBNAILS_API = "https://thumbnails.roblox.com"
const CACHE_TTL = 60 * 60 // 1 heure

type ThumbnailSize = "48x48" | "60x60" | "100x100" | "150x150" | "180x180" | "352x352" | "420x420" | "720x720"
type ThumbnailType = "avatar" | "avatar-headshot" | "avatar-bust"

export async function getUserThumbnail(
  userId: string,
  size: ThumbnailSize = "420x420",
  type: ThumbnailType = "avatar"
): Promise<string | null> {
  const cacheKey = `thumb:${type}:${userId}:${size}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return cached as string
  }

  const endpoint = type === "avatar"
    ? "users/avatar"
    : type === "avatar-headshot"
      ? "users/avatar-headshot"
      : "users/avatar-bust"

  const response = await fetch(
    `${THUMBNAILS_API}/v1/${endpoint}?userIds=${userId}&size=${size}&format=Png&isCircular=false`,
    { next: { revalidate: 3600 } }
  )

  if (!response.ok) {
    console.error(`Thumbnail fetch failed: ${response.status}`)
    return null
  }

  const data = await response.json()
  const thumbnail = data.data?.[0] as RobloxThumbnail | undefined

  if (thumbnail?.state === "Completed" && thumbnail.imageUrl) {
    await redis.setex(cacheKey, CACHE_TTL, thumbnail.imageUrl)
    return thumbnail.imageUrl
  }

  return null
}

export async function getAssetThumbnails(
  assetIds: number[],
  size: ThumbnailSize = "150x150"
): Promise<Map<number, string>> {
  const results = new Map<number, string>()
  const uncached: number[] = []

  // Check cache for each
  for (const id of assetIds) {
    const cached = await redis.get(`asset-thumb:${id}:${size}`)
    if (cached) {
      results.set(id, cached as string)
    } else {
      uncached.push(id)
    }
  }

  if (uncached.length === 0) {
    return results
  }

  // Batch fetch (max 100 per request)
  const batches = chunk(uncached, 100)

  for (const batch of batches) {
    const response = await fetch(
      `${THUMBNAILS_API}/v1/assets?assetIds=${batch.join(",")}&size=${size}&format=Png`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) continue

    const data = await response.json()

    for (const item of data.data || []) {
      if (item.state === "Completed" && item.imageUrl) {
        results.set(item.targetId, item.imageUrl)
        await redis.setex(`asset-thumb:${item.targetId}:${size}`, CACHE_TTL, item.imageUrl)
      }
    }
  }

  return results
}

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
}
