import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createServerSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { id: sessionId } = await params

        // Fetch session
        const { data: session, error: sessionError } = await supabase
            .from('practice_sessions')
            .select('*')
            .eq('id', sessionId)
            .eq('user_id', user.id)
            .single()

        if (sessionError || !session) {
            return NextResponse.json({ message: 'Sesi tidak ditemukan' }, { status: 404 })
        }

        // Fetch questions based on session category
        // If category is "Simulasi Lengkap", we might fetch from all categories. 
        // For now, let's fetch based on exact string match.
        let query = supabase.from('questions').select('*')
        
        // Match the category string from practiceOptions in practice/page.tsx
        // The practiceOptions title is what is stored in session.category.
        // E.g., 'Verbal Reasoning', 'Numerical Reasoning', 'Figural Reasoning'
        if (session.category && session.category !== 'Simulasi Lengkap') {
            query = query.eq('category', session.category)
        }

        const { data: questions, error: questionsError } = await query.limit(30)

        if (questionsError) {
            return NextResponse.json({ message: 'Gagal mengambil soal' }, { status: 500 })
        }

        return NextResponse.json({ session, questions })
    } catch (error) {
        console.error('Error fetching session details:', error)
        return NextResponse.json(
            { message: 'Terjadi kesalahan' },
            { status: 500 }
        )
    }
}
