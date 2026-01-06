"use client"

import { useState } from "react"
import Dashboard from "@/components/dashboard"
import CareerExplorer from "@/components/career-explorer"
import Navigation from "@/components/navigation"
import MentorsSection from "@/components/mentors-section"
import OnboardingFlow from "@/components/onboarding-flow"
import { type CareerRecommendation } from "@/lib/ai-career-service"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "explore" | "challenges" | "mentors">("dashboard")
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [recommendation, setRecommendation] = useState<CareerRecommendation | null>(null)

  const handleOnboardingComplete = (rec: CareerRecommendation) => {
    setRecommendation(rec)
    setShowOnboarding(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <AnimatePresence mode="wait">
        {showOnboarding ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <OnboardingFlow onComplete={handleOnboardingComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main className="pt-24 pb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {currentPage === "dashboard" && <Dashboard recommendation={recommendation} />}
                  {currentPage === "explore" && <CareerExplorer />}
                  {currentPage === "mentors" && <MentorsSection />}
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
