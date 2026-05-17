'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { GoogleAuthButton } from '@/components/GoogleAuthButton'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    useEffect(() => {
        if (searchParams.get('error') === 'OAuthCallbackError') {
            setError('Login Google gagal. Silakan coba lagi.')
        }
        if (searchParams.get('registered') === 'true') {
            setError('')
        }
    }, [searchParams])

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

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || 'Login gagal')
                return
            }

            router.push('/dashboard')
            router.refresh()
        } catch {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-background text-on-background">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-16 overflow-hidden bg-primary">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-primary-container/80 to-primary-container/50" />

                {/* Decorative circles */}
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 z-0" />
                <div className="absolute bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 z-0" />
                <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-on-primary-container/10 z-0" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">TIU Prep</span>
                </div>

                {/* Main headline */}
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Kuasai Tes Intelegensia dengan{' '}
                        <span className="text-secondary-fixed-dim">Presisi AI</span>
                    </h1>
                    <p className="text-lg text-on-primary-container/80 leading-relaxed">
                        Platform adaptif kami menganalisis pola kognitif Anda secara real-time untuk memberikan jalur belajar personal yang terus berkembang bersama Anda.
                    </p>
                </div>

                {/* Feature badges */}
                <div className="relative z-10 flex gap-6">
                    {[
                        { icon: '✓', label: 'Berbasis Bukti' },
                        { icon: '✦', label: 'Adaptif & Cerdas' },
                        { icon: '◈', label: 'Analitik Real-time' },
                    ].map((feature) => (
                        <div key={feature.label} className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                                {feature.icon}
                            </div>
                            <span className="text-sm font-medium text-white/90">{feature.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-5/12 flex items-center justify-center px-6 py-12 lg:px-16 bg-surface">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
                        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-primary tracking-tight">TIU Prep</span>
                    </div>

                    {/* Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-on-background mb-2">Selamat Datang</h2>
                        <p className="text-on-surface-variant">Masuk untuk melanjutkan perjalanan belajar Anda.</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 px-4 py-3 bg-error-container text-error rounded-xl text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-on-surface">
                                Email atau Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nama@email.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base transition-all outline-none text-on-surface placeholder:text-outline"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-on-surface">
                                    Kata Sandi
                                </label>
                                <a href="#" className="text-xs text-primary hover:underline font-medium">
                                    Lupa Kata Sandi?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base transition-all outline-none text-on-surface placeholder:text-outline"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center gap-3">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary accent-primary"
                            />
                            <label htmlFor="remember" className="text-sm text-on-surface cursor-pointer">
                                Tetap masuk selama 30 hari
                            </label>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-6 bg-primary text-white font-semibold text-base rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    Masuk ke Dashboard
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-outline-variant" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-surface px-4 text-xs uppercase tracking-wider text-outline font-medium">
                                    Atau masuk dengan
                                </span>
                            </div>
                        </div>

                        <GoogleAuthButton
                            disabled={loading}
                            onError={setError}
                        />
                    </form>

                    <p className="mt-8 text-center text-sm text-on-surface-variant">
                        Belum punya akun?{' '}
                        <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                            Mulai Uji Coba Gratis
                        </Link>
                    </p>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-xs text-outline hover:text-primary transition-colors">
                            ← Kembali ke beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    )
}
