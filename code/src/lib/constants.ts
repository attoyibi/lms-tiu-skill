// Color Palette from Design System
export const colors = {
  primary: '#032dbc',
  onPrimary: '#ffffff',
  primaryContainer: '#2e4ad3',
  onPrimaryContainer: '#c9cfff',
  secondary: '#006c49',
  onSecondary: '#ffffff',
  secondaryContainer: '#6cf8bb',
  onSecondaryContainer: '#00714d',
  tertiary: '#811b1a',
  onTertiary: '#ffffff',
  tertiaryContainer: '#a1332f',
  onTertiaryContainer: '#ffc3bd',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  background: '#f8f9ff',
  onBackground: '#0b1c30',
  surface: '#f8f9ff',
  onSurface: '#0b1c30',
  onSurfaceVariant: '#444654',
  outline: '#757686',
  outlineVariant: '#c5c5d7',
} as const

// TIU Question Categories
export const tiuCategories = {
  VERBAL: 'Verbal Reasoning',
  NUMERICAL: 'Numerical Reasoning',
  FIGURAL: 'Figural Reasoning',
} as const

// Skill Levels
export const skillLevels = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
} as const

// Question Difficulty
export const difficulties = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  EXPERT: 'Expert',
} as const
