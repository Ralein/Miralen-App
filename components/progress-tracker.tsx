"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Clock, Zap, Star, Trophy, ChevronUp, ChevronDown, Activity, Settings, AlertTriangle } from "lucide-react"

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
  onProgressReset?: () => void
}

export function ProgressTracker({ userProgress, realTimeStats, accessibilityMode, onProgressReset }: ProgressTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Calculate progress percentages
  const xpToNextLevel = 100 // XP needed for next level
  const currentLevelXP = userProgress.xp % xpToNextLevel
  const levelProgress = (currentLevelXP / xpToNextLevel) * 100

  const resetProgress = () => {
    // Call the parent component's reset function if provided
    if (onProgressReset) {
      onProgressReset()
    }
    
    // Hide the confirmation dialog
    setShowResetConfirm(false)
    setShowSettings(false)
    
    // Show a success message (you could add a toast notification here)
    console.log("Progress has been reset successfully!")
  }

  const renderCompactView = () => (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-60 shadow-lg border-2 border-blue-200 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Live Progress</h3>
                <p className="text-xs text-gray-600">Level {userProgress.level}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className="h-8 w-8 p-0">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-semibold mb-2">Settings</h4>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                className="w-full text-xs"
              >
                Reset All Progress
              </Button>
            </div>
          )}

          {/* XP Progress */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span>XP Progress</span>
              <span>
                {currentLevelXP}/{xpToNextLevel}
              </span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="text-lg font-bold text-blue-600">{realTimeStats.currentSession.timeSpent}m</div>
              <div className="text-xs text-gray-600">Session</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <div className="text-lg font-bold text-green-600">+{realTimeStats.currentSession.xpGained}</div>
              <div className="text-xs text-gray-600">XP Gained</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2">
              <div className="text-lg font-bold text-purple-600">{userProgress.streak}</div>
              <div className="text-xs text-gray-600">Streak</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-3 space-y-2">
            <h4 className="text-xs font-semibold text-gray-700">Recent Activity</h4>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {userProgress.recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="truncate flex-1">{activity.description}</span>
                  <Badge variant="outline" className="text-xs ml-2">
                    +{activity.xpGained}
                  </Badge>
                </div>
              ))}
              {userProgress.recentActivity.length === 0 && (
                <p className="text-xs text-gray-500 italic">Start learning to see your progress!</p>
              )}
            </div>
          </div>

          {/* Progress Reset Confirmation */}
          {showResetConfirm && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">Reset All Progress?</h3>
                  <p className="text-red-700 text-xs mb-3">
                    This will permanently delete all your learning progress. This action cannot be undone!
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={resetProgress}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-xs"
                    >
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowResetConfirm(false)}
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderExpandedView = () => (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 shadow-xl border-2 border-blue-200 bg-white/95 backdrop-blur-sm max-h-[80vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Real-Time Progress
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className="h-8 w-8 p-0">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="h-8 w-8 p-0">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </h3>
              <Button
                variant="destructive"
                onClick={() => setShowResetConfirm(true)}
                className="w-full"
              >
                Reset All Progress
              </Button>
            </div>
          )}

          {/* Level Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Level {userProgress.level}
              </h3>
              <Badge variant="secondary">{userProgress.xp.toLocaleString()} XP</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {userProgress.level + 1}</span>
                <span>
                  {currentLevelXP}/{xpToNextLevel}
                </span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>
          </div>

          {/* Current Session Stats */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              Current Session
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{realTimeStats.currentSession.timeSpent}</div>
                <div className="text-xs text-gray-600">Minutes</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">+{realTimeStats.currentSession.xpGained}</div>
                <div className="text-xs text-gray-600">XP Earned</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {realTimeStats.currentSession.lessonsCompleted}
                </div>
                <div className="text-xs text-gray-600">Lessons</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-orange-600">{realTimeStats.currentSession.wordsLearned}</div>
                <div className="text-xs text-gray-600">Words</div>
              </div>
            </div>
          </div>

          {/* Skill Levels */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center">
              <Zap className="w-4 h-4 mr-2 text-purple-500" />
              Skill Levels
            </h3>
            <div className="space-y-2">
              {Object.entries(userProgress.skillLevels).map(([skill, level]) => (
                <div key={skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{skill.replace(/([A-Z])/g, " $1")}</span>
                    <span>{String(level)}%</span>
                  </div>
                  <Progress value={level as number} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center">
              <Activity className="w-4 h-4 mr-2 text-blue-500" />
              Recent Activity
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {userProgress.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-blue-600" />
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
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No activity yet</p>
                  <p className="text-xs text-gray-400">Start learning to see your progress!</p>
                </div>
              )}
            </div>
          </div>

          {/* Today's Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
              Today's Summary
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-indigo-50 rounded-lg p-2">
                <div className="text-lg font-bold text-indigo-600">{realTimeStats.todayStats.timeSpent}m</div>
                <div className="text-xs text-gray-600">Time</div>
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <div className="text-lg font-bold text-green-600">+{realTimeStats.todayStats.xpGained}</div>
                <div className="text-xs text-gray-600">XP</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600">{realTimeStats.todayStats.lessonsCompleted}</div>
                <div className="text-xs text-gray-600">Lessons</div>
              </div>
            </div>
          </div>

          {/* Progress Reset Confirmation */}
          {showResetConfirm && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Reset All Progress?</h3>
                  <p className="text-red-700 text-sm mb-4">
                    This will permanently delete all your learning progress including:
                  </p>
                  <ul className="text-red-700 text-sm mb-4 list-disc ml-5 space-y-1">
                    <li>Level {userProgress.level} and {userProgress.xp.toLocaleString()} XP</li>
                    <li>{userProgress.streak} day streak and {userProgress.lessonsCompleted} completed lessons</li>
                    <li>{userProgress.wordsLearned} learned words and {userProgress.achievements.length} achievements</li>
                    <li>All skill progress and statistics</li>
                    <li>All recent activity history ({userProgress.recentActivity.length} activities)</li>
                    <li>Multiplayer rankings and tournament progress</li>
                  </ul>
                  <p className="text-red-700 text-sm font-semibold mb-4">
                    This action cannot be undone!
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="destructive"
                      onClick={resetProgress}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Reset Everything
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowResetConfirm(false)}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return isExpanded ? renderExpandedView() : renderCompactView()
}

export default ProgressTracker