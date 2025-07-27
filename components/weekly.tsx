import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, Target, Zap, Clock, TrendingUp, Star, Award } from "lucide-react"

// Weekly Progress and Milestones with Real-time Updates
export function RealTimeProgressSection({ 
  userProgress,
  realTimeStats,
  updateProgress 
}: {
  userProgress: {
    xp: number;
    weeklyGoal: number;
    weeklyProgress: number;
    nextMilestone: {
      progress: number;
      target: number;
      title: string;
    };
    achievements: any[];
    lessonsCompleted: number;
    accuracy: number;
  };
  realTimeStats: {
    todayStats: {
      xpGained: number;
    };
    currentSession: {
      xpGained: number;
    };
  };
  updateProgress: (progress: {
    xp: number;
    weeklyProgress: number;
    nextMilestone: {
      progress: number;
      target: number;
      title: string;
    };
  }) => void;
}) {
  const [weeklyData, setWeeklyData] = useState([
    { day: "Mon", completed: true, xp: 85, target: 80 },
    { day: "Tue", completed: true, xp: 92, target: 80 },
    { day: "Wed", completed: true, xp: 76, target: 80 },
    { day: "Thu", completed: true, xp: 103, target: 80 },
    { day: "Fri", completed: true, xp: 88, target: 80 },
    { day: "Sat", completed: false, xp: realTimeStats.todayStats.xpGained, target: 80 },
    { day: "Sun", completed: false, xp: 0, target: 80 },
  ])

  const [milestoneProgress, setMilestoneProgress] = useState({
    current: userProgress.nextMilestone.progress,
    target: userProgress.nextMilestone.target,
    title: userProgress.nextMilestone.title,
    timeRemaining: "2 days",
    estimatedCompletion: "Tomorrow",
  })

  // Update weekly data in real-time
  useEffect(() => {
    const currentDay = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
    const dayIndex = currentDay === 0 ? 6 : currentDay - 1 // Convert to our array index

    setWeeklyData(prev => prev.map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          xp: day.xp + realTimeStats.currentSession.xpGained,
          completed: (day.xp + realTimeStats.currentSession.xpGained) >= day.target
        }
      }
      return day
    }))
  }, [realTimeStats.currentSession.xpGained])

  // Update milestone progress in real-time
  useEffect(() => {
    const newProgress = userProgress.nextMilestone.progress + realTimeStats.currentSession.xpGained
    const progressPercentage = (newProgress / userProgress.nextMilestone.target) * 100
    
    setMilestoneProgress(prev => ({
      ...prev,
      current: newProgress,
      estimatedCompletion: progressPercentage > 90 ? "Today!" : 
                          progressPercentage > 70 ? "Tomorrow" : 
                          progressPercentage > 40 ? "This Week" : "Next Week"
    }))
  }, [realTimeStats.currentSession.xpGained, userProgress.nextMilestone])

  const totalWeeklyXP = weeklyData.reduce((sum, day) => sum + day.xp, 0)
  const weeklyGoalProgress = (totalWeeklyXP / userProgress.weeklyGoal) * 100
  const completedDays = weeklyData.filter(day => day.completed).length

  // Simulate earning XP for demo purposes
  const earnXP = (amount: number) => {
    updateProgress({
      xp: userProgress.xp + amount,
      weeklyProgress: userProgress.weeklyProgress + amount,
      nextMilestone: {
        ...userProgress.nextMilestone,
        progress: userProgress.nextMilestone.progress + amount
      }
    })
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      {/* Enhanced Weekly Goal Progress */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Weekly Goal Progress
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={weeklyGoalProgress >= 100 ? "default" : "secondary"} className="text-xs">
                {Math.round(weeklyGoalProgress)}%
              </Badge>
              {weeklyGoalProgress >= 100 && (
                <Badge variant="default" className="bg-green-500 text-xs">
                  <Trophy className="w-3 h-3 mr-1" />
                  Goal Achieved!
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Real-time XP Progress */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">XP Goal</span>
              <div className="text-right">
                <span className="text-sm font-bold text-blue-600">
                  {totalWeeklyXP.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">
                  /{userProgress.weeklyGoal.toLocaleString()}
                </span>
                {realTimeStats.currentSession.xpGained > 0 && (
                  <span className="text-xs text-green-600 ml-2">
                    +{realTimeStats.currentSession.xpGained} today
                  </span>
                )}
              </div>
            </div>
            
            <Progress 
              value={Math.min(weeklyGoalProgress, 100)} 
              className="h-3"
            />
            
            {/* Weekly Calendar with Real-time Updates */}
            <div className="grid grid-cols-7 gap-1">
              {weeklyData.map((dayData, index) => {
                const isToday = index === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
                const progressPercent = Math.min((dayData.xp / dayData.target) * 100, 100)
                
                return (
                  <div key={dayData.day} className="text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs relative overflow-hidden ${
                        dayData.completed 
                          ? "bg-green-500 text-white" 
                          : isToday 
                            ? "bg-blue-500 text-white" 
                            : progressPercent > 0 
                              ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                              : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {/* Progress fill for current day */}
                      {isToday && !dayData.completed && (
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-blue-300 transition-all duration-500"
                          style={{ height: `${progressPercent}%` }}
                        />
                      )}
                      <span className="relative z-10">
                        {dayData.completed ? "✓" : isToday ? "!" : ""}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{dayData.day}</div>
                    <div className="text-xs text-gray-500">
                      {dayData.xp}/{dayData.target}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Weekly Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{completedDays}/7</div>
                <div className="text-xs text-gray-600">Days Complete</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {Math.round(totalWeeklyXP / 7)}
                </div>
                <div className="text-xs text-gray-600">Avg XP/Day</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {Math.max(0, userProgress.weeklyGoal - totalWeeklyXP)}
                </div>
                <div className="text-xs text-gray-600">XP Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Milestone Progress */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              Next Milestone
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              <Star className="w-3 h-3 mr-1" />
              {Math.round((milestoneProgress.current / milestoneProgress.target) * 100)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Milestone Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{milestoneProgress.title}</h3>
                <div className="text-right">
                  <div className="text-sm font-bold text-yellow-600">
                    {milestoneProgress.current.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">
                    /{milestoneProgress.target.toLocaleString()} XP
                  </div>
                </div>
              </div>
              
              <Progress
                value={(milestoneProgress.current / milestoneProgress.target) * 100}
                className="h-4"
              />
              
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-600">
                  {milestoneProgress.target - milestoneProgress.current} XP remaining
                </p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  ETA: {milestoneProgress.estimatedCompletion}
                </div>
              </div>
            </div>

            {/* Real-time Session Progress */}
            {realTimeStats.currentSession.xpGained > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Session Progress</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    +{realTimeStats.currentSession.xpGained} XP
                  </Badge>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  You're {realTimeStats.currentSession.xpGained} XP closer to your milestone!
                </div>
              </div>
            )}

            {/* Achievement Stats */}
            <div className="grid grid-cols-3 gap-4 text-center pt-2 border-t">
              <div>
                <div className="text-2xl font-bold text-blue-600">{userProgress.achievements.length}</div>
                <div className="text-xs text-gray-600">Achievements</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{userProgress.lessonsCompleted}</div>
                <div className="text-xs text-gray-600">Lessons</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{Math.round(userProgress.accuracy)}%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
            </div>

            {/* Quick Action Buttons for Demo */}
            <div className="flex gap-2 pt-2 border-t">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => earnXP(10)}
                className="text-xs flex-1"
              >
                <Zap className="w-3 h-3 mr-1" />
                +10 XP
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => earnXP(25)}
                className="text-xs flex-1"
              >
                <Target className="w-3 h-3 mr-1" />
                +25 XP
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => earnXP(50)}
                className="text-xs flex-1"
              >
                <Award className="w-3 h-3 mr-1" />
                +50 XP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}