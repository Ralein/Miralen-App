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
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Accessibility Settings</h1>
            <p className="text-gray-600 mt-2">Customize your learning experience</p>
          </div>
        </div>

        {/* Current Mode */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Accessibility Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {accessibilityMode ? accessibilityMode.charAt(0).toUpperCase() + accessibilityMode.slice(1) : "None"}{" "}
                  Mode
                </Badge>
                <p className="text-gray-600 mt-2">
                  {accessibilityMode === "blind" && "Audio + Haptic feedback"}
                  {accessibilityMode === "deaf" && "Visual + Text feedback"}
                  {accessibilityMode === "mute" && "Visual + Morse feedback"}
                  {accessibilityMode === "hybrid" && "Customizable multi-modal"}
                  {!accessibilityMode && "No specific mode selected"}
                </p>
              </div>
              <Button variant="outline" onClick={() => onModeChange(null)}>
                Change Mode
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="w-5 h-5 mr-2 text-blue-600" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Audio</label>
                <Switch
                  checked={settings.audioEnabled}
                  onCheckedChange={(checked) => updateSetting("audioEnabled", checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Volume: {settings.audioVolume}%</label>
                <Slider
                  value={[settings.audioVolume]}
                  onValueChange={(value) => updateSetting("audioVolume", value[0])}
                  max={100}
                  step={5}
                  disabled={!settings.audioEnabled}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Morse Speed: {settings.morseSpeed} WPM</label>
                <Slider
                  value={[settings.morseSpeed]}
                  onValueChange={(value) => updateSetting("morseSpeed", value[0])}
                  min={5}
                  max={30}
                  step={1}
                  disabled={!settings.audioEnabled}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tone Frequency: {settings.toneFrequency} Hz</label>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-green-600" />
                Visual Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">High Contrast</label>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Dark Mode</label>
                <Switch checked={settings.darkMode} onCheckedChange={(checked) => updateSetting("darkMode", checked)} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Color Blind Friendly</label>
                <Switch
                  checked={settings.colorBlindFriendly}
                  onCheckedChange={(checked) => updateSetting("colorBlindFriendly", checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Font Size: {settings.fontSize}px</label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => updateSetting("fontSize", value[0])}
                  min={12}
                  max={24}
                  step={1}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Animation Speed: {settings.animationSpeed}x</label>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Vibrate className="w-5 h-5 mr-2 text-purple-600" />
                Haptic Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Vibration</label>
                <Switch
                  checked={settings.vibrationEnabled}
                  onCheckedChange={(checked) => updateSetting("vibrationEnabled", checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Vibration Intensity: {settings.vibrationIntensity}%
                </label>
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
                className="w-full bg-transparent"
              >
                Test Vibration
              </Button>
            </CardContent>
          </Card>

          {/* Interface Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-orange-600" />
                Interface Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Button Size</label>
                <Select value={settings.buttonSize} onValueChange={(value) => updateSetting("buttonSize", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Gesture Controls</label>
                <Switch
                  checked={settings.gestureControls}
                  onCheckedChange={(checked) => updateSetting("gestureControls", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Voice Commands</label>
                <Switch
                  checked={settings.voiceCommands}
                  onCheckedChange={(checked) => updateSetting("voiceCommands", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Learning Settings */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Learning Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Hints</label>
                  <Switch
                    checked={settings.showHints}
                    onCheckedChange={(checked) => updateSetting("showHints", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Auto Advance</label>
                  <Switch
                    checked={settings.autoAdvance}
                    onCheckedChange={(checked) => updateSetting("autoAdvance", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Practice Reminders</label>
                  <Switch
                    checked={settings.practiceReminders}
                    onCheckedChange={(checked) => updateSetting("practiceReminders", checked)}
                  />
                </div>
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
    </div>
  )
}

function updateProgress(resetUserProgress: UserProgress) {
  throw new Error("Function not implemented.")
}
