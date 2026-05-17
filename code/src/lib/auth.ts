import { createClient } from '@/lib/supabase/client'
import { getOAuthCallbackUrl } from '@/lib/site-url'

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const supabase = createClient()
  const redirectTo = getOAuthCallbackUrl()

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
