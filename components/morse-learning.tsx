"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Volume2, Vibrate, CheckCircle, XCircle, RotateCcw, Lightbulb, Delete } from "lucide-react"

interface MorseLearningProps {
  accessibilityMode: string | null
  onBack: () => void
  userProgress?: any
  updateProgress?: (update: any) => void
}

// Simplified lessons focusing on basic A-Z learning
const LESSONS = [
  {
    id: 1,
    title: "Letters A-E",
    letters: ["A", "B", "C", "D", "E"],
    difficulty: "Beginner",
    words: ["A", "B", "C", "D", "E"],
    sentences: [],
  },
  {
    id: 2,
    title: "Letters F-J",
    letters: ["F", "G", "H", "I", "J"],
    difficulty: "Beginner",
    words: ["F", "G", "H", "I", "J"],
    sentences: [],
  },
  {
    id: 3,
    title: "Letters K-O",
    letters: ["K", "L", "M", "N", "O"],
    difficulty: "Beginner",
    words: ["K", "L", "M", "N", "O"],
    sentences: [],
  },
  {
    id: 4,
    title: "Letters P-T",
    letters: ["P", "Q", "R", "S", "T"],
    difficulty: "Beginner",
    words: ["P", "Q", "R", "S", "T"],
    sentences: [],
  },
  {
    id: 5,
    title: "Letters U-Z",
    letters: ["U", "V", "W", "X", "Y", "Z"],
    difficulty: "Beginner",
    words: ["U", "V", "W", "X", "Y", "Z"],
    sentences: [],
  },
  {
    id: 6,
    title: "Numbers 0-9",
    letters: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    difficulty: "Intermediate",
    words: ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"],
    sentences: [],
  },
  {
    id: 7,
    title: "Three Letter Words",
    letters: [],
    difficulty: "Intermediate",
    words: ["CAT", "DOG", "SUN", "RUN", "FUN", "HAT", "BAT", "CAR", "EAR", "TEA"],
    sentences: [],
  },
  {
    id: 8,
    title: "Basic Sentences",
    letters: [],
    difficulty: "Advanced",
    words: [],
    sentences: ["I AM FINE", "HOW ARE YOU", "THANK YOU", "GOOD MORNING", "HELP ME"],
  },
]

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
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "0": "-----",
  " ": "/",
}

const REVERSE_MORSE_MAP = Object.fromEntries(Object.entries(MORSE_CODE_MAP).map(([key, value]) => [value, key]))

