"use client"

import { useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { OutfitCard } from "@/components/outfit/outfit-card"
import { Skeleton } from "@/components/ui/skeleton"

interface InfiniteFeedProps {
  initialData?: any
  filter?: "trending" | "recent" | "top" | "following"
  tag?: string
}

export function InfiniteFeed({ initialData, filter = "recent", tag }: InfiniteFeedProps) {
  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["outfits", filter, tag],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams({
        filter,
        limit: "20",
        ...(tag && { tag }),
        ...(pageParam && { cursor: pageParam })
      })

      const res = await fetch(`/api/outfits?${params}`)
      return res.json()
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData ? { pages: [initialData], pageParams: [null] } : undefined,
    initialPageParam: null,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return <FeedSkeleton />
  }

  const outfits = data?.pages.flatMap(page => page.outfits) ?? []

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {outfits.map((outfit, index) => (
          <OutfitCard
            key={outfit.id}
            outfit={outfit}
            priority={index < 8}
          />
        ))}
      </div>

      {/* Load more trigger */}
      <div ref={ref} className="flex justify-center py-8">
        {isFetchingNextPage && <LoadingSpinner />}
      </div>
    </>
  )
}

function FeedSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-border">
          <Skeleton className="aspect-square" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  )
}
