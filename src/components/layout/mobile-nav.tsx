"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Swords, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Battles", href: "/battles", icon: Swords },
  { name: "Rankings", href: "/rankings", icon: Trophy },
  { name: "Profile", href: "/profile", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Don't show on login page
  if (pathname === "/login") {
    return null
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around h-16">
        {navigation.map((item) => {
          // Hide profile if not logged in
          if (item.href === "/profile" && !session) {
            return null
          }

          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
