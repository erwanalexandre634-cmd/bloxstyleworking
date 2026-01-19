import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRobloxAuthUrl } from '@/lib/roblox/api'

export async function GET() {
  // Générer un state aléatoire pour CSRF protection
  const state = crypto.randomUUID()

  // Stocker le state dans un cookie
  const cookieStore = await cookies()
  cookieStore.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  })

  // Rediriger vers Roblox
  const authUrl = getRobloxAuthUrl(state)
  return NextResponse.redirect(authUrl)
}
