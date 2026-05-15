import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(
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
        const { answers, durationSeconds, totalQuestions } = await request.json()
        
        // answers array format: [{ question_id: 'uuid', selected_option: 1 }]

        // Fetch the questions to verify correct answers
        const questionIds = answers.map((a: any) => a.question_id)
        const { data: questions } = await supabase
            .from('questions')
            .select('id, correct_option')
            .in('id', questionIds)

        const questionsMap = new Map()
        questions?.forEach(q => questionsMap.set(q.id, q.correct_option))

        let correctCount = 0
        const sessionAnswersToInsert = answers.map((ans: any) => {
            const isCorrect = questionsMap.get(ans.question_id) === ans.selected_option
            if (isCorrect) correctCount++
            return {
                session_id: sessionId,
                question_id: ans.question_id,
                user_answer_index: ans.selected_option,
                is_correct: isCorrect,
                time_spent_seconds: 0 // Simplification for now
            }
        })

        // Insert answers
        if (sessionAnswersToInsert.length > 0) {
            await supabase.from('session_answers').insert(sessionAnswersToInsert)
        }

        // Update session
        const { error: updateError } = await supabase
            .from('practice_sessions')
            .update({
                status: 'completed',
                total_questions: totalQuestions || answers.length,
                correct_answers: correctCount,
                duration_seconds: durationSeconds || 0
            })
            .eq('id', sessionId)
            .eq('user_id', user.id)

        if (updateError) {
            throw updateError
        }

        return NextResponse.json({ success: true, correctCount, totalQuestions: answers.length })
    } catch (error) {
        console.error('Error submitting session:', error)
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menyimpan jawaban' },
            { status: 500 }
        )
    }
}
