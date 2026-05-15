'use client'

import { cn } from '@/lib/utils'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
    size?: 'sm' | 'md'
    className?: string
}

export function Badge({
    children,
    variant = 'primary',
    size = 'sm',
    className,
}: BadgeProps) {
    const variants = {
        primary: 'bg-primary-fixed text-primary',
        secondary: 'bg-secondary-fixed text-secondary',
        success: 'bg-secondary-fixed text-secondary',
        warning: 'bg-amber-100 text-amber-800',
        error: 'bg-error-container text-error',
        info: 'bg-surface-container text-on-surface',
    }

    const sizes = {
        sm: 'px-2 py-1 text-label-md',
        md: 'px-3 py-1.5 text-body-sm',
    }

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full font-medium',
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </span>
    )
}
