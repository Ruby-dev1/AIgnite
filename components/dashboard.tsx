"use client"

import { useState, useEffect } from "react"
import StatCard from "./stat-card"
import BadgeShowcase from "./badge-showcase"
import ProgressCard from "./progress-card"
import MentorTip from "./mentor-tip"
import { Zap, Award, Target, TrendingUp, Sparkles, Compass } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { type CareerRecommendation } from "@/lib/ai-career-service"
import { AuthService, type UserProfile } from "@/lib/auth-service"

interface DashboardProps {
  recommendation?: CareerRecommendation | null
  onboardingSkipped?: boolean
  onStartOnboarding?: () => void
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
} as const

export default function Dashboard({ recommendation, onboardingSkipped, onStartOnboarding }: DashboardProps) {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const session = AuthService.getSession()
    if (session) setUser(session)
  }, [])

  if (!user) return null

  const stats = [
    { label: "Total XP", value: user.xp, icon: Zap, color: "from-indigo-500 to-blue-500" },
    { label: "Badges", value: user.badges, icon: Award, color: "from-pink-500 to-rose-500" },
    { label: "Quests", value: user.completedChallenges, icon: Target, color: "from-amber-500 to-orange-500" },
    { label: "Level", value: user.level, icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
  ]

  // Dynamic progression based on activity
  const careerProgress = [
    { name: "IT & Technology", progress: user.primaryCareer?.toLowerCase().includes("tech") ? 45 : 10 },
    { name: "Health Sciences", progress: user.primaryCareer?.toLowerCase().includes("health") ? 45 : 5 },
    { name: "Business", progress: user.primaryCareer?.toLowerCase().includes("business") ? 45 : 15 },
    { name: "Fashion & Design", progress: user.primaryCareer?.toLowerCase().includes("fashion") ? 45 : 8 },
    { name: "Arts & Creative", progress: user.primaryCareer?.toLowerCase().includes("arts") ? 45 : 12 },
  ].map(p => ({
    ...p,
    progress: Math.min(100, p.progress + (user.completedChallenges * 5))
  }))

  const allPossibleBadges = [
    { id: 1, name: "Code Master", icon: "⚡" },
    { id: 2, name: "Problem Solver", icon: "🧩" },
    { id: 3, name: "Quick Learner", icon: "🚀" },
    { id: 4, name: "Team Player", icon: "👥" },
    { id: 5, name: "Creative Mind", icon: "🎨" },
    { id: 6, name: "Leader in Making", icon: "👑" },
  ]

  const badgesList = allPossibleBadges.map((badge, index) => ({
    ...badge,
    unlocked: index < user.badges
  }))

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Welcome back, <span className="text-indigo-600">{user.name.split(' ')[0]}</span>!
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Your career odyssey continues. What's the plan for today?
          </p>
        </div>
        {user.primaryCareer && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 px-6 py-4 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-0.5">Primary Goal</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white uppercase line-clamp-1 max-w-[200px]">{user.primaryCareer}</div>
            </div>
          </div>
        )}
      </motion.div>

      {onboardingSkipped && (
        <motion.div
          variants={item}
          className="mb-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="p-5 bg-white/20 rounded-2xl backdrop-blur-xl border border-white/20">
              <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-black mb-3">Personalize Your Journey</h3>
              <p className="text-blue-50 text-lg mb-6 font-medium">Complete your academic profile to get AI-powered career recommendations tailored specifically for you.</p>
              <button
                onClick={onStartOnboarding}
                className="bg-white text-indigo-600 hover:bg-blue-50 px-8 py-3 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Complete Onboarding
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {!onboardingSkipped && recommendation && (
        <motion.div
          variants={item}
          className="mb-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
          <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
            <div className="p-5 bg-white/20 rounded-2xl backdrop-blur-xl border border-white/20 shadow-inner">
              <Sparkles className="w-12 h-12 text-yellow-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-100 font-bold uppercase tracking-[0.2em] text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">AI Recommendation</span>
              </div>
              <h3 className="text-4xl font-black mb-3 leading-tight">{recommendation.careerPath}</h3>
              <p className="text-blue-50 text-xl mb-6 font-medium leading-relaxed max-w-3xl">{recommendation.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/10 group/item hover:bg-white/20 transition-colors">
                  <h4 className="font-bold mb-3 flex items-center gap-2 text-indigo-100">
                    <span className="bg-white/20 rounded-lg w-6 h-6 flex items-center justify-center text-xs">?</span>
                    The Reasoning
                  </h4>
                  <div className="max-h-24 overflow-y-auto pr-2 no-scrollbar">
                    <p className="text-blue-50/90 italic text-sm leading-relaxed">"{recommendation.reasoning}"</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-3 flex items-center gap-2 text-indigo-100">
                    Essential Skills
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {recommendation.recommendedSkills?.map(skill => (
                      <span key={skill} className="px-4 py-1.5 rounded-xl bg-white/20 text-sm font-bold border border-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        {/* Progress Section */}
        <motion.div variants={item} className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">Path Progression</h3>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Keep going! You're making great progress.
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerProgress.map((career, idx) => (
              <motion.div key={idx} variants={item}>
                <ProgressCard name={career.name} progress={career.progress} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div variants={item} className="bg-slate-50 dark:bg-white/5 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 text-center md:text-left">Hall of Fame</h3>
            <p className="text-slate-500 font-medium text-center md:text-left">Unlock badges by completing challenges and gaining XP.</p>
          </div>
          <div className="px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 self-center">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-black text-slate-900 dark:text-white">{badgesList.filter(b => b.unlocked).length} / {badgesList.length} Badges</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {badgesList.map((badge) => (
            <motion.div key={badge.id} variants={item} whileHover={{ y: -5 }}>
              <BadgeShowcase {...badge} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
