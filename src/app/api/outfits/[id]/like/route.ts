import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

// POST /api/outfits/[id]/like
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const outfitId = params.id

  try {
    // Check if outfit exists
    const outfit = await prisma.outfit.findUnique({
      where: { id: outfitId },
      select: { id: true, userId: true }
    })

    if (!outfit) {
      return NextResponse.json({ error: "Outfit not found" }, { status: 404 })
    }

    // Create like (upsert to avoid duplicates)
    await prisma.like.create({
      data: {
        userId: session.user.id,
        outfitId
      }
    })

    // Update counts
    await prisma.$transaction([
      prisma.outfit.update({
        where: { id: outfitId },
        data: { likesCount: { increment: 1 } }
      }),
      prisma.user.update({
        where: { id: outfit.userId },
        data: { likesReceived: { increment: 1 } }
      })
    ])

    return NextResponse.json({ liked: true })
  } catch (error: any) {
    // Handle unique constraint (already liked)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Already liked" }, { status: 409 })
    }
    console.error("Like error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// DELETE /api/outfits/[id]/like
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const outfitId = params.id

  try {
    const outfit = await prisma.outfit.findUnique({
      where: { id: outfitId },
      select: { userId: true }
    })

    if (!outfit) {
      return NextResponse.json({ error: "Outfit not found" }, { status: 404 })
    }

    // Delete like
    await prisma.like.delete({
      where: {
        userId_outfitId: {
          userId: session.user.id,
          outfitId
        }
      }
    })

    // Update counts
    await prisma.$transaction([
      prisma.outfit.update({
        where: { id: outfitId },
        data: { likesCount: { decrement: 1 } }
      }),
      prisma.user.update({
        where: { id: outfit.userId },
        data: { likesReceived: { decrement: 1 } }
      })
    ])

    return NextResponse.json({ liked: false })
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Not liked" }, { status: 404 })
    }
    console.error("Unlike error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
