"use client"

import { motion } from "framer-motion"

interface BadgeShowcaseProps {
  id: number
  name: string
  icon: string
  unlocked: boolean
}

export default function BadgeShowcase({ id, name, icon, unlocked }: BadgeShowcaseProps) {
  return (
    <div className="flex flex-col items-center group">
      <motion.div
        whileHover={unlocked ? { scale: 1.15, rotate: [0, -5, 5, 0] } : {}}
        transition={{ duration: 0.3 }}
        className={`relative aspect-square w-full max-w-[120px] rounded-[2rem] flex items-center justify-center text-5xl transition-all shadow-inner ${unlocked
            ? "bg-gradient-to-br from-yellow-300 via-amber-200 to-yellow-400 shadow-[0_10px_30px_-5px_rgba(251,191,36,0.4)] border-4 border-white/50"
            : "bg-slate-100 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600"
          }`}
      >
        <span className={unlocked ? "drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" : "grayscale opacity-30"}>
          {icon}
        </span>

        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-[2rem] backdrop-blur-[2px]">
            <span className="text-2xl filter drop-shadow-md">🔒</span>
          </div>
        )}

        {unlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
          >
            <span className="text-[10px] text-white font-bold">✓</span>
          </motion.div>
        )}
      </motion.div>
      <p className={`text-center text-xs font-black mt-3 uppercase tracking-wider transition-colors ${unlocked ? "text-slate-900 dark:text-white" : "text-slate-400"
        }`}>
        {name}
      </p>
    </div>
  )
}
