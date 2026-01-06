"use client"

import { Zap, Compass, Target, Users } from "lucide-react"

interface NavigationProps {
  currentPage: "dashboard" | "explore" | "challenges" | "mentors"
  setCurrentPage: (page: "dashboard" | "explore" | "challenges" | "mentors") => void
}

export default function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              CareerQuest
            </h1>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage("dashboard")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === "dashboard" ? "bg-indigo-500 text-white shadow-lg" : "text-foreground hover:bg-muted"
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage("explore")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === "explore" ? "bg-pink-500 text-white shadow-lg" : "text-foreground hover:bg-muted"
              }`}
            >
              <Compass className="w-4 h-4 inline mr-2" />
              Explore
            </button>
            <button
              onClick={() => setCurrentPage("challenges")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === "challenges" ? "bg-amber-500 text-white shadow-lg" : "text-foreground hover:bg-muted"
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Challenges
            </button>
            <button
              onClick={() => setCurrentPage("mentors")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === "mentors" ? "bg-purple-500 text-white shadow-lg" : "text-foreground hover:bg-muted"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Mentors
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
