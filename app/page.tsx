"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Volume2,
  Eye,
  Settings,
  BookOpen,
  MessageSquare,
  Gamepad2,
  Trophy,
  Target,
  Zap,
  Users,
  Globe,
  Calendar,
  Brain,
  Mic,
  Map,
  Shield,
  Star,
  TrendingUp,
  Clock,
  Flame,
  ChevronRight,
  Sparkles,
  ArrowUp,
} from "lucide-react"
import { MorseConverter } from "@/components/morse-converter"
import { MorseLearning } from "@/components/morse-learning"
import { SignLanguageViewer } from "@/components/sign-language-viewer"
import { AccessibilitySettings } from "@/components/accessibility-settings"
import { AITutor } from "@/components/ai-tutor"
import { RealWorldScenarios } from "@/components/real-world-scenarios"
import { VoiceTraining } from "@/components/voice-training"
import { DictionaryExplorer } from "@/components/dictionary-explorer"
import { ProgressTracker } from "@/components/progress-tracker"

type AccessibilityMode = "blind" | "deaf" | "mute" | "hybrid" | null

// Import the UserProgress type from the lib
import { UserProgress } from "@/lib/types"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<string>("dashboard")
  const [accessibilityMode, setAccessibilityMode] = useState<AccessibilityMode>(null)
  
  // Initial default progress state - now matching the imported UserProgress type
  const getInitialProgress = (): UserProgress => ({
    level: 1,
    xp: 0,
    streak: 0,
    lessonsCompleted: 0,
    totalLessons: 200,
    wordsLearned: 0,
    totalWords: 2500,
    sentencesLearned: 0,
    totalSentences: 500,
    accuracy: 0,
    averageSpeed: 0,
    timeSpent: 0,
    achievements: [],
    weeklyGoal: 300,
    weeklyProgress: 0,
    dailyStreak: 0,
    longestStreak: 0,
    masteryLevels: {
      basicLetters: 0,
      advancedLetters: 0,
      numbers: 0,
      punctuation: 0,
      basicWords: 0,
      advancedWords: 0,
      sentences: 0,
      conversations: 0,
      emergency: 0,
      signLanguage: 0,
      voiceRecognition: 0,
      multiplayer: 0,
    },
    skillLevels: {
      letters: 0,
      numbers: 0,
      punctuation: 0,
      words: 0,
      sentences: 0,
      emergency: 0,
      signLanguage: 0,
      voiceRecognition: 0,
      interactiveLearning: 0 // This was missing and is required by the imported type
    },
    recentActivity: [],
    weakAreas: [],
    strongAreas: [],
    learningPath: [
      "Start with Basic Letters A-E",
      "Learn Numbers 0-9",
      "Practice Word Formation",
      "Emergency Protocols",
    ],
    nextMilestone: {
      title: "First Steps",
      progress: 0,
      target: 100,
    },
    multiplayerStats: {
      gamesPlayed: 0,
      gamesWon: 0,
      winRate: 0,
      ranking: 0,
      tournamentWins: 0,
    },
  })

  const [userProgress, setUserProgress] = useState<UserProgress>(getInitialProgress())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem("viola-accessibility-settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  }, []);

  const [realTimeStats, setRealTimeStats] = useState({
    currentSession: {
      timeSpent: 0,
      xpGained: 0,
      lessonsCompleted: 0,
      accuracy: 0,
      wordsLearned: 0,
    },
    todayStats: {
      timeSpent: 0,
      xpGained: 0,
      lessonsCompleted: 0,
      accuracy: 0,
      wordsLearned: 0,
    },
    weekStats: {
      timeSpent: 0,
      xpGained: 0,
      lessonsCompleted: 0,
      accuracy: 0,
      wordsLearned: 0,
    },
  })

  // Real-time progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats((prev) => ({
        ...prev,
        currentSession: {
          ...prev.currentSession,
          timeSpent: prev.currentSession.timeSpent + 1,
        },
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const updateProgress = useCallback((progressUpdate: Partial<UserProgress>) => {
    setUserProgress((prev) => {
      const updated = { ...prev, ...progressUpdate }
      



      const xpGained = (progressUpdate.xp || 0) - prev.xp;

      // Add to recent activity if XP was gained or other significant progress
      if (xpGained > 0 || Object.keys(progressUpdate).some(key => key !== 'xp' && progressUpdate[key as keyof UserProgress] !== prev[key as keyof UserProgress])) {
        let activityType: string = "progress";
        let activityDescription: string = "Progress updated";

        if (progressUpdate.lessonsCompleted && progressUpdate.lessonsCompleted > prev.lessonsCompleted) {
          activityType = "lesson";
          activityDescription = `Completed ${progressUpdate.lessonsCompleted - prev.lessonsCompleted} lesson(s)`;
        } else if (progressUpdate.wordsLearned && progressUpdate.wordsLearned > prev.wordsLearned) {
          activityType = "words";
          activityDescription = `Learned ${progressUpdate.wordsLearned - prev.wordsLearned} new word(s)`;
        } else if (progressUpdate.level && progressUpdate.level > prev.level) {
          activityType = "level";
          activityDescription = `Leveled up to Level ${progressUpdate.level}!`;
        } else if (progressUpdate.streak && progressUpdate.streak > prev.streak) {
          activityType = "streak";
          activityDescription = `Increased streak to ${progressUpdate.streak} days!`;
        } else if (progressUpdate.timeSpent && progressUpdate.timeSpent > prev.timeSpent) {
          activityType = "time";
          activityDescription = `Spent ${Math.floor((progressUpdate.timeSpent - prev.timeSpent) / 60)}m learning`;
        }

        updated.recentActivity = [
          {
            type: activityType,
            description: activityDescription,
            timestamp: new Date(),
            xpGained,
          },
          ...prev.recentActivity.slice(0, 9),
        ];

        // Update real-time stats
        setRealTimeStats((prevStats) => ({
          ...prevStats,
          currentSession: {
            ...prevStats.currentSession,
            xpGained: prevStats.currentSession.xpGained + xpGained,
          },
          todayStats: {
            ...prevStats.todayStats,
            xpGained: prevStats.todayStats.xpGained + xpGained,
          },
          weekStats: {
            ...prevStats.weekStats,
            xpGained: prevStats.weekStats.xpGained + xpGained,
          },
        }));
      }

      return updated
    })
  }, [])

  // Reset progress function
  const handleProgressReset = useCallback(() => {
    // Reset to initial state
    const initialProgress = getInitialProgress()
    setUserProgress(initialProgress)
    
    // Reset real-time stats
    setRealTimeStats({
      currentSession: {
        timeSpent: 0,
        xpGained: 0,
        lessonsCompleted: 0,
        accuracy: 0,
        wordsLearned: 0,
      },
      todayStats: {
        timeSpent: 0,
        xpGained: 0,
        lessonsCompleted: 0,
        accuracy: 0,
        wordsLearned: 0,
      },
      weekStats: {
        timeSpent: 0,
        xpGained: 0,
        lessonsCompleted: 0,
        accuracy: 0,
        wordsLearned: 0,
      },
    })
    
    // Remove localStorage usage as it's not supported in Claude artifacts
    // localStorage.removeItem("userProgress")
    
    // Optional: Show success message
    console.log("All progress has been reset successfully!")
    
    // You could also add a toast notification here if you have a toast system
    // toast.success("All progress has been reset successfully!")
  }, [])

  useEffect(() => {
    // Load user preferences and progress - removed localStorage usage
    // const savedMode = localStorage.getItem("accessibilityMode") as AccessibilityMode
    // const savedProgress = localStorage.getItem("userProgress")

    // if (savedMode) setAccessibilityMode(savedMode)
    // if (savedProgress) {
    //   try {
    //     const parsed = JSON.parse(savedProgress)
    //     // Convert timestamp strings back to Date objects
    //     if (parsed.recentActivity && Array.isArray(parsed.recentActivity)) {
    //       parsed.recentActivity = parsed.recentActivity.map((activity: any) => ({
    //         ...activity,
    //         timestamp: new Date(activity.timestamp)
    //       }))
    //     }
    //     setUserProgress((prev) => ({ ...prev, ...parsed }))
    //   } catch (error) {
    //     console.error("Error loading progress:", error)
    //   }
    // }
  }, [])

  const handleModeSelect = (mode: AccessibilityMode) => {
    setAccessibilityMode(mode)
    // Remove localStorage usage
    // localStorage.setItem("accessibilityMode", mode || "")
  }

  const getModeDescription = (mode: AccessibilityMode) => {
    switch (mode) {
      default:
        return ""
    }
  }

  
        

      

  const renderDashboard = () => (
    <div className="min-h-screen bg-background text-foreground p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground flex items-center justify-center sm:justify-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-2 sm:mr-3 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              Viola Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base lg:text-lg px-2 sm:px-0">{getModeDescription(accessibilityMode)}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start mt-2 gap-2 sm:space-x-4 sm:gap-0">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                <Clock className="w-3 h-3 mr-1" />
                Session: {realTimeStats.currentSession.timeSpent}m
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                <Calendar className="w-3 h-3 mr-1" />
                Today: {realTimeStats.todayStats.timeSpent}m
              </Badge>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="text-center sm:text-right">
              <Badge variant="secondary" className="text-base sm:text-lg px-3 sm:px-4 py-2 mb-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Level {userProgress.level}
              </Badge>
              <div className="text-xs sm:text-sm text-gray-600">
                Next: {userProgress.nextMilestone.progress}/{userProgress.nextMilestone.target} XP
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentView("settings")} className="w-full sm:w-auto">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>


       {/* Enhanced Stats Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6 sm:mb-8">
          {[
            {
              title: "Total XP",
              value: userProgress.xp.toLocaleString(),
              subtitle: `+${Math.round(realTimeStats.todayStats.xpGained/2)} today`,
              icon: Zap,
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-50 to-cyan-50",
            },
            {
              title: "Streak",
              value: userProgress.streak.toString(),
              subtitle: `Best: ${userProgress.longestStreak} days`,
              icon: Flame,
              gradient: "from-orange-500 to-red-500",
              bgGradient: "from-orange-50 to-red-50",
            },
            {
              title: "Accuracy",
              value: `${userProgress.accuracy}%`,
              subtitle: `+${realTimeStats.todayStats.accuracy - userProgress.accuracy}% today`,
              icon: Target,
              gradient: "from-green-500 to-emerald-500",
              bgGradient: "from-green-50 to-emerald-50",
            },
            {
              title: "Words Learned",
              value: userProgress.wordsLearned.toString(),
              subtitle: `+${realTimeStats.todayStats.wordsLearned} today`,
              icon: BookOpen,
              gradient: "from-purple-500 to-violet-500",
              bgGradient: "from-purple-50 to-violet-50",
            },
            {
              title: "Speed (WPM)",
              value: userProgress.averageSpeed.toString(),
              subtitle: "Personal best",
              icon: TrendingUp,
              gradient: "from-pink-500 to-rose-500",
              bgGradient: "from-pink-50 to-rose-50",
            },
            {
              title: "Time Spent",
              value: `${Math.floor(userProgress.timeSpent / 60)}h`,
              subtitle: `${userProgress.timeSpent % 60}m total`,
              icon: Clock,
              gradient: "from-indigo-500 to-blue-500",
              bgGradient: "from-indigo-50 to-blue-50",
            },
          ].map(({ title, value, subtitle, icon: Icon, gradient, bgGradient }) => (
            <Card key={title} className={`bg-gradient-to-br ${bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <ArrowUp className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
                  <p className="text-xs text-gray-500">{subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      {/* Enhanced Progress Section - Mobile Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
          {/* Weekly Progress with improved visuals */}
          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Weekly Progress
                </CardTitle>
                <Badge className={`${(userProgress.weeklyProgress / userProgress.weeklyGoal) * 100 >= 100 ? "bg-green-500" : "bg-blue-500"} text-white text-center sm:text-left`}>
                  {Math.round((userProgress.weeklyProgress / userProgress.weeklyGoal) * 100)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                  <span className="text-base sm:text-lg font-semibold text-gray-800 text-center sm:text-left">XP Goal Progress</span>
                  <div className="text-center sm:text-right">
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">
                      {(userProgress.weeklyProgress + realTimeStats.todayStats.xpGained).toLocaleString()}
                    </span>
                    <span className="text-gray-600 text-base sm:text-lg">/{userProgress.weeklyGoal.toLocaleString()}</span>
                  </div>
                </div>
                <Progress 
                  value={Math.min(((userProgress.weeklyProgress + realTimeStats.todayStats.xpGained) / userProgress.weeklyGoal) * 100, 100)} 
                  className="h-3 sm:h-4 bg-gray-200"
                />
              </div>
              
              {/* Enhanced daily progress circles - Mobile Responsive */}
              <div className="grid grid-cols-7 gap-1 sm:gap-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                  const isToday = index === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
                  const dayTarget = Math.floor(userProgress.weeklyGoal / 7)
                  const todayProgress = isToday ? realTimeStats.todayStats.xpGained : 0
                  const dayProgressPercentage = Math.min((todayProgress / dayTarget) * 100, 100)
                  const dayComplete = todayProgress >= dayTarget

                  return (
                    <div key={day} className="text-center relative">
                      <div
                        className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold relative overflow-hidden transition-all duration-300 border-2 ${
                          dayComplete
                            ? "border-green-500 bg-green-100 text-green-800"
                            : isToday
                              ? "border-blue-500 bg-blue-100 text-blue-800"
                              : "border-gray-300 bg-gray-100 text-gray-600"
                        }`}
                      >
                        {/* Inner progress circle */}
                        <div
                          className={`absolute inset-0 rounded-full ${
                            dayComplete ? "bg-green-500" : "bg-blue-500"
                          } opacity-30`}
                          style={{ transform: `scale(${dayProgressPercentage / 100})` }}
                        ></div>
                        <span className="relative z-10 text-center px-1">
                          {isToday ? (
                            <span className="hidden sm:inline">{todayProgress} XP</span>
                          ) : dayComplete ? "✓" : day.slice(0, 2)}
                          {isToday && <span className="sm:hidden">{day.slice(0, 1)}</span>}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1 sm:mt-2 font-medium">{day}</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Milestone Card - Mobile Responsive */}
          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Next Milestone
                </CardTitle>
                <Badge variant="outline" className="text-sm sm:text-lg px-3 sm:px-4 py-2 border-yellow-300 text-yellow-700">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {Math.round(((userProgress.nextMilestone.progress + realTimeStats.currentSession.xpGained) / userProgress.nextMilestone.target) * 100)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center sm:text-left">{userProgress.nextMilestone.title}</h3>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                  <span className="text-base sm:text-lg text-gray-600 text-center sm:text-left">Progress</span>
                  <div className="text-center sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-orange-600">
                      {(userProgress.nextMilestone.progress + realTimeStats.currentSession.xpGained).toLocaleString()}
                    </div>
                    <div className="text-gray-600">/{userProgress.nextMilestone.target.toLocaleString()} XP</div>
                  </div>
                </div>
                <Progress
                  value={((userProgress.nextMilestone.progress + realTimeStats.currentSession.xpGained) / userProgress.nextMilestone.target) * 100}
                  className="h-3 sm:h-4"
                />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 space-y-2 sm:space-y-0">
                  <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                    {userProgress.nextMilestone.target - userProgress.nextMilestone.progress - realTimeStats.currentSession.xpGained} XP remaining
                  </p>
                  <Badge className="bg-green-100 text-green-700 mx-auto sm:mx-0">
                    Almost there! 🎉
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">{userProgress.achievements.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Achievements</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 sm:p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{userProgress.lessonsCompleted}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Lessons</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 sm:p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">{Math.round(userProgress.accuracy)}%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


       {/* Feature Cards - Mobile Responsive */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            {
              title: "Interactive Learning",
              description: "Structured lessons with real-time feedback and adaptive difficulty",
              icon: BookOpen,
              view: "learning",
              color: "blue",
              badge: `${userProgress.skillLevels.interactiveLearning}% Mastery`,
              progress: userProgress.skillLevels.interactiveLearning,
              gradient: "from-blue-500 to-cyan-500",
            },
           
            {
              title: "Sign Language Hub",
              description: "3D avatars and comprehensive dictionary with gesture recognition",
              icon: Eye,
              view: "sign-language",
              color: "purple",
              badge: `${userProgress.skillLevels.signLanguage}% Mastery`,
              progress: userProgress.skillLevels.signLanguage,
              gradient: "from-purple-500 to-violet-500",
            },
            {
              title: "Real-World Practice",
              description: "Emergency scenarios and practical communication situations",
              icon: Map,
              view: "scenarios",
              color: "red",
              badge: `${userProgress.skillLevels.emergency}% Emergency Ready`,
              progress: userProgress.skillLevels.emergency,
              gradient: "from-red-500 to-pink-500",
            },
            {
              title: "Voice Training",
              description: "Speech recognition and pronunciation improvement tools",
              icon: Mic,
              view: "voice-training",
              color: "teal",
              badge: `${userProgress.skillLevels.voiceRecognition}% Voice Accuracy`,
              progress: userProgress.skillLevels.voiceRecognition,
              gradient: "from-teal-500 to-cyan-500",
            },
            {
              title: "Dictionary Explorer",
              description: "Comprehensive word and phrase library with audio examples",
              icon: Globe,
              view: "dictionary",
              color: "cyan",
              badge: `${userProgress.wordsLearned}/1000 Words`,
              progress: 100,
              gradient: "from-cyan-500 to-blue-500",
            },
            {
              title: "AI Tutor",
              description: "Personalized learning with advanced analytics and recommendations",
              icon: Brain,
              view: "ai-tutor",
              color: "pink",
              badge: "Smart Recommendations",
              progress: 100,
              gradient: "from-pink-500 to-rose-500",
            },
             {
              title: "Smart Converter",
              description: "Advanced text-to-Morse with AI assistance and multi-modal output",
              icon: MessageSquare,
              view: "converter",
              color: "green",
              badge: "Multi-modal",
              progress: 100,
              gradient: "from-green-500 to-emerald-500",
            },
            {
              title: "Settings & Preferences",
              description: "Customize your accessibility experience and learning preferences",
              icon: Settings,
              view: "settings",
              color: "gray",
              badge: "Personalized",
              progress: 100,
              gradient: "from-gray-500 to-slate-500",
            },
          ].map(({ title, description, icon: Icon, view, color, badge, progress, gradient }) => (
           <Card
              key={view}
              className="cursor-pointer hover:shadow-2xl transition-all duration-500 hover:scale-105 group bg-white/70 backdrop-blur-xl border-0 shadow-lg overflow-hidden relative"
              onClick={() => setCurrentView(view)}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <CardContent className="p-4 sm:p-6 relative z-10">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs py-1 px-2 sm:px-3 bg-gray-100 text-gray-700 group-hover:bg-white transition-colors">
                    {badge}
                  </Badge>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-purple-600 transition-colors">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">{description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500">Progress</span>
                      <span className="text-xs font-bold text-gray-700">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={progress} className="h-2" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-20 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">Click to explore</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Feed - Mobile Responsive */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {userProgress.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                      activity.type === "lesson"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "game"
                          ? "bg-orange-100 text-orange-600"
                          : activity.type === "achievement"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                    }`}
                  >
                    {activity.type === "lesson" && <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {activity.type === "game" && <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {activity.type === "achievement" && <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {activity.type === "practice" && <Target className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp.toLocaleTimeString()}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    +{activity.xpGained} XP
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderCurrentView = () => {
    const commonProps = {
      accessibilityMode,
      onBack: () => setCurrentView("dashboard"),
      userProgress,
      updateProgress,
    }

    switch (currentView) {
      case "learning":
        return <MorseLearning {...commonProps} />
      case "converter":
        return <MorseConverter {...commonProps} />
      case "sign-language":
        return <SignLanguageViewer {...commonProps} />
      case "ai-tutor":
        return <AITutor {...commonProps} />
      case "scenarios":
        return <RealWorldScenarios {...commonProps} />
      case "voice-training":
        return <VoiceTraining {...commonProps} />
      case "dictionary":
        return <DictionaryExplorer {...commonProps} />
      case "settings":
        return (
          <AccessibilitySettings
            accessibilityMode={accessibilityMode}
            onModeChange={(mode) => handleModeSelect(mode as AccessibilityMode)}
            onBack={() => setCurrentView("dashboard")}
            userProgress={userProgress}
            onProgressReset={handleProgressReset}
          />
        )
      default:
        return renderDashboard()
    }
  }

  

  return (
    <div className="relative">
      {renderCurrentView()}
      <ProgressTracker
        userProgress={userProgress}
        realTimeStats={realTimeStats}
        accessibilityMode={accessibilityMode}
      />
    </div>
  )
}