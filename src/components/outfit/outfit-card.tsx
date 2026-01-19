"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { LikeButton } from "./like-button"
import type { Outfit, User } from "@prisma/client"

interface OutfitCardProps {
  outfit: Outfit & {
    user: Pick<User, "id" | "username" | "displayName" | "avatarUrl">
    tags: { tag: string }[]
    isLiked?: boolean
  }
  priority?: boolean
}

export function OutfitCard({ outfit, priority = false }: OutfitCardProps) {
  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
      {/* Image */}
      <Link href={`/outfit/${outfit.id}`}>
        <div className="aspect-square relative overflow-hidden bg-muted">
          <Image
            src={outfit.thumbnailUrl}
            alt={outfit.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <Link href={`/outfit/${outfit.id}`}>
          <h3 className="font-semibold text-sm truncate hover:text-primary transition-colors">
            {outfit.name}
          </h3>
        </Link>

        {/* Creator */}
        <Link
          href={`/u/${outfit.user.username}`}
          className="flex items-center gap-2 mt-2"
        >
          {outfit.user.avatarUrl && (
            <Image
              src={outfit.user.avatarUrl}
              alt={outfit.user.displayName}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span className="text-xs text-muted-foreground hover:text-foreground transition-colors truncate">
            {outfit.user.displayName}
          </span>
        </Link>

        {/* Tags */}
        {outfit.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {outfit.tags.slice(0, 3).map(({ tag }) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-full text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-3">
          <LikeButton
            outfitId={outfit.id}
            initialLiked={outfit.isLiked ?? false}
            initialCount={outfit.likesCount}
          />
          <span className="text-xs text-muted-foreground">
            {outfit.viewsCount} views
          </span>
        </div>
      </div>
    </div>
  )
}
