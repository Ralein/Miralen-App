"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Volume2, Vibrate, Eye, Settings, Zap, RotateCcw, AlertTriangle, Palette, Sun, Moon, Contrast } from "lucide-react"

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


  }, [])

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    // Apply visual changes immediately
    if (key === 'darkMode' || key === 'highContrast' || key === 'colorBlindFriendly' || key === 'fontSize') {
      applyVisualSettings(newSettings)
    }
  }

  const applyVisualSettings = (currentSettings: typeof settings) => {
    const root = document.documentElement
    
    // Apply dark mode using Tailwind's dark class
    if (currentSettings.darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Apply high contrast using CSS custom properties
    if (currentSettings.highContrast) {
      root.style.setProperty('--high-contrast', '1')
      // Enhanced contrast colors
      if (currentSettings.darkMode) {
        root.style.setProperty('--background', '0 0% 0%')
        root.style.setProperty('--foreground', '0 0% 100%')
        root.style.setProperty('--card', '0 0% 0%')
        root.style.setProperty('--card-foreground', '0 0% 100%')
        root.style.setProperty('--border', '0 0% 100%')
      } else {
        root.style.setProperty('--background', '0 0% 100%')
        root.style.setProperty('--foreground', '0 0% 0%')
        root.style.setProperty('--card', '0 0% 100%')
        root.style.setProperty('--card-foreground', '0 0% 0%')
        root.style.setProperty('--border', '0 0% 0%')
      }
    } else {
      root.style.removeProperty('--high-contrast')
      // Reset to default theme colors
      if (currentSettings.darkMode) {
        root.style.setProperty('--background', '0 0% 3.9%')
        root.style.setProperty('--foreground', '0 0% 98%')
        root.style.setProperty('--card', '0 0% 3.9%')
        root.style.setProperty('--card-foreground', '0 0% 98%')
        root.style.setProperty('--border', '0 0% 14.9%')
      } else {
        root.style.setProperty('--background', '0 0% 100%')
        root.style.setProperty('--foreground', '0 0% 3.9%')
        root.style.setProperty('--card', '0 0% 100%')
        root.style.setProperty('--card-foreground', '0 0% 3.9%')
        root.style.setProperty('--border', '0 0% 89.8%')
      }
    }
    
    // Apply color blind friendly mode
    if (currentSettings.colorBlindFriendly) {
      root.style.setProperty('--color-blind-friendly', '1')
    } else {
      root.style.removeProperty('--color-blind-friendly')
    }
    
    // Apply font size as CSS custom property
    root.style.setProperty('--font-size-base', `${currentSettings.fontSize}px`)
    
    // Apply animation speed
    root.style.setProperty('--animation-speed', `${currentSettings.animationSpeed}`)
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
    applyVisualSettings(defaultSettings)
  }

  const resetProgress = () => {
    onProgressReset()
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
      const intensity = Math.floor(settings.vibrationIntensity * 3)
      navigator.vibrate([intensity, 100, intensity, 100, intensity])
    }
  }

  // Get theme classes based on current settings using Tailwind utilities
  const getThemeClasses = () => {
    return "min-h-screen bg-background text-foreground p-4 transition-all duration-300"
  }

  const getCardClasses = () => {
    const baseClasses = "bg-card text-card-foreground border-border transition-all duration-300"
    if (settings.highContrast) {
      return `${baseClasses} border-2`
    }
    return baseClasses
  }

  const getButtonSizeClasses = (size: string) => {
    switch (size) {
      case "small":
        return "h-8 px-3 text-sm"
      case "medium":
        return "h-10 px-4 text-base"
      case "large":
        return "h-12 px-6 text-lg"
      case "extra-large":
        return "h-16 px-8 text-xl"
      default:
        return "h-10 px-4 text-base"
    }
  }

  // Apply color blind friendly colors using CSS custom properties
  const getColorBlindFriendlyColors = () => {
    if (settings.colorBlindFriendly) {
      return {
        blue: "from-blue-700 to-indigo-800",
        green: "from-emerald-700 to-teal-800",
        purple: "from-violet-700 to-purple-800",
        orange: "from-amber-700 to-orange-800",
        yellow: "from-yellow-600 to-amber-700",
        red: "from-red-700 to-pink-800"
      }
    }
    return {
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500", 
      purple: "from-purple-500 to-violet-500",
      orange: "from-orange-500 to-red-500",
      yellow: "from-yellow-500 to-amber-500",
      red: "from-red-500 to-pink-500"
    }
  }

  const colors = getColorBlindFriendlyColors()

  return (
    <div className={getThemeClasses()} style={{ fontSize: `var(--font-size-base, ${settings.fontSize}px)` }}>
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center mb-10">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className={`mr-6 ${getButtonSizeClasses(settings.buttonSize)} hover:bg-accent text-foreground backdrop-blur-sm shadow-md`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Accessibility Settings
            </h1>
            <p className="text-lg font-medium text-muted-foreground">
              Customize your learning experience with precision
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Audio Settings */}
          <Card className={`${getCardClasses()} hover:border-blue-300/50`}>
            <CardHeader>
              <div className="flex items-center">
                <div className={`p-3 bg-gradient-to-br ${colors.blue} rounded-xl mr-4 group-hover:scale-110 transition-transform shadow-inner`}>
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">Audio Settings</h3>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Configure sound feedback and morse code
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
                <div>
                  <label className="text-sm font-bold text-card-foreground">Enable Audio</label>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Turn on sound feedback and morse tones
                  </p>
                </div>
                <Switch
                  checked={settings.audioEnabled}
                  onCheckedChange={(checked) => updateSetting("audioEnabled", checked)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-card-foreground">Volume</label>
                  <div className={`px-3 py-1 bg-gradient-to-r ${colors.blue} text-white text-xs font-bold rounded-full shadow-inner`}>
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
                  <label className="text-sm font-bold">Morse Speed</label>
                  <div className={`px-3 py-1 bg-gradient-to-r ${colors.green} text-white text-xs font-bold rounded-full shadow-inner`}>
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
                  <label className="text-sm font-bold">Tone Frequency</label>
                  <div className={`px-3 py-1 bg-gradient-to-r ${colors.purple} text-white text-xs font-bold rounded-full shadow-inner`}>
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
                className={`w-full ${getButtonSizeClasses(settings.buttonSize)} bg-transparent`}
              >
                Test Audio Settings
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Visual Settings */}
          <Card className={`${getCardClasses()} hover:border-green-300/50`}>
            <CardHeader>
              <div className="flex items-center">
                <div className={`p-3 bg-gradient-to-br ${colors.green} rounded-xl mr-4 group-hover:scale-110 transition-transform shadow-inner`}>
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Visual Settings</h3>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Adjust display and visual accessibility
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Mode Selection */}
              <div className="space-y-4">
                <label className="text-sm font-bold block">Theme Mode</label>
                <div className="grid grid-cols-1 gap-3">
                  <div className={`flex items-center justify-between p-4 ${
                    settings.darkMode 
                      ? "bg-gradient-to-r from-gray-800/50 to-transparent" 
                      : "bg-gradient-to-r from-green-50/50 to-transparent"
                  } rounded-xl`}>
                    <div className="flex items-center">
                      {settings.darkMode ? (
                        <Moon className="w-5 h-5 mr-3 text-blue-500" />
                      ) : (
                        <Sun className="w-5 h-5 mr-3 text-yellow-500" />
                      )}
                      <div>
                        <label className="text-sm font-bold">
                          {settings.darkMode ? 'Dark Mode' : 'Light Mode'}
                        </label>
                        <p className={`text-xs mt-1 ${
                          settings.darkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                          {settings.darkMode ? 'Dark theme interface' : 'Light theme interface'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => updateSetting("darkMode", checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Accessibility Options */}
              {[
                { 
                  key: 'highContrast', 
                  label: 'High Contrast', 
                  desc: 'Enhance visibility with better contrast',
                  icon: Contrast
                },
                { 
                  key: 'colorBlindFriendly', 
                  label: 'Color Blind Friendly', 
                  desc: 'Use accessible color patterns',
                  icon: Palette
                }
              ].map((item) => (
                <div key={item.key} className={`flex items-center justify-between p-4 ${
                  settings.darkMode 
                    ? "bg-gradient-to-r from-gray-800/50 to-transparent" 
                    : "bg-gradient-to-r from-green-50/50 to-transparent"
                } rounded-xl`}>
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3 text-green-500" />
                    <div>
                      <label className="text-sm font-bold">{item.label}</label>
                      <p className={`text-xs mt-1 ${
                        settings.darkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => updateSetting(item.key, checked)}
                  />
                </div>
              ))}

              {/* Font Size Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold">Font Size</label>
                  <div className={`px-3 py-1 bg-gradient-to-r ${colors.purple} text-white text-xs font-bold rounded-full shadow-inner`}>
                    {settings.fontSize}px
                  </div>
                </div>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => updateSetting("fontSize", value[0])}
                  min={12}
                  max={28}
                  step={1}
                />
                <div className="text-center text-sm bg-accent/30 p-3 rounded-lg">
                  Sample text at {settings.fontSize}px - The quick brown fox jumps over the lazy dog.
                </div>
              </div>

              {/* Animation Speed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold">Animation Speed</label>
                  <div className={`px-3 py-1 bg-gradient-to-r ${colors.orange} text-white text-xs font-bold rounded-full shadow-inner`}>
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
          <Card className={`${getCardClasses()} hover:border-purple-300/50`}>
            <CardHeader>
              <div className="flex items-center">
                <div className={`p-3 bg-gradient-to-br ${colors.purple} rounded-xl mr-4 group-hover:scale-110 transition-transform shadow-inner`}>
                  <Vibrate className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">Haptic Settings</h3>
                  <p className="text-sm mt-1 text-muted-foreground">Configure vibration and tactile feedback</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
                <div>
                  <label className="text-sm font-bold text-card-foreground">Enable Vibration</label>
                  <p className="text-xs mt-1 text-muted-foreground">Turn on haptic feedback for interactions</p>
                </div>
                <Switch
                  checked={settings.vibrationEnabled}
                  onCheckedChange={(checked) => updateSetting("vibrationEnabled", checked)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-card-foreground">Vibration Intensity</label>
                  <div className={`px-3 py-1 bg-gradient-to-r ${colors.purple} text-white text-xs font-bold rounded-full shadow-inner`}>
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
                className={`w-full ${getButtonSizeClasses(settings.buttonSize)} bg-transparent`}
              >
                <Vibrate className="w-4 h-4 mr-2" />
                Test Vibration
              </Button>
            </CardContent>
          </Card>

          {/* Interface Settings */}
          <Card className={`${getCardClasses()} hover:border-orange-300/50`}>
            <CardHeader>
              <div className="flex items-center">
                <div className={`p-3 bg-gradient-to-br ${colors.orange} rounded-xl mr-4 group-hover:scale-110 transition-transform shadow-inner`}>
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">Interface Settings</h3>
                  <p className="text-sm mt-1 text-muted-foreground">Customize interface and controls</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-card-foreground block">Button Size</label>
                <div className="grid grid-cols-2 gap-3">
                  {['small', 'medium', 'large', 'extra-large'].map((size) => (
                    <Button
                      key={size}
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
                <div key={item.key} className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
                  <div>
                    <label className="text-sm font-bold text-card-foreground">{item.label}</label>
                    <p className="text-xs mt-1 text-muted-foreground">{item.desc}</p>
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
        <Card className={`mt-6 ${getCardClasses()} hover:border-yellow-300/50`}>
          <CardHeader>
            <div className="flex items-center">
              <div className={`p-3 bg-gradient-to-br ${colors.yellow} rounded-xl mr-4 group-hover:scale-110 transition-transform shadow-inner`}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground">Learning Preferences</h3>
                <p className="text-sm mt-1 text-muted-foreground">Customize your learning experience and study habits</p>
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
                <div key={item.key} className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
                  <div>
                    <label className="text-sm font-bold text-card-foreground">{item.label}</label>
                    <p className="text-xs mt-1 text-muted-foreground">{item.desc}</p>
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

        {/* Reset Buttons */}
        <Card className={`mt-6 ${getCardClasses()}`}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="outline" 
                onClick={resetToDefaults}
                className={getButtonSizeClasses(settings.buttonSize)}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default Settings
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={() => setShowResetConfirm(true)}
                className={`${getButtonSizeClasses(settings.buttonSize)} bg-red-600 hover:bg-red-700 text-white`}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Reset Progress
              </Button>
            </div>
            
            {/* Progress Reset Confirmation */}
            {showResetConfirm && (
              <div className={`mt-6 p-4 rounded-lg border-2 ${
                settings.darkMode
                  ? "bg-red-900/20 border-red-700 text-red-200"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}>
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      settings.darkMode ? "text-red-300" : "text-red-800"
                    }`}>
                      Reset All Progress?
                    </h3>
                    <p className={`text-sm mb-4 ${
                      settings.darkMode ? "text-red-200" : "text-red-700"
                    }`}>
                      This will permanently delete all your learning progress including:
                    </p>
                    <ul className={`text-sm mb-4 list-disc ml-5 space-y-1 ${
                      settings.darkMode ? "text-red-200" : "text-red-700"
                    }`}>
                      <li>Level {userProgress.level} and {userProgress.xp.toLocaleString()} XP</li>
                      <li>{userProgress.streak} day streak and {userProgress.lessonsCompleted} completed lessons</li>
                      <li>{userProgress.wordsLearned} learned words and {userProgress.achievements.length} achievements</li>
                      <li>All skill progress and statistics</li>
                    </ul>
                    <p className={`text-sm font-semibold mb-4 ${
                      settings.darkMode ? "text-red-300" : "text-red-700"
                    }`}>
                      This action cannot be undone!
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        variant="destructive" 
                        onClick={resetProgress}
                        className={`${getButtonSizeClasses(settings.buttonSize)} bg-red-600 hover:bg-red-700`}
                      >
                        Yes, Reset Everything
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowResetConfirm(false)}
                        className={`${getButtonSizeClasses(settings.buttonSize)} ${
                          settings.darkMode
                            ? "border-red-500 text-red-400 hover:bg-red-900/20"
                            : "border-red-300 text-red-700 hover:bg-red-50"
                        }`}
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

        {/* Visual Accessibility Guide */}
        <Card className={`mt-6 ${getCardClasses()}`}>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Visual Accessibility Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Current Settings Impact:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 rounded bg-opacity-10">
                    <span>Theme Mode:</span>
                    <Badge variant={settings.darkMode ? "secondary" : "default"}>
                      {settings.darkMode ? "Dark" : "Light"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-opacity-10">
                    <span>High Contrast:</span>
                    <Badge variant={settings.highContrast ? "default" : "secondary"}>
                      {settings.highContrast ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-opacity-10">
                    <span>Color Blind Friendly:</span>
                    <Badge variant={settings.colorBlindFriendly ? "default" : "secondary"}>
                      {settings.colorBlindFriendly ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-opacity-10">
                    <span>Font Size:</span>
                    <Badge variant="outline">{settings.fontSize}px</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-opacity-10">
                    <span>Button Size:</span>
                    <Badge variant="outline">{settings.buttonSize}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Accessibility Tips:</h4>
                <ul className={`text-sm space-y-2 text-muted-foreground`}>
                  <li>• Use High Contrast mode for better text visibility</li>
                  <li>• Enable Color Blind Friendly mode for improved color distinction</li>
                  <li>• Increase font size if text appears too small</li>
                  <li>• Choose larger buttons for easier touch interaction</li>
                  <li>• Dark mode can reduce eye strain in low light</li>
                  <li>• Adjust animation speed to reduce motion sensitivity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}