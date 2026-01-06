"use client"

import { useState } from "react"
import Dashboard from "@/components/dashboard"
import CareerExplorer from "@/components/career-explorer"
import Navigation from "@/components/navigation"
import MentorsSection from "@/components/mentors-section"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "explore" | "challenges" | "mentors">("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="pt-20">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "explore" && <CareerExplorer />}
        {currentPage === "mentors" && <MentorsSection />}
      </main>
    </div>
  )
}
