"use client"

import { useState } from "react"
import StatCard from "./stat-card"
import BadgeShowcase from "./badge-showcase"
import ProgressCard from "./progress-card"
import MentorTip from "./mentor-tip"
import { Zap, Award, Target, TrendingUp } from "lucide-react"

const mentorTips = [
  {
    mentor: "Alex Chen",
    role: "IT Professional",
    avatar: "AC",
    tip: "Master fundamentals first! Start with web development before diving into mobile apps.",
    icon: "💻",
  },
  {
    mentor: "Dr. Priya Sharma",
    role: "Health Expert",
    avatar: "PS",
    tip: "Internships are crucial in healthcare. Build practical experience early in your journey.",
    icon: "🏥",
  },
  {
    mentor: "Raj Patel",
    role: "Business Leader",
    avatar: "RP",
    tip: "Develop your leadership skills through team projects and volunteer initiatives.",
    icon: "📊",
  },
]

export default function Dashboard() {
  const [activeMentor, setActiveMentor] = useState(0)

  const stats = [
    { label: "Total Points", value: 2450, icon: Zap, color: "from-indigo-500 to-blue-500" },
    { label: "Badges Earned", value: 12, icon: Award, color: "from-pink-500 to-rose-500" },
    { label: "Challenges Done", value: 18, icon: Target, color: "from-amber-500 to-orange-500" },
    { label: "Level", value: 8, icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
  ]

  const careerProgress = [
    { name: "IT & Technology", progress: 65 },
    { name: "Health Sciences", progress: 42 },
    { name: "Business", progress: 58 },
    { name: "Fashion & Design", progress: 35 },
    { name: "Arts & Creative", progress: 71 },
  ]

  const badges = [
    { id: 1, name: "Code Master", icon: "⚡", unlocked: true },
    { id: 2, name: "Problem Solver", icon: "🧩", unlocked: true },
    { id: 3, name: "Quick Learner", icon: "🚀", unlocked: true },
    { id: 4, name: "Team Player", icon: "👥", unlocked: false },
    { id: 5, name: "Creative Mind", icon: "🎨", unlocked: true },
    { id: 6, name: "Leader in Making", icon: "👑", unlocked: false },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, Explorer! 🎮</h2>
        <p className="text-muted-foreground">Keep crushing those challenges and discover your perfect career path</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Section */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-foreground">Your Career Progress</h3>
          {careerProgress.map((career, idx) => (
            <ProgressCard key={idx} name={career.name} progress={career.progress} />
          ))}
        </div>

        {/* Mentor Tip */}
        <div>
          <MentorTip {...mentorTips[activeMentor]} />
          <div className="mt-4 flex gap-2">
            {mentorTips.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMentor(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeMentor === idx ? "bg-indigo-500 w-6" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Your Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <BadgeShowcase key={badge.id} {...badge} />
          ))}
        </div>
      </div>
    </div>
  )
}
