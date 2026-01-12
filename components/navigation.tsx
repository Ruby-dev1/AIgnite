"use client"

import { Zap, Compass, Target, User, Menu, X, MessageSquare, Trophy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { type UserProfile } from "@/lib/auth-service"

interface NavigationProps {
  currentPage: "dashboard" | "explore" | "challenges" | "leaderboard" | "profile"
  setCurrentPage: (page: "dashboard" | "explore" | "challenges" | "leaderboard" | "profile") => void
  onOpenAIChat: () => void
  isAuthenticated?: boolean
  onLoginClick?: () => void
  user: UserProfile | null
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Zap, color: "bg-indigo-500" },
  { id: "explore", label: "Explore", icon: Compass, color: "bg-pink-500" },
  { id: "challenges", label: "Challenges", icon: Target, color: "bg-amber-500" },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, color: "bg-slate-500" },
] as const

export default function Navigation({
  currentPage,
  setCurrentPage,
  onOpenAIChat,
  isAuthenticated,
  onLoginClick,
  user
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setCurrentPage("dashboard")}>
            <motion.div
              whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
              className="flex items-center justify-center transition-all duration-300"
            >
              <img src="/logo.png" alt="AIgnite Logo" className="h-10 w-auto sm:h-11 object-contain" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              AIgnite
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
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

          <div className="flex items-center gap-2 sm:gap-4">
            {/* AI Chat Button - desktop and mobile */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenAIChat}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-[1.25rem] text-xs sm:text-sm font-black shadow-lg shadow-indigo-500/20 transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">AI Advice</span>
            </motion.button>

            {/* Auth / Profile Area */}
            {isAuthenticated && user ? (
              <div className="hidden lg:flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Level {user.level}</span>
                  <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${(user.xp / user.maxXp) * 100}%` }}
                    />
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "w-11 h-11 rounded-[1.25rem] bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-2 shadow-md overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300",
                    currentPage === "profile" ? "border-indigo-600 ring-4 ring-indigo-500/20" : "border-white dark:border-slate-800"
                  )}
                  onClick={() => setCurrentPage("profile")}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-black text-slate-500">{getInitials(user.name)}</span>
                  )}
                </motion.div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLoginClick}
                className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-[1.25rem] text-sm font-black transition-all duration-300 border border-slate-200 dark:border-slate-700"
              >
                Sign In
              </motion.button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all",
                    currentPage === item.id
                      ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <div className={cn("p-2 rounded-xl text-white", item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
              {/* Profile in Mobile Menu */}
              <button
                onClick={() => {
                  setCurrentPage("profile")
                  setIsMobileMenuOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all",
                  currentPage === "profile"
                    ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="p-2 rounded-xl text-white bg-emerald-500">
                  <User className="w-5 h-5" />
                </div>
                <span>Profile</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
