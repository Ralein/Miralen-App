"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Shield,
  Plane,
  Home,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Heart,
  Phone,
  Zap,
  Volume2,
  Vibrate,
} from "lucide-react"

interface RealWorldScenariosProps {
  accessibilityMode: string | null
  onBack: () => void
  userProgress: any
  updateProgress: (progress: any) => void
}

const SCENARIOS = [
  {
    id: "emergency-medical",
    title: "Medical Emergency",
    description: "Communicate vital medical information in emergency situations",
    difficulty: "Critical",
    icon: Heart,
    color: "red",
    situations: [
      {
        id: 1,
        context: "You witness a car accident and need to call for help",
        challenge: "Send 'HELP ACCIDENT HIGHWAY 101 MILE 45' in Morse code",
        timeLimit: 60,
        criticalWords: ["HELP", "ACCIDENT", "HIGHWAY", "101", "MILE", "45"],
      },
      {
        id: 2,
        context: "Someone is having a heart attack",
        challenge: "Transmit 'HEART ATTACK NEED AMBULANCE URGENT' quickly and accurately",
        timeLimit: 45,
        criticalWords: ["HEART", "ATTACK", "AMBULANCE", "URGENT"],
      },
    ],
  },
  {
    id: "aviation-emergency",
    title: "Aviation Emergency",
    description: "Critical communication for aircraft emergencies",
    difficulty: "Expert",
    icon: Plane,
    color: "blue",
    situations: [
      {
        id: 1,
        context: "Aircraft experiencing engine failure",
        challenge: "Send 'MAYDAY MAYDAY ENGINE FAILURE REQUESTING EMERGENCY LANDING'",
        timeLimit: 90,
        criticalWords: ["MAYDAY", "ENGINE", "FAILURE", "EMERGENCY", "LANDING"],
      },
    ],
  },
  {
    id: "maritime-distress",
    title: "Maritime Distress",
    description: "Ship-to-shore emergency communications",
    difficulty: "Expert",
    icon: Shield,
    color: "blue",
    situations: [
      {
        id: 1,
        context: "Vessel taking on water",
        challenge: "Transmit 'SOS SOS VESSEL SINKING POSITION 40N 70W NEED IMMEDIATE ASSISTANCE'",
        timeLimit: 120,
        criticalWords: ["SOS", "VESSEL", "SINKING", "POSITION", "ASSISTANCE"],
      },
    ],
  },
  {
    id: "home-security",
    title: "Home Security",
    description: "Silent alarm and security communications",
    difficulty: "Medium",
    icon: Home,
    color: "orange",
    situations: [
      {
        id: 1,
        context: "Intruder in the house, need silent communication",
        challenge: "Send 'INTRUDER IN HOUSE CALL POLICE QUIETLY' without making sound",
        timeLimit: 75,
        criticalWords: ["INTRUDER", "HOUSE", "POLICE", "QUIETLY"],
      },
    ],
  },
  {
    id: "workplace-emergency",
    title: "Workplace Emergency",
    description: "Office building emergency protocols",
    difficulty: "Medium",
    icon: Building,
    color: "purple",
    situations: [
      {
        id: 1,
        context: "Fire alarm system failed, need to alert everyone",
        challenge: "Broadcast 'FIRE ON FLOOR 12 EVACUATE IMMEDIATELY USE STAIRS'",
        timeLimit: 60,
        criticalWords: ["FIRE", "FLOOR", "EVACUATE", "IMMEDIATELY", "STAIRS"],
      },
    ],
  },
  {
    id: "outdoor-rescue",
    title: "Outdoor Rescue",
    description: "Wilderness and outdoor emergency situations",
    difficulty: "Hard",
    icon: MapPin,
    color: "green",
    situations: [
      {
        id: 1,
        context: "Lost hiker needs rescue",
        challenge: "Signal 'LOST HIKER INJURED LEG NEED RESCUE GPS 34.0522N 118.2437W'",
        timeLimit: 100,
        criticalWords: ["LOST", "HIKER", "INJURED", "RESCUE", "GPS"],
      },
    ],
  },
]

export function RealWorldScenarios({
  accessibilityMode,
  onBack,
  userProgress,
  updateProgress,
}: RealWorldScenariosProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [currentSituation, setCurrentSituation] = useState<number>(0)
  const [userInput, setUserInput] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "timeout" | null>(null)
  const [score, setScore] = useState(0)
  const [completedWords, setCompletedWords] = useState<string[]>([])

  const MORSE_CODE_MAP: { [key: string]: string } = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    " ": "/",
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
    } else if (timeLeft === 0 && isActive) {
      handleTimeout()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, isActive])

  const startScenario = (scenarioId: string) => {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId)
    if (!scenario) return

    setSelectedScenario(scenarioId)
    setCurrentSituation(0)
    setUserInput("")
    setTimeLeft(scenario.situations[0].timeLimit)
    setIsActive(true)
    setFeedback(null)
    setScore(0)
    setCompletedWords([])
  }

  const textToMorse = (text: string): string => {
    return text
      .toUpperCase()
      .split("")
      .map((char) => MORSE_CODE_MAP[char] || char)
      .join(" ")
  }

  const checkAnswer = () => {
    const scenario = SCENARIOS.find((s) => s.id === selectedScenario)
    if (!scenario) return

    const situation = scenario.situations[currentSituation]
    const expectedMorse = textToMorse(situation.challenge.split("'")[1])
    const isCorrect = userInput.trim() === expectedMorse

    setIsActive(false)
    setFeedback(isCorrect ? "correct" : "incorrect")

    if (isCorrect) {
      const xpGained =
        scenario.difficulty === "Critical"
          ? 200
          : scenario.difficulty === "Expert"
            ? 150
            : scenario.difficulty === "Hard"
              ? 100
              : 75

      setScore((prev) => prev + xpGained)

      updateProgress({
        xp: userProgress.xp + xpGained,
        skillLevels: {
          ...userProgress.skillLevels,
          emergency: Math.min(100, userProgress.skillLevels.emergency + 5),
        },
        recentActivity: [
          {
            type: "scenario",
            description: `Completed ${scenario.title} scenario`,
            timestamp: new Date(),
            xpGained,
          },
          ...userProgress.recentActivity.slice(0, 9),
        ],
      })
    }
  }

  const handleTimeout = () => {
    setIsActive(false)
    setFeedback("timeout")
  }

  const addDot = () => {
    if (isActive) setUserInput((prev) => prev + ".")
  }

  const addDash = () => {
    if (isActive) setUserInput((prev) => prev + "-")
  }

  const addSpace = () => {
    if (isActive) setUserInput((prev) => prev + " ")
  }

  const clearInput = () => {
    setUserInput("")
  }

  const playMorseAudio = async (morseCode: string) => {
    if (!("AudioContext" in window)) return

    const audioContext = new AudioContext()
    const dotDuration = 100
    const dashDuration = 300
    const pauseDuration = 100

    for (let i = 0; i < morseCode.length; i++) {
      const char = morseCode[i]
      if (char === ".") {
        await playTone(audioContext, 800, dotDuration)
      } else if (char === "-") {
        await playTone(audioContext, 800, dashDuration)
      } else if (char === " ") {
        await new Promise((resolve) => setTimeout(resolve, pauseDuration * 2))
        continue
      }
      await new Promise((resolve) => setTimeout(resolve, pauseDuration))
    }
  }

  const playTone = (audioContext: AudioContext, frequency: number, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration / 1000)

      setTimeout(resolve, duration)
    })
  }

  const playMorseVibration = (morseCode: string) => {
    if (!navigator.vibrate) return

    const pattern: number[] = []
    for (const char of morseCode) {
      if (char === ".") {
        pattern.push(100, 100)
      } else if (char === "-") {
        pattern.push(300, 100)
      } else if (char === " ") {
        pattern.push(0, 200)
      }
    }

    navigator.vibrate(pattern)
  }

  const renderScenarioList = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SCENARIOS.map((scenario) => {
        const IconComponent = scenario.icon
        const completionRate = (userProgress.skillLevels.emergency / 100) * scenario.situations.length

        return (
          <Card
            key={scenario.id}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4"
            style={{
              borderLeftColor:
                scenario.color === "red"
                  ? "#ef4444"
                  : scenario.color === "blue"
                    ? "#3b82f6"
                    : scenario.color === "orange"
                      ? "#f97316"
                      : scenario.color === "purple"
                        ? "#8b5cf6"
                        : "#10b981",
            }}
            onClick={() => startScenario(scenario.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${scenario.color}-100`}>
                  <IconComponent className={`w-6 h-6 text-${scenario.color}-600`} />
                </div>
                <Badge
                  variant={
                    scenario.difficulty === "Critical"
                      ? "destructive"
                      : scenario.difficulty === "Expert"
                        ? "destructive"
                        : scenario.difficulty === "Hard"
                          ? "default"
                          : "secondary"
                  }
                >
                  {scenario.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl">{scenario.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{scenario.description}</p>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Completion Rate</span>
                  <span>
                    {Math.round(completionRate)}/{scenario.situations.length}
                  </span>
                </div>
                <Progress value={(completionRate / scenario.situations.length) * 100} className="h-2" />

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{scenario.situations.length} scenarios</span>
                  <span>Emergency Level: {userProgress.skillLevels.emergency}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const renderScenario = () => {
    const scenario = SCENARIOS.find((s) => s.id === selectedScenario)
    if (!scenario) return null

    const situation = scenario.situations[currentSituation]
    const expectedMessage = situation.challenge.split("'")[1]
    const expectedMorse = textToMorse(expectedMessage)

    return (
      <div className="max-w-4xl mx-auto">
        {/* Scenario Header */}
        <Card className="mb-6 border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <scenario.icon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-red-900">{scenario.title}</h2>
                  <p className="text-red-700">Emergency Scenario {currentSituation + 1}</p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-3xl font-bold ${timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-gray-900"}`}
                >
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-600">Time Remaining</div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Emergency Situation</h3>
                  <p className="text-red-800">{situation.context}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Challenge Instructions */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-900">Your Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">{situation.challenge}</p>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-semibold mb-2">Message to transmit:</h4>
                  <p className="font-mono text-lg">{expectedMessage}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Critical Words:</h4>
                  <div className="flex flex-wrap gap-2">
                    {situation.criticalWords.map((word, index) => (
                      <Badge
                        key={index}
                        variant={completedWords.includes(word) ? "default" : "outline"}
                        className="text-sm"
                      >
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expected Morse Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-mono text-sm break-all">{expectedMorse}</p>
                </div>

                <div className="flex space-x-2">
                  {(accessibilityMode === "blind" || accessibilityMode === "hybrid") && (
                    <Button variant="outline" size="sm" onClick={() => playMorseAudio(expectedMorse)}>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Play Audio
                    </Button>
                  )}

                  {(accessibilityMode === "blind" || accessibilityMode === "hybrid") && (
                    <Button variant="outline" size="sm" onClick={() => playMorseVibration(expectedMorse)}>
                      <Vibrate className="w-4 h-4 mr-2" />
                      Feel Pattern
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Input Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Transmit Your Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-gray-100 rounded-lg min-h-20 font-mono text-lg break-all">
                {userInput || "Start transmitting..."}
              </div>

              {/* Input Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={addDot}
                  disabled={!isActive}
                  className="h-16 text-2xl bg-transparent"
                >
                  • DOT
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={addDash}
                  disabled={!isActive}
                  className="h-16 text-2xl bg-transparent"
                >
                  — DASH
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={addSpace}
                  disabled={!isActive}
                  className="h-16 bg-transparent"
                >
                  SPACE
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={clearInput}
                  disabled={!isActive}
                  className="h-16 bg-transparent"
                >
                  CLEAR
                </Button>
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={checkAnswer} disabled={!userInput || !isActive} size="lg" className="px-8">
                  <Phone className="w-4 h-4 mr-2" />
                  Transmit Emergency Message
                </Button>
              </div>

              {/* Feedback */}
              {feedback && (
                <div
                  className={`p-4 rounded-lg flex items-center justify-center ${
                    feedback === "correct"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : feedback === "timeout"
                        ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {feedback === "correct" && (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Emergency message transmitted successfully! Lives saved!
                    </>
                  )}
                  {feedback === "incorrect" && (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Message unclear - emergency response delayed. Try again!
                    </>
                  )}
                  {feedback === "timeout" && (
                    <>
                      <Clock className="w-5 h-5 mr-2" />
                      Time expired! In real emergencies, speed is critical.
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={selectedScenario ? () => setSelectedScenario(null) : onBack}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {selectedScenario ? "Back to Scenarios" : "Back"}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-red-600" />
              Real-World Emergency Scenarios
            </h1>
            <p className="text-gray-600 mt-2">
              {selectedScenario
                ? "Practice critical emergency communication skills"
                : "Master life-saving Morse code communication in emergency situations"}
            </p>
          </div>
        </div>

        {/* Emergency Readiness Stats */}
        {!selectedScenario && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-red-200" />
                <div className="text-2xl font-bold">{userProgress.skillLevels.emergency}%</div>
                <div className="text-red-100 text-sm">Emergency Ready</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl font-bold">{userProgress.averageSpeed}</div>
                <div className="text-blue-100 text-sm">WPM Speed</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-200" />
                <div className="text-2xl font-bold">{Math.round(userProgress.accuracy)}%</div>
                <div className="text-green-100 text-sm">Accuracy</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-purple-200" />
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-purple-100 text-sm">Emergency XP</div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedScenario ? renderScenario() : renderScenarioList()}
      </div>
    </div>
  )
}
