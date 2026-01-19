import Link from 'next/link'
import { getSession } from '@/lib/session'

export async function Navbar() {
  const session = await getSession()

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          Bloxstyle
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {session.user.displayName}
              </span>
              {session.user.avatarUrl && (
                <img
                  src={session.user.avatarUrl}
                  alt={session.user.displayName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <Link
                href="/api/logout"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign out
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
