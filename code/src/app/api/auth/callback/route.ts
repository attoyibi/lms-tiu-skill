import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  const redirectResponse = NextResponse.redirect(`${origin}${next}`)

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookies().getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // try to get user info (session should be set on cookies)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      try {
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            name: (user.user_metadata as any)?.full_name || user.email?.split('@')[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }
      } catch (e) {
        // ignore profile upsert errors, but keep login flow
        console.error('Profile upsert error:', e)
      }

      return redirectResponse
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=OAuthCallbackError`)
}
