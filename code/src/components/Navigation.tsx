'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface NavProps {
    currentPath?: string
    className?: string
}

interface AuthUser {
    id: string
    email: string
    name: string
}

export function Navigation({ currentPath = '', className }: NavProps) {
    const router = useRouter()
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loggingOut, setLoggingOut] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const navItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Latihan', href: '/practice' },
        { label: 'Analisis', href: '/analysis' },
        { label: 'Materi', href: '/materials' },
    ]

    useEffect(() => {
        fetch('/api/auth/me')
            .then((r) => r.json())
            .then((d) => setUser(d.user || null))
            .catch(() => setUser(null))
    }, [])

    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            setUser(null)
            router.push('/')
            router.refresh()
        } finally {
            setLoggingOut(false)
        }
    }

    return (
        <nav
            className={cn(
                'fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-outline-variant',
                className
            )}
        >
            <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto w-full">
                {/* Logo + Nav Links */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                            </svg>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-primary">TIU Prep</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors pb-1 border-b-2 border-transparent',
                                    currentPath === item.href
                                        ? 'text-primary border-b-primary'
                                        : 'text-on-surface-variant hover:text-primary'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-2 pr-3 border-r border-outline-variant">
                                <div className="w-8 h-8 bg-primary-fixed rounded-full flex items-center justify-center">
                                    <span className="text-primary text-sm font-bold">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-on-surface max-w-[120px] truncate">
                                    {user.name}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant text-on-surface hover:bg-surface-container rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                            >
                                {loggingOut ? (
                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                )}
                                Keluar
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/auth/register"
                                className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
                            >
                                Daftar Gratis
                            </Link>
                        </>
                    )}

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-outline-variant px-6 py-4 space-y-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                'block text-sm font-medium py-2 transition-colors',
                                currentPath === item.href ? 'text-primary' : 'text-on-surface-variant'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    )
}
