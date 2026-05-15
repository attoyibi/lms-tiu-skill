'use client'

import { Button } from '@/components/Button'
import { Card, CardHeader, CardBody } from '@/components/Card'
import Link from 'next/link'
import { useState } from 'react'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.message || 'Registration failed')
                return
            }

            // Redirect to login
            window.location.href = '/auth/login'
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
                    <p className="text-on-surface-variant">Create your account</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-label-md text-on-surface font-semibold mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-label-md text-on-surface font-semibold mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-label-md text-on-surface font-semibold mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 transition"
                            />
                        </div>

                        {error && (
                            <div className="bg-error-container text-error p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <Button type="submit" loading={loading} className="w-full">
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-outline-variant">
                        <p className="text-center text-body-sm text-on-surface-variant">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                                Sign in
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
