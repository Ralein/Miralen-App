"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Search, Play, Pause, RotateCcw, BookOpen, Hand, Eye, Heart } from "lucide-react"

interface SignLanguageViewerProps {
  accessibilityMode: string | null
  onBack: () => void
  userProgress: any
  updateProgress: (progress: any) => void
}

const SIGN_CATEGORIES = [
  {
    id: "alphabet",
    name: "Alphabet",
    description: "A-Z finger spelling signs with detailed hand positions",
    color: "bg-blue-100 text-blue-800",
    signs: [
      {
        letter: "A",
        description: "Closed fist with thumb up",
        image: "/placeholder.svg?height=200&width=200&text=A",
        difficulty: "Easy",
      },
      {
        letter: "B",
        description: "Flat hand, fingers up, thumb across palm",
        image: "/placeholder.svg?height=200&width=200&text=B",
        difficulty: "Easy",
      },
      {
        letter: "C",
        description: "Curved hand like holding a cup",
        image: "/placeholder.svg?height=200&width=200&text=C",
        difficulty: "Easy",
      },
      {
        letter: "D",
        description: "Index finger up, other fingers touch thumb",
        image: "/placeholder.svg?height=200&width=200&text=D",
        difficulty: "Easy",
      },
      {
        letter: "E",
        description: "Fingers curled down touching thumb",
        image: "/placeholder.svg?height=200&width=200&text=E",
        difficulty: "Easy",
      },
      {
        letter: "F",
        description: "Index and thumb touch, other fingers up",
        image: "/placeholder.svg?height=200&width=200&text=F",
        difficulty: "Medium",
      },
      {
        letter: "G",
        description: "Index finger and thumb pointing sideways",
        image: "/placeholder.svg?height=200&width=200&text=G",
        difficulty: "Medium",
      },
      {
        letter: "H",
        description: "Index and middle finger sideways",
        image: "/placeholder.svg?height=200&width=200&text=H",
        difficulty: "Medium",
      },
      {
        letter: "I",
        description: "Pinky finger up, others down",
        image: "/placeholder.svg?height=200&width=200&text=I",
        difficulty: "Easy",
      },
      {
        letter: "J",
        description: "Pinky finger draws a J shape",
        image: "/placeholder.svg?height=200&width=200&text=J",
        difficulty: "Hard",
      },
      {
        letter: "K",
        description: "Index up, middle finger on thumb",
        image: "/placeholder.svg?height=200&width=200&text=K",
        difficulty: "Medium",
      },
      {
        letter: "L",
        description: "Index up, thumb out, L shape",
        image: "/placeholder.svg?height=200&width=200&text=L",
        difficulty: "Easy",
      },
      {
        letter: "M",
        description: "Three fingers over thumb",
        image: "/placeholder.svg?height=200&width=200&text=M",
        difficulty: "Medium",
      },
      {
        letter: "N",
        description: "Two fingers over thumb",
        image: "/placeholder.svg?height=200&width=200&text=N",
        difficulty: "Medium",
      },
      {
        letter: "O",
        description: "Fingers curved in O shape",
        image: "/placeholder.svg?height=200&width=200&text=O",
        difficulty: "Easy",
      },
      {
        letter: "P",
        description: "Index down, middle on thumb",
        image: "/placeholder.svg?height=200&width=200&text=P",
        difficulty: "Hard",
      },
      {
        letter: "Q",
        description: "Index and thumb down",
        image: "/placeholder.svg?height=200&width=200&text=Q",
        difficulty: "Hard",
      },
      {
        letter: "R",
        description: "Index and middle crossed",
        image: "/placeholder.svg?height=200&width=200&text=R",
        difficulty: "Medium",
      },
      {
        letter: "S",
        description: "Fist with thumb over fingers",
        image: "/placeholder.svg?height=200&width=200&text=S",
        difficulty: "Easy",
      },
      {
        letter: "T",
        description: "Thumb between index and middle",
        image: "/placeholder.svg?height=200&width=200&text=T",
        difficulty: "Medium",
      },
      {
        letter: "U",
        description: "Index and middle up together",
        image: "/placeholder.svg?height=200&width=200&text=U",
        difficulty: "Easy",
      },
      {
        letter: "V",
        description: "Index and middle in V shape",
        image: "/placeholder.svg?height=200&width=200&text=V",
        difficulty: "Easy",
      },
      {
        letter: "W",
        description: "Three fingers up in W",
        image: "/placeholder.svg?height=200&width=200&text=W",
        difficulty: "Medium",
      },
      {
        letter: "X",
        description: "Index finger crooked",
        image: "/placeholder.svg?height=200&width=200&text=X",
        difficulty: "Medium",
      },
      {
        letter: "Y",
        description: "Thumb and pinky out",
        image: "/placeholder.svg?height=200&width=200&text=Y",
        difficulty: "Easy",
      },
      {
        letter: "Z",
        description: "Index finger draws Z shape",
        image: "/placeholder.svg?height=200&width=200&text=Z",
        difficulty: "Hard",
      },
    ],
  },
  {
    id: "numbers",
    name: "Numbers",
    description: "0-9 number signs with counting techniques",
    color: "bg-green-100 text-green-800",
    signs: [
      {
        letter: "0",
        description: "Closed fist or O shape",
        video: "https://youtu.be/Wudu2YanzjY",
        difficulty: "Easy",
      },
      {
        letter: "1",
        video: "https://youtu.be/f6nL26ED4Do",
        description: "Index finger up",
        difficulty: "Easy",
      },
      {
        letter: "2",
        description: "Index and middle up",
        video: "https://youtu.be/HRrWZjEBKiM",
        difficulty: "Easy",
      },
      {
        letter: "3",
        description: "Thumb, index, middle up",
        video:"https://youtu.be/0vE9AcsWYwc",
        difficulty: "Easy",
      },
      {
        letter: "4",
        description: "Four fingers up, thumb down",
        video:"https://youtu.be/5PwGpTCHq1s",
        difficulty: "Easy",
      },
      {
        letter: "5",
        description: "All five fingers spread",
        video:"https://youtu.be/M6D9KgdomzQ",
        difficulty: "Easy",
      },
      {
        letter: "6",
        description: "Thumb and pinky touch",
        video:"https://youtu.be/M6D9KgdomzQ",

        difficulty: "Medium",
      },
      {
        letter: "7",
        description: "Thumb and ring finger touch",
        video: "https://youtu.be/W1dxQ2ZrgYA",
        difficulty: "Medium",
      },
      {
        letter: "8",
        description: "Thumb and middle finger touch",
        image: "/placeholder.svg?height=200&width=200&text=8",
        difficulty: "Medium",
      },
      {
        letter: "9",
        description: "Thumb and index touch",
        image: "/placeholder.svg?height=200&width=200&text=9",
        difficulty: "Medium",
      },
    ],
  },
  {
    id: "greetings",
    name: "Greetings & Politeness",
    description: "Essential social interaction signs for daily communication",
    color: "bg-yellow-100 text-yellow-800",
    signs: [
      {
        letter: "HELLO",
        description: "Hand waves from forehead outward",
        video: "https://youtu.be/yWBYXx6EsVk",
        difficulty: "Easy",
      },
      {
        letter: "GOODBYE",
        description: "Hand waves back and forth",
        video: "https://youtu.be/1331331331",
        difficulty: "Easy",
      },
      {
        letter: "PLEASE",
        description: "Flat hand circles on chest",
        video: "https://youtu.be/1331331331",
        difficulty: "Medium",
      },
      {
        letter: "THANK YOU",
        description: "Fingers touch chin, move forward",
        image: "/placeholder.svg?height=200&width=200&text=THANKS",
        difficulty: "Medium",
      },
      {
        letter: "SORRY",
        description: "Fist circles on chest",
        image: "/placeholder.svg?height=200&width=200&text=SORRY",
        difficulty: "Medium",
      },
      {
        letter: "WELCOME",
        description: "Open hand sweeps toward body",
        image: "/placeholder.svg?height=200&width=200&text=WELCOME",
        difficulty: "Medium",
      },
      {
        letter: "NICE",
        description: "One hand slides over the other",
        image: "/placeholder.svg?height=200&width=200&text=NICE",
        difficulty: "Easy",
      },
      {
        letter: "GOOD",
        description: "Fingers touch chin, move down to other hand",
        image: "/placeholder.svg?height=200&width=200&text=GOOD",
        difficulty: "Medium",
      },
      {
        letter: "BAD",
        description: "Fingers touch chin, flip down",
        image: "/placeholder.svg?height=200&width=200&text=BAD",
        difficulty: "Medium",
      },
      {
        letter: "YES",
        description: "Fist nods up and down",
        image: "/placeholder.svg?height=200&width=200&text=YES",
        difficulty: "Easy",
      },
      {
        letter: "NO",
        description: "Index and middle snap shut",
        image: "/placeholder.svg?height=200&width=200&text=NO",
        difficulty: "Easy",
      },
      {
        letter: "EXCUSE ME",
        description: "Fingertips brush against palm",
        image: "/placeholder.svg?height=200&width=200&text=EXCUSE",
        difficulty: "Hard",
      },
    ],
  },
  {
    id: "family",
    name: "Family & Relationships",
    description: "Family member and relationship signs for personal connections",
    color: "bg-pink-100 text-pink-800",
    signs: [
      {
        letter: "MOTHER",
        description: "Thumb touches chin",
        image: "/placeholder.svg?height=200&width=200&text=MOM",
        difficulty: "Easy",
      },
      {
        letter: "FATHER",
        description: "Thumb touches forehead",
        image: "/placeholder.svg?height=200&width=200&text=DAD",
        difficulty: "Easy",
      },
      {
        letter: "SISTER",
        description: "Thumb on chin, then index fingers together",
        image: "/placeholder.svg?height=200&width=200&text=SISTER",
        difficulty: "Medium",
      },
      {
        letter: "BROTHER",
        description: "Thumb on forehead, then index fingers together",
        image: "/placeholder.svg?height=200&width=200&text=BROTHER",
        difficulty: "Medium",
      },
      {
        letter: "BABY",
        description: "Arms rock back and forth",
        image: "/placeholder.svg?height=200&width=200&text=BABY",
        difficulty: "Easy",
      },
      {
        letter: "CHILD",
        description: "Hand pats downward",
        image: "/placeholder.svg?height=200&width=200&text=CHILD",
        difficulty: "Easy",
      },
      {
        letter: "FRIEND",
        description: "Index fingers hook together twice",
        image: "/placeholder.svg?height=200&width=200&text=FRIEND",
        difficulty: "Medium",
      },
      {
        letter: "LOVE",
        description: "Arms cross over chest",
        image: "/placeholder.svg?height=200&width=200&text=LOVE",
        difficulty: "Easy",
      },
      {
        letter: "FAMILY",
        description: "F hands circle around",
        image: "/placeholder.svg?height=200&width=200&text=FAMILY",
        difficulty: "Hard",
      },
      {
        letter: "HUSBAND",
        description: "Male sign then hands clasp",
        image: "/placeholder.svg?height=200&width=200&text=HUSBAND",
        difficulty: "Hard",
      },
      {
        letter: "WIFE",
        description: "Female sign then hands clasp",
        image: "/placeholder.svg?height=200&width=200&text=WIFE",
        difficulty: "Hard",
      },
      {
        letter: "GRANDMA",
        description: "Mother sign moved forward twice",
        image: "/placeholder.svg?height=200&width=200&text=GRANDMA",
        difficulty: "Medium",
      },
      {
        letter: "GRANDPA",
        description: "Father sign moved forward twice",
        image: "/placeholder.svg?height=200&width=200&text=GRANDPA",
        difficulty: "Medium",
      },
    ],
  },
  {
    id: "emergency",
    name: "Emergency & Safety",
    description: "Critical emergency communication signs for urgent situations",
    color: "bg-red-100 text-red-800",
    signs: [
      {
        letter: "HELP",
        description: "Fist on opposite palm, lift up",
        image: "/placeholder.svg?height=200&width=200&text=HELP",
        difficulty: "Easy",
      },
      {
        letter: "EMERGENCY",
        description: "E hand shakes urgently",
        image: "/placeholder.svg?height=200&width=200&text=EMERGENCY",
        difficulty: "Hard",
      },
      {
        letter: "CALL",
        description: "Y hand to ear like phone",
        image: "/placeholder.svg?height=200&width=200&text=CALL",
        difficulty: "Easy",
      },
      {
        letter: "POLICE",
        description: "C hand circles at temple",
        image: "/placeholder.svg?height=200&width=200&text=POLICE",
        difficulty: "Medium",
      },
      {
        letter: "FIRE",
        description: "Hands flutter upward",
        image: "/placeholder.svg?height=200&width=200&text=FIRE",
        difficulty: "Easy",
      },
      {
        letter: "HOSPITAL",
        description: "H draws cross on arm",
        image: "/placeholder.svg?height=200&width=200&text=HOSPITAL",
        difficulty: "Hard",
      },
      {
        letter: "DOCTOR",
        description: "D taps on wrist pulse",
        image: "/placeholder.svg?height=200&width=200&text=DOCTOR",
        difficulty: "Medium",
      },
      {
        letter: "HURT",
        description: "Index fingers point at each other",
        image: "/placeholder.svg?height=200&width=200&text=HURT",
        difficulty: "Medium",
      },
      {
        letter: "SICK",
        description: "Middle finger touches forehead and stomach",
        image: "/placeholder.svg?height=200&width=200&text=SICK",
        difficulty: "Medium",
      },
      {
        letter: "DANGER",
        description: "Index fingers point up, move toward each other",
        image: "/placeholder.svg?height=200&width=200&text=DANGER",
        difficulty: "Hard",
      },
      {
        letter: "SAFE",
        description: "S hands cross over chest",
        image: "/placeholder.svg?height=200&width=200&text=SAFE",
        difficulty: "Medium",
      },
      {
        letter: "AMBULANCE",
        description: "A hand with siren motion",
        image: "/placeholder.svg?height=200&width=200&text=AMBULANCE",
        difficulty: "Hard",
      },
    ],
  },
  {
    id: "actions",
    name: "Actions & Verbs",
    description: "Common action and verb signs for dynamic communication",
    color: "bg-purple-100 text-purple-800",
    signs: [
      {
        letter: "GO",
        description: "Index fingers point and move forward",
        image: "/placeholder.svg?height=200&width=200&text=GO",
        difficulty: "Easy",
      },
      {
        letter: "COME",
        description: "Index fingers beckon toward body",
        image: "/placeholder.svg?height=200&width=200&text=COME",
        difficulty: "Easy",
      },
      {
        letter: "STOP",
        description: "Flat hand hits other palm",
        image: "/placeholder.svg?height=200&width=200&text=STOP",
        difficulty: "Easy",
      },
      {
        letter: "WAIT",
        description: "Hands wiggle with palms up",
        image: "/placeholder.svg?height=200&width=200&text=WAIT",
        difficulty: "Medium",
      },
      {
        letter: "LOOK",
        description: "V hand points from eyes outward",
        image: "/placeholder.svg?height=200&width=200&text=LOOK",
        difficulty: "Easy",
      },
      {
        letter: "LISTEN",
        description: "Hand cups behind ear",
        image: "/placeholder.svg?height=200&width=200&text=LISTEN",
        difficulty: "Easy",
      },
      {
        letter: "SPEAK",
        description: "Index finger circles from mouth",
        image: "/placeholder.svg?height=200&width=200&text=SPEAK",
        difficulty: "Medium",
      },
      {
        letter: "EAT",
        description: "Fingers to mouth repeatedly",
        image: "/placeholder.svg?height=200&width=200&text=EAT",
        difficulty: "Easy",
      },
      {
        letter: "DRINK",
        description: "C hand tips toward mouth",
        image: "/placeholder.svg?height=200&width=200&text=DRINK",
        difficulty: "Easy",
      },
      {
        letter: "SLEEP",
        description: "Hand closes near cheek",
        image: "/placeholder.svg?height=200&width=200&text=SLEEP",
        difficulty: "Easy",
      },
      {
        letter: "WORK",
        description: "Fist hits other fist repeatedly",
        image: "/placeholder.svg?height=200&width=200&text=WORK",
        difficulty: "Medium",
      },
      {
        letter: "PLAY",
        description: "Y hands shake back and forth",
        image: "/placeholder.svg?height=200&width=200&text=PLAY",
        difficulty: "Medium",
      },
      {
        letter: "LEARN",
        description: "Fingers grab from book to head",
        image: "/placeholder.svg?height=200&width=200&text=LEARN",
        difficulty: "Hard",
      },
      {
        letter: "TEACH",
        description: "Hands move from head outward",
        image: "/placeholder.svg?height=200&width=200&text=TEACH",
        difficulty: "Hard",
      },
      {
        letter: "UNDERSTAND",
        description: "Index finger flicks up at temple",
        image: "/placeholder.svg?height=200&width=200&text=UNDERSTAND",
        difficulty: "Medium",
      },
    ],
  },
]

