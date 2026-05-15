'use client'

import { Navigation } from '@/components/Navigation'
import { Card, CardHeader, CardBody } from '@/components/Card'
import { ProgressBar } from '@/components/ProgressBar'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface StatsData {
    totalSessions: number
    totalQuestions: number
    averageAccuracy: number
    bestCategory: string
    streak: number
}

interface SessionData {
    id: string
    title: string
    correct_answers: number
    total_questions: number
    started_at: string
    category?: string
    status: string
}

interface SkillData {
    category: string
    accuracy: number
    trend: 'up' | 'stable' | 'down'
}

export default function DashboardPage() {
    const [stats, setStats] = useState<StatsData | null>(null)
    const [sessions, setSessions] = useState<SessionData[]>([])
    const [skills, setSkills] = useState<SkillData[]>([])
    const [user, setUser] = useState<{ name: string } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch('/api/auth/me').then((r) => r.json()),
            fetch('/api/stats').then((r) => r.json()),
            fetch('/api/sessions').then((r) => r.json()),
        ])
            .then(([userData, statsData, sessionsData]) => {
                setUser(userData.user)
                if (!statsData.message) setStats(statsData)
                if (Array.isArray(sessionsData)) {
                    setSessions(sessionsData.slice(0, 5))

                    // Compute skills from sessions
                    const catMap: Record<string, { correct: number; total: number }> = {}
                    sessionsData.forEach((s: SessionData) => {
                        if (s.category && s.status === 'completed') {
                            if (!catMap[s.category]) catMap[s.category] = { correct: 0, total: 0 }
                            catMap[s.category].correct += s.correct_answers || 0
                            catMap[s.category].total += s.total_questions || 0
                        }
                    })

                    // If no real data, show placeholder skills
                    const computedSkills: SkillData[] = Object.entries(catMap).map(([cat, data]) => ({
                        category: cat,
                        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
                        trend: 'up',
                    }))

                    if (computedSkills.length === 0) {
                        setSkills([
                            { category: 'Verbal Reasoning', accuracy: 0, trend: 'stable' },
                            { category: 'Numerical Reasoning', accuracy: 0, trend: 'stable' },
                            { category: 'Figural Reasoning', accuracy: 0, trend: 'stable' },
                        ])
                    } else {
                        setSkills(computedSkills)
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const defaultStats: StatsData = {
        totalSessions: stats?.totalSessions ?? 0,
        totalQuestions: stats?.totalQuestions ?? 0,
        averageAccuracy: stats?.averageAccuracy ?? 0,
        bestCategory: stats?.bestCategory ?? '-',
        streak: stats?.streak ?? 0,
    }

    const formatDate = (isoDate: string) => {
        return new Date(isoDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
    }

    const getAccuracy = (session: SessionData) => {
        if (!session.total_questions) return 0
        return Math.round((session.correct_answers / session.total_questions) * 100)
    }

    return (
        <main className="bg-background min-h-screen">
            <Navigation currentPath="/dashboard" />

            <div className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-on-surface mb-1">
                            {loading ? 'Memuat...' : `Selamat datang kembali, ${user?.name?.split(' ')[0] || 'Peserta'}! 👋`}
                        </h1>
                        <p className="text-on-surface-variant">Pertahankan semangat belajarmu dan terus tingkatkan kemampuan.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[
                            {
                                label: 'Total Sesi',
                                value: loading ? '...' : defaultStats.totalSessions,
                                icon: '📋',
                                color: 'bg-primary-fixed',
                            },
                            {
                                label: 'Soal Dikerjakan',
                                value: loading ? '...' : defaultStats.totalQuestions,
                                icon: '✏️',
                                color: 'bg-secondary-fixed',
                            },
                            {
                                label: 'Rata-rata Akurasi',
                                value: loading ? '...' : `${defaultStats.averageAccuracy}%`,
                                icon: '🎯',
                                color: 'bg-tertiary-fixed',
                            },
                            {
                                label: 'Kategori Terbaik',
                                value: loading ? '...' : defaultStats.bestCategory,
                                icon: '🏆',
                                color: 'bg-surface-container',
                            },
                        ].map((stat) => (
                            <Card key={stat.label}>
                                <CardBody>
                                    <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-xl mb-3`}>
                                        {stat.icon}
                                    </div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-primary truncate">{stat.value}</p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Skill Overview */}
                            <Card>
                                <CardHeader title="Profil Kemampuan" description="Level kemampuan saat ini" />
                                <CardBody>
                                    {loading ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="animate-pulse">
                                                    <div className="h-4 bg-surface-container rounded mb-2 w-1/3" />
                                                    <div className="h-2.5 bg-surface-container rounded-full" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {skills.map((skill) => (
                                                <div key={skill.category}>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium text-on-surface">{skill.category}</span>
                                                        <Badge
                                                            variant={
                                                                skill.accuracy >= 75 ? 'success'
                                                                    : skill.accuracy >= 50 ? 'info'
                                                                        : 'warning'
                                                            }
                                                        >
                                                            {skill.accuracy}%
                                                        </Badge>
                                                    </div>
                                                    <ProgressBar
                                                        value={skill.accuracy}
                                                        variant={
                                                            skill.accuracy >= 75 ? 'success'
                                                                : skill.accuracy >= 50 ? 'primary'
                                                                    : 'warning'
                                                        }
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Recent Sessions */}
                            <Card>
                                <CardHeader title="Sesi Terakhir" />
                                <CardBody>
                                    {loading ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="animate-pulse h-14 bg-surface-container rounded-lg" />
                                            ))}
                                        </div>
                                    ) : sessions.length === 0 ? (
                                        <div className="text-center py-10">
                                            <div className="text-4xl mb-3">📚</div>
                                            <p className="text-on-surface-variant mb-4">Belum ada sesi latihan. Mulai sekarang!</p>
                                            <Link href="/practice">
                                                <Button size="sm">Mulai Latihan</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {sessions.map((session) => {
                                                const acc = getAccuracy(session)
                                                const isOngoing = session.status !== 'completed'
                                                const href = isOngoing ? `/practice/${session.id}` : `/analysis/${session.id}`
                                                
                                                return (
                                                    <Link
                                                        href={href}
                                                        key={session.id}
                                                        className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-surface-container-high hover:ring-2 hover:ring-primary/20 transition cursor-pointer group"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-on-surface truncate group-hover:text-primary transition-colors">{session.title}</p>
                                                            <p className="text-xs text-on-surface-variant">
                                                                {session.total_questions} soal • {formatDate(session.started_at)}
                                                            </p>
                                                        </div>
                                                        <div className="ml-3 flex items-center gap-3">
                                                            <Badge
                                                                variant={
                                                                    isOngoing ? 'info'
                                                                        : acc >= 75 ? 'success'
                                                                            : acc >= 50 ? 'info'
                                                                                : 'warning'
                                                                }
                                                            >
                                                                {isOngoing ? 'Berlangsung' : `${acc}%`}
                                                            </Badge>
                                                            {isOngoing && (
                                                                <span className="material-symbols-outlined text-primary text-sm opacity-50 group-hover:opacity-100 transition-opacity">
                                                                    play_circle
                                                                </span>
                                                            )}
                                                            {!isOngoing && (
                                                                <span className="material-symbols-outlined text-slate-400 text-sm opacity-50 group-hover:opacity-100 transition-opacity">
                                                                    analytics
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader title="Aksi Cepat" />
                                <CardBody>
                                    <div className="flex flex-col gap-3">
                                        <Link href="/practice" className="block">
                                            <Button className="w-full" size="md">
                                                🚀 Mulai Latihan
                                            </Button>
                                        </Link>
                                        <Link href="/analysis" className="block">
                                            <Button variant="secondary" className="w-full" size="md">
                                                📊 Lihat Analitik
                                            </Button>
                                        </Link>
                                        <Link href="/materials" className="block">
                                            <Button variant="ghost" className="w-full" size="md">
                                                📖 Materi Belajar
                                            </Button>
                                        </Link>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Study Streak */}
                            <Card>
                                <CardHeader title="Streak Belajar" />
                                <CardBody>
                                    <div className="flex items-center justify-center gap-3 py-2">
                                        <span className="text-5xl">🔥</span>
                                        <div>
                                            <p className="text-4xl font-bold text-primary">{loading ? '...' : defaultStats.streak}</p>
                                            <p className="text-sm text-on-surface-variant">hari berturut-turut</p>
                                        </div>
                                    </div>
                                    {!loading && defaultStats.streak === 0 && (
                                        <p className="text-xs text-center text-on-surface-variant mt-2">
                                            Mulai latihan hari ini untuk membangun streak!
                                        </p>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Today's Goal */}
                            <Card>
                                <CardHeader
                                    title="Target Hari Ini"
                                    description="Selesaikan 30 soal"
                                />
                                <CardBody>
                                    <ProgressBar
                                        value={loading ? 0 : Math.min(defaultStats.totalQuestions % 30, 30)}
                                        max={30}
                                        label="Progress"
                                        showLabel
                                    />
                                    <p className="text-xs text-on-surface-variant mt-3">
                                        Konsistensi adalah kunci keberhasilan! 💪
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
