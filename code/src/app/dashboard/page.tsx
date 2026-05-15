'use client'

import { Navigation } from '@/components/Navigation'
import { Card, CardHeader, CardBody } from '@/components/Card'
import { ProgressBar } from '@/components/ProgressBar'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import Link from 'next/link'

export default function DashboardPage() {
    const stats = {
        totalSessions: 12,
        totalQuestions: 450,
        averageAccuracy: 72,
        bestCategory: 'Figural Reasoning',
    }

    const recentSessions = [
        {
            id: 1,
            title: 'Verbal Reasoning Practice',
            accuracy: 68,
            questions: 40,
            date: '2024-05-15',
        },
        {
            id: 2,
            title: 'Numerical Reasoning Drill',
            accuracy: 75,
            questions: 35,
            date: '2024-05-14',
        },
        {
            id: 3,
            title: 'Figural Reasoning Session',
            accuracy: 82,
            questions: 30,
            date: '2024-05-13',
        },
    ]

    const skillProgression = [
        { category: 'Verbal Reasoning', accuracy: 68, trend: 'up' },
        { category: 'Numerical Reasoning', accuracy: 65, trend: 'stable' },
        { category: 'Figural Reasoning', accuracy: 82, trend: 'up' },
    ]

    return (
        <main className="bg-background min-h-screen">
            <Navigation currentPath="/dashboard" />

            <div className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-on-surface mb-2">Welcome back!</h1>
                        <p className="text-on-surface-variant">Keep up your momentum and continue improving.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Total Sessions', value: stats.totalSessions },
                            { label: 'Questions Solved', value: stats.totalQuestions },
                            { label: 'Average Accuracy', value: `${stats.averageAccuracy}%` },
                            { label: 'Best Category', value: stats.bestCategory },
                        ].map((stat, idx) => (
                            <Card key={idx}>
                                <CardBody>
                                    <p className="text-label-md text-on-surface-variant mb-2">{stat.label}</p>
                                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Skill Overview */}
                            <Card>
                                <CardHeader title="Your Skills" description="Current proficiency levels" />
                                <CardBody>
                                    <div className="space-y-6">
                                        {skillProgression.map((skill) => (
                                            <div key={skill.category}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-body-md text-on-surface">{skill.category}</span>
                                                    <Badge
                                                        variant={
                                                            skill.accuracy >= 75
                                                                ? 'success'
                                                                : skill.accuracy >= 50
                                                                    ? 'info'
                                                                    : 'warning'
                                                        }
                                                    >
                                                        {skill.accuracy}%
                                                    </Badge>
                                                </div>
                                                <ProgressBar
                                                    value={skill.accuracy}
                                                    variant={
                                                        skill.accuracy >= 75
                                                            ? 'success'
                                                            : skill.accuracy >= 50
                                                                ? 'primary'
                                                                : 'warning'
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Recent Sessions */}
                            <Card>
                                <CardHeader title="Recent Sessions" />
                                <CardBody>
                                    <div className="space-y-4">
                                        {recentSessions.map((session) => (
                                            <div
                                                key={session.id}
                                                className="flex items-center justify-between p-4 bg-surface-container rounded-lg hover:bg-surface-container-high transition"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-body-md text-on-surface">{session.title}</p>
                                                    <p className="text-body-sm text-on-surface-variant">
                                                        {session.questions} questions • {session.date}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        session.accuracy >= 75
                                                            ? 'success'
                                                            : session.accuracy >= 50
                                                                ? 'info'
                                                                : 'warning'
                                                    }
                                                >
                                                    {session.accuracy}%
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader title="Quick Actions" />
                                <CardBody>
                                    <div className="space-y-3">
                                        <Link href="/practice">
                                            <Button className="w-full" size="md">
                                                Start Practice
                                            </Button>
                                        </Link>
                                        <Link href="/analysis">
                                            <Button variant="secondary" className="w-full" size="md">
                                                View Analytics
                                            </Button>
                                        </Link>
                                        <Link href="/materials">
                                            <Button variant="ghost" className="w-full" size="md">
                                                Study Materials
                                            </Button>
                                        </Link>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Today's Goal */}
                            <Card>
                                <CardHeader
                                    title="Today's Goal"
                                    description="Complete 50 questions in 45 minutes"
                                />
                                <CardBody>
                                    <ProgressBar value={30} max={50} label="Progress" showLabel />
                                    <p className="text-body-sm text-on-surface-variant mt-4">
                                        You're on track! Keep up the good work.
                                    </p>
                                </CardBody>
                            </Card>

                            {/* Study Streak */}
                            <Card>
                                <CardHeader title="Study Streak" />
                                <CardBody>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-4xl">🔥</span>
                                        <div>
                                            <p className="text-3xl font-bold text-primary">7</p>
                                            <p className="text-body-sm text-on-surface-variant">days in a row</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