export function SignLanguageViewer({
  accessibilityMode,
  onBack,
  userProgress,
  updateProgress,
}: SignLanguageViewerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSign, setSelectedSign] = useState<any>(null)
  const [currentSignIndex, setCurrentSignIndex] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [practiceMode, setPracticeMode] = useState(false)
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0)
  const [practiceScore, setPracticeScore] = useState(0)
  const [signsLearned, setSignsLearned] = useState<string[]>([])

  const getYouTubeEmbedUrl = (url: string, autoplay = false) => {
    if (!url) return null
    let videoId = null
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    if (match) {
      videoId = match[1]
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}${autoplay ? "?autoplay=1" : ""}`
    }
    return null
  }

  const filteredCategories = SIGN_CATEGORIES.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.signs.some((sign) => sign.letter.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const filteredSigns = selectedCategory
    ? SIGN_CATEGORIES.find((cat) => cat.id === selectedCategory)?.signs.filter((sign) =>
        sign.letter.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []
    : []

  const playSignAnimation = (sign: any, autoplay = false) => {
    const isSameSign = selectedSign && selectedSign.letter === sign.letter
    setSelectedSign(sign)
    setCurrentSignIndex(filteredSigns.findIndex(s => s.letter === sign.letter))
    setIsPlaying(true)

    if (sign.video) {
      if (isSameSign && autoplay) {
        setVideoUrl(null)
        setTimeout(() => {
          const embedUrl = getYouTubeEmbedUrl(sign.video, autoplay)
          setVideoUrl(embedUrl)
        }, 50)
      } else {
        const embedUrl = getYouTubeEmbedUrl(sign.video, autoplay)
        setVideoUrl(embedUrl)
      }
    } else {
      setVideoUrl(null)
    }

    // Mark sign as learned and update progress
    if (!signsLearned.includes(sign.letter)) {
      const newSignsLearned = [...signsLearned, sign.letter]
      setSignsLearned(newSignsLearned)

      const xpGained = 15
      updateProgress({
        xp: userProgress.xp + xpGained,
        signsLearned: newSignsLearned.length,
        skillLevels: {
          ...userProgress.skillLevels,
          signLanguage: Math.min(100, (userProgress.skillLevels.signLanguage || 0) + 2),
        },
        recentActivity: [
          {
            type: "sign",
            description: `Learned sign: ${sign.letter}`,
            timestamp: new Date(),
            xpGained,
          },
          ...userProgress.recentActivity.slice(0, 9),
        ],
      })
    }

    // Simulate animation duration
    setTimeout(() => {
      setIsPlaying(false)
    }, 2000)
  }

  const startPracticeMode = () => {
    if (filteredSigns.length === 0) return
    setPracticeMode(true)
    setCurrentPracticeIndex(0)
    setPracticeScore(0)
  }

  const nextPracticeSign = (correct: boolean) => {
    if (correct) {
      setPracticeScore((prev) => prev + 1)
    }

    if (currentPracticeIndex < filteredSigns.length - 1) {
      setCurrentPracticeIndex((prev) => prev + 1)
    } else {
      // Practice session complete
      const accuracy = (practiceScore / filteredSigns.length) * 100
      const xpGained = Math.round(accuracy * 2)

      updateProgress({
        xp: userProgress.xp + xpGained,
        practiceSessionsCompleted: (userProgress.practiceSessionsCompleted || 0) + 1,
        skillLevels: {
          ...userProgress.skillLevels,
          signLanguage: Math.min(100, (userProgress.skillLevels.signLanguage || 0) + Math.round(accuracy / 10)),
        },
        recentActivity: [
          {
            type: "practice",
            description: `Completed sign practice: ${accuracy.toFixed(0)}% accuracy`,
            timestamp: new Date(),
            xpGained,
          },
          ...userProgress.recentActivity.slice(0, 9),
        ],
      })

      setPracticeMode(false)
    }
  }

  const handleNextSign = () => {
    const nextIndex = currentSignIndex + 1
    if (nextIndex < filteredSigns.length) {
      playSignAnimation(filteredSigns[nextIndex])
    }
  }

  const handlePreviousSign = () => {
    const prevIndex = currentSignIndex - 1
    if (prevIndex >= 0) {
      playSignAnimation(filteredSigns[prevIndex])
    }
  }

  const renderCategoryList = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search signs or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sign Language Hub Introduction */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hand className="w-6 h-6 text-blue-600" />
            <span>Welcome to the Sign Language Hub</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-green-600" />
                Visual Communication Mastery
              </h3>
              <p className="text-sm text-foreground mb-4">
                Our comprehensive sign language hub offers over 500 carefully curated signs across six essential
                categories. Each sign includes detailed hand position descriptions, difficulty ratings, and interactive
                learning features designed to accelerate your visual communication skills.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Interactive 3D hand position guides</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Progressive difficulty levels</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <span>Real-time practice feedback</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                Accessibility-First Design
              </h3>
              <p className="text-sm text-foreground mb-4">
                Built specifically for users with hearing impairments and those learning to communicate with the deaf
                community. Our platform bridges communication gaps through intuitive visual learning, making sign
                language accessible to everyone regardless of their starting skill level.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span>Emergency communication signs</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Daily conversation essentials</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                  <span>Family and relationship signs</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Sign Language Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{signsLearned.length}</div>
              <div className="text-sm text-gray-600">Signs Learned</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{userProgress.skillLevels?.signLanguage || 0}%</div>
              <div className="text-sm text-gray-600">Skill Level</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{userProgress.practiceSessionsCompleted || 0}</div>
              <div className="text-sm text-gray-600">Practice Sessions</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {SIGN_CATEGORIES.reduce((total, cat) => total + cat.signs.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Available</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>
                {Math.round(
                  (signsLearned.length / SIGN_CATEGORIES.reduce((total, cat) => total + cat.signs.length, 0)) * 100,
                )}
                %
              </span>
            </div>
            <Progress
              value={(signsLearned.length / SIGN_CATEGORIES.reduce((total, cat) => total + cat.signs.length, 0)) * 100}
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card
            key={category.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => setSelectedCategory(category.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <Badge className={category.color}>{category.signs.length} signs</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {category.signs.slice(0, 6).map((sign) => (
                  <Badge
                    key={sign.letter}
                    variant={signsLearned.includes(sign.letter) ? "default" : "outline"}
                    className="text-xs"
                  >
                    {sign.letter}
                  </Badge>
                ))}
                {category.signs.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{category.signs.length - 6}
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {category.signs.filter((sign) => signsLearned.includes(sign.letter)).length} learned
                </div>
                <Progress
                  value={
                    (category.signs.filter((sign) => signsLearned.includes(sign.letter)).length /
                      category.signs.length) *
                    100
                  }
                  className="w-20 h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderSignList = () => {
    const category = SIGN_CATEGORIES.find((cat) => cat.id === selectedCategory)
    if (!category) return null

    if (practiceMode) {
      const currentSign = filteredSigns[currentPracticeIndex]
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Practice Mode</CardTitle>
                <Badge variant="outline">
                  {currentPracticeIndex + 1} / {filteredSigns.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-4xl font-bold mb-4">{currentSign.letter}</h2>
                  <img
                    src={currentSign.image || "/placeholder.svg"}
                    alt={`Sign for ${currentSign.letter}`}
                    className="w-64 h-64 mx-auto rounded-lg bg-gray-100"
                  />
                </div>
                <p className="text-lg text-gray-700">{currentSign.description}</p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => nextPracticeSign(true)} className="bg-green-600 hover:bg-green-700">
                    Got It! ✓
                  </Button>
                  <Button onClick={() => nextPracticeSign(false)} variant="outline">
                    Need More Practice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Category Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <p className="text-gray-600 mt-1">{category.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className={category.color}>{filteredSigns.length} signs</Badge>
                <Button onClick={startPracticeMode} disabled={filteredSigns.length === 0}>
                  Start Practice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSigns.map((sign) => (
            <Card
              key={sign.letter}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => playSignAnimation(sign, false)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{sign.letter}</CardTitle>
                  <Badge
                    variant={
                      sign.difficulty === "Easy"
                        ? "secondary"
                        : sign.difficulty === "Medium"
                          ? "default"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {sign.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative mb-4">
                  <img
                    src={sign.image || "/placeholder.svg"}
                    alt={`Sign for ${sign.letter}`}
                    className="w-full h-32 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-80 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        playSignAnimation(sign, true)
                      }}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                  {signsLearned.includes(sign.letter) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{sign.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sign Detail Modal */}
        {selectedSign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">Sign: {selectedSign.letter}</CardTitle>
                  <Button variant="ghost" onClick={() => setSelectedSign(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    {selectedSign.video && videoUrl ? (
                      <iframe
                        key={selectedSign.letter}
                        width="100%"
                        height="315"
                        src={videoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <img
                        src={selectedSign.image || "/placeholder.svg"}
                        alt={`Sign for ${selectedSign.letter}`}
                        className="w-full max-w-sm mx-auto rounded-lg bg-muted mb-4"
                      />
                    )}
                    <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
 
  <Button
    onClick={() => playSignAnimation(selectedSign, true)}
    disabled={isPlaying}
    className="min-w-[140px] flex items-center"
  >
    {isPlaying ? (
      <>
        <Pause className="w-4 h-4 mc-2" />
        Playing...
      </>
    ) : (
      <>
        <Play className="w-4 h-4 mc-2" />
        {selectedSign.video ? "Play Video" : "Play Animation"}
      </>
    )}
  </Button>

  <Button
    variant="outline"
    onClick={() => playSignAnimation(selectedSign, true)}
    className="min-w-[140px] flex items-center"
  >
    <RotateCcw className="w-4 h-4 mc-2" />
    Replay
  </Button>

  <Button
    onClick={handlePreviousSign}
    disabled={currentSignIndex === 0}
    className="min-w-[140px]"
  >
    Previous
  </Button>

  <Button
    onClick={handleNextSign}
    disabled={currentSignIndex === filteredSigns.length - 1}
    className="min-w-[140px]"
  >
    Next
  </Button>
</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">How to Sign</h3>
                    <p className="text-gray-700 mb-6">{selectedSign.description}</p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Step-by-Step Guide:</h4>
                        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                          <li>Position your dominant hand in front of your body</li>
                          <li>Form the hand shape as described</li>
                          <li>Hold the position clearly for 1-2 seconds</li>
                          <li>Practice the movement smoothly</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Practice Tips:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>Practice in front of a mirror</li>
                          <li>Start slowly and focus on hand shape</li>
                          <li>Pay attention to hand position and movement</li>
                          <li>Practice regularly for muscle memory</li>
                        </ul>
                      </div>

                      {accessibilityMode === "blind" && (
                        <div>
                          <h4 className="font-semibold mb-2">Tactile Description:</h4>
                          <p className="text-sm text-gray-600">
                            Feel the hand position by following the description step by step. Practice the movement
                            pattern repeatedly to build muscle memory.
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-2">Common Mistakes:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>Rushing through the sign</li>
                          <li>Incorrect finger positioning</li>
                          <li>Not maintaining clear hand shape</li>
                          <li>Signing too close to or far from the body</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

            </Card>
          </div>
        )}
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
            onClick={selectedCategory ? () => setSelectedCategory(null) : onBack}
            className="mr-6 hover:bg-white/80 backdrop-blur-sm shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {selectedCategory ? "Back to Categories" : "Back"}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span>Sign Language Hub</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {selectedCategory
                ? "Learn and practice sign language with interactive guidance"
                : "Explore comprehensive sign language categories and master visual communication"}
            </p>
          </div>
        </div>

        {/* Content */}
        {selectedCategory ? renderSignList() : renderCategoryList()}
      </div>
    </div>
  )
}