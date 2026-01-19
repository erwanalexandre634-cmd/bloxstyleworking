export interface RobloxAvatar {
  scales: {
    height: number
    width: number
    head: number
    depth: number
    proportion: number
    bodyType: number
  }
  playerAvatarType: "R6" | "R15"
  bodyColors: {
    headColorId: number
    torsoColorId: number
    rightArmColorId: number
    leftArmColorId: number
    rightLegColorId: number
    leftLegColorId: number
  }
  assets: Array<{
    id: number
    name: string
    assetType: {
      id: number
      name: string
    }
  }>
  defaultShirtApplied: boolean
  defaultPantsApplied: boolean
  emotes: Array<{
    assetId: number
    assetName: string
    position: number
  }>
}

export interface RobloxThumbnail {
  targetId: number
  state: "Completed" | "Pending" | "Error"
  imageUrl: string
}

export interface RobloxAssetDetails {
  id: number
  name: string
  description: string
  assetType: number
  creatorType: string
  creatorTargetId: number
  creatorName: string
  price?: number
  premiumPricing?: {
    premiumDiscountPercentage: number
    premiumPriceInRobux: number
  }
}
