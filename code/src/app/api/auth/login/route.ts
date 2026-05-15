import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            )
        }

        // TODO: Implement actual authentication with Supabase
        // For now, return a mock response
        const mockUser = {
            id: 'user_123',
            email,
            name: email.split('@')[0],
        }

        // In production, you would:
        // 1. Create a session in Supabase
        // 2. Set secure cookies
        // 3. Return user data

        return NextResponse.json(
            {
                message: 'Login successful',
                user: mockUser,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { message: 'An error occurred during login' },
            { status: 500 }
        )
    }
}
