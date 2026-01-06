"use client"

import type { LucideIcon } from "lucide-react"
import { useState } from "react"

interface Course {
  title: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface Challenge {
  id: number
  title: string
  points: number
  type: "simulation" | "quiz" | "practical" | "project"
}

interface CareerPathCardProps {
  career: {
    id: string
    name: string
    description: string
    icon: LucideIcon
    color: string
    courses: Course[]
    challenges: Challenge[]
  }
  onChallengeSelect: (challengeId: number) => void
  completedChallenges: number[]
}

export default function CareerPathCard({ career, onChallengeSelect, completedChallenges }: CareerPathCardProps) {
  const [expanded, setExpanded] = useState(false)
  const Icon = career.icon

  return (
    <div className="group cursor-pointer">
      <div
        className={`h-48 bg-gradient-to-br ${career.color} rounded-xl p-6 text-white shadow-lg transition-all transform group-hover:scale-105 group-hover:shadow-xl`}
        onClick={() => setExpanded(!expanded)}
      >
        <Icon className="w-8 h-8 mb-4" />
        <h3 className="text-lg font-bold mb-1 text-pretty">{career.name}</h3>
        <p className="text-sm opacity-90">{career.description}</p>
        <div className="mt-4 text-xs opacity-75">
          {career.challenges.length} challenges • {career.courses.length} courses
        </div>
      </div>

      {expanded && (
        <div className="bg-card border border-border rounded-b-xl p-4 shadow-md">
          <h4 className="font-bold text-sm mb-2 text-foreground">Challenges:</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {career.challenges.map((challenge) => (
              <button
                key={challenge.id}
                onClick={() => onChallengeSelect(challenge.id)}
                className={`w-full text-left p-2 rounded-lg text-sm transition-all ${
                  completedChallenges.includes(challenge.id)
                    ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                    : "bg-muted hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{challenge.title}</span>
                  <span className="text-xs px-2 py-1 bg-white dark:bg-slate-800 rounded">{challenge.points}pts</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
