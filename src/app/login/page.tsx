'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-2">
            Sign in to Bloxstyle
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Connect your Roblox account to get started
          </p>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                {error === 'state_mismatch' && 'Session expired. Please try again.'}
                {error === 'callback_failed' && 'Authentication failed. Please try again.'}
                {error === 'missing_params' && 'Invalid request. Please try again.'}
                {!['state_mismatch', 'callback_failed', 'missing_params'].includes(error) &&
                  `Error: ${error}`}
              </p>
            </div>
          )}

          <Link
            href="/api/roblox/login"
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#00A2FF] text-white rounded-lg font-semibold hover:bg-[#0091E6] transition"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.164 0L0 18.627l18.836 5.373L24 5.373 5.164 0zM9.88 14.469l-4.349-1.239 1.239-4.349 4.349 1.239-1.239 4.349z" />
            </svg>
            Continue with Roblox
          </Link>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginContent />
    </Suspense>
  )
}
