import { createServerSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

async function ensureProfile(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const metadata = user.user_metadata ?? {}
  const name =
    metadata.full_name ||
    metadata.name ||
    user.email?.split('@')[0] ||
    'User'
  const avatar_url = metadata.avatar_url || metadata.picture || null

  await supabase.from('profiles').upsert(
    {
      id: user.id,
      name,
      email: user.email,
      avatar_url,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=OAuthCallbackError`)
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth callback error:', error.message)
    return NextResponse.redirect(`${origin}/auth/login?error=OAuthCallbackError`)
  }

  await ensureProfile(supabase)

  return NextResponse.redirect(`${origin}${next}`)
}
