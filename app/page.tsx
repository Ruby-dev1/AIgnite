"use client"

import { useState } from "react"
import Dashboard from "@/components/dashboard"
import CareerExplorer from "@/components/career-explorer"
import Navigation from "@/components/navigation"
import OnboardingFlow from "@/components/onboarding-flow"
import AIChat from "@/components/ai-chat"
import ProfileSection from "@/components/profile-section"
import AuthModal from "@/components/auth-modal"
import ChallengesSection from "@/components/challenges-section"
import LeaderboardSection from "@/components/leaderboard-section"
import { type CareerRecommendation } from "@/lib/ai-career-service"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useEffect } from "react"
import { AuthService, type UserProfile, SESSION_UPDATED_EVENT } from "@/lib/auth-service"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "explore" | "challenges" | "leaderboard" | "profile">("dashboard")
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [recommendation, setRecommendation] = useState<CareerRecommendation | null>(null)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [hasSkippedOnboarding, setHasSkippedOnboarding] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const session = AuthService.getSession()
    if (session) {
      setUser(session)
      setIsAuthenticated(true)
      if (session.onboardingCompleted) {
        setShowOnboarding(false)
      }
    }

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setUser(e.detail)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    }

    window.addEventListener(SESSION_UPDATED_EVENT, handleUpdate)
    return () => window.removeEventListener(SESSION_UPDATED_EVENT, handleUpdate)
  }, [])

  const handleOnboardingComplete = (rec: CareerRecommendation, onboardingData: any) => {
    setRecommendation(rec)
    setShowOnboarding(false)
    setHasSkippedOnboarding(false)

    if (isAuthenticated) {
      AuthService.updateProfile({
        onboardingCompleted: true,
        skills: onboardingData.skills,
        interests: onboardingData.interests,
        academics: onboardingData.academics,
        ecas: onboardingData.ecas,
        primaryCareer: rec.careerPath,
      })
    }
  }

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser)
    setIsAuthenticated(true)
    setIsAuthModalOpen(false)

    if (loggedInUser.onboardingCompleted) {
      setShowOnboarding(false)
    } else {
      setShowOnboarding(true)
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    setUser(null)
    setIsAuthenticated(false)
    setIsAuthModalOpen(true)
  }

  const handleSkipOnboarding = () => {
    setShowOnboarding(false)
    setHasSkippedOnboarding(true)
  }

  if (!mounted) return null

  // Force login wall
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-lg">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 mx-auto"
          >
            <Zap className="w-12 h-12 text-white" />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter text-white">
              Elevate Your <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Future</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              Join the elite community of ambitious learners and career architects.
            </p>
          </div>
          <Button
            onClick={() => setIsAuthModalOpen(true)}
            className="py-8 px-12 rounded-[2rem] bg-white text-slate-950 hover:bg-slate-100 font-black text-xl shadow-xl transition-all"
          >
            Get Started
          </Button>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </div>
    )
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
            <OnboardingFlow
              onComplete={handleOnboardingComplete}
              onSkip={handleSkipOnboarding}
            />
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Navigation
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onOpenAIChat={() => setIsAIChatOpen(true)}
              isAuthenticated={isAuthenticated}
              onLoginClick={() => setIsAuthModalOpen(true)}
              user={user}
            />
            <main className="pt-24 pb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {currentPage === "dashboard" && (
                    <Dashboard
                      recommendation={recommendation}
                      onboardingSkipped={hasSkippedOnboarding}
                      onStartOnboarding={() => setShowOnboarding(true)}
                    />
                  )}
                  {currentPage === "explore" && <CareerExplorer />}
                  {currentPage === "challenges" && <ChallengesSection />}
                  {currentPage === "leaderboard" && <LeaderboardSection />}
                  {currentPage === "profile" && (
                    <ProfileSection onLogout={handleLogout} />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* AI Career Chat Modal */}
            <AnimatePresence>
              {isAIChatOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAIChatOpen(false)}
                    className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[600px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative z-10 border border-white/20 dark:border-slate-800"
                  >
                    <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">AI Career Advisor</h3>
                          <p className="text-xs text-indigo-100 font-medium">Always here to help</p>
                        </div>
                      </div>
                      <button onClick={() => setIsAIChatOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <AIChat />
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(isAuthenticated)} // Don't allow closing if not authenticated
        onSuccess={handleLoginSuccess}
      />
    </div>
  )
}
