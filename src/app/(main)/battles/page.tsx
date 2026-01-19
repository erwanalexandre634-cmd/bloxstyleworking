"use client"

import { useState, useEffect } from "react"
import { BattleArena } from "@/components/battle/battle-arena"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface BattleOutfit {
  id: string
  name: string
  thumbnailUrl: string
  user: {
    username: string
    displayName: string
  }
}

export default function BattlesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [outfitA, setOutfitA] = useState<BattleOutfit | null>(null)
  const [outfitB, setOutfitB] = useState<BattleOutfit | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchBattle = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/battles")
      const data = await res.json()
      setOutfitA(data.outfitA)
      setOutfitB(data.outfitB)
    } catch (error) {
      console.error("Failed to fetch battle:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }
    fetchBattle()
  }, [session, router])

  const handleVote = async (winnerId: string) => {
    if (!outfitA || !outfitB) return

    try {
      await fetch("/api/battles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outfitAId: outfitA.id,
          outfitBId: outfitB.id,
          winnerId
        })
      })

      // Fetch next battle
      fetchBattle()
    } catch (error) {
      console.error("Failed to record vote:", error)
    }
  }

  if (!session) {
    return null
  }

  if (loading || !outfitA || !outfitB) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Look Battles</h1>
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden border-4 border-border">
                <Skeleton className="aspect-square" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Look Battles</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Vote for your favorite outfit! Your votes help rank the best looks.
        </p>

        <BattleArena
          outfitA={outfitA}
          outfitB={outfitB}
          onVote={handleVote}
          onSkip={fetchBattle}
        />
      </div>
    </div>
  )
}
