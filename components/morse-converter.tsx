"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Volume2, Vibrate, Flashlight, Copy, RotateCcw, Pause } from "lucide-react"

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

interface MorseConverterProps {
  accessibilityMode: string | null
  onBack: () => void
}

export function MorseConverter({ accessibilityMode, onBack }: MorseConverterProps) {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [mode, setMode] = useState<"text-to-morse" | "morse-to-text">("text-to-morse")
  const [isPlaying, setIsPlaying] = useState(false)

  const textToMorse = (text: string): string => {
    return text
      .toUpperCase()
      .split("")
      .map((char) => MORSE_CODE_MAP[char] || char)
      .join(" ")
  }

  const morseToText = (morse: string): string => {
    return morse
      .split(" ")
      .map((code) => REVERSE_MORSE_MAP[code] || code)
      .join("")
  }

  const handleConvert = () => {
    if (mode === "text-to-morse") {
      setOutputText(textToMorse(inputText))
    } else {
      setOutputText(morseToText(inputText))
    }
  }

  const playMorseAudio = async (morseCode: string) => {
    if (!("AudioContext" in window)) return

    setIsPlaying(true)
    const audioContext = new AudioContext()
    const dotDuration = 100 // milliseconds
    const dashDuration = 300
    const pauseDuration = 100

    for (let i = 0; i < morseCode.length; i++) {
      const char = morseCode[i]
      if (char === ".") {
        await playTone(audioContext, 600, dotDuration)
      } else if (char === "-") {
        await playTone(audioContext, 600, dashDuration)
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

  const playMorseVibration = (morseCode: string) => {
    if (!navigator.vibrate) return

    const pattern: number[] = []
    for (const char of morseCode) {
      if (char === ".") {
        pattern.push(100, 100) // Short vibration, short pause
      } else if (char === "-") {
        pattern.push(300, 100) // Long vibration, short pause
      } else if (char === " ") {
        pattern.push(0, 300) // Longer pause between letters
      }
    }

    navigator.vibrate(pattern)
  }

  const playMorseFlashlight = async (morseCode: string) => {
    if (!navigator.mediaDevices) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      const track = stream.getVideoTracks()[0]

      if (!track.getCapabilities().torch) return

      for (const char of morseCode) {
        if (char === ".") {
          await track.applyConstraints({ advanced: [{ torch: true }] })
          await new Promise((resolve) => setTimeout(resolve, 100))
          await track.applyConstraints({ advanced: [{ torch: false }] })
        } else if (char === "-") {
          await track.applyConstraints({ advanced: [{ torch: true }] })
          await new Promise((resolve) => setTimeout(resolve, 300))
          await track.applyConstraints({ advanced: [{ torch: false }] })
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      track.stop()
    } catch (error) {
      console.error("Flashlight not available:", error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
  }

  useEffect(() => {
    if (inputText) {
      handleConvert()
    }
  }, [inputText, mode])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="mr-6 hover:bg-white/80 backdrop-blur-sm shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Morse Converter</h1>
            <p className="text-gray-600 mt-2">Convert between text and Morse code</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-center space-x-4">
              <Button
                variant={mode === "text-to-morse" ? "default" : "outline"}
                onClick={() => setMode("text-to-morse")}
                className="text-lg px-6 py-3"
              >
                Text → Morse
              </Button>
              <Button
                variant={mode === "morse-to-text" ? "default" : "outline"}
                onClick={() => setMode("morse-to-text")}
                className="text-lg px-6 py-3"
              >
                Morse → Text
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>{mode === "text-to-morse" ? "Enter Text" : "Enter Morse Code"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  mode === "text-to-morse"
                    ? "Type your message here..."
                    : "Enter Morse code (use . for dot, - for dash, space between letters)"
                }
                className="min-h-32 text-lg"
              />
              <div className="flex justify-between items-center mt-4">
                <Badge variant="secondary">{inputText.length} characters</Badge>
                <Button variant="outline" onClick={clearAll}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>{mode === "text-to-morse" ? "Morse Code Output" : "Text Output"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-32 p-4 bg-gray-100 rounded-lg text-lg font-mono">
                {outputText || "Output will appear here..."}
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  {mode === "text-to-morse" && outputText && (
                    <>
                      {(accessibilityMode === "blind" || accessibilityMode === "hybrid") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playMorseAudio(outputText)}
                          disabled={isPlaying}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                      )}
                      {(accessibilityMode === "blind" || accessibilityMode === "hybrid") && (
                        <Button variant="outline" size="sm" onClick={() => playMorseVibration(outputText)}>
                          <Vibrate className="w-4 h-4" />
                        </Button>
                      )}
                      {(accessibilityMode === "deaf" || accessibilityMode === "hybrid") && (
                        <Button variant="outline" size="sm" onClick={() => playMorseFlashlight(outputText)}>
                          <Flashlight className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Morse Code Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Morse Code Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
              {Object.entries(MORSE_CODE_MAP)
                .slice(0, 26)
                .map(([letter, code]) => (
                  <div key={letter} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <span className="font-bold">{letter}</span>
                    <span className="font-mono">{code}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
