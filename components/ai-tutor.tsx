"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, MessageSquare, Send, Bot, User, Lightbulb, TrendingUp, BookOpen, Target } from "lucide-react"

interface AITutorProps {
  accessibilityMode: string | null
  onBack: () => void
}

const SAMPLE_CONVERSATIONS = [
  {
    type: "bot",
    message:
      "Hello! I'm your personal Morse code tutor. I've analyzed your progress and noticed you're doing great with letters A-E. Ready to tackle some new challenges?",
  },
  {
    type: "user",
    message: "Yes, I'd like to learn more letters!",
  },
  {
    type: "bot",
    message:
      "Perfect! Based on your learning pattern, I recommend starting with letters F, G, and H. They build nicely on what you already know. Would you like me to create a personalized lesson plan?",
  },
]

const LEARNING_INSIGHTS = [
  {
    title: "Strong Areas",
    items: ["Letters A-E mastered", "Good rhythm with dots", "Consistent practice streak"],
    color: "green",
  },
  {
    title: "Areas to Improve",
    items: ["Dash timing needs work", "Letter spacing in words", "Numbers practice needed"],
    color: "orange",
  },
  {
    title: "Recommendations",
    items: ["Practice 15 minutes daily", "Focus on letters F-J next", "Try the memory game"],
    color: "blue",
  },
]

export function AITutor({ accessibilityMode, onBack }: AITutorProps) {
  const [messages, setMessages] = useState(SAMPLE_CONVERSATIONS)
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const newUserMessage = {
      type: "user" as const,
      message: inputMessage,
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that. Based on your current level, I'd suggest focusing on consistent timing between dots and dashes.",
        "I understand you're finding that challenging. Many learners struggle with this at first. Let's break it down into smaller steps.",
        "Excellent progress! You're really getting the hang of this. Ready for the next challenge?",
        "I notice you're having trouble with longer sequences. Try practicing with shorter patterns first, then gradually increase the length.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          message: randomResponse,
        },
      ])
      setIsTyping(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-6 hover:bg-white/80 backdrop-blur-sm shadow-md">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Learning Tutor</h1>
            <p className="text-muted-foreground mt-2">Your personalized Morse code learning assistant</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-blue-600" />
                  Chat with Your AI Tutor
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.type === "user" ? "bg-blue-600 text-white" : "bg-muted text-foreground"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.type === "bot" && <Bot className="w-4 h-4 mt-1 text-blue-600" />}
                          {msg.type === "user" && <User className="w-4 h-4 mt-1 text-white" />}
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-foreground p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about Morse code..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!inputMessage.trim() || isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Analytics */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Mastery</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Letters (A-Z)</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Numbers (0-9)</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Speed (WPM)</span>
                      <span>12/20</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {LEARNING_INSIGHTS.map((insight, index) => (
                    <div key={index}>
                      <h4 className={`font-semibold text-${insight.color}-700 mb-2`}>{insight.title}</h4>
                      <ul className="space-y-1">
                        {insight.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600 flex items-start">
                            <div className={`w-2 h-2 bg-${insight.color}-500 rounded-full mr-2 mt-2 flex-shrink-0`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Practice Letters F-J
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Target className="w-4 h-4 mr-2" />
                    Speed Challenge
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Review Weak Areas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Study Streak */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">7</div>
                <div className="text-sm text-gray-600">Day Study Streak</div>
                <div className="text-xs text-gray-500 mt-1">Keep it up!</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
