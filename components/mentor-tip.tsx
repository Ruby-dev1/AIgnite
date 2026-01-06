"use client"

import { motion } from "framer-motion"

interface MentorTipProps {
  mentor: string
  role: string
  avatar: string
  tip: string
  icon: string
}

export default function MentorTip({ mentor, role, avatar, tip, icon }: MentorTipProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-indigo-100 dark:border-indigo-900/50 shadow-xl shadow-indigo-500/5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />

      <div className="flex items-start gap-5 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-black shadow-lg flex-shrink-0 group-hover:rotate-6 transition-transform">
          {avatar}
        </div>

        <div className="flex-1 space-y-1">
          <h4 className="text-lg font-black text-slate-900 dark:text-white">{mentor}</h4>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{role}</p>
          <div className="mt-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border-l-4 border-indigo-500 shadow-inner">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-start gap-3 leading-relaxed">
              <span className="text-2xl flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">{icon}</span>
              <span>{tip}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
