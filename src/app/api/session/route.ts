import { NextResponse } from 'next/server'
import { getSession, clearSession } from '@/lib/session'

// GET /api/session - Récupérer la session courante
export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json(session)
}

// DELETE /api/session - Se déconnecter
export async function DELETE() {
  await clearSession()
  return NextResponse.json({ success: true })
}
