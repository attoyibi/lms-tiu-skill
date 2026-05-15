import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
        return NextResponse.json({ user: null }, { status: 401 })
    }
    
    // Get user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', user.id)
        .single()

    const sessionUser = {
        id: user.id,
        email: user.email!,
        name: profile?.name || user.email!.split('@')[0],
    }

    return NextResponse.json({ user: sessionUser })
}
