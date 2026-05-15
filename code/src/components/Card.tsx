'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    hoverable?: boolean
    padded?: boolean
}

export function Card({
    children,
    hoverable = false,
    padded = true,
    className,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                'bg-white rounded-lg border border-outline-variant shadow-sm',
                padded && 'p-6',
                hoverable && 'hover:shadow-md transition-shadow cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    description?: string
    children?: React.ReactNode
}

export function CardHeader({
    title,
    description,
    children,
    className,
    ...props
}: CardHeaderProps) {
    return (
        <div className={cn('mb-4', className)} {...props}>
            {title && <h3 className="font-title-lg text-on-surface">{title}</h3>}
            {description && (
                <p className="text-body-sm text-on-surface-variant mt-1">{description}</p>
            )}
            {children}
        </div>
    )
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export function CardBody({ children, className, ...props }: CardBodyProps) {
    return (
        <div className={cn('space-y-4', className)} {...props}>
            {children}
        </div>
    )
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
    return (
        <div className={cn('mt-6 pt-4 border-t border-outline-variant', className)} {...props}>
            {children}
        </div>
    )
}
