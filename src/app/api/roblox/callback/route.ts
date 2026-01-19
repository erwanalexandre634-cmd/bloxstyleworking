import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { exchangeCodeForTokens, getRobloxUserInfo } from '@/lib/roblox/api'
import { setSessionCookie } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  // Vérifier les erreurs OAuth
  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${baseUrl}/login?error=${error}`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/login?error=missing_params`)
  }

  // Vérifier le state CSRF
  const cookieStore = await cookies()
  const storedState = cookieStore.get('oauth_state')?.value

  if (!storedState || storedState !== state) {
    console.error('State mismatch:', { storedState, state })
    return NextResponse.redirect(`${baseUrl}/login?error=state_mismatch`)
  }

  // Supprimer le cookie state
  cookieStore.delete('oauth_state')

  try {
    // Échanger le code contre des tokens
    const tokens = await exchangeCodeForTokens(code)

    // Récupérer les infos utilisateur
    const userInfo = await getRobloxUserInfo(tokens.access_token)

    // Upsert l'utilisateur dans la DB
    const user = await prisma.user.upsert({
      where: { robloxId: userInfo.sub },
      update: {
        username: userInfo.preferred_username,
        displayName: userInfo.name || userInfo.nickname || userInfo.preferred_username,
        avatarUrl: userInfo.picture || null,
        lastLoginAt: new Date(),
      },
      create: {
        robloxId: userInfo.sub,
        username: userInfo.preferred_username,
        displayName: userInfo.name || userInfo.nickname || userInfo.preferred_username,
        avatarUrl: userInfo.picture || null,
      },
    })

    // Créer la session
    await setSessionCookie({
      id: user.id,
      robloxId: user.robloxId!,
      username: user.username!,
      displayName: user.displayName!,
      avatarUrl: user.avatarUrl,
    })

    // Rediriger vers la home
    return NextResponse.redirect(baseUrl)
  } catch (err) {
    console.error('Callback error:', err)
    return NextResponse.redirect(`${baseUrl}/login?error=callback_failed`)
  }
}
