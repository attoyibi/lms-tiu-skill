'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    children: React.ReactNode
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    className,
    disabled,
    children,
    ...props
}: ButtonProps) {
    const baseStyles =
        'font-semibold rounded-lg transition-all active:scale-95 duration-150 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary:
            'bg-primary hover:bg-primary-container text-on-primary shadow-sm hover:shadow-md',
        secondary: 'border border-outline text-on-surface hover:bg-surface-container',
        ghost: 'text-primary hover:bg-primary-fixed hover:bg-opacity-30',
        success:
            'bg-secondary hover:bg-secondary-container text-on-secondary shadow-sm hover:shadow-md',
        danger:
            'bg-error hover:bg-error-container text-on-error shadow-sm hover:shadow-md',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {children}
                </span>
            ) : (
                children
            )}
        </button>
    )
}
