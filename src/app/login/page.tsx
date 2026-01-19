'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const handleSignIn = async () => {
    await signIn('roblox', { callbackUrl })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold">
            Bienvenue sur Bloxstyle
          </CardTitle>
          <CardDescription className="text-base">
            La communauté Roblox pour créer, partager et découvrir des tenues stylées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error === 'OAuthSignin' && 'Erreur lors de la connexion avec Roblox.'}
              {error === 'OAuthCallback' && 'Erreur lors du retour de Roblox.'}
              {error === 'OAuthCreateAccount' && 'Erreur lors de la création du compte.'}
              {error === 'EmailCreateAccount' && 'Erreur lors de la création du compte.'}
              {error === 'Callback' && 'Erreur lors de la connexion.'}
              {error === 'Default' && 'Une erreur inattendue est survenue.'}
            </div>
          )}

          <Button
            onClick={handleSignIn}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Se connecter avec Roblox
          </Button>

          <div className="space-y-2 rounded-md bg-muted p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Pourquoi Roblox?</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Accès direct à vos avatars Roblox</li>
              <li>Synchronisation automatique de vos tenues</li>
              <li>Partage sécurisé avec la communauté</li>
              <li>Pas besoin de compte séparé</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
