"use client"

import { useState } from "react"
import CareerPathCard from "./career-path-card"
import ChallengeModal from "./challenge-modal"
import { Code2, Stethoscope, Briefcase, Palette, Brush } from "lucide-react"

const careers = [
  {
    id: "it",
    name: "IT & Technology",
    description: "Build the digital future",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    courses: [
      { title: "Web Development Basics", difficulty: "beginner" },
      { title: "Mobile App Development", difficulty: "intermediate" },
      { title: "AI & Machine Learning", difficulty: "advanced" },
    ],
    challenges: [
      { id: 1, title: "Build Your First Website", points: 100, type: "simulation" },
      { id: 2, title: "Debug a Real App", points: 150, type: "practical" },
      { id: 3, title: "Create an API", points: 200, type: "project" },
    ],
  },
  {
    id: "health",
    name: "Health Sciences",
    description: "Heal and help communities",
    icon: Stethoscope,
    color: "from-red-500 to-pink-500",
    courses: [
      { title: "Human Anatomy", difficulty: "beginner" },
      { title: "Medical Ethics", difficulty: "intermediate" },
      { title: "Advanced Diagnostics", difficulty: "advanced" },
    ],
    challenges: [
      { id: 4, title: "Patient Case Study", points: 100, type: "simulation" },
      { id: 5, title: "Medical Quiz Challenge", points: 120, type: "quiz" },
      { id: 6, title: "Health Campaign Design", points: 150, type: "project" },
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Lead with vision and strategy",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-500",
    courses: [
      { title: "Entrepreneurship 101", difficulty: "beginner" },
      { title: "Finance & Accounting", difficulty: "intermediate" },
      { title: "Strategic Management", difficulty: "advanced" },
    ],
    challenges: [
      { id: 7, title: "Startup Pitch Challenge", points: 150, type: "simulation" },
      { id: 8, title: "Market Analysis", points: 120, type: "practical" },
      { id: 9, title: "Business Plan Competition", points: 200, type: "project" },
    ],
  },
  {
    id: "fashion",
    name: "Fashion & Design",
    description: "Express creativity through style",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    courses: [
      { title: "Fashion Design Basics", difficulty: "beginner" },
      { title: "Trend Forecasting", difficulty: "intermediate" },
      { title: "Sustainable Fashion", difficulty: "advanced" },
    ],
    challenges: [
      { id: 10, title: "Design Your Collection", points: 130, type: "project" },
      { id: 11, title: "Style Quiz Challenge", points: 100, type: "quiz" },
      { id: 12, title: "Runway Show Planning", points: 180, type: "practical" },
    ],
  },
  {
    id: "arts",
    name: "Arts & Creative",
    description: "Create and inspire the world",
    icon: Brush,
    color: "from-orange-500 to-red-500",
    courses: [
      { title: "Digital Art Fundamentals", difficulty: "beginner" },
      { title: "Animation Basics", difficulty: "intermediate" },
      { title: "Concept Art & Storytelling", difficulty: "advanced" },
    ],
    challenges: [
      { id: 13, title: "Create an Artwork", points: 140, type: "project" },
      { id: 14, title: "Story Illustration Challenge", points: 160, type: "practical" },
      { id: 15, title: "Animation Mini-Project", points: 170, type: "project" },
    ],
  },
]

export default function CareerExplorer() {
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([])

  const handleCompleteChallenge = (challengeId: number) => {
    setCompletedChallenges([...completedChallenges, challengeId])
    setSelectedChallenge(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Explore Career Paths</h2>
        <p className="text-muted-foreground">Choose a path and complete challenges to discover your passion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {careers.map((career) => (
          <CareerPathCard
            key={career.id}
            career={career}
            onChallengeSelect={setSelectedChallenge}
            completedChallenges={completedChallenges}
          />
        ))}
      </div>

      {selectedChallenge !== null && (
        <ChallengeModal
          challengeId={selectedChallenge}
          careers={careers}
          onComplete={handleCompleteChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  )
}
