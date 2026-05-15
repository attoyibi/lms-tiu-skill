'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
    value: number
    max?: number
    variant?: 'primary' | 'success' | 'warning' | 'error'
    animated?: boolean
    showLabel?: boolean
    label?: string
    className?: string
}

export function ProgressBar({
    value,
    max = 100,
    variant = 'primary',
    animated = false,
    showLabel = false,
    label,
    className,
}: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100)

    const variants = {
        primary: 'bg-primary',
        success: 'bg-secondary',
        warning: 'bg-tertiary-fixed-dim',
        error: 'bg-error',
    }

    return (
        <div className={cn('w-full', className)}>
            {(showLabel || label) && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-label-md text-on-surface">{label || 'Progress'}</span>
                    <span className="text-label-md text-on-surface-variant">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                    className={cn(
                        'h-full transition-all duration-300 rounded-full',
                        variants[variant],
                        animated && 'animate-pulse'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}
