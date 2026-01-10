"use client"

import { useState, useEffect } from "react"
import CareerPathCard from "./career-path-card"
import ChallengeModal from "./challenge-modal"
import { Code2, Stethoscope, Briefcase, Palette, Brush, Sparkles, Compass } from "lucide-react"
import { AuthService, type UserProfile } from "@/lib/auth-service"
import { motion } from "framer-motion"

const careers = [
  {
    id: "it",
    name: "IT & Technology",
    description: "Build the digital future",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    courses: [
      { title: "Web Development Basics", difficulty: "beginner" as const },
      { title: "Mobile App Development", difficulty: "intermediate" as const },
      { title: "AI & Machine Learning", difficulty: "advanced" as const },
    ],
    challenges: [
      { id: 1, title: "Build Your First Website", points: 100, type: "simulation" as const },
      { id: 2, title: "Debug a Real App", points: 150, type: "practical" as const },
      { id: 3, title: "Create an API", points: 200, type: "project" as const },
    ],
  },
  {
    id: "health",
    name: "Health Sciences",
    description: "Heal and help communities",
    icon: Stethoscope,
    color: "from-red-500 to-pink-500",
    courses: [
      { title: "Human Anatomy", difficulty: "beginner" as const },
      { title: "Medical Ethics", difficulty: "intermediate" as const },
      { title: "Advanced Diagnostics", difficulty: "advanced" as const },
    ],
    challenges: [
      { id: 4, title: "Patient Case Study", points: 100, type: "simulation" as const },
      { id: 5, title: "Medical Quiz Challenge", points: 120, type: "quiz" as const },
      { id: 6, title: "Health Campaign Design", points: 150, type: "project" as const },
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Lead with vision and strategy",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-500",
    courses: [
      { title: "Entrepreneurship 101", difficulty: "beginner" as const },
      { title: "Finance & Accounting", difficulty: "intermediate" as const },
      { title: "Strategic Management", difficulty: "advanced" as const },
    ],
    challenges: [
      { id: 7, title: "Startup Pitch Challenge", points: 150, type: "simulation" as const },
      { id: 8, title: "Market Analysis", points: 120, type: "practical" as const },
      { id: 9, title: "Business Plan Competition", points: 200, type: "project" as const },
    ],
  },
  {
    id: "fashion",
    name: "Fashion & Design",
    description: "Express creativity through style",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    courses: [
      { title: "Fashion Design Basics", difficulty: "beginner" as const },
      { title: "Trend Forecasting", difficulty: "intermediate" as const },
      { title: "Sustainable Fashion", difficulty: "advanced" as const },
    ],
    challenges: [
      { id: 10, title: "Design Your Collection", points: 130, type: "project" as const },
      { id: 11, title: "Style Quiz Challenge", points: 100, type: "quiz" as const },
      { id: 12, title: "Runway Show Planning", points: 180, type: "practical" as const },
    ],
  },
  {
    id: "arts",
    name: "Arts & Creative",
    description: "Create and inspire the world",
    icon: Brush,
    color: "from-orange-500 to-red-500",
    courses: [
      { title: "Digital Art Fundamentals", difficulty: "beginner" as const },
      { title: "Animation Basics", difficulty: "intermediate" as const },
      { title: "Concept Art & Storytelling", difficulty: "advanced" as const },
    ],
    challenges: [
      { id: 13, title: "Create an Artwork", points: 140, type: "project" as const },
      { id: 14, title: "Story Illustration Challenge", points: 160, type: "practical" as const },
      { id: 15, title: "Animation Mini-Project", points: 170, type: "project" as const },
    ],
  },
]

export default function CareerExplorer() {
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const session = AuthService.getSession()
    if (session) setUser(session)
  }, [])

  const handleCompleteChallenge = (challengeId: number) => {
    if (!user) return

    // Check if challenge is already completed
    if (user.completedChallengeIds?.includes(challengeId)) {
      console.log("Challenge already completed")
      setSelectedChallenge(null)
      return
    }

    // Find which career this challenge belongs to
    const career = careers.find(c => c.challenges.some(ch => ch.id === challengeId))
    const challenge = career?.challenges.find(ch => ch.id === challengeId)

    if (career && challenge) {
      const currentFieldXP = user.fieldXp?.[career.id] || 0
      const newCompletedIds = [...(user.completedChallengeIds || []), challengeId]

      AuthService.updateProfile({
        xp: user.xp + challenge.points,
        completedChallenges: user.completedChallenges + 1,
        completedChallengeIds: newCompletedIds,
        fieldXp: {
          ...user.fieldXp,
          [career.id]: currentFieldXP + challenge.points
        }
      })

      const updated = AuthService.getSession()
      if (updated) setUser(updated)
    }
    setSelectedChallenge(null)
  }

  const handleSelectPrimary = (careerId: string) => {
    AuthService.updateProfile({ primaryCareer: careerId })
    const updated = AuthService.getSession()
    if (updated) setUser(updated)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-indigo-200 dark:border-indigo-800/50">
          <Compass className="w-4 h-4" />
          Vocation Discovery
        </div>
        <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Explore the <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Futures</span> 🚀
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-xl max-w-3xl leading-relaxed">
          Dive into specialized career tracks, master industry-standard tools, and build a portfolio that stands out.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        {careers.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <CareerPathCard
              career={career}
              onChallengeSelect={setSelectedChallenge}
              completedChallenges={user?.completedChallengeIds || []}
              onSelectPrimary={handleSelectPrimary}
              isPrimary={user?.primaryCareer === career.id}
            />
          </motion.div>
        ))}
      </motion.div>

      {selectedChallenge !== null && (
        <ChallengeModal
          challengeId={selectedChallenge}
          careers={careers}
          onComplete={handleCompleteChallenge}
          onClose={() => setSelectedChallenge(null)}
          isCompleted={user?.completedChallengeIds?.includes(selectedChallenge) || false}
        />
      )}
    </div>
  )
}
