import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // TODO: Fetch sessions from Supabase
        const mockSessions = [
            {
                id: 'session_1',
                title: 'Verbal Reasoning Practice',
                accuracy: 68,
                questions: 40,
                date: '2024-05-15',
            },
            {
                id: 'session_2',
                title: 'Numerical Reasoning Drill',
                accuracy: 75,
                questions: 35,
                date: '2024-05-14',
            },
        ]

        return NextResponse.json(mockSessions)
    } catch (error) {
        console.error('Error fetching sessions:', error)
        return NextResponse.json(
            { message: 'Failed to fetch sessions' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const { category, difficulty } = await request.json()

        // TODO: Create session in Supabase
        const mockSession = {
            id: 'session_' + Math.random().toString(36).substr(2, 9),
            category,
            difficulty,
            status: 'ongoing',
            startedAt: new Date().toISOString(),
        }

        return NextResponse.json(mockSession, { status: 201 })
    } catch (error) {
        console.error('Error creating session:', error)
        return NextResponse.json(
            { message: 'Failed to create session' },
            { status: 500 }
        )
    }
}