export function MorseLearning({ accessibilityMode, onBack, userProgress, updateProgress }: MorseLearningProps) {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [currentItem, setCurrentItem] = useState<string>("")
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0)
  const [userInput, setUserInput] = useState<string>("")
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [lessonProgress, setLessonProgress] = useState(0)

  const startLesson = (lessonId: number) => {
    setSelectedLesson(lessonId)
    const lesson = LESSONS.find((l) => l.id === lessonId)
    if (lesson) {
      const items =
        lesson.sentences.length > 0 ? lesson.sentences : lesson.words.length > 0 ? lesson.words : lesson.letters

      if (items.length > 0) {
        setCurrentItem(items[0])
        setCurrentItemIndex(0)
        setUserInput("")
        setFeedback(null)
        setScore(0)
        setAttempts(0)
        setLessonProgress(0)
        setShowHint(false)
      }
    }
  }

  const convertToMorse = (text: string): string => {
    return text
      .split("")
      .map((char) => MORSE_CODE_MAP[char] || "")
      .join(" ")
  }

  const playMorseAudio = async (morseCode: string) => {
    if (!("AudioContext" in window) || !('speechSynthesis' in window)) return

    const audioContext = new AudioContext()
    const dotDuration = 150
    const dashDuration = 450
    const pauseDuration = 150
    const letterPauseDuration = 400
    const wordPauseDuration = 700

    const morseTokens = morseCode.split(' ')
    let currentWord = ''

    for (const token of morseTokens) {
      if (token === '/') {
        if (currentWord) {
          const wordUtterance = new SpeechSynthesisUtterance(currentWord)
          window.speechSynthesis.speak(wordUtterance)
          await new Promise((r) => setTimeout(r, wordPauseDuration))
          currentWord = ''
        }
      } else if (token) {
        const letter = REVERSE_MORSE_MAP[token]
        if (letter) {
          currentWord += letter
          const utterance = new SpeechSynthesisUtterance(letter)
          utterance.rate = 1.5
          window.speechSynthesis.speak(utterance)
          await new Promise((r) => setTimeout(r, 150))

          for (const char of token) {
            if (char === '.') {
              await playTone(audioContext, 600, dotDuration)
            } else if (char === '-') {
              await playTone(audioContext, 600, dashDuration)
            }
            await new Promise((r) => setTimeout(r, pauseDuration))
          }
          await new Promise((r) => setTimeout(r, letterPauseDuration))
        }
      }
    }

    if (currentWord) {
      // Speak last word
      const wordUtterance = new SpeechSynthesisUtterance(currentWord)
      window.speechSynthesis.speak(wordUtterance)
      await new Promise((r) => setTimeout(r, wordPauseDuration))
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

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
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
        pattern.push(150, 150)
      } else if (char === "-") {
        pattern.push(450, 150)
      } else if (char === " ") {
        pattern.push(0, 300)
      }
    }

    navigator.vibrate(pattern)
  }

  const readAloud = (text: string) => {
    if (!('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  const checkAnswer = () => {
    const correctAnswer = convertToMorse(currentItem)
    const isCorrect = userInput.trim() === correctAnswer

    setFeedback(isCorrect ? "correct" : "incorrect")
    setAttempts((prev) => prev + 1)

    if (isCorrect) {
      setScore((prev) => prev + 1)

      // Award XP and update progress
      const xpGained = currentItem.length <= 1 ? 10 : currentItem.length <= 3 ? 25 : 50
      const newXP = (userProgress?.xp || 0) + xpGained
      const newLevel = Math.floor(newXP / 100) + 1

      // Update various progress metrics
      const progressUpdate = {
        xp: newXP,
        level: newLevel,
        lessonsCompleted:
          isCorrect && currentItemIndex === 0
            ? (userProgress?.lessonsCompleted || 0) + 1
            : userProgress?.lessonsCompleted || 0,
        wordsLearned: currentItem.length > 1 ? (userProgress?.wordsLearned || 0) + 1 : userProgress?.wordsLearned || 0,
        accuracy: Math.round(((score + 1) / (attempts + 1)) * 100),
        timeSpent: (userProgress?.timeSpent || 0) + 1,
        skillLevels: {
          ...userProgress?.skillLevels,
          letters:
            selectedLesson && selectedLesson <= 5
              ? Math.min((userProgress?.skillLevels?.letters || 0) + 2, 100)
              : userProgress?.skillLevels?.letters || 0,
          numbers:
            selectedLesson === 6
              ? Math.min((userProgress?.skillLevels?.numbers || 0) + 5, 100)
              : userProgress?.skillLevels?.numbers || 0,
          words:
            selectedLesson === 7
              ? Math.min((userProgress?.skillLevels?.words || 0) + 3, 100)
              : userProgress?.skillLevels?.words || 0,
          sentences:
            selectedLesson === 8
              ? Math.min((userProgress?.skillLevels?.sentences || 0) + 4, 100)
              : userProgress?.skillLevels?.sentences || 0,
        },
        recentActivity: [
          {
            type: "lesson",
            description: `Learned "${currentItem}" in Morse code`,
            timestamp: new Date(),
            xpGained: xpGained,
          },
          ...(userProgress?.recentActivity || []).slice(0, 9),
        ],
      }

      if (updateProgress) {
        updateProgress(progressUpdate)
      }

      setTimeout(() => {
        nextItem()
      }, 1500)
    }
  }

  const nextItem = () => {
    const lesson = LESSONS.find((l) => l.id === selectedLesson)
    if (!lesson) return

    const items =
      lesson.sentences.length > 0 ? lesson.sentences : lesson.words.length > 0 ? lesson.words : lesson.letters

    const nextIndex = (currentItemIndex + 1) % items.length

    setCurrentItem(items[nextIndex])
    setCurrentItemIndex(nextIndex)
    setUserInput("")
    setFeedback(null)
    setShowHint(false)

    const progressIncrement = 100 / items.length
    const newProgress = Math.min(lessonProgress + progressIncrement, 100)
    setLessonProgress(newProgress)
  }

  const addDot = () => {
    setUserInput((prev) => prev + ".")
  }

  const addDash = () => {
    setUserInput((prev) => prev + "-")
  }

  const addSpace = () => {
    setUserInput((prev) => prev + " ")
  }

  const addSlash = () => {
    setUserInput((prev) => prev + "/")
  }

  const clearInput = () => {
    setUserInput("")
  }

  const backspace = () => {
    setUserInput((prev) => prev.slice(0, -1))
  }

  const renderLessonList = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {LESSONS.map((lesson) => (
        <Card
          key={lesson.id}
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => startLesson(lesson.id)}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{lesson.title}</CardTitle>
              <Badge
                variant={
                  lesson.difficulty === "Beginner"
                    ? "secondary"
                    : lesson.difficulty === "Intermediate"
                      ? "default"
                      : "destructive"
                }
              >
                {lesson.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {lesson.letters.slice(0, 8).map((letter) => (
                <Badge key={letter} variant="outline" className="text-sm">
                  {letter}
                </Badge>
              ))}
              {lesson.letters.length > 8 && (
                <Badge variant="outline" className="text-sm">
                  +{lesson.letters.length - 8}
                </Badge>
              )}
            </div>
            <p className="text-gray-600 text-sm">
              {lesson.sentences.length > 0
                ? `${lesson.sentences.length} sentences to practice`
                : lesson.words.length > 0
                  ? `${lesson.words.length} words to learn`
                  : `${lesson.letters.length} letters to master`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderLesson = () => {
    const lesson = LESSONS.find((l) => l.id === selectedLesson)
    if (!lesson) return null

    const morseCode = convertToMorse(currentItem)

    return (
      <div className="max-w-4xl mx-auto">
        {/* Lesson Header */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">{lesson.title}</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  Score: {score}/{attempts}
                </Badge>
                <Badge variant="secondary">
                  XP: +{score * (currentItem.length <= 1 ? 10 : currentItem.length <= 3 ? 25 : 50)}
                </Badge>
              </div>
            </div>
            <Progress value={lessonProgress} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">{Math.round(lessonProgress)}% Complete</p>
          </CardContent>
        </Card>

        {/* Current Item Practice */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Item Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {lesson.sentences.length > 0
                  ? "Learn This Sentence"
                  : lesson.words.length > 0
                    ? "Learn This Word"
                    : "Learn This Letter"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-4 break-words">{currentItem}</div>
              <div className="text-3xl font-mono mb-6 p-4 bg-muted text-muted-foreground">{morseCode}</div>

              {/* Multimodal Feedback Buttons */}
              <div className="flex justify-center space-x-4 mb-4 flex-wrap gap-2">
                <Button variant="outline" onClick={() => readAloud(currentItem)}>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Read Aloud
                </Button>

                <Button variant="outline" onClick={() => playMorseVibration(morseCode)}>
                  <Vibrate className="w-4 h-4 mr-2" />
                  Vibration
                </Button>

                {(accessibilityMode === "blind" || accessibilityMode === "hybrid") && (
                  <Button variant="outline" onClick={() => playMorseAudio(morseCode)}>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Play Morse Audio
                  </Button>
                )}
              </div>

              {/* Visual Animation */}
              {(accessibilityMode === "deaf" || accessibilityMode === "hybrid") && (
                <div className="mb-4">
                  <div className="flex justify-center items-center space-x-2 h-16 flex-wrap">
                    {morseCode.split("").map((symbol, index) => (
                      <div
                        key={index}
                        className={`${
                          symbol === "." ? "w-4 h-4 rounded-full" : symbol === "-" ? "w-12 h-4 rounded-sm" : "w-2 h-2"
                        } ${symbol === " " ? "bg-transparent" : "bg-primary animate-pulse"}`}
                        style={{ animationDelay: `${index * 0.5}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Input Practice */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Practice Input</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-lg mb-4">
                  Enter the Morse code for: <strong>{currentItem}</strong>
                </p>
                <div className="text-2xl font-mono p-4 bg-muted rounded-lg mb-4 min-h-16 flex items-center justify-center break-words">
                  {userInput || "Tap dots, dashes, and spaces..."}
                </div>
              </div>

              {/* Input Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button size="lg" variant="outline" onClick={addDot} className="h-20 text-2xl bg-transparent">
                  • DOT
                </Button>
                <Button size="lg" variant="outline" onClick={addDash} className="h-20 text-2xl bg-transparent">
                  — DASH
                </Button>
                <Button size="lg" variant="outline" onClick={addSpace} className="h-20 text-2xl bg-transparent">
                  ␣ SPACE
                </Button>
                <Button size="lg" variant="outline" onClick={addSlash} className="h-20 text-2xl bg-transparent">
                  / SLASH
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mb-4 flex-wrap gap-2">
                <Button variant="outline" onClick={clearInput}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button variant="outline" onClick={backspace}>
                  <Delete className="w-4 h-4 mr-2" />
                  Backspace
                </Button>
                <Button variant="outline" onClick={() => setShowHint(!showHint)}>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Hint
                </Button>
                <Button onClick={checkAnswer} disabled={!userInput} className="bg-blue-600 hover:bg-blue-700">
                  Check Answer
                </Button>
              </div>

              {/* Hint */}
              {showHint && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <p className="text-sm text-yellow-800 break-words">
                    <strong>Hint:</strong> The correct answer is {morseCode}
                  </p>
                </div>
              )}

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
                      Correct! Well done! +{currentItem.length <= 1 ? 10 : currentItem.length <= 3 ? 25 : 50} XP
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Try again! The correct answer is {morseCode}
                    </>
                  )}
                </div>
              )}
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
            onClick={selectedLesson ? () => setSelectedLesson(null) : onBack}
            className="mr-6 hover:bg-white/80 backdrop-blur-sm shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground truncate">
              {selectedLesson ? "Morse Code Practice" : "Learn Morse Code"}
            </h1>
            <p className="text-gray-600 mt-2">
              {selectedLesson ? "Practice with real-time progress tracking" : "Start with basic letters A-Z"}
            </p>
          </div>
        </div>

        {selectedLesson ? renderLesson() : renderLessonList()}
      </div>

      </div>

  )
}
