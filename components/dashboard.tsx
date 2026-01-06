"use client"

import { useState } from "react"
import StatCard from "./stat-card"
import BadgeShowcase from "./badge-showcase"
import ProgressCard from "./progress-card"
import MentorTip from "./mentor-tip"
import { Zap, Award, Target, TrendingUp, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { type CareerRecommendation } from "@/lib/ai-career-service"

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

interface DashboardProps {
  recommendation?: CareerRecommendation | null
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

export default function Dashboard({ recommendation }: DashboardProps) {
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          Welcome back, Explorer! <span className="animate-bounce inline-block">🎮</span>
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
          Ready to continue your quest for the perfect career?
        </p>
      </motion.div>

      {recommendation && (
        <motion.div
          variants={item}
          className="mb-12 p-8 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white shadow-2xl relative overflow-hidden group"
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
                  <p className="text-blue-50/90 italic line-clamp-3">"{recommendation.reasoning}"</p>
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
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        {/* Progress Section */}
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Path Progression</h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View All</button>
          </div>
          <div className="grid gap-4">
            {careerProgress.map((career, idx) => (
              <motion.div key={idx} variants={item}>
                <ProgressCard name={career.name} progress={career.progress} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mentor Tip */}
        <motion.div variants={item} className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Expert Guidance</h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMentor}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MentorTip {...mentorTips[activeMentor]} />
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-3">
            {mentorTips.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMentor(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeMentor === idx ? "bg-indigo-600 w-10 shadow-lg shadow-indigo-500/30" : "bg-slate-200 dark:bg-slate-800"
                  }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Hall of Fame</h3>
          <p className="text-sm font-bold text-slate-500">{badges.filter(b => b.unlocked).length}/{badges.length} Unlocked</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {badges.map((badge) => (
            <motion.div key={badge.id} variants={item} whileHover={{ y: -5 }}>
              <BadgeShowcase {...badge} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
