import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createOutfitSchema } from "@/lib/validations"
import { z } from "zod"

// GET /api/outfits
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const filter = searchParams.get("filter") || "recent"
  const tag = searchParams.get("tag")
  const cursor = searchParams.get("cursor")
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50)

  const session = await auth()

  let orderBy: any = { createdAt: "desc" }
  let where: any = { isPublic: true }

  if (filter === "trending") {
    // Trending = most likes in last 24h
    where.createdAt = { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    orderBy = { likesCount: "desc" }
  } else if (filter === "top") {
    orderBy = { likesCount: "desc" }
  } else if (filter === "following" && session?.user?.id) {
    // Get followed users' outfits
    const following = await prisma.follow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true }
    })
    where.userId = { in: following.map(f => f.followingId) }
  }

  if (tag) {
    where.tags = { some: { tag } }
  }

  const outfits = await prisma.outfit.findMany({
    where,
    orderBy,
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      tags: {
        select: { tag: true }
      },
      ...(session?.user?.id && {
        likes: {
          where: { userId: session.user.id },
          select: { userId: true }
        }
      })
    }
  })

  const hasMore = outfits.length > limit
  const results = hasMore ? outfits.slice(0, -1) : outfits

  return NextResponse.json({
    outfits: results.map(outfit => ({
      ...outfit,
      assetIds: outfit.assetIds.map(id => Number(id)),
      isLiked: session?.user?.id ? outfit.likes?.length > 0 : false,
      likes: undefined
    })),
    nextCursor: hasMore ? results[results.length - 1].id : null
  })
}

// POST /api/outfits
export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createOutfitSchema.parse(body)

    const outfit = await prisma.outfit.create({
      data: {
        userId: session.user.id,
        name: data.name,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        assetIds: data.assetIds,
        bodyColors: data.bodyColors,
        avatarType: data.avatarType,
        isPublic: data.isPublic,
        tags: data.tags ? {
          create: data.tags.map(tag => ({ tag }))
        } : undefined
      },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    })

    // Update user's outfit count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { outfitsCount: { increment: 1 } }
    })

    return NextResponse.json(outfit, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Create outfit error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
