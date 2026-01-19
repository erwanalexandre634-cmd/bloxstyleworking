const ROBLOX_OAUTH_URL = 'https://apis.roblox.com/oauth'

interface RobloxTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  scope: string
  id_token?: string
}

interface RobloxUserInfo {
  sub: string
  name?: string
  nickname?: string
  preferred_username: string
  created_at?: number
  profile?: string
  picture?: string
}

export function getRobloxAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.ROBLOX_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/roblox/callback`,
    response_type: 'code',
    scope: 'openid profile',
    state,
  })

  return `${ROBLOX_OAUTH_URL}/v1/authorize?${params.toString()}`
}

export async function exchangeCodeForTokens(code: string): Promise<RobloxTokenResponse> {
  const response = await fetch(`${ROBLOX_OAUTH_URL}/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.ROBLOX_CLIENT_ID!,
      client_secret: process.env.ROBLOX_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/roblox/callback`,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Token exchange failed:', error)
    throw new Error(`Token exchange failed: ${response.status}`)
  }

  return response.json()
}

export async function getRobloxUserInfo(accessToken: string): Promise<RobloxUserInfo> {
  const response = await fetch(`${ROBLOX_OAUTH_URL}/v1/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('UserInfo failed:', error)
    throw new Error(`UserInfo failed: ${response.status}`)
  }

  return response.json()
}
