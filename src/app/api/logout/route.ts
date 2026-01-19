import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/session'

export async function GET() {
  await clearSession()
  return NextResponse.redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000')
}
