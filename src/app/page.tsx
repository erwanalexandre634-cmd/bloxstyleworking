import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // If user is logged in, redirect to feed
  if (session?.user) {
    redirect('/feed')
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 px-4 py-20 text-white">
        <div className="max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Bloxstyle
          </h1>
          <p className="mb-4 text-xl md:text-2xl">
            Le hub de la mode Roblox
          </p>
          <p className="mb-8 text-lg opacity-90 md:text-xl">
            Crée, partage et découvre les meilleures tenues de la communauté
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Link href="/login">
                Commencer maintenant
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/explore">
                Découvrir
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Tout ce dont tu as besoin
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                  <svg
                    className="h-8 w-8 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Tes Tenues</h3>
              <p className="text-muted-foreground">
                Crée et sauvegarde tes meilleures tenues Roblox en un clic
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900">
                  <svg
                    className="h-8 w-8 text-pink-600 dark:text-pink-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Communauté</h3>
              <p className="text-muted-foreground">
                Partage avec la communauté et découvre des styles incroyables
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <svg
                    className="h-8 w-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Battles</h3>
              <p className="text-muted-foreground">
                Affronte d'autres joueurs dans des battles de style épiques
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Prêt à rejoindre la communauté?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Connecte-toi avec ton compte Roblox et commence dès maintenant
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Link href="/login">
              Se connecter avec Roblox
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
