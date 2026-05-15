'use client'

import { Navigation } from '@/components/Navigation'
import { Card, CardHeader, CardBody } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'

export default function MaterialsPage() {
    const materials = [
        {
            id: 1,
            title: 'Verbal Reasoning Masterclass',
            description: 'Comprehensive guide to reading comprehension and logical reasoning',
            type: 'Video',
            duration: '2.5 hours',
            level: 'Beginner',
            views: 1250,
        },
        {
            id: 2,
            title: 'Numerical Reasoning Formulas',
            description: 'Essential formulas and shortcuts for quick calculations',
            type: 'PDF',
            duration: '45 pages',
            level: 'Intermediate',
            views: 890,
        },
        {
            id: 3,
            title: 'Figural Reasoning Patterns',
            description: 'Master pattern recognition and spatial visualization',
            type: 'Interactive',
            duration: '3 hours',
            level: 'Intermediate',
            views: 2100,
        },
        {
            id: 4,
            title: 'Time Management Strategies',
            description: 'Techniques to answer questions faster without sacrificing accuracy',
            type: 'Webinar',
            duration: '1.5 hours',
            level: 'Advanced',
            views: 650,
        },
        {
            id: 5,
            title: 'Common Mistakes Guide',
            description: 'Learn from the most common errors TIU takers make',
            type: 'PDF',
            duration: '60 pages',
            level: 'Advanced',
            views: 1050,
        },
        {
            id: 6,
            title: 'Mock Test Strategy',
            description: 'How to effectively prepare for the actual TIU exam',
            type: 'Guide',
            duration: '30 pages',
            level: 'Expert',
            views: 780,
        },
    ]

    const categories = [
        { name: 'Verbal Reasoning', count: 12 },
        { name: 'Numerical Reasoning', count: 15 },
        { name: 'Figural Reasoning', count: 10 },
        { name: 'Test Strategies', count: 8 },
    ]

    return (
        <main className="bg-background min-h-screen">
            <Navigation currentPath="/materials" />

            <div className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-on-surface mb-2">Study Materials</h1>
                        <p className="text-on-surface-variant">
                            Access videos, guides, and resources to enhance your learning.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                        {/* Categories Sidebar */}
                        <div>
                            <Card>
                                <CardHeader title="Categories" />
                                <CardBody>
                                    <div className="space-y-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.name}
                                                className="w-full text-left p-2 rounded-lg hover:bg-surface-container transition flex justify-between items-center"
                                            >
                                                <span className="text-body-sm text-on-surface">{cat.name}</span>
                                                <span className="text-label-md text-on-surface-variant">
                                                    {cat.count}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Materials List */}
                        <div className="lg:col-span-3">
                            <div className="space-y-4">
                                {materials.map((material) => (
                                    <Card key={material.id} hoverable>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-title-lg text-on-surface">{material.title}</h3>
                                                    <Badge
                                                        variant={
                                                            material.level === 'Beginner'
                                                                ? 'success'
                                                                : material.level === 'Intermediate'
                                                                    ? 'info'
                                                                    : 'warning'
                                                        }
                                                        size="sm"
                                                    >
                                                        {material.level}
                                                    </Badge>
                                                </div>
                                                <p className="text-body-sm text-on-surface-variant mb-3">
                                                    {material.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-body-sm text-on-surface-variant">
                                                    <span className="inline-flex items-center gap-1">
                                                        <span className="text-lg">📄</span> {material.type}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <span className="text-lg">⏱️</span> {material.duration}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <span className="text-lg">👁️</span> {material.views} views
                                                    </span>
                                                </div>
                                            </div>
                                            <Button variant="secondary" size="sm" className="ml-4">
                                                View
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
