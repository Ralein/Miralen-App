
export interface UserProgress {
  level: number
  xp: number
  streak: number
  lessonsCompleted: number
  totalLessons: number
  wordsLearned: number
  totalWords: number
  accuracy: number
  averageSpeed: number
  timeSpent: number
  achievements: string[]
  weeklyGoal: number
  weeklyProgress: number
  dailyStreak: number
  longestStreak: number
  skillLevels: {
    letters: number
    numbers: number
    punctuation: number
    words: number
    sentences: number
    emergency: number
    signLanguage: number
    voiceRecognition: number
    interactiveLearning: number
  }
  recentActivity: Array<{
    type: string
    description: string
    timestamp: Date
    xpGained: number
  }>
  weakAreas: string[]
  strongAreas: string[]
  learningPath: string[]
  nextMilestone: {
    title: string
    progress: number
    target: number
  }
  sentencesLearned: number
  totalSentences: number
  masteryLevels: {
    basicLetters: number
    advancedLetters: number
    numbers: number
    punctuation: number
    basicWords: number
    advancedWords: number
    sentences: number
    conversations: number
    emergency: number
    signLanguage: number
    voiceRecognition: number
    multiplayer: number
  }
  multiplayerStats: {
    gamesPlayed: number
    gamesWon: number
    winRate: number
    ranking: number
    tournamentWins: number
  }
}
