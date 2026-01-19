import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { OutfitCard } from "@/components/outfit/outfit-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      outfits: {
        orderBy: { createdAt: "desc" },
        take: 20,
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
          }
        }
      }
    }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
            <AvatarFallback className="text-2xl">
              {user.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.bio && (
              <p className="mt-2 text-sm">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{user.outfitsCount}</div>
            <div className="text-sm text-muted-foreground">Outfits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.likesReceived}</div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.followersCount}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.followingCount}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </div>
        </div>
      </div>

      {/* Outfits Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Outfits</h2>
          <Button asChild>
            <Link href="/outfit/create">Create Outfit</Link>
          </Button>
        </div>

        {user.outfits.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {user.outfits.map((outfit) => (
              <OutfitCard key={outfit.id} outfit={outfit} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't created any outfits yet</p>
            <Button asChild>
              <Link href="/outfit/create">Create Your First Outfit</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
