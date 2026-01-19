"use client"

import { useState, useTransition } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface LikeButtonProps {
  outfitId: string
  initialLiked: boolean
  initialCount: number
}

export function LikeButton({ outfitId, initialLiked, initialCount }: LikeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)

  async function handleLike() {
    if (!session) {
      router.push("/login")
      return
    }

    // Optimistic update
    setLiked(!liked)
    setCount(prev => liked ? prev - 1 : prev + 1)

    startTransition(async () => {
      try {
        const res = await fetch(`/api/outfits/${outfitId}/like`, {
          method: liked ? "DELETE" : "POST"
        })

        if (!res.ok) {
          // Revert on error
          setLiked(liked)
          setCount(count)
        }
      } catch {
        setLiked(liked)
        setCount(count)
      }
    })
  }

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={cn(
        "flex items-center gap-1.5 text-sm transition-colors",
        liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          liked && "fill-current scale-110"
        )}
      />
      <span>{count}</span>
    </button>
  )
}
