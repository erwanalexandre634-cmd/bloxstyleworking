import { InfiniteFeed } from "@/components/feed/infinite-feed"
import { auth } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Amazing Outfits</h1>
        <p className="text-muted-foreground">
          Browse the latest fashion trends from the Roblox community
        </p>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="top">Top</TabsTrigger>
          {session && <TabsTrigger value="following">Following</TabsTrigger>}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="recent" className="mt-0">
            <InfiniteFeed filter="recent" />
          </TabsContent>

          <TabsContent value="trending" className="mt-0">
            <InfiniteFeed filter="trending" />
          </TabsContent>

          <TabsContent value="top" className="mt-0">
            <InfiniteFeed filter="top" />
          </TabsContent>

          {session && (
            <TabsContent value="following" className="mt-0">
              <InfiniteFeed filter="following" />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  )
}
