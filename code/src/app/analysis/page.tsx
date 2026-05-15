'use client'

import { Navigation } from '@/components/Navigation'
import { Card, CardHeader, CardBody } from '@/components/Card'
import { ProgressBar } from '@/components/ProgressBar'
import { Badge } from '@/components/Badge'
import { useEffect, useState } from 'react'

interface SessionData {
    id: string
    title: string
    correct_answers: number
    total_questions: number
    started_at: string
    category?: string
    status: string
    duration_seconds?: number
}

interface CategoryStat {
    category: string
    accuracy: number
    sessionsCount: number
    trend: 'up' | 'stable' | 'down'
}

export default function AnalysisPage() {
    const [sessions, setSessions] = useState<SessionData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/sessions')
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setSessions(data)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    // Compute analytics from sessions
    const completedSessions = sessions.filter((s) => s.status === 'completed')
    const totalSessions = completedSessions.length
    const totalQuestions = completedSessions.reduce((acc, s) => acc + (s.total_questions || 0), 0)
    const totalCorrect = completedSessions.reduce((acc, s) => acc + (s.correct_answers || 0), 0)
    const averageAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

    // Category breakdown
    const catMap: Record<string, { correct: number; total: number; count: number }> = {}
    completedSessions.forEach((s) => {
        const cat = s.category || 'Lainnya'
        if (!catMap[cat]) catMap[cat] = { correct: 0, total: 0, count: 0 }
        catMap[cat].correct += s.correct_answers || 0
        catMap[cat].total += s.total_questions || 0
        catMap[cat].count++
    })

    const categoryStats: CategoryStat[] = Object.entries(catMap).map(([cat, data]) => ({
        category: cat,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        sessionsCount: data.count,
        trend: 'up',
    }))

    // Improvement calculation (compare last 3 vs first 3 sessions)
    const sorted = [...completedSessions].sort(
        (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
    )
    const firstHalf = sorted.slice(0, Math.ceil(sorted.length / 2))
    const lastHalf = sorted.slice(Math.ceil(sorted.length / 2))
    const firstAccuracy =
        firstHalf.length > 0
            ? Math.round(
                  (firstHalf.reduce((acc, s) => acc + (s.correct_answers || 0), 0) /
                      Math.max(firstHalf.reduce((acc, s) => acc + (s.total_questions || 0), 0), 1)) *
                      100
              )
            : 0
    const lastAccuracy =
        lastHalf.length > 0
            ? Math.round(
                  (lastHalf.reduce((acc, s) => acc + (s.correct_answers || 0), 0) /
                      Math.max(lastHalf.reduce((acc, s) => acc + (s.total_questions || 0), 0), 1)) *
                      100
              )
            : 0
    const improvement = lastAccuracy - firstAccuracy

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
        })

    return (
        <main className="bg-background min-h-screen">
            <Navigation currentPath="/analysis" />

            <div className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-on-surface mb-2">Analisis Performa</h1>
                        <p className="text-on-surface-variant">
                            Wawasan mendalam tentang perkembangan belajar dan area yang perlu ditingkatkan.
                        </p>
                    </div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: 'Total Sesi', value: loading ? '...' : totalSessions },
                            { label: 'Soal Dikerjakan', value: loading ? '...' : totalQuestions },
                            { label: 'Akurasi Keseluruhan', value: loading ? '...' : `${averageAccuracy}%` },
                            {
                                label: 'Peningkatan',
                                value: loading
                                    ? '...'
                                    : completedSessions.length < 2
                                    ? 'N/A'
                                    : `${improvement >= 0 ? '+' : ''}${improvement}%`,
                            },
                        ].map((stat) => (
                            <Card key={stat.label}>
                                <CardBody>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Category Performance */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader title="Performa per Kategori" />
                                <CardBody>
                                    {loading ? (
                                        <div className="space-y-6">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="animate-pulse">
                                                    <div className="h-4 bg-surface-container rounded mb-2 w-2/5" />
                                                    <div className="h-2.5 bg-surface-container rounded-full" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : categoryStats.length === 0 ? (
                                        <div className="text-center py-10">
                                            <div className="text-4xl mb-3">📊</div>
                                            <p className="text-on-surface-variant">
                                                Belum ada data performa. Selesaikan sesi latihan untuk melihat analisis.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {categoryStats.map((cat) => (
                                                <div key={cat.category}>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <div>
                                                            <p className="text-sm font-medium text-on-surface">{cat.category}</p>
                                                            <p className="text-xs text-on-surface-variant">
                                                                {cat.sessionsCount} sesi selesai
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
                                                            {cat.accuracy}%{' '}
                                                            {cat.trend === 'up' ? '↑' : cat.trend === 'down' ? '↓' : '→'}
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
                                    )}
                                </CardBody>
                            </Card>

                            {/* Session History */}
                            <Card>
                                <CardHeader title="Riwayat Sesi" />
                                <CardBody>
                                    {loading ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="animate-pulse h-14 bg-surface-container rounded-lg" />
                                            ))}
                                        </div>
                                    ) : sessions.length === 0 ? (
                                        <p className="text-center text-on-surface-variant py-8">
                                            Belum ada riwayat sesi.
                                        </p>
                                    ) : (
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {sessions.map((session) => {
                                                const acc =
                                                    session.total_questions > 0
                                                        ? Math.round(
                                                              (session.correct_answers / session.total_questions) * 100
                                                          )
                                                        : 0
                                                return (
                                                    <div
                                                        key={session.id}
                                                        className="flex items-center justify-between p-3 bg-surface-container rounded-xl"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-on-surface truncate">
                                                                {session.title}
                                                            </p>
                                                            <p className="text-xs text-on-surface-variant">
                                                                {formatDate(session.started_at)} •{' '}
                                                                {session.total_questions} soal
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            size="sm"
                                                            variant={
                                                                session.status !== 'completed'
                                                                    ? 'info'
                                                                    : acc >= 75
                                                                    ? 'success'
                                                                    : acc >= 50
                                                                    ? 'info'
                                                                    : 'warning'
                                                            }
                                                        >
                                                            {session.status !== 'completed'
                                                                ? session.status === 'ongoing'
                                                                    ? '▶ Berlangsung'
                                                                    : session.status
                                                                : `${acc}%`}
                                                        </Badge>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>

                        {/* Recommendations */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader
                                    title="Rekomendasi Personal"
                                    description="Berdasarkan performa Anda"
                                />
                                <CardBody>
                                    {loading ? (
                                        <div className="space-y-3">
                                            {[1, 2].map((i) => (
                                                <div key={i} className="animate-pulse h-20 bg-surface-container rounded-lg" />
                                            ))}
                                        </div>
                                    ) : categoryStats.length === 0 ? (
                                        <div className="p-4 bg-surface-container rounded-xl">
                                            <p className="text-sm font-medium text-on-surface mb-1">
                                                🚀 Mulai Latihan
                                            </p>
                                            <p className="text-xs text-on-surface-variant">
                                                Selesaikan beberapa sesi untuk mendapatkan rekomendasi personal.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {categoryStats
                                                .sort((a, b) => a.accuracy - b.accuracy)
                                                .slice(0, 2)
                                                .map((cat) => (
                                                    <div
                                                        key={cat.category}
                                                        className="p-4 bg-primary-fixed rounded-xl border border-primary/10"
                                                    >
                                                        <p className="text-sm font-semibold text-on-surface mb-1">
                                                            📚 Fokus pada {cat.category}
                                                        </p>
                                                        <p className="text-xs text-on-surface-variant">
                                                            Akurasi {cat.accuracy}%. Kami rekomendasikan 2 sesi
                                                            latihan tambahan minggu ini.
                                                        </p>
                                                    </div>
                                                ))}
                                            {categoryStats
                                                .sort((a, b) => b.accuracy - a.accuracy)
                                                .slice(0, 1)
                                                .map((cat) => (
                                                    <div
                                                        key={cat.category + '-best'}
                                                        className="p-4 bg-secondary-fixed rounded-xl border border-secondary/10"
                                                    >
                                                        <p className="text-sm font-semibold text-on-surface mb-1">
                                                            🏆 Pertahankan {cat.category}
                                                        </p>
                                                        <p className="text-xs text-on-surface-variant">
                                                            Akurasi {cat.accuracy}%. Luar biasa! Latihan 2-3x
                                                            seminggu untuk menjaga level ini.
                                                        </p>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Accuracy donut-style indicator */}
                            <Card>
                                <CardHeader title="Ringkasan Akurasi" />
                                <CardBody>
                                    <div className="flex items-center justify-center py-4">
                                        <div className="relative w-28 h-28">
                                            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--outline-variant)" strokeWidth="10" />
                                                <circle
                                                    cx="50" cy="50" r="40"
                                                    fill="none"
                                                    stroke="var(--primary)"
                                                    strokeWidth="10"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - averageAccuracy / 100)}`}
                                                    className="transition-all duration-1000"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-primary">
                                                        {loading ? '...' : `${averageAccuracy}%`}
                                                    </p>
                                                    <p className="text-xs text-on-surface-variant">Akurasi</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center text-xs text-on-surface-variant">
                                        Dari {totalQuestions} soal yang dikerjakan
                                    </p>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
