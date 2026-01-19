import { prisma } from "@/lib/db"
import { OutfitCard } from "@/components/outfit/outfit-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function getTopOutfits(orderBy: any) {
  return await prisma.outfit.findMany({
    where: { isPublic: true },
    orderBy,
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
  })
}

export default async function RankingsPage() {
  const topLiked = await getTopOutfits({ likesCount: "desc" })
  const topBattles = await getTopOutfits({ battlesWon: "desc" })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rankings</h1>
        <p className="text-muted-foreground">
          Top outfits based on community votes
        </p>
      </div>

      <Tabs defaultValue="likes" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="likes">Most Liked</TabsTrigger>
          <TabsTrigger value="battles">Battle Champions</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="likes" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topLiked.map((outfit, index) => (
                <div key={outfit.id} className="relative">
                  <div className="absolute -top-2 -left-2 z-10 h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <OutfitCard outfit={outfit} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="battles" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topBattles.map((outfit, index) => (
                <div key={outfit.id} className="relative">
                  <div className="absolute -top-2 -left-2 z-10 h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <OutfitCard outfit={outfit} />
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
