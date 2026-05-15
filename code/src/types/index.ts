export interface User {
    id: string
    email: string
    name: string
    avatar_url?: string
    created_at: string
    updated_at: string
}

export interface Session {
    id: string
    user_id: string
    title: string
    description?: string
    started_at: string
    ended_at?: string
    status: 'ongoing' | 'completed' | 'abandoned'
    total_questions: number
    correct_answers: number
    duration_seconds: number
    category?: string
    difficulty?: string
}

export interface Question {
    id: string
    content: string
    category: 'verbal' | 'numerical' | 'figural'
    difficulty: 'easy' | 'medium' | 'hard' | 'expert'
    options: string[]
    correct_answer: number
    explanation?: string
    time_limit?: number
}

export interface QuestionResponse {
    id: string
    session_id: string
    question_id: string
    selected_answer?: number
    is_correct: boolean
    time_spent_seconds: number
    answered_at: string
}

export interface SkillAssessment {
    id: string
    user_id: string
    category: 'verbal' | 'numerical' | 'figular'
    skill_level: string
    accuracy_percentage: number
    questions_attempted: number
    last_assessed_at: string
    improvement_trend: number
}

export interface SessionAnalytics {
    total_sessions: number
    total_questions: number
    average_accuracy: number
    best_category: string
    weakest_category: string
    average_session_duration: number
    improvement_over_time: Array<{
        date: string
        accuracy: number
    }>
}
