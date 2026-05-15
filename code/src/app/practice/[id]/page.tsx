'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
    id: string
    category: string
    difficulty: string
    question_text: string
    options: string[]
    correct_option: number
}

interface Session {
    id: string
    title: string
    category: string
}

export default function QuizInterface({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id: sessionId } = use(params)

    const [session, setSession] = useState<Session | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    
    // answers map: questionId -> selected option index
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [flagged, setFlagged] = useState<Record<string, boolean>>({})
    
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        // Load saved progress from local storage
        const savedData = localStorage.getItem(`tiu_session_${sessionId}`)
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData)
                if (parsed.answers) setAnswers(parsed.answers)
                if (parsed.flagged) setFlagged(parsed.flagged)
                if (parsed.timeElapsed) setTimeElapsed(parsed.timeElapsed)
            } catch (e) {
                console.error('Failed to parse saved session', e)
            }
        }

        const fetchQuiz = async () => {
            try {
                const res = await fetch(`/api/sessions/${sessionId}`)
                if (!res.ok) {
                    if (res.status === 401) router.push('/auth/login')
                    throw new Error('Gagal memuat kuis')
                }
                const data = await res.json()
                setSession(data.session)
                setQuestions(data.questions || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchQuiz()
    }, [sessionId, router])

    useEffect(() => {
        if (loading || submitting || questions.length === 0) return
        const timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000)
        return () => clearInterval(timer)
    }, [loading, submitting, questions])

    // Save progress to local storage
    useEffect(() => {
        if (loading) return
        localStorage.setItem(`tiu_session_${sessionId}`, JSON.stringify({
            answers,
            flagged,
            timeElapsed
        }))
    }, [answers, flagged, timeElapsed, sessionId, loading])

    const handleSelectOption = (qId: string, optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [qId]: optionIndex }))
    }

    const toggleFlag = (qId: string) => {
        setFlagged(prev => ({ ...prev, [qId]: !prev[qId] }))
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const handleSubmit = async () => {
        if (!confirm('Apakah Anda yakin ingin menyelesaikan ujian ini?')) return
        setSubmitting(true)
        
        try {
            const formattedAnswers = Object.entries(answers).map(([qId, selected_option]) => ({
                question_id: qId,
                selected_option
            }))

            const res = await fetch(`/api/sessions/${sessionId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers: formattedAnswers,
                    durationSeconds: timeElapsed,
                    totalQuestions: questions.length
                })
            })

            if (res.ok) {
                localStorage.removeItem(`tiu_session_${sessionId}`)
                router.push('/dashboard') // Or analysis page
            } else {
                alert('Gagal menyimpan hasil kuis')
                setSubmitting(false)
            }
        } catch (error) {
            console.error(error)
            alert('Gagal menyimpan hasil kuis')
            setSubmitting(false)
        }
    }

    if (loading) return <div className="flex h-screen items-center justify-center">Memuat soal...</div>
    if (questions.length === 0) return <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p>Tidak ada soal untuk kategori ini.</p>
        <button onClick={() => router.push('/practice')} className="text-primary hover:underline">Kembali ke Latihan</button>
    </div>

    const currentQ = questions[currentIndex]
    const letters = ['A', 'B', 'C', 'D', 'E']

    return (
        <div className="font-body-md text-on-surface antialiased overflow-hidden h-screen flex flex-col bg-background">
            {/* TopNavBar */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm h-16">
                <div className="flex justify-between items-center h-full px-6 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold tracking-tight text-indigo-700">TIU Prep</span>
                        <div className="h-6 w-px bg-slate-200 mx-2"></div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 uppercase tracking-widest">{session?.category}</span>
                            <span className="font-semibold text-on-surface text-sm">{session?.title}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-bold text-red-600 font-mono tabular-nums leading-none">{formatTime(timeElapsed)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {submitting ? 'Menyimpan...' : 'Selesai'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow pt-16 flex overflow-hidden">
                {/* Left Sidebar: Progress Map */}
                <aside className="w-80 flex-shrink-0 bg-white border-r border-slate-200 p-6 flex flex-col h-full">
                    <div className="mb-6">
                        <h3 className="font-semibold text-slate-900 mb-1">Navigasi Soal</h3>
                        <p className="text-sm text-slate-500">Pantau progres ujian Anda</p>
                    </div>
                    <div className="grid grid-cols-5 gap-3 overflow-y-auto pr-2 pb-10">
                        {questions.map((q, idx) => {
                            const isCurrent = idx === currentIndex
                            const isAnswered = answers[q.id] !== undefined
                            const isFlagged = flagged[q.id]

                            let btnClass = "h-10 w-10 flex items-center justify-center rounded-lg font-medium transition-all duration-200 relative "
                            
                            if (isCurrent) {
                                btnClass += "bg-primary text-white shadow-md shadow-primary/20 ring-4 ring-primary/10 "
                            } else if (isAnswered) {
                                btnClass += "bg-green-100 text-green-800 border border-green-200 hover:brightness-95 "
                            } else {
                                btnClass += "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 "
                            }

                            return (
                                <button 
                                    key={q.id} 
                                    onClick={() => setCurrentIndex(idx)}
                                    className={btnClass}
                                >
                                    {(idx + 1).toString().padStart(2, '0')}
                                    {isFlagged && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                    <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="w-3 h-3 rounded-full bg-green-200 border border-green-300"></span>
                            <span>Terjawab ({Object.keys(answers).length})</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10"></span>
                            <span>Sedang Dikerjakan</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            <span>Ditandai (Ragu-ragu)</span>
                        </div>
                    </div>
                </aside>

                {/* Center Area: The Question Interface */}
                <section className="flex-grow flex flex-col items-center justify-start py-12 px-8 overflow-y-auto bg-slate-50">
                    <div className="max-w-3xl w-full">
                        {/* Question Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-bold text-xs">SOAL {(currentIndex + 1).toString().padStart(2, '0')}</span>
                                    <span className="text-slate-400 font-medium">•</span>
                                    <span className="text-slate-500 text-sm">Kesulitan: {currentQ.difficulty}</span>
                                </div>
                                <button 
                                    onClick={() => toggleFlag(currentQ.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${flagged[currentQ.id] ? 'text-red-600 bg-red-50' : 'text-slate-500 hover:bg-slate-100'}`}
                                >
                                    <svg className="w-5 h-5" fill={flagged[currentQ.id] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                                    <span className="text-xs font-bold">{flagged[currentQ.id] ? 'DITANDAI' : 'TANDAI RAGU'}</span>
                                </button>
                            </div>
                            
                            {/* Question Content */}
                            <div className="space-y-6">
                                <p className="text-xl font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                                    {currentQ.question_text}
                                </p>
                                
                                {/* Answer Options */}
                                <div className="grid grid-cols-1 gap-3 mt-8">
                                    {currentQ.options.map((optJson, optIdx) => {
                                        // Handle if option string starts with "A. "
                                        let optText = optJson
                                        if (typeof optJson === 'string' && optJson.match(/^[A-E]\.\s/)) {
                                            optText = optJson.substring(3)
                                        }

                                        const isSelected = answers[currentQ.id] === optIdx

                                        return (
                                            <label 
                                                key={optIdx} 
                                                className={`group relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                    isSelected 
                                                    ? 'border-primary bg-indigo-50/50' 
                                                    : 'border-slate-100 bg-white hover:border-primary/30'
                                                }`}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name={`q-${currentQ.id}`}
                                                    className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-slate-300'}`}
                                                    checked={isSelected}
                                                    onChange={() => handleSelectOption(currentQ.id, optIdx)}
                                                />
                                                <span className="ml-4 flex items-center gap-4">
                                                    <span className={`font-bold ${isSelected ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
                                                        {letters[optIdx]}.
                                                    </span>
                                                    <span className={`text-lg ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
                                                        {optText}
                                                    </span>
                                                </span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer Navigation Buttons */}
                        <div className="flex justify-between items-center px-4">
                            <button 
                                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                disabled={currentIndex === 0}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors disabled:opacity-30"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                SEBELUMNYA
                            </button>
                            
                            <button 
                                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                                disabled={currentIndex === questions.length - 1}
                                className="flex items-center gap-2 px-8 py-3 bg-indigo-700 text-white rounded-xl font-bold hover:bg-indigo-800 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
                            >
                                SELANJUTNYA
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
