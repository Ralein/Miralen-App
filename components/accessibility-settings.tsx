"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Volume2, Vibrate, Eye, Settings, Zap, RotateCcw, AlertTriangle } from "lucide-react"

// Import the UserProgress type from lib instead of defining it locally
import { UserProgress } from "@/lib/types"

interface AccessibilitySettingsProps {
  accessibilityMode: string | null
  onModeChange: (mode: string | null) => void
  onBack: () => void
  userProgress: UserProgress
  onProgressReset: () => void
}

export function AccessibilitySettings({ accessibilityMode, onModeChange, onBack, userProgress, onProgressReset }: AccessibilitySettingsProps) {
  const [settings, setSettings] = useState({
    // Audio Settings
    audioEnabled: true,
    audioVolume: 70,
    morseSpeed: 15, // WPM
    toneFrequency: 600, // Hz

    // Visual Settings
    highContrast: false,
    darkMode: false,
    fontSize: 16,
    animationSpeed: 1,
    colorBlindFriendly: false,

    // Haptic Settings
    vibrationEnabled: true,
    vibrationIntensity: 80,

    // Interface Settings
    buttonSize: "medium",
    gestureControls: false,
    voiceCommands: false,

    // Learning Settings
    showHints: true,
    autoAdvance: false,
    practiceReminders: true,
  })

  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    // Remove localStorage usage as it's not supported in Claude artifacts
    // const savedSettings = localStorage.getItem("accessibilitySettings")
    // if (savedSettings) {
    //   setSettings(JSON.parse(savedSettings))
    // }
  }, [])

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    // Remove localStorage usage
    // localStorage.setItem("accessibilitySettings", JSON.stringify(newSettings))
  }

  const resetToDefaults = () => {
    const defaultSettings = {
      audioEnabled: true,
      audioVolume: 70,
      morseSpeed: 15,
      toneFrequency: 600,
      highContrast: false,
      darkMode: false,
      fontSize: 16,
      animationSpeed: 1,
      colorBlindFriendly: false,
      vibrationEnabled: true,
      vibrationIntensity: 80,
      buttonSize: "medium",
      gestureControls: false,
      voiceCommands: false,
      showHints: true,
      autoAdvance: false,
      practiceReminders: true,
    }
    setSettings(defaultSettings)
    // Remove localStorage usage
    // localStorage.setItem("accessibilitySettings", JSON.stringify(defaultSettings))
  }

  const resetProgress = () => {
    const resetUserProgress: UserProgress = {
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
        interactiveLearning: 0, // This was missing and causing the TypeScript error!
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
    }
    
    updateProgress(resetUserProgress)
    // Remove localStorage usage
    // localStorage.removeItem("userProgress")
    setShowResetConfirm(false)
  }

  const testAudioSettings = () => {
    if (!("AudioContext" in window)) return

    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = settings.toneFrequency
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime((settings.audioVolume / 100) * 0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const testVibration = () => {
    if (navigator.vibrate) {
      const intensity = Math.floor(settings.vibrationIntensity * 3) // Scale to 0-300ms
      navigator.vibrate([intensity, 100, intensity, 100, intensity])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {/* Enhanced Header */}
        <div className="flex items-center mb-10">
           <Button variant="ghost" onClick={onBack} className="mr-6 hover:bg-white/80 backdrop-blur-sm shadow-md">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-black bg-clip-text text-transparent mb-2">
              Accessibility Settings
            </h1>
            <p className="text-gray-600 text-lg font-medium">Customize your learning experience with precision</p>
          </div>
        </div>





        <div className="grid md:grid-cols-2 gap-6">
          {/* Audio Settings */}
          <Card className="hover:border-blue-300/50">
            <CardHeader>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mr-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors shadow-inner">
                  <Volume2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Audio Settings</h3>
                  <p className="text-sm text-gray-600 mt-1">Configure sound feedback and morse code</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl">
                <div>
                  <label className="text-sm font-bold text-gray-900">Enable Audio</label>
                  <p className="text-xs text-gray-500 mt-1">Turn on sound feedback and morse tones</p>
                </div>
                <Switch
                  checked={settings.audioEnabled}
                  onCheckedChange={(checked) => updateSetting("audioEnabled", checked)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900">Volume</label>
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-bold rounded-full shadow-inner">
                    {settings.audioVolume}%
                  </div>
                </div>
                <Slider
                  value={[settings.audioVolume]}
                  onValueChange={(value) => updateSetting("audioVolume", value[0])}
                  max={100}
                  step={5}
                  disabled={!settings.audioEnabled}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900">Morse Speed</label>
                  <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-bold rounded-full shadow-inner">
                    {settings.morseSpeed} WPM
                  </div>
                </div>
                <Slider
                  value={[settings.morseSpeed]}
                  onValueChange={(value) => updateSetting("morseSpeed", value[0])}
                  min={5}
                  max={30}
                  step={1}
                  disabled={!settings.audioEnabled}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900">Tone Frequency</label>
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-xs font-bold rounded-full shadow-inner">
                    {settings.toneFrequency} Hz
                  </div>
                </div>
                <Slider
                  value={[settings.toneFrequency]}
                  onValueChange={(value) => updateSetting("toneFrequency", value[0])}
                  min={300}
                  max={1000}
                  step={50}
                  disabled={!settings.audioEnabled}
                />
              </div>

  <Button
                variant="outline"
                onClick={testAudioSettings}
                disabled={!settings.audioEnabled}
                className="w-full bg-transparent"
              >
                Test Audio Settings
              </Button>
            </CardContent>
          </Card>

          {/* Visual Settings */}
         <Card className="hover:border-green-300/50">
            <CardHeader>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mr-4 group-hover:from-green-200 group-hover:to-green-300 transition-colors shadow-inner">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Visual Settings</h3>
                  <p className="text-sm text-gray-600 mt-1">Adjust display and visual accessibility</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'highContrast', label: 'High Contrast', desc: 'Enhance visibility with better contrast' },
                { key: 'darkMode', label: 'Dark Mode', desc: 'Switch to dark theme interface' },
                { key: 'colorBlindFriendly', label: 'Color Blind Friendly', desc: 'Use accessible color patterns' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/50 to-transparent rounded-xl">
                  <div>
                    <label className="text-sm font-bold text-gray-900">{item.label}</label>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                  <Switch
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => updateSetting(item.key, checked)}
                  />
                </div>
              ))}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900">Font Size</label>
                  <div className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 text-xs font-bold rounded-full shadow-inner">
                    {settings.fontSize}px
                  </div>
                </div>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => updateSetting("fontSize", value[0])}
                  min={12}
                  max={24}
                  step={1}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900">Animation Speed</label>
                  <div className="px-3 py-1 bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 text-xs font-bold rounded-full shadow-inner">
                    {settings.animationSpeed}x
                  </div>
                </div>
                <Slider
                  value={[settings.animationSpeed]}
                  onValueChange={(value) => updateSetting("animationSpeed", value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>
            </CardContent>
          </Card>

          {/* Haptic Settings */}
           <Card className="hover:border-purple-300/50">
            <CardHeader>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mr-4 group-hover:from-purple-200 group-hover:to-purple-300 transition-colors shadow-inner">
                  <Vibrate className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Haptic Settings</h3>
                  <p className="text-sm text-gray-600 mt-1">Configure vibration and tactile feedback</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50/50 to-transparent rounded-xl">
                <div>
                  <label className="text-sm font-bold text-gray-900">Enable Vibration</label>
                  <p className="text-xs text-gray-500 mt-1">Turn on haptic feedback for interactions</p>
                </div>
                <Switch
                  checked={settings.vibrationEnabled}
                  onCheckedChange={(checked) => updateSetting("vibrationEnabled", checked)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900">Vibration Intensity</label>
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-xs font-bold rounded-full shadow-inner">
                    {settings.vibrationIntensity}%
                  </div>
                </div>
                <Slider
                  value={[settings.vibrationIntensity]}
                  onValueChange={(value) => updateSetting("vibrationIntensity", value[0])}
                  max={100}
                  step={5}
                  disabled={!settings.vibrationEnabled}
                />
              </div>

              <Button
                variant="outline"
                onClick={testVibration}
                disabled={!settings.vibrationEnabled}
                className="w-full"
              >
                {false ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    Testing Vibration...
                  </>
                ) : (
                  <>
                    <Vibrate className="w-4 h-4 mr-2" />
                    Test Vibration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>


          {/* Interface Settings */}
          <Card className="hover:border-orange-300/50">
            <CardHeader>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl mr-4 group-hover:from-orange-200 group-hover:to-orange-300 transition-colors shadow-inner">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Interface Settings</h3>
                  <p className="text-sm text-gray-600 mt-1">Customize interface and controls</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-900 block">Button Size</label>
                <div className="grid grid-cols-2 gap-3">
                  {['small', 'medium', 'large', 'extra-large'].map((size) => (
                    <Button
                      key={size}
                      value={size}
                      variant={settings.buttonSize === size ? "default" : "outline"}
                      onClick={() => updateSetting("buttonSize", size)}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' ')}
                    </Button>
                  ))}
                </div>
              </div>

              {[
                { key: 'gestureControls', label: 'Gesture Controls', desc: 'Enable swipe and touch gestures' },
                { key: 'voiceCommands', label: 'Voice Commands', desc: 'Control app with voice input' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50/50 to-transparent rounded-xl">
                  <div>
                    <label className="text-sm font-bold text-gray-900">{item.label}</label>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                  <Switch
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => updateSetting(item.key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>


          {/* Learning Settings */}
           <Card className="mt-8 hover:border-yellow-300/50">
          <CardHeader>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl mr-4 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-colors shadow-inner">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Learning Preferences</h3>
                <p className="text-sm text-gray-600 mt-1">Customize your learning experience and study habits</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { key: 'showHints', label: 'Show Hints', desc: 'Display helpful tips during lessons' },
                { key: 'autoAdvance', label: 'Auto Advance', desc: 'Automatically proceed to next lesson' },
                { key: 'practiceReminders', label: 'Practice Reminders', desc: 'Get notifications to practice daily' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50/50 to-transparent rounded-xl">
                  <div>
                    <label className="text-sm font-bold text-gray-900">{item.label}</label>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                  <Switch
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => updateSetting(item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Reset Buttons */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="outline" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default Settings
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={() => onProgressReset()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Reset Progress
              </Button>
            </div>
            
            {/* Progress Reset Confirmation */}
            {showResetConfirm && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
}

 

function updateProgress(resetUserProgress: UserProgress) {
  throw new Error("Function not implemented.")
}
