'use client'

import { Navigation } from '@/components/Navigation'
import { Card, CardHeader, CardBody } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const practiceOptions = [
    {
        id: 'verbal',
        title: 'Verbal Reasoning',
        description: 'Pemahaman bacaan, kosakata, dan penalaran logis',
        icon: '📚',
        color: 'primary',
        questionCount: 180,
        avgTime: '45 menit',
    },
    {
        id: 'numerical',
        title: 'Numerical Reasoning',
        description: 'Matematika, perhitungan, dan analisis numerik',
        icon: '🔢',
        color: 'secondary',
        questionCount: 180,
        avgTime: '50 menit',
    },
    {
        id: 'figural',
        title: 'Figural Reasoning',
        description: 'Pengenalan pola, penalaran spasial, dan analisis visual',
        icon: '🔷',
        color: 'tertiary',
        questionCount: 180,
        avgTime: '40 menit',
    },
    {
        id: 'fulltest',
        title: 'Simulasi Lengkap',
        description: 'Simulasi TIU lengkap dengan 90 soal seperti ujian nyata',
        icon: '🎯',
        color: 'primary',
        questionCount: 90,
        avgTime: '120 menit',
    },
]

const difficulties = [
    { level: 'Beginner', questions: 30, description: 'Bangun fondasi', icon: '🌱' },
    { level: 'Intermediate', questions: 45, description: 'Perkuat kemampuan', icon: '⚡' },
    { level: 'Advanced', questions: 60, description: 'Kuasai konsep', icon: '🔥' },
    { level: 'Expert', questions: 80, description: 'Tantangan tertinggi', icon: '🏆' },
]

export default function PracticePage() {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
    const [starting, setStarting] = useState(false)
    const [error, setError] = useState('')

    const handleStartSession = async () => {
        if (!selectedCategory) {
            setError('Pilih jenis latihan terlebih dahulu')
            return
        }

        setStarting(true)
        setError('')

        try {
            const option = practiceOptions.find((o) => o.id === selectedCategory)
            const response = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: option?.title,
                    difficulty: selectedDifficulty,
                    title: `${option?.title || 'TIU'} - ${selectedDifficulty || 'Mixed'}`,
                }),
            })

            if (response.status === 401) {
                router.push('/auth/login')
                return
            }

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || 'Gagal memulai sesi')
                return
            }

            // Redirect to practice session page
            router.push(`/practice/${data.id}`)
        } catch {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setStarting(false)
        }
    }

    return (
        <main className="bg-background min-h-screen">
            <Navigation currentPath="/practice" />

            <div className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-on-surface mb-2">Sesi Latihan</h1>
                        <p className="text-on-surface-variant">
                            Pilih jenis latihan dan tingkat kesulitan untuk memulai.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 px-4 py-3 bg-error-container text-error rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Practice Type Selection */}
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-on-surface mb-4">
                            1. Pilih Jenis Latihan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {practiceOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSelectedCategory(option.id)}
                                    className={`text-left p-5 rounded-2xl border-2 transition-all hover:shadow-md ${
                                        selectedCategory === option.id
                                            ? 'border-primary bg-primary-fixed shadow-md'
                                            : 'border-outline-variant bg-white hover:border-primary/40'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-4xl">{option.icon}</span>
                                        <Badge variant={option.color as any}>{option.questionCount} Soal</Badge>
                                    </div>
                                    <h3 className="text-base font-bold text-on-surface mb-1">{option.title}</h3>
                                    <p className="text-sm text-on-surface-variant mb-3">{option.description}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        ≈ {option.avgTime}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-on-surface mb-4">
                            2. Pilih Tingkat Kesulitan{' '}
                            <span className="text-sm font-normal text-on-surface-variant">(opsional)</span>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {difficulties.map((diff) => (
                                <button
                                    key={diff.level}
                                    onClick={() =>
                                        setSelectedDifficulty(
                                            selectedDifficulty === diff.level ? null : diff.level
                                        )
                                    }
                                    className={`p-4 rounded-2xl border-2 transition-all text-center hover:shadow-sm ${
                                        selectedDifficulty === diff.level
                                            ? 'border-primary bg-primary-fixed shadow-sm'
                                            : 'border-outline-variant bg-white hover:border-primary/40'
                                    }`}
                                >
                                    <div className="text-2xl mb-2">{diff.icon}</div>
                                    <p className="font-bold text-sm text-on-surface">{diff.level}</p>
                                    <p className="text-xs text-on-surface-variant mt-0.5">{diff.description}</p>
                                    <p className="text-lg font-bold text-primary mt-2">{diff.questions} Q</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Start Session CTA */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Button
                            size="lg"
                            onClick={handleStartSession}
                            loading={starting}
                            disabled={!selectedCategory}
                            className="w-full sm:w-auto px-10"
                        >
                            🚀 Mulai Sesi Latihan
                        </Button>
                        <Link href="/dashboard">
                            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                                Lihat Dashboard
                            </Button>
                        </Link>
                    </div>

                    {!selectedCategory && (
                        <p className="text-sm text-on-surface-variant mt-3">
                            Pilih jenis latihan untuk melanjutkan.
                        </p>
                    )}
                </div>
            </div>
        </main>
    )
}
