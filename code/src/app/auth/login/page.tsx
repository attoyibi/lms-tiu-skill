'use client'

import { Button } from '@/components/Button'
import { Card, CardHeader, CardBody } from '@/components/Card'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.message || 'Login failed')
                return
            }

            // Redirect to dashboard on success
            window.location.href = '/dashboard'
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">TIU Prep</h1>
                    <p className="text-on-surface-variant">Sign in to your account</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-label-md text-on-surface font-semibold mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-label-md text-on-surface font-semibold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 transition"
                            />
                        </div>

                        {error && <div className="bg-error-container text-error-container p-3 rounded-lg text-sm">{error}</div>}

                        <Button type="submit" loading={loading} className="w-full">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-outline-variant">
                        <p className="text-center text-body-sm text-on-surface-variant">
                            Don't have an account?{' '}
                            <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </Card>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-primary hover:underline text-body-sm">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </main>
    )
}
