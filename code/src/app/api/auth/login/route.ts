import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email dan password wajib diisi' },
                { status: 400 }
            )
        }

        const supabase = await createServerSupabaseClient()

        // Sign in with Supabase Auth (This automatically sets session cookies!)
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error || !data.user) {
            return NextResponse.json(
                { message: 'Email atau password salah' },
                { status: 401 }
            )
        }

        // Get user profile from profiles table
        const { data: profile } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('id', data.user.id)
            .single()

        const user = {
            id: data.user.id,
            email: data.user.email!,
            name: profile?.name || data.user.email!.split('@')[0],
        }

        return NextResponse.json(
            {
                message: 'Login berhasil',
                user,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat login' },
            { status: 500 }
        )
    }
}
