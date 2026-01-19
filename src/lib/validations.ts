import { z } from "zod"

export const createOutfitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  thumbnailUrl: z.string().url(),
  assetIds: z.array(z.number()),
  bodyColors: z.record(z.string()).optional(),
  avatarType: z.enum(["R6", "R15"]).default("R15"),
  tags: z.array(z.string().max(30)).max(5).optional(),
  isPublic: z.boolean().default(false)
})

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(280).optional(),
})

export const createBattleVoteSchema = z.object({
  outfitAId: z.string(),
  outfitBId: z.string(),
  winnerId: z.string(),
})
