import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET
if (!SECRET_KEY) {
  throw new Error('SESSION_SECRET or NEXTAUTH_SECRET is required')
}

const secret = new TextEncoder().encode(SECRET_KEY)
const COOKIE_NAME = 'bloxstyle_session'

export interface SessionUser {
  id: string
  robloxId: string
  username: string
  displayName: string
  avatarUrl: string | null
}

export interface Session {
  user: SessionUser
  expires: string
}

// Créer un token JWT signé
export async function createSessionToken(user: SessionUser): Promise<string> {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours

  const token = await new SignJWT({ user, expires: expires.toISOString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secret)

  return token
}

// Vérifier et décoder le token
export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as Session
  } catch {
    return null
  }
}

// Définir le cookie de session
export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await createSessionToken(user)
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 jours
  })
}

// Récupérer la session depuis le cookie
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifySessionToken(token)
}

// Supprimer la session
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
