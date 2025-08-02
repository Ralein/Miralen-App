"use client"

import React, { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, SkipBack, SkipForward, HelpCircle, MessageSquare } from "lucide-react"

const LIP_READING_LESSONS = [
  {
    id: "alphabet",
    title: "The Alphabet",
    description: "Learn to recognize the lip movements for each letter from A to Z.",
    items: [
      { item: "A", video: "/videos/lip-reading/a.mp4" },
      { item: "B", video: "/videos/lip-reading/b.mp4" },
      { item: "C", video: "/videos/lip-reading/c.mp4" },
      { item: "D", video: "/videos/lip-reading/d.mp4" },
      { item: "E", video: "/videos/lip-reading/e.mp4" },
      { item: "F", video: "/videos/lip-reading/f.mp4" },
      { item: "G", video: "/videos/lip-reading/g.mp4" },
      { item: "H", video: "/videos/lip-reading/h.mp4" },
      { item: "I", video: "/videos/lip-reading/i.mp4" },
      { item: "J", video: "/videos/lip-reading/j.mp4" },
      { item: "K", video: "/videos/lip-reading/k.mp4" },
      { item: "L", video: "/videos/lip-reading/l.mp4" },
      { item: "M", video: "/videos/lip-reading/m.mp4" },
      { item: "N", video: "/videos/lip-reading/n.mp4" },
      { item: "O", video: "/videos/lip-reading/o.mp4" },
      { item: "P", video: "/videos/lip-reading/p.mp4" },
      { item: "Q", video: "/videos/lip-reading/q.mp4" },
      { item: "R", video: "/videos/lip-reading/r.mp4" },
      { item: "S", video: "/videos/lip-reading/s.mp4" },
      { item: "T", video: "/videos/lip-reading/t.mp4" },
      { item: "U", video: "/videos/lip-reading/u.mp4" },
      { item: "V", video: "/videos/lip-reading/v.mp4" },
      { item: "W", video: "/videos/lip-reading/w.mp4" },
      { item: "X", video: "/videos/lip-reading/x.mp4" },
      { item: "Y", video: "/videos/lip-reading/y.mp4" },
      { item: "Z", video: "/videos/lip-reading/z.mp4" },
    ],
  },
  {
    id: "greetings",
    title: "Common Greetings",
    description: "Practice reading lips for everyday greetings and phrases.",
    items: [
      { item: "Hello", video: "/videos/lip-reading/hello.mp4" },
      { item: "Goodbye", video: "/videos/lip-reading/goodbye.mp4" },
      { item: "How are you?", video: "/videos/lip-reading/how-are-you.mp4" },
      { item: "Thank you", video: "/videos/lip-reading/thank-you.mp4" },
      { item: "You're welcome", video: "/videos/lip-reading/youre-welcome.mp4" },
    ],
  },
]

const LipReading = ({ onBack }: { onBack: () => void }) => {
  const [selectedLesson, setSelectedLesson] = useState(LIP_READING_LESSONS[0])
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [practiceMode, setPracticeMode] = useState(false)
  const [userGuess, setUserGuess] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)

  const currentItem = selectedLesson.items[currentItemIndex]

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleNext = () => {
    if (currentItemIndex < selectedLesson.items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1)
    }
  }

  const checkGuess = () => {
    if (userGuess.toLowerCase() === currentItem.item.toLowerCase()) {
      setFeedback("correct")
    } else {
      setFeedback("incorrect")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
         <Button
            variant="ghost"
            onClick={selectedLesson ? onBack : onBack}
            className="mr-6 hover:bg-white/80 backdrop-blur-sm shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Lip Reading Practice</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{selectedLesson.title}</span>
                  <Badge variant="secondary">{currentItemIndex + 1} / {selectedLesson.items.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center text-white">
                  <video
                    ref={videoRef}
                    src={currentItem.video}
                    className="w-full h-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
                <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                  <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentItemIndex === 0}>
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleReplay}>
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  <Button size="lg" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNext} disabled={currentItemIndex === selectedLesson.items.length - 1}>
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>
                <Progress value={((currentItemIndex + 1) / selectedLesson.items.length) * 100} className="mt-6" />
              </CardContent>
            </Card>

            {practiceMode && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    What did you see?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={userGuess}
                      onChange={(e) => setUserGuess(e.target.value)}
                      className="flex-grow p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                      placeholder="Type your guess here..."
                    />
                    <Button onClick={checkGuess}>Submit</Button>
                  </div>
                  {feedback && (
                    <div className={`mt-4 p-3 rounded-md text-white ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {feedback === 'correct' ? 'Correct!' : `Not quite. The answer is "${currentItem.item}".`}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Lessons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {LIP_READING_LESSONS.map((lesson) => (
                  <Button
                    key={lesson.id}
                    variant={selectedLesson.id === lesson.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedLesson(lesson)
                      setCurrentItemIndex(0)
                      setPracticeMode(false)
                      setFeedback(null)
                      setUserGuess("")
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {lesson.title}
                  </Button>
                ))}
              </CardContent>
            </Card>
            <div className="p-4">
              <Button className="w-full" onClick={() => setPracticeMode(!practiceMode)}>
                {practiceMode ? "Stop Practice" : "Start Practice"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LipReading