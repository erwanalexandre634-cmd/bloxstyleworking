import { getSession } from '@/lib/session'
import Link from 'next/link'

export default async function HomePage() {
  const session = await getSession()

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold">
          Welcome to <span className="text-primary">Bloxstyle</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Create, share and discover the best Roblox avatar outfits
        </p>

        {session?.user ? (
          <div className="p-6 bg-card border border-border rounded-xl">
            <p className="text-lg mb-4">
              Welcome back, <strong>{session.user.displayName}</strong>!
            </p>
            <p className="text-sm text-muted-foreground">
              Roblox ID: {session.user.robloxId}
            </p>
            <p className="text-sm text-muted-foreground">
              Username: @{session.user.username}
            </p>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:opacity-90"
          >
            Get Started
          </Link>
        )}
      </div>
    </main>
  )
}
