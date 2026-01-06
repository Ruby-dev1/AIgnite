"use client"

import { Zap, Compass, Target, Users } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavigationProps {
  currentPage: "dashboard" | "explore" | "challenges" | "mentors"
  setCurrentPage: (page: "dashboard" | "explore" | "challenges" | "mentors") => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Zap, color: "bg-indigo-500" },
  { id: "explore", label: "Explore", icon: Compass, color: "bg-pink-500" },
  { id: "challenges", label: "Challenges", icon: Target, color: "bg-amber-500" },
  { id: "mentors", label: "Mentors", icon: Users, color: "bg-purple-500" },
] as const

export default function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 group cursor-pointer">
            <motion.div
              whileHover={{ rotate: 180 }}
              className="w-11 h-11 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              AIgnite
            </h1>
          </div>

          <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={cn(
                  "relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                  currentPage === item.id ? "text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {currentPage === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={cn("absolute inset-0 rounded-xl shadow-lg", item.color)}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={cn("w-4 h-4 relative z-10", currentPage === item.id ? "animate-pulse" : "")} />
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Level 8</span>
              <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                <div className="h-full w-[65%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-2 border-white dark:border-slate-800 shadow-md overflow-hidden flex items-center justify-center">
              <span className="text-sm font-black text-slate-500">JD</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
