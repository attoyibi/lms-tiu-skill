import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json()

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Nama, email, dan password wajib diisi' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password minimal 6 karakter' },
                { status: 400 }
            )
        }

        const supabase = await createServerSupabaseClient()

        // Create user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        })

        if (error) {
            if (error.message.includes('already registered')) {
                return NextResponse.json(
                    { message: 'Email sudah terdaftar' },
                    { status: 400 }
                )
            }
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            )
        }

        if (!data.user) {
            return NextResponse.json(
                { message: 'Gagal membuat akun' },
                { status: 500 }
            )
        }

        // Insert profile record
        await supabase.from('profiles').upsert({
            id: data.user.id,
            name,
            email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })

        // If email confirmation is disabled in Supabase, auto-login
        if (data.session) {
            const user = {
                id: data.user.id,
                email: data.user.email!,
                name,
            }

            return NextResponse.json(
                {
                    message: 'Registrasi berhasil',
                    user,
                    autoLogin: true,
                },
                { status: 201 }
            )
        }

        return NextResponse.json(
            {
                message: 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.',
                autoLogin: false,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat registrasi' },
            { status: 500 }
        )
    }
}
