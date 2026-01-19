import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/battles - Get random battle pair
export async function GET(req: NextRequest) {
  const session = await auth()

  // Get two random public outfits
  const outfits = await prisma.$queryRaw<Array<any>>`
    SELECT o.*,
           u.username, u."displayName", u."avatarUrl"
    FROM "Outfit" o
    JOIN "User" u ON o."userId" = u.id
    WHERE o."isPublic" = true
    ORDER BY RANDOM()
    LIMIT 2
  `

  if (outfits.length < 2) {
    return NextResponse.json({ error: "Not enough outfits" }, { status: 404 })
  }

  return NextResponse.json({
    outfitA: {
      id: outfits[0].id,
      name: outfits[0].name,
      thumbnailUrl: outfits[0].thumbnailUrl,
      user: {
        username: outfits[0].username,
        displayName: outfits[0].displayName
      }
    },
    outfitB: {
      id: outfits[1].id,
      name: outfits[1].name,
      thumbnailUrl: outfits[1].thumbnailUrl,
      user: {
        username: outfits[1].username,
        displayName: outfits[1].displayName
      }
    }
  })
}

// POST /api/battles - Record vote
export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { outfitAId, outfitBId, winnerId } = await req.json()

  if (!outfitAId || !outfitBId || !winnerId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  if (winnerId !== outfitAId && winnerId !== outfitBId) {
    return NextResponse.json({ error: "Invalid winner" }, { status: 400 })
  }

  const loserId = winnerId === outfitAId ? outfitBId : outfitAId

  // Create battle record and update stats
  await prisma.$transaction([
    prisma.battle.create({
      data: {
        outfitAId,
        outfitBId,
        winnerId,
        voterId: session.user.id
      }
    }),
    prisma.outfit.update({
      where: { id: winnerId },
      data: { battlesWon: { increment: 1 } }
    }),
    prisma.outfit.update({
      where: { id: loserId },
      data: { battlesLost: { increment: 1 } }
    })
  ])

  return NextResponse.json({ success: true })
}
