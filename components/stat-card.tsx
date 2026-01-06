"use client"

import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  color: string
}

export default function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl h-full group transition-all duration-300"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90 group-hover:opacity-100 transition-opacity`} />
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner group-hover:bg-white/30 transition-colors">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-white/70 group-hover:text-white/90 transition-colors">{label}</p>
          <p className="text-3xl font-black mt-1 tabular-nums">{value}</p>
        </div>
      </div>
    </motion.div>
  )
}
