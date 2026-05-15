'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import React from 'react'

interface NavProps {
    currentPath?: string
    className?: string
}

export function Navigation({ currentPath = '', className }: NavProps) {
    const navItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Practice', href: '/practice' },
        { label: 'Analysis', href: '/analysis' },
        { label: 'Materials', href: '/materials' },
    ]

    return (
        <nav
            className={cn(
                'fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-outline-variant',
                className
            )}
        >
            <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tight text-primary"
                    >
                        TIU Prep
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'font-body-md text-body-md transition-colors pb-1 border-b-2 border-transparent',
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
                <div className="flex items-center gap-4">
                    <Link
                        href="/auth/login"
                        className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </nav>
    )
}
