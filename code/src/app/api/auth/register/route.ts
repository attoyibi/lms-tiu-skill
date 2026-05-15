import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json()

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Name, email, and password are required' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        // TODO: Implement actual registration with Supabase
        // For now, return a mock response
        const mockUser = {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            name,
            email,
        }

        // In production, you would:
        // 1. Hash the password with bcryptjs
        // 2. Store user in Supabase
        // 3. Send verification email
        // 4. Return success response

        return NextResponse.json(
            {
                message: 'Registration successful. Please check your email to verify your account.',
                user: mockUser,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { message: 'An error occurred during registration' },
            { status: 500 }
        )
    }
}
