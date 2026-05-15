'use client'

import { Navigation } from '@/components/Navigation'
import { Card, CardHeader, CardBody } from '@/components/Card'
import { ProgressBar } from '@/components/ProgressBar'
import { Badge } from '@/components/Badge'

export default function AnalysisPage() {
    const analyticsData = {
        totalSessions: 12,
        totalQuestions: 450,
        averageAccuracy: 72,
        improvementTrend: '+8%',
    }

    const categoryPerformance = [
        {
            category: 'Verbal Reasoning',
            accuracy: 68,
            trend: 'up',
            sessionsCount: 5,
        },
        {
            category: 'Numerical Reasoning',
            accuracy: 65,
            trend: 'stable',
            sessionsCount: 4,
        },
        {
            category: 'Figural Reasoning',
            accuracy: 82,
            trend: 'up',
            sessionsCount: 3,
        },
    ]

    const improvementAreas = [
        { area: 'Time Management', score: 55, priority: 'High' },
        { area: 'Complex Problems', score: 60, priority: 'High' },
        { area: 'Pattern Recognition', score: 75, priority: 'Medium' },
        { area: 'Reading Speed', score: 80, priority: 'Low' },
    ]

    return (
        <main className="bg-background min-h-screen">
            <Navigation currentPath="/analysis" />

            <div className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-on-surface mb-2">Performance Analysis</h1>
                        <p className="text-on-surface-variant">
                            Detailed insights into your learning progress and areas for improvement.
                        </p>
                    </div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Total Sessions', value: analyticsData.totalSessions },
                            { label: 'Questions Completed', value: analyticsData.totalQuestions },
                            { label: 'Overall Accuracy', value: `${analyticsData.averageAccuracy}%` },
                            { label: 'Improvement', value: analyticsData.improvementTrend },
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
                        {/* Category Performance */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader title="Category Performance" />
                                <CardBody>
                                    <div className="space-y-8">
                                        {categoryPerformance.map((cat) => (
                                            <div key={cat.category}>
                                                <div className="flex justify-between items-center mb-3">
                                                    <div>
                                                        <p className="font-body-md text-on-surface">{cat.category}</p>
                                                        <p className="text-body-sm text-on-surface-variant">
                                                            {cat.sessionsCount} sessions
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            cat.accuracy >= 75
                                                                ? 'success'
                                                                : cat.accuracy >= 50
                                                                    ? 'info'
                                                                    : 'warning'
                                                        }
                                                    >
                                                        {cat.accuracy}% {cat.trend === 'up' ? '↑' : '→'}
                                                    </Badge>
                                                </div>
                                                <ProgressBar
                                                    value={cat.accuracy}
                                                    variant={
                                                        cat.accuracy >= 75
                                                            ? 'success'
                                                            : cat.accuracy >= 50
                                                                ? 'primary'
                                                                : 'warning'
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Improvement Areas */}
                        <div>
                            <Card>
                                <CardHeader
                                    title="Areas for Improvement"
                                    description="Focus on these to boost your score"
                                />
                                <CardBody>
                                    <div className="space-y-4">
                                        {improvementAreas.map((area) => (
                                            <div key={area.area} className="p-3 bg-surface-container rounded-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-body-sm text-on-surface">{area.area}</span>
                                                    <Badge
                                                        variant={
                                                            area.priority === 'High'
                                                                ? 'error'
                                                                : area.priority === 'Medium'
                                                                    ? 'warning'
                                                                    : 'success'
                                                        }
                                                        size="sm"
                                                    >
                                                        {area.priority}
                                                    </Badge>
                                                </div>
                                                <ProgressBar value={area.score} variant="warning" />
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <Card className="mt-8">
                        <CardHeader title="Personalized Recommendations" />
                        <CardBody>
                            <div className="space-y-4">
                                <div className="p-4 bg-primary-fixed rounded-lg border border-primary">
                                    <p className="font-body-md text-on-surface mb-1">📚 Focus on Verbal Skills</p>
                                    <p className="text-body-sm text-on-surface-variant">
                                        Your verbal reasoning needs improvement. We recommend practicing 2 more sessions
                                        this week.
                                    </p>
                                </div>
                                <div className="p-4 bg-secondary-fixed rounded-lg border border-secondary">
                                    <p className="font-body-md text-on-surface mb-1">⏱️ Improve Speed</p>
                                    <p className="text-body-sm text-on-surface-variant">
                                        You're spending too much time on numerical problems. Try timed drills to improve
                                        your pace.
                                    </p>
                                </div>
                                <div className="p-4 bg-surface-container rounded-lg border border-outline-variant">
                                    <p className="font-body-md text-on-surface mb-1">🎯 Keep Your Momentum</p>
                                    <p className="text-body-sm text-on-surface-variant">
                                        Your figural reasoning is excellent! Maintain this level by practicing 2-3 times
                                        per week.
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </main>
    )
}
