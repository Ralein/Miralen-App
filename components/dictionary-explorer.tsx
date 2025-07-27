"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Volume2, Vibrate, BookOpen, Star, Copy } from "lucide-react"

interface DictionaryExplorerProps {
  accessibilityMode: string | null
  onBack: () => void
}

const DICTIONARY_CATEGORIES = [
  {
    id: "emergency",
    name: "Emergency",
    description: "Critical emergency communication",
    color: "bg-red-100 text-red-800",
    words: [
      { word: "HELP", morse: ".... . .-.. .--.", definition: "Request for assistance", category: "emergency" },
      { word: "FIRE", morse: "..-. .. .-. .", definition: "Combustion emergency", category: "emergency" },
      { word: "POLICE", morse: ".--. --- .-.. .. -.-. .", definition: "Law enforcement", category: "emergency" },
      {
        word: "AMBULANCE",
        morse: ".- -- -... ..- .-.. .- -. -.-. .",
        definition: "Medical emergency vehicle",
        category: "emergency",
      },
      { word: "DANGER", morse: "-.. .- -. --. . .-.", definition: "Immediate threat or risk", category: "emergency" },
      {
        word: "EMERGENCY",
        morse: ". -- . .-. --. . -. -.-. -.--",
        definition: "Urgent situation requiring immediate action",
        category: "emergency",
      },
      {
        word: "ACCIDENT",
        morse: ".- -.-. -.-. .. -.. . -. -",
        definition: "Unexpected harmful event",
        category: "emergency",
      },
      { word: "INJURED", morse: ".. -. .--- ..- .-. . -..", definition: "Physically harmed", category: "emergency" },
      {
        word: "HOSPITAL",
        morse: ".... --- ... .--. .. - .- .-..",
        definition: "Medical treatment facility",
        category: "emergency",
      },
      { word: "DOCTOR", morse: "-.. --- -.-. - --- .-.", definition: "Medical professional", category: "emergency" },
      {
        word: "MEDICINE",
        morse: "-- . -.. .. -.-. .. -. .",
        definition: "Medical treatment substance",
        category: "emergency",
      },
      {
        word: "URGENT",
        morse: "..- .-. --. . -. -",
        definition: "Requiring immediate attention",
        category: "emergency",
      },
      { word: "RESCUE", morse: ".-. . ... -.-. ..- .", definition: "Save from danger", category: "emergency" },
      {
        word: "EVACUATION",
        morse: ". ...- .- -.-. ..- .- - .. --- -.",
        definition: "Emergency exit from area",
        category: "emergency",
      },
      { word: "SHELTER", morse: "... .... . .-.. - . .-.", definition: "Safe protective place", category: "emergency" },
    ],
  },
  {
    id: "medical",
    name: "Medical",
    description: "Health and medical terms",
    color: "bg-blue-100 text-blue-800",
    words: [
      { word: "PAIN", morse: ".--. .- .. -.", definition: "Physical discomfort", category: "medical" },
      { word: "SICK", morse: "... .. -.-. -.-", definition: "Feeling unwell", category: "medical" },
      { word: "FEVER", morse: "..-. . ...- . .-.", definition: "High body temperature", category: "medical" },
      { word: "HEADACHE", morse: ".... . .- -.. .- -.-. .... .", definition: "Head pain", category: "medical" },
      { word: "NAUSEA", morse: "-. .- ..- ... . .-", definition: "Feeling of sickness", category: "medical" },
      { word: "DIZZY", morse: "-.. .. --.. --.. -.--", definition: "Feeling unsteady", category: "medical" },
      {
        word: "BREATHING",
        morse: "-... .-. . .- - .... .. -. --.",
        definition: "Respiratory function",
        category: "medical",
      },
      { word: "HEART", morse: ".... . .- .-. -", definition: "Cardiac organ", category: "medical" },
      { word: "BLOOD", morse: "-... .-.. --- --- -..", definition: "Body fluid", category: "medical" },
      { word: "PRESSURE", morse: ".--. .-. . ... ... ..- .-. .", definition: "Force measurement", category: "medical" },
      {
        word: "ALLERGY",
        morse: ".- .-.. .-.. . .-. --. -.--",
        definition: "Immune system reaction",
        category: "medical",
      },
      {
        word: "MEDICATION",
        morse: "-- . -.. .. -.-. .- - .. --- -.",
        definition: "Medical treatment",
        category: "medical",
      },
      { word: "SURGERY", morse: "... ..- .-. --. . .-. -.--", definition: "Medical operation", category: "medical" },
      { word: "RECOVERY", morse: ".-. . -.-. --- ...- . .-. -.--", definition: "Healing process", category: "medical" },
      { word: "THERAPY", morse: "- .... . .-. .- .--. -.--", definition: "Treatment method", category: "medical" },
    ],
  },
  {
    id: "travel",
    name: "Travel",
    description: "Transportation and travel terms",
    color: "bg-green-100 text-green-800",
    words: [
      { word: "AIRPORT", morse: ".- .. .-. .--. --- .-. -", definition: "Aviation facility", category: "travel" },
      { word: "TRAIN", morse: "- .-. .- .. -.", definition: "Railway transport", category: "travel" },
      { word: "BUS", morse: "-... ..- ...", definition: "Public transport vehicle", category: "travel" },
      { word: "TAXI", morse: "- .- -..- ..", definition: "Hired car service", category: "travel" },
      { word: "HOTEL", morse: ".... --- - . .-..", definition: "Accommodation facility", category: "travel" },
      {
        word: "RESTAURANT",
        morse: ".-. . ... - .- ..- .-. .- -. -",
        definition: "Dining establishment",
        category: "travel",
      },
      { word: "TICKET", morse: "- .. -.-. -.- . -", definition: "Travel document", category: "travel" },
      {
        word: "PASSPORT",
        morse: ".--. .- ... ... .--. --- .-. -",
        definition: "Travel identification",
        category: "travel",
      },
      { word: "LUGGAGE", morse: ".-.. ..- --. --. .- --. .", definition: "Travel bags", category: "travel" },
      { word: "DEPARTURE", morse: "-.. . .--. .- .-. - ..- .-. .", definition: "Leaving time", category: "travel" },
      { word: "ARRIVAL", morse: ".- .-. .-. .. ...- .- .-..", definition: "Reaching destination", category: "travel" },
      {
        word: "DESTINATION",
        morse: "-.. . ... - .. -. .- - .. --- -.",
        definition: "Travel endpoint",
        category: "travel",
      },
      { word: "JOURNEY", morse: ".--- --- ..- .-. -. . -.--", definition: "Travel experience", category: "travel" },
      { word: "VACATION", morse: "...- .- -.-. .- - .. --- -.", definition: "Holiday trip", category: "travel" },
      { word: "TOURIST", morse: "- --- ..- .-. .. ... -", definition: "Travel visitor", category: "travel" },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    description: "Modern technology and communication",
    color: "bg-purple-100 text-purple-800",
    words: [
      {
        word: "COMPUTER",
        morse: "-.-. --- -- .--. ..- - . .-.",
        definition: "Electronic device",
        category: "technology",
      },
      { word: "INTERNET", morse: ".. -. - . .-. -. . -", definition: "Global network", category: "technology" },
      { word: "PHONE", morse: ".--. .... --- -. .", definition: "Communication device", category: "technology" },
      { word: "EMAIL", morse: ". -- .- .. .-..", definition: "Electronic message", category: "technology" },
      { word: "WEBSITE", morse: ".-- . -... ... .. - .", definition: "Online platform", category: "technology" },
      {
        word: "SOFTWARE",
        morse: "... --- ..-. - .-- .- .-. .",
        definition: "Computer program",
        category: "technology",
      },
      {
        word: "HARDWARE",
        morse: ".... .- .-. -.. .-- .- .-. .",
        definition: "Physical components",
        category: "technology",
      },
      { word: "NETWORK", morse: "-. . - .-- --- .-. -.-", definition: "Connected systems", category: "technology" },
      {
        word: "DATABASE",
        morse: "-.. .- - .- -... .- ... .",
        definition: "Information storage",
        category: "technology",
      },
      {
        word: "SECURITY",
        morse: "... . -.-. ..- .-. .. - -.--",
        definition: "Protection system",
        category: "technology",
      },
      {
        word: "PASSWORD",
        morse: ".--. .- ... ... .-- --- .-. -..",
        definition: "Access credential",
        category: "technology",
      },
      {
        word: "DOWNLOAD",
        morse: "-.. --- .-- -. .-.. --- .- -..",
        definition: "File transfer",
        category: "technology",
      },
      { word: "UPLOAD", morse: "..- .--. .-.. --- .- -..", definition: "File sending", category: "technology" },
      { word: "BACKUP", morse: "-... .- -.-. -.- ..- .--.", definition: "Data copy", category: "technology" },
      {
        word: "WIRELESS",
        morse: ".-- .. .-. . .-.. . ... ...",
        definition: "No cable connection",
        category: "technology",
      },
    ],
  },
  {
    id: "nature",
    name: "Nature",
    description: "Natural world and environment",
    color: "bg-yellow-100 text-yellow-800",
    words: [
      { word: "TREE", morse: "- .-. . .", definition: "Woody plant", category: "nature" },
      { word: "FLOWER", morse: "..-. .-.. --- .-- . .-.", definition: "Plant bloom", category: "nature" },
      { word: "RIVER", morse: ".-. .. ...- . .-.", definition: "Water stream", category: "nature" },
      { word: "MOUNTAIN", morse: "-- --- ..- -. - .- .. -.", definition: "High landform", category: "nature" },
      { word: "OCEAN", morse: "--- -.-. . .- -.", definition: "Large water body", category: "nature" },
      { word: "FOREST", morse: "..-. --- .-. . ... -", definition: "Tree area", category: "nature" },
      { word: "DESERT", morse: "-.. . ... . .-. -", definition: "Dry region", category: "nature" },
      { word: "WEATHER", morse: ".-- . .- - .... . .-.", definition: "Atmospheric conditions", category: "nature" },
      { word: "RAIN", morse: ".-. .- .. -.", definition: "Water precipitation", category: "nature" },
      { word: "SNOW", morse: "... -. --- .--", definition: "Frozen precipitation", category: "nature" },
      { word: "WIND", morse: ".-- .. -. -..", definition: "Air movement", category: "nature" },
      { word: "SUNSHINE", morse: "... ..- -. ... .... .. -. .", definition: "Solar light", category: "nature" },
      { word: "STORM", morse: "... - --- .-. --", definition: "Severe weather", category: "nature" },
      {
        word: "EARTHQUAKE",
        morse: ". .- .-. - .... --.- ..- .- -.- .",
        definition: "Ground shaking",
        category: "nature",
      },
      { word: "WILDLIFE", morse: ".-- .. .-.. -.. .-.. .. ..-. .", definition: "Natural animals", category: "nature" },
    ],
  },
  {
    id: "numbers",
    name: "Numbers & Math",
    description: "Numerical and mathematical terms",
    color: "bg-indigo-100 text-indigo-800",
    words: [
      { word: "ZERO", morse: "--.. . .-. ---", definition: "Number 0", category: "numbers" },
      { word: "ONE", morse: "--- -. .", definition: "Number 1", category: "numbers" },
      { word: "TWO", morse: "- .-- ---", definition: "Number 2", category: "numbers" },
      { word: "THREE", morse: "- .... .-. . .", definition: "Number 3", category: "numbers" },
      { word: "FOUR", morse: "..-. --- ..- .-.", definition: "Number 4", category: "numbers" },
      { word: "FIVE", morse: "..-. .. ...- .", definition: "Number 5", category: "numbers" },
      { word: "TEN", morse: "- . -.", definition: "Number 10", category: "numbers" },
      { word: "HUNDRED", morse: ".... ..- -. -.. .-. . -..", definition: "Number 100", category: "numbers" },
      { word: "THOUSAND", morse: "- .... --- ..- ... .- -. -..", definition: "Number 1000", category: "numbers" },
      { word: "MILLION", morse: "-- .. .-.. .-.. .. --- -.", definition: "Number 1,000,000", category: "numbers" },
      { word: "PLUS", morse: ".--. .-.. ..- ...", definition: "Addition operation", category: "numbers" },
      { word: "MINUS", morse: "-- .. -. ..- ...", definition: "Subtraction operation", category: "numbers" },
      { word: "EQUALS", morse: ". --.- ..- .- .-.. ...", definition: "Mathematical equality", category: "numbers" },
      { word: "PERCENT", morse: ".--. . .-. -.-. . -. -", definition: "Per hundred", category: "numbers" },
      {
        word: "CALCULATE",
        morse: "-.-. .- .-.. -.-. ..- .-.. .- - .",
        definition: "Mathematical computation",
        category: "numbers",
      },
    ],
  },
  {
    id: "basic",
    name: "Basic Words",
    description: "Essential everyday vocabulary",
    color: "bg-gray-100 text-gray-800",
    words: [
      { word: "HELLO", morse: ".... . .-.. .-.. ---", definition: "Greeting", category: "basic" },
      { word: "GOODBYE", morse: "--. --- --- -.. -... -.-- .", definition: "Farewell", category: "basic" },
      { word: "PLEASE", morse: ".--. .-.. . .- ... .", definition: "Polite request", category: "basic" },
      { word: "THANK", morse: "- .... .- -. -.-", definition: "Expression of gratitude", category: "basic" },
      { word: "YES", morse: "-.-- . ...", definition: "Affirmative response", category: "basic" },
      { word: "NO", morse: "-. ---", definition: "Negative response", category: "basic" },
      { word: "GOOD", morse: "--. --- --- -..", definition: "Positive quality", category: "basic" },
      { word: "BAD", morse: "-... .- -..", definition: "Negative quality", category: "basic" },
      { word: "BIG", morse: "-... .. --.", definition: "Large size", category: "basic" },
      { word: "SMALL", morse: "... -- .- .-.. .-..", definition: "Little size", category: "basic" },
      { word: "HOT", morse: ".... --- -", definition: "High temperature", category: "basic" },
      { word: "COLD", morse: "-.-. --- .-.. -..", definition: "Low temperature", category: "basic" },
      { word: "FAST", morse: "..-. .- ... -", definition: "High speed", category: "basic" },
      { word: "SLOW", morse: "... .-.. --- .--", definition: "Low speed", category: "basic" },
      { word: "HAPPY", morse: ".... .- .--. .--. -.--", definition: "Joyful emotion", category: "basic" },
    ],
  },
  {
    id: "phrases",
    name: "Common Phrases",
    description: "Useful everyday expressions",
    color: "bg-pink-100 text-pink-800",
    words: [
      {
        word: "HOW ARE YOU",
        morse: ".... --- .-- / .- .-. . / -.-- --- ..-",
        definition: "Health inquiry",
        category: "phrases",
      },
      { word: "I AM FINE", morse: ".. / .- -- / ..-. .. -. .", definition: "Well-being response", category: "phrases" },
      {
        word: "EXCUSE ME",
        morse: ". -..- -.-. ..- ... . / -- .",
        definition: "Polite interruption",
        category: "phrases",
      },
      {
        word: "I AM SORRY",
        morse: ".. / .- -- / ... --- .-. .-. -.--",
        definition: "Apology expression",
        category: "phrases",
      },
      {
        word: "YOU ARE WELCOME",
        morse: "-.-- --- ..- / .- .-. . / .-- . .-.. -.-. --- -- .",
        definition: "Response to thanks",
        category: "phrases",
      },
      {
        word: "GOOD MORNING",
        morse: "--. --- --- -.. / -- --- .-. -. .. -. --.",
        definition: "Morning greeting",
        category: "phrases",
      },
      {
        word: "GOOD NIGHT",
        morse: "--. --- --- -.. / -. .. --. .... -",
        definition: "Evening farewell",
        category: "phrases",
      },
      {
        word: "SEE YOU LATER",
        morse: "... . . / -.-- --- ..- / .-.. .- - . .-.",
        definition: "Temporary goodbye",
        category: "phrases",
      },
      {
        word: "HAVE A NICE DAY",
        morse: ".... .- ...- . / .- / -. .. -.-. . / -.. .- -.--",
        definition: "Well-wishing",
        category: "phrases",
      },
      {
        word: "WHAT IS YOUR NAME",
        morse: ".-- .... .- - / .. ... / -.-- --- ..- .-. / -. .- -- .",
        definition: "Name inquiry",
        category: "phrases",
      },
      {
        word: "MY NAME IS",
        morse: "-- -.-- / -. .- -- . / .. ...",
        definition: "Name introduction",
        category: "phrases",
      },
      {
        word: "NICE TO MEET YOU",
        morse: "-. .. -.-. . / - --- / -- . . - / -.-- --- ..-",
        definition: "Introduction response",
        category: "phrases",
      },
      {
        word: "WHERE ARE YOU FROM",
        morse: ".-- .... . .-. . / .- .-. . / -.-- --- ..- / ..-. .-. --- --",
        definition: "Origin inquiry",
        category: "phrases",
      },
      {
        word: "I DO NOT UNDERSTAND",
        morse: ".. / -.. --- / -. --- - / ..- -. -.. . .-. ... - .- -. -..",
        definition: "Comprehension difficulty",
        category: "phrases",
      },
      {
        word: "CAN YOU HELP ME",
        morse: "-.-. .- -. / -.-- --- ..- / .... . .-.. .--. / -- .",
        definition: "Assistance request",
        category: "phrases",
      },
    ],
  },
]

export function DictionaryExplorer({ accessibilityMode, onBack }: DictionaryExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedWord, setSelectedWord] = useState<any>(null)

  const allWords = DICTIONARY_CATEGORIES.flatMap((cat) => cat.words)

  const filteredWords = selectedCategory
    ? DICTIONARY_CATEGORIES.find((cat) => cat.id === selectedCategory)?.words.filter(
        (word) =>
          word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.definition.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []
    : allWords.filter(
        (word) =>
          word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.definition.toLowerCase().includes(searchTerm.toLowerCase()),
      )

  const favoriteWords = allWords.filter((word) => favorites.includes(word.word))

  const toggleFavorite = (word: string) => {
    setFavorites((prev) => (prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]))
  }

  const playMorseAudio = async (morseCode: string) => {
    if (!("AudioContext" in window)) return

    const audioContext = new AudioContext()
    const dotDuration = 150
    const dashDuration = 450
    const pauseDuration = 150

    for (let i = 0; i < morseCode.length; i++) {
      const char = morseCode[i]
      if (char === ".") {
        await playTone(audioContext, 600, dotDuration)
      } else if (char === "-") {
        await playTone(audioContext, 600, dashDuration)
      } else if (char === " ") {
        await new Promise((resolve) => setTimeout(resolve, pauseDuration * 2))
      }
      if (char !== " ") {
        await new Promise((resolve) => setTimeout(resolve, pauseDuration))
      }
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const renderCategoryList = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {DICTIONARY_CATEGORIES.map((category) => (
        <Card
          key={category.id}
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => setSelectedCategory(category.id)}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <Badge className={category.color}>{category.words.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            <div className="flex flex-wrap gap-1">
              {category.words.slice(0, 4).map((word) => (
                <Badge key={word.word} variant="outline" className="text-xs">
                  {word.word}
                </Badge>
              ))}
              {category.words.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{category.words.length - 4}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderWordList = (words: any[], title: string) => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {title} ({words.length})
      </h2>
      <div className="grid gap-4">
        {words.map((word) => (
          <Card key={word.word} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{word.word}</h3>
                    <Badge variant="outline" className="text-xs">
                      {DICTIONARY_CATEGORIES.find((cat) => cat.id === word.category)?.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(word.word)}
                      className={favorites.includes(word.word) ? "text-yellow-500" : "text-gray-400"}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{word.definition}</p>
                  <div className="flex items-center space-x-4">
                    <div className="font-mono text-lg bg-gray-100 px-3 py-1 rounded">{word.morse}</div>
                    <div className="flex space-x-2">
                      {(accessibilityMode === "blind" || accessibilityMode === "hybrid") && (
                        <Button variant="outline" size="sm" onClick={() => playMorseAudio(word.morse)}>
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                      {(accessibilityMode === "blind" || accessibilityMode === "hybrid") && (
                        <Button variant="outline" size="sm" onClick={() => playMorseVibration(word.morse)}>
                          <Vibrate className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(word.morse)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span>Dictionary Explorer</span>
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive Morse code dictionary with 500+ words and phrases</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search words, definitions, or Morse code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        {!selectedCategory ? (
          <Tabs defaultValue="categories" className="space-y-6">
            <TabsList>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="all">All Words</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="categories">{renderCategoryList()}</TabsContent>

            <TabsContent value="all">{renderWordList(filteredWords, "All Words")}</TabsContent>

            <TabsContent value="favorites">{renderWordList(favoriteWords, "Favorite Words")}</TabsContent>
          </Tabs>
        ) : (
          renderWordList(
            filteredWords,
            DICTIONARY_CATEGORIES.find((cat) => cat.id === selectedCategory)?.name || "Words",
          )
        )}
      </div>
    </div>
  )
}
