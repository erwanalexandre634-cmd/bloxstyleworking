import { InfiniteFeed } from "@/components/feed/infinite-feed"

export default function ExplorePage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore</h1>
        <p className="text-muted-foreground">
          Discover outfits by tags and categories
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {["aesthetic", "streetwear", "formal", "casual", "vintage", "cyberpunk", "y2k"].map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <InfiniteFeed filter="top" />
    </div>
  )
}
