export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ')
}

export function calculateAccuracy(correct: number, total: number): number {
    if (total === 0) return 0
    return Math.round((correct / total) * 100)
}

export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
}

export function calculateSkillLevel(accuracy: number): string {
    if (accuracy >= 85) return 'Expert'
    if (accuracy >= 70) return 'Advanced'
    if (accuracy >= 50) return 'Intermediate'
    return 'Beginner'
}

export function getColorForScore(score: number): string {
    if (score >= 80) return '#006c49' // Secondary (green)
    if (score >= 60) return '#344fd8' // Primary (blue)
    if (score >= 40) return '#f59e0b' // Warning (amber)
    return '#811b1a' // Tertiary (red)
}
