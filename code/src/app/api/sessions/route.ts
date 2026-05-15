import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { data, error } = await supabase
            .from('practice_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('started_at', { ascending: false })
            .limit(20)

        if (error) {
            console.error('Error fetching sessions:', error)
            return NextResponse.json(
                { message: 'Gagal mengambil data sesi' },
                { status: 500 }
            )
        }

        return NextResponse.json(data || [])
    } catch (error) {
        console.error('Error fetching sessions:', error)
        return NextResponse.json(
            { message: 'Gagal mengambil data sesi' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { category, difficulty, title } = await request.json()

        const { data, error } = await supabase
            .from('practice_sessions')
            .insert({
                user_id: user.id,
                title: title || `${category || 'TIU'} Practice`,
                category: category || null,
                difficulty: difficulty || null,
                status: 'ongoing',
                started_at: new Date().toISOString(),
                total_questions: 0,
                correct_answers: 0,
                duration_seconds: 0,
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating session:', error)
            return NextResponse.json(
                { message: 'Gagal membuat sesi latihan' },
                { status: 500 }
            )
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Error creating session:', error)
        return NextResponse.json(
            { message: 'Gagal membuat sesi latihan' },
            { status: 500 }
        )
    }
}
