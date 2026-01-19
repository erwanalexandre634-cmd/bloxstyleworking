import type { RobloxAssetDetails } from "./types"

const CATALOG_API = "https://catalog.roblox.com"
const ECONOMY_API = "https://economy.roblox.com"

export async function getAssetDetails(assetId: number): Promise<RobloxAssetDetails | null> {
  try {
    const response = await fetch(
      `${ECONOMY_API}/v2/assets/${assetId}/details`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) return null

    return response.json()
  } catch {
    return null
  }
}

export async function searchCatalog(query: string, category?: string) {
  const params = new URLSearchParams({
    keyword: query,
    limit: "30",
    ...(category && { category })
  })

  const response = await fetch(
    `${CATALOG_API}/v1/search/items?${params}`,
    { next: { revalidate: 300 } }
  )

  if (!response.ok) {
    throw new Error("Catalog search failed")
  }

  return response.json()
}
