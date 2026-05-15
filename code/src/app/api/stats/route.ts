import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // Get all completed sessions for this user
        const { data: sessions, error } = await supabase
            .from('practice_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'completed')

        if (error) {
            return NextResponse.json({ message: 'Gagal mengambil statistik' }, { status: 500 })
        }

        const totalSessions = sessions?.length || 0
        const totalQuestions = sessions?.reduce((acc, s) => acc + (s.total_questions || 0), 0) || 0
        const correctAnswers = sessions?.reduce((acc, s) => acc + (s.correct_answers || 0), 0) || 0
        const averageAccuracy = totalQuestions > 0
            ? Math.round((correctAnswers / totalQuestions) * 100)
            : 0

        // Get best category
        const categoryMap: Record<string, { correct: number; total: number }> = {}
        sessions?.forEach((s) => {
            if (s.category) {
                if (!categoryMap[s.category]) categoryMap[s.category] = { correct: 0, total: 0 }
                categoryMap[s.category].correct += s.correct_answers || 0
                categoryMap[s.category].total += s.total_questions || 0
            }
        })

        const bestCategory = Object.entries(categoryMap).sort((a, b) => {
            const aAcc = a[1].total > 0 ? a[1].correct / a[1].total : 0
            const bAcc = b[1].total > 0 ? b[1].correct / b[1].total : 0
            return bAcc - aAcc
        })[0]?.[0] || 'Figural Reasoning'

        // Study streak calculation
        const sessionDates = new Set(
            sessions?.map((s) => s.started_at?.split('T')[0]).filter(Boolean)
        )
        let streak = 0
        const today = new Date()
        for (let i = 0; i < 365; i++) {
            const d = new Date(today)
            d.setDate(d.getDate() - i)
            const dateStr = d.toISOString().split('T')[0]
            if (sessionDates.has(dateStr)) {
                streak++
            } else if (i > 0) {
                break
            }
        }

        return NextResponse.json({
            totalSessions,
            totalQuestions,
            averageAccuracy,
            bestCategory,
            streak,
        })
    } catch (error) {
        console.error('Stats error:', error)
        return NextResponse.json({ message: 'Gagal mengambil statistik' }, { status: 500 })
    }
}
