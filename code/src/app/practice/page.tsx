'use client'

import { Navigation } from '@/components/Navigation'
import { Card, CardHeader, CardBody } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import Link from 'next/link'

const practiceOptions = [
    {
        id: 'verbal',
        title: 'Verbal Reasoning',
        description: 'Reading comprehension, vocabulary, and logical reasoning',
        icon: '📚',
        color: 'primary',
        questionCount: 180,
        avgTime: '45 mins',
    },
    {
        id: 'numerical',
        title: 'Numerical Reasoning',
        description: 'Mathematical problems, calculations, and numerical analysis',
        icon: '🔢',
        color: 'secondary',
        questionCount: 180,
        avgTime: '50 mins',
    },
    {
        id: 'figural',
        title: 'Figural Reasoning',
        description: 'Pattern recognition, spatial reasoning, and visual analysis',
        icon: '🔷',
        color: 'tertiary',
        questionCount: 180,
        avgTime: '40 mins',
    },
    {
        id: 'fulltest',
        title: 'Full Mock Test',
        description: 'Complete 90-question TIU simulation',
        icon: '🎯',
        color: 'primary',
        questionCount: 90,
        avgTime: '120 mins',
    },
]

const difficulties = [
    { level: 'Beginner', questions: 30, description: 'Build fundamentals' },
    { level: 'Intermediate', questions: 45, description: 'Strengthen skills' },
    { level: 'Advanced', questions: 60, description: 'Master concepts' },
    { level: 'Expert', questions: 80, description: 'Final challenge' },
]

export default function PracticePage() {
    return (
        <main className="bg-background min-h-screen">
            <Navigation currentPath="/practice" />

            <div className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-on-surface mb-2">Practice Sessions</h1>
                        <p className="text-on-surface-variant">
                            Choose your practice type and difficulty level to get started.
                        </p>
                    </div>

                    {/* Practice Options */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-on-surface mb-6">Choose Your Practice</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {practiceOptions.map((option) => (
                                <Card key={option.id} hoverable>
                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="text-4xl">{option.icon}</span>
                                            <Badge variant={option.color as any}>{option.questionCount} Q</Badge>
                                        </div>
                                        <h3 className="font-title-lg text-on-surface">{option.title}</h3>
                                        <p className="text-body-sm text-on-surface-variant mt-1">
                                            {option.description}
                                        </p>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="flex items-center justify-between">
                                            <span className="text-body-sm text-on-surface-variant">
                                                ⏱ {option.avgTime}
                                            </span>
                                            <Button size="sm">Start</Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Levels */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-on-surface mb-6">Difficulty Levels</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {difficulties.map((diff) => (
                                <Card key={diff.level} hoverable>
                                    <CardBody>
                                        <p className="font-title-lg text-on-surface">{diff.level}</p>
                                        <p className="text-body-sm text-on-surface-variant mt-1">
                                            {diff.description}
                                        </p>
                                        <p className="text-2xl font-bold text-primary mt-3">{diff.questions} Q</p>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Recent Practice */}
                    <Card>
                        <CardHeader title="Your Recent Practice Sessions" />
                        <CardBody>
                            <div className="text-center py-8">
                                <p className="text-on-surface-variant mb-4">You haven't started any practice yet.</p>
                                <Link href="/dashboard">
                                    <Button>View Dashboard</Button>
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </main>
    )
}
