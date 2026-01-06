"use client"

import { motion } from "framer-motion"

interface ProgressCardProps {
  name: string
  progress: number
}

export default function ProgressCard({ name, progress }: ProgressCardProps) {
  const getColor = (progress: number) => {
    if (progress >= 70) return "from-emerald-500 to-teal-500"
    if (progress >= 50) return "from-blue-500 to-indigo-500"
    if (progress >= 30) return "from-yellow-500 to-amber-500"
    return "from-pink-500 to-rose-500"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 5 }}
      className="bg-white dark:bg-slate-900/50 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 backdrop-blur-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-slate-800 dark:text-slate-200">{name}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{progress}%</span>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </div>
      </div>
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={`h-full bg-gradient-to-r ${getColor(progress)} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
        />
      </div>
    </motion.div>
  )
}
