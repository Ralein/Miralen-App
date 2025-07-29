"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Clock, Zap, Star, Trophy, ChevronUp, ChevronDown, Activity } from "lucide-react"

interface UserProgress {
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

interface RealTimeStats {
  currentSession: {
    timeSpent: number
    xpGained: number
    lessonsCompleted: number
    accuracy: number
    wordsLearned: number
  }
  todayStats: {
    timeSpent: number
    xpGained: number
    lessonsCompleted: number
    accuracy: number
    wordsLearned: number
  }
  weekStats: {
    timeSpent: number
    xpGained: number
    lessonsCompleted: number
    accuracy: number
    wordsLearned: number
  }
}

interface ProgressTrackerProps {
  userProgress: UserProgress
  realTimeStats: RealTimeStats
  accessibilityMode: string | null
}

export function ProgressTracker({ userProgress, realTimeStats }: ProgressTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false)



  // Calculate progress percentages
  const xpToNextLevel = 100 // XP needed for next level
  const currentLevelXP = userProgress.xp % xpToNextLevel
  const levelProgress = (currentLevelXP / xpToNextLevel) * 100

 

  const renderCompactView = () => (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-52 shadow-lg border-2 border-blue-200 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Activity className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Level {userProgress.level}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-7 w-7 p-0">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </Button>
          </div>

          {/* XP Progress */}
          <div className="space-y-1 mb-2">
            <div className="flex justify-between text-xs">
              <span>XP Progress</span>
              <span>
                {currentLevelXP}/{xpToNextLevel}
              </span>
            </div>
            <Progress value={levelProgress} className="h-1.5" />
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="bg-blue-50 rounded-lg p-1">
              <div className="text-sm font-bold text-blue-600">{realTimeStats.currentSession.timeSpent}m</div>
              <div className="text-xs text-gray-600">Session</div>
            </div>
            <div className="bg-green-50 rounded-lg p-1">
              <div className="text-sm font-bold text-green-600">+{Math.round(realTimeStats.currentSession.xpGained/2)}</div>
              <div className="text-xs text-gray-600">XP</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-1">
              <div className="text-sm font-bold text-purple-600">{userProgress.streak}</div>
              <div className="text-xs text-gray-600">Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderExpandedView = () => (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-xl border-2 border-blue-200 bg-white/95 backdrop-blur-sm max-h-[70vh] overflow-y-auto">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-blue-600" />
              Real-Time Progress
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="h-7 w-7 p-0">
                <ChevronDown className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-3">

         
          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center text-sm">
                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                Level {userProgress.level}
              </h3>
              <Badge variant="secondary" className="text-xs">{userProgress.xp.toLocaleString()} XP</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress to Level {userProgress.level + 1}</span>
                <span>
                  {currentLevelXP}/{xpToNextLevel}
                </span>
              </div>
              <Progress value={levelProgress} className="h-1.5" />
            </div>
          </div>

          {/* Current Session Stats */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center text-sm">
              <Clock className="w-3 h-3 mr-1 text-blue-500" />
              Current Session
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-base font-bold text-blue-600">{realTimeStats.currentSession.timeSpent}</div>
                <div className="text-xs text-gray-600">Minutes</div>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <div className="text-base font-bold text-green-600">+{realTimeStats.currentSession.xpGained}</div>
                <div className="text-xs text-gray-600">XP Earned</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-2 text-center">
                <div className="text-base font-bold text-purple-600">
                  {realTimeStats.currentSession.lessonsCompleted}
                </div>
                <div className="text-xs text-gray-600">Lessons</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <div className="text-base font-bold text-orange-600">{realTimeStats.currentSession.wordsLearned}</div>
                <div className="text-xs text-gray-600">Words</div>
              </div>
            </div>
          </div>

          {/* Skill Levels */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center text-sm">
              <Zap className="w-3 h-3 mr-1 text-purple-500" />
              Skill Levels
            </h3>
            <div className="space-y-1">
              {Object.entries(userProgress.skillLevels).map(([skill, level]) => (
                <div key={skill}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="capitalize">{skill.replace(/([A-Z])/g, " $1")}</span>
                    <span>{String(level)}%</span>
                  </div>
                  <Progress value={level as number} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center text-sm">
              <Activity className="w-3 h-3 mr-1 text-blue-500" />
              Recent Activity
            </h3>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {userProgress.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-2 p-1.5 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp.toLocaleTimeString()}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    +{activity.xpGained}
                  </Badge>
                </div>
              ))}
              {userProgress.recentActivity.length === 0 && (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-500">No activity yet</p>
                  <p className="text-xs text-muted-foreground">Start learning to see your progress!</p>
                </div>
              )}
            </div>
          </div>

          {/* Today's Summary */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center text-sm">
              <Calendar className="w-3 h-3 mr-1 text-indigo-500" />
              Today's Summary
            </h3>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-indigo-50 rounded-lg p-1.5">
                <div className="text-base font-bold text-indigo-600">{realTimeStats.todayStats.timeSpent}m</div>
                <div className="text-xs text-foreground">Time</div>
              </div>
              <div className="bg-green-50 rounded-lg p-1.5">
                <div className="text-base font-bold text-green-600">+{realTimeStats.todayStats.xpGained}</div>
                <div className="text-xs text-gray-600">XP</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-1.5">
                <div className="text-base font-bold text-blue-600">{realTimeStats.todayStats.lessonsCompleted}</div>
                <div className="text-xs text-gray-600">Lessons</div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )

  return isExpanded ? renderExpandedView() : renderCompactView()
}

export default ProgressTracker