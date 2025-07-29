"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Headphones,
  AudioWaveformIcon as Waveform,
  Target,
  TrendingUp,
} from "lucide-react"

interface VoiceTrainingProps {
  accessibilityMode: string | null
  onBack: () => void
  userProgress: any
  updateProgress: (progress: any) => void
}

const VOICE_EXERCISES = [
  {
    id: "pronunciation",
    title: "Morse Pronunciation",
    description: "Learn to speak Morse code rhythms",
    exercises: [
      { word: "SOS", morse: "... --- ...", pronunciation: "dit-dit-dit dah-dah-dah dit-dit-dit" },
      { word: "HELP", morse: ".... . .-.. .--.", pronunciation: "dit-dit-dit-dit dit dit-dah-dit-dit dit-dah-dah-dit" },
      {
        word: "EMERGENCY",
        morse: ". -- . .-. --. . -. -.-. -.--",
        pronunciation: "dit dah-dah dit dit-dah dit dah-dah-dit dit dah-dit dah-dit-dah-dit dah-dit-dah-dah",
      },
    ],
  },
  {
    id: "rhythm",
    title: "Rhythm Training",
    description: "Master the timing of dots and dashes",
    exercises: [
      { word: "A", morse: ".-", pronunciation: "dit-dah" },
      { word: "N", morse: "-.", pronunciation: "dah-dit" },
      { word: "T", morse: "-", pronunciation: "dah" },
      { word: "E", morse: ".", pronunciation: "dit" },
    ],
  },
  {
    id: "speed",
    title: "Speed Building",
    description: "Increase your speaking speed gradually",
    exercises: [
      {
        word: "QUICK",
        morse: "--.- ..- .. -.-. -.-",
        pronunciation: "dah-dah-dit-dah dit-dit-dah dit-dit dah-dit-dah-dit dah-dit-dah",
      },
      { word: "FAST", morse: "..-. .- ... -", pronunciation: "dit-dit-dah-dit dit-dah dit-dit-dit dah" },
      {
        word: "RAPID",
        morse: ".-. .- .--. .. -..",
        pronunciation: "dit-dah-dit dit-dah dit-dah-dah-dit dit-dit dah-dit-dit",
      },
    ],
  },
]

export function VoiceTraining({ accessibilityMode, onBack, userProgress, updateProgress }: VoiceTrainingProps) {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [currentWord, setCurrentWord] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>(null)

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Set up audio analysis
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / bufferLength
          setAudioLevel(average)
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
        }
      }
      updateAudioLevel()

      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.start()
      setIsRecording(true)

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording()
        }
      }, 10000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setAudioLevel(0)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // Simulate voice analysis feedback
      const accuracy = Math.random() * 40 + 60 // 60-100% accuracy
      const isCorrect = accuracy > 75

      setFeedback(isCorrect ? "correct" : "incorrect")
      setAttempts((prev) => prev + 1)

      if (isCorrect) {
        const xpGained = Math.round(accuracy)
        setScore((prev) => prev + xpGained)

        updateProgress({
          xp: userProgress.xp + xpGained,
          skillLevels: {
            ...userProgress.skillLevels,
            voiceRecognition: Math.min(100, userProgress.skillLevels.voiceRecognition + 2),
          },
          recentActivity: [
            {
              type: "voice",
              description: "Completed voice training exercise",
              timestamp: new Date(),
              xpGained,
            },
            ...userProgress.recentActivity.slice(0, 9),
          ],
        })
      }

      setTimeout(() => {
        setFeedback(null)
        if (isCorrect) {
          nextWord()
        }
      }, 2000)
    }
  }

  const playExample = async (morse: string) => {
    if (!("AudioContext" in window)) return

    setIsPlaying(true)
    const audioContext = new AudioContext()
    const dotDuration = 150
    const dashDuration = 450
    const pauseDuration = 150

    for (let i = 0; i < morse.length; i++) {
      const char = morse[i]
      if (char === ".") {
        await playTone(audioContext, 600, dotDuration)
      } else if (char === "-") {
        await playTone(audioContext, 600, dashDuration)
      } else if (char === " ") {
        await new Promise((resolve) => setTimeout(resolve, pauseDuration * 2))
        continue
      }
      await new Promise((resolve) => setTimeout(resolve, pauseDuration))
    }

    setIsPlaying(false)
  }

  const playTone = (audioContext: AudioContext, frequency: number, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration / 1000)

      setTimeout(resolve, duration)
    })
  }

  const nextWord = () => {
    const exercise = VOICE_EXERCISES.find((e) => e.id === selectedExercise)
    if (!exercise) return

    if (currentWord < exercise.exercises.length - 1) {
      setCurrentWord((prev) => prev + 1)
    } else {
      // Exercise completed
      setCurrentWord(0)
      setSelectedExercise(null)
    }
  }

  const renderExerciseList = () => (
    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
      {VOICE_EXERCISES.map((exercise) => (
        <Card
          key={exercise.id}
          className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
          onClick={() => {
            setSelectedExercise(exercise.id)
            setCurrentWord(0)
            setScore(0)
            setAttempts(0)
          }}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="outline">{exercise.exercises.length} exercises</Badge>
            </div>
            <CardTitle className="text-xl">{exercise.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{exercise.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Voice Accuracy</span>
                <span>{userProgress.skillLevels.voiceRecognition}%</span>
              </div>
              <Progress value={userProgress.skillLevels.voiceRecognition} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderExercise = () => {
    const exercise = VOICE_EXERCISES.find((e) => e.id === selectedExercise)
    if (!exercise) return null

    const currentExercise = exercise.exercises[currentWord]

    return (
      <div className="max-w-4xl mx-auto">
        {/* Exercise Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{exercise.title}</h2>
                <p className="text-gray-600">
                  Exercise {currentWord + 1} of {exercise.exercises.length}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-2">
                  Score: {score}
                </Badge>
                <div className="text-sm text-gray-600">
                  Accuracy: {attempts > 0 ? Math.round(((score / attempts) * 100) / 100) : 0}%
                </div>
              </div>
            </div>
            <Progress value={(currentWord / exercise.exercises.length) * 100} className="h-3" />
          </CardContent>
        </Card>

        {/* Current Exercise */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Word to Practice</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-4">{currentExercise.word}</div>
              <div className="text-2xl font-mono mb-4 p-4 bg-muted rounded-lg">{currentExercise.morse}</div>
              <Button
                variant="outline"
                onClick={() => playExample(currentExercise.morse)}
                disabled={isPlaying}
                className="mb-4"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                Play Morse Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pronunciation Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Say it like this:</h4>
                  <p className="text-lg font-mono">{currentExercise.pronunciation}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Tips:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• "dit" for dots (short and sharp)</li>
                    <li>• "dah" for dashes (longer, about 3x dit)</li>
                    <li>• Pause briefly between letters</li>
                    <li>• Keep a steady rhythm</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voice Recording Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Headphones className="w-5 h-5 mr-2" />
              Voice Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Audio Level Visualizer */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="w-full h-full rounded-full border-4 border-border flex items-center justify-center">
                    <div
                      className={`rounded-full transition-all duration-100 ${
                        isRecording ? "bg-red-500" : "bg-gray-400"
                      }`}
                      style={{
                        width: `${Math.max(20, Math.min(100, audioLevel))}px`,
                        height: `${Math.max(20, Math.min(100, audioLevel))}px`,
                      }}
                    />
                  </div>
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-pulse" />
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    size="lg"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-8 ${isRecording ? "bg-red-600 hover:bg-red-700" : ""}`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentWord(0)
                      setScore(0)
                      setAttempts(0)
                      setFeedback(null)
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center text-gray-600">
                <p className="mb-2">
                  {isRecording
                    ? "Speak the pronunciation clearly into your microphone..."
                    : "Click 'Start Recording' and speak the Morse pronunciation"}
                </p>
                {isRecording && <p className="text-sm">Recording will auto-stop after 10 seconds</p>}
              </div>

              {/* Feedback */}
              {feedback && (
                <div
                  className={`p-4 rounded-lg flex items-center justify-center ${
                    feedback === "correct"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {feedback === "correct" ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Excellent pronunciation! Moving to next word...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Try again! Focus on the rhythm and clarity.
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Stats */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{attempts}</div>
              <div className="text-sm text-gray-600">Attempts</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Waveform className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{userProgress.skillLevels.voiceRecognition}%</div>
              <div className="text-sm text-gray-600">Voice Skill</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={selectedExercise ? () => setSelectedExercise(null) : onBack}
            className="mr-6 hover:bg-white/80 backdrop-blur-sm shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {selectedExercise ? "Back to Exercises" : "Back"}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Mic className="w-8 h-8 mr-3 text-blue-600" />
              Voice Training
            </h1>
            <p className="text-gray-600 mt-2">
              {selectedExercise
                ? "Practice speaking Morse code with voice recognition"
                : "Master Morse code pronunciation and rhythm"}
            </p>
          </div>
        </div>

        {/* Voice Skill Stats */}
        {!selectedExercise && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Mic className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl font-bold">{userProgress.skillLevels.voiceRecognition}%</div>
                <div className="text-blue-100 text-sm">Voice Accuracy</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <Volume2 className="w-8 h-8 mx-auto mb-2 text-green-200" />
                <div className="text-2xl font-bold">{userProgress.averageSpeed}</div>
                <div className="text-green-100 text-sm">Speaking WPM</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <Headphones className="w-8 h-8 mx-auto mb-2 text-purple-200" />
                <div className="text-2xl font-bold">{Math.round(userProgress.accuracy)}%</div>
                <div className="text-purple-100 text-sm">Pronunciation</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6 text-center">
                <Waveform className="w-8 h-8 mx-auto mb-2 text-orange-200" />
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-orange-100 text-sm">Session Score</div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedExercise ? renderExercise() : renderExerciseList()}
      </div>
    </div>
  )
}
