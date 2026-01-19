"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BattleOutfit {
  id: string
  name: string
  thumbnailUrl: string
  user: {
    username: string
    displayName: string
  }
}

interface BattleArenaProps {
  outfitA: BattleOutfit
  outfitB: BattleOutfit
  onVote: (winnerId: string) => Promise<void>
  onSkip: () => void
}

export function BattleArena({ outfitA, outfitB, onVote, onSkip }: BattleArenaProps) {
  const [voting, setVoting] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)

  const handleVote = useCallback(async (winnerId: string) => {
    setVoting(true)
    setWinner(winnerId)

    await onVote(winnerId)

    // Animation delay before next battle
    setTimeout(() => {
      setVoting(false)
      setWinner(null)
    }, 800)
  }, [onVote])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className="text-2xl font-bold text-primary">VS</span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-8">
        {[outfitA, outfitB].map((outfit, index) => (
          <motion.button
            key={outfit.id}
            onClick={() => handleVote(outfit.id)}
            disabled={voting}
            className={cn(
              "relative group rounded-2xl overflow-hidden border-4 transition-all duration-300",
              winner === outfit.id
                ? "border-yellow-400 scale-105"
                : winner
                  ? "border-border opacity-50 scale-95"
                  : "border-border hover:border-primary"
            )}
            whileHover={{ scale: voting ? 1 : 1.02 }}
            whileTap={{ scale: voting ? 1 : 0.98 }}
          >
            <div className="aspect-square relative bg-muted">
              <Image
                src={outfit.thumbnailUrl}
                alt={outfit.name}
                fill
                className="object-cover"
                priority
              />

              {/* Winner Crown */}
              <AnimatePresence>
                {winner === outfit.id && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40"
                  >
                    <Crown className="h-16 w-16 text-yellow-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 bg-card">
              <h3 className="font-semibold truncate">{outfit.name}</h3>
              <p className="text-sm text-muted-foreground">
                by {outfit.user.displayName}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Button
          variant="ghost"
          onClick={onSkip}
          disabled={voting}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Skip
        </Button>
      </div>
    </div>
  )
}
