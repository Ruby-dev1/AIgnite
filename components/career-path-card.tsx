"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Target, Check, Trophy, Sparkles, AlertCircle, X, ChevronRight, CircleCheckBig } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  isPrimary: boolean
}

export default function CareerPathCard({
  career,
  onChallengeSelect,
  completedChallenges,
  isPrimary
}: CareerPathCardProps) {
  const [expanded, setExpanded] = useState(false)
  const Icon = career.icon

  return (
    <div className="group space-y-4">
      <motion.div
        whileHover={{ y: -5 }}
        className={cn(
          "relative overflow-hidden rounded-[2.5rem] p-8 text-white transition-all shadow-xl group cursor-pointer",
          `bg-gradient-to-br ${career.color}`,
          isPrimary && "border-4 border-white/40 shadow-white/10"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20">
              <Icon className="w-8 h-8" />
            </div>
          </div>

          <h3 className="text-2xl font-black mb-2 leading-tight">{career.name}</h3>
          <p className="text-white/80 text-sm font-medium mb-6 line-clamp-2">{career.description}</p>

          <div className="mt-auto flex items-center gap-4 text-xs font-bold text-white/70">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              {career.challenges.length} Missions
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {career.courses.length} Paths
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl h-full overflow-hidden flex flex-col"
            >
              <div className={cn("p-8 text-white relative", `bg-gradient-to-br ${career.color}`)}>
                <button
                  onClick={() => setExpanded(false)}
                  className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20 w-fit mb-6">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black mb-2">{career.name}</h3>
                <p className="text-white/80 font-medium">{career.description}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Available Missions</h4>
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/30">
                      {career.challenges.length} Quests
                    </span>
                  </div>

                  <div className="space-y-3">
                    {career.challenges.map((challenge) => (
                      <button
                        key={challenge.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onChallengeSelect(challenge.id);
                          setExpanded(false);
                        }}
                        className={cn(
                          "w-full text-left p-5 rounded-3xl transition-all border group/quest",
                          completedChallenges.includes(challenge.id)
                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-slate-300 shadow-sm hover:shadow-md"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            completedChallenges.includes(challenge.id)
                              ? "bg-emerald-200 dark:bg-emerald-800"
                              : "bg-white dark:bg-slate-700 shadow-sm group-hover/quest:scale-110"
                          )}>
                            {completedChallenges.includes(challenge.id) ? (
                              <CircleCheckBig className="w-5 h-5" />
                            ) : (
                              <Target className="w-5 h-5 text-slate-400 group-hover/quest:text-indigo-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-base mb-0.5">{challenge.title}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{challenge.points} XP • {challenge.type}</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover/quest:text-indigo-600 group-hover/quest:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Learning Paths</h4>
                  <div className="grid gap-3">
                    {career.courses.map((course, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="font-bold text-sm text-slate-700 dark:text-slate-300">{course.title}</div>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                          course.difficulty === 'beginner' ? "bg-green-100 text-green-600" :
                            course.difficulty === 'intermediate' ? "bg-amber-100 text-amber-600" :
                              "bg-red-100 text-red-600"
                        )}>
                          {course.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
