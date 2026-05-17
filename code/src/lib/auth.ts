import { createClient } from '@/lib/supabase/client'

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const supabase = createClient()
  const redirectTo = `${window.location.origin}/api/auth/callback`

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}
