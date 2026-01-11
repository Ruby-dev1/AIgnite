"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Medal, Crown, Star, TrendingUp, Users, RefreshCw } from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import { cn } from "@/lib/utils"

interface LeaderboardUser {
    _id: string
    name: string
    avatar: string | null
    level: number
    xp: number
    completedChallenges: number
    rank: number
    isCurrentUser: boolean
}

interface LeaderboardData {
    leaderboard: LeaderboardUser[]
    currentUserRank: LeaderboardUser | null
    totalUsers: number
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function LeaderboardSection() {
    const [data, setData] = useState<LeaderboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchLeaderboard = async () => {
        try {
            const token = AuthService.getToken()
            const headers: HeadersInit = {}
            if (token) {
                headers["Authorization"] = `Bearer ${token}`
            }

            const response = await fetch("/api/leaderboard", { headers })
            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    const handleRefresh = () => {
        setRefreshing(true)
        fetchLeaderboard()
    }

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1: return "from-amber-400 to-yellow-500"
            case 2: return "from-slate-300 to-slate-400"
            case 3: return "from-orange-400 to-amber-600"
            default: return "from-indigo-500 to-purple-600"
        }
    }

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-6 h-6 text-amber-500" />
            case 2: return <Medal className="w-6 h-6 text-slate-400" />
            case 3: return <Medal className="w-6 h-6 text-orange-500" />
            default: return null
        }
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
            </div>
        )
    }

    const topThree = data?.leaderboard.slice(0, 3) || []
    const restOfList = data?.leaderboard.slice(3) || []

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Header */}
                <motion.div variants={item} className="mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-amber-200 dark:border-amber-800/50">
                        <Trophy className="w-4 h-4 fill-current" />
                        Global Rankings
                    </div>
                    <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Leaderboard</span> 🏆
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-xl max-w-3xl leading-relaxed">
                        Top performers ranked by total XP earned. Keep climbing to reach the top!
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Total Users</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">{data?.totalUsers || 0}</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl border border-amber-100 dark:border-amber-800/50">
                        <div className="flex items-center gap-3 mb-2">
                            <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            <span className="text-sm font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Top Score</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">{topThree[0]?.xp.toLocaleString() || 0} XP</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Your Rank</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">
                            #{data?.leaderboard.find(u => u.isCurrentUser)?.rank || data?.currentUserRank?.rank || "-"}
                        </div>
                    </div>
                </motion.div>

                {/* Top 3 Podium */}
                {topThree.length > 0 && (
                    <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 2nd Place */}
                        {topThree[1] && (
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="order-2 md:order-1 relative overflow-hidden rounded-[2.5rem] p-8 bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-6xl font-black opacity-20">#2</div>
                                        <Medal className="w-12 h-12" />
                                    </div>
                                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-3xl font-black mb-4 mx-auto">
                                        {topThree[1].avatar ? (
                                            <img src={topThree[1].avatar} alt={topThree[1].name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            topThree[1].name[0].toUpperCase()
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black text-center mb-2">{topThree[1].name}</h3>
                                    <div className="text-center space-y-1">
                                        <div className="text-2xl font-black">{topThree[1].xp.toLocaleString()} XP</div>
                                        <div className="text-sm font-bold opacity-80">Level {topThree[1].level}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 1st Place */}
                        {topThree[0] && (
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="order-1 md:order-2 relative overflow-hidden rounded-[2.5rem] p-8 bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-2xl md:scale-110 md:z-10"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-6xl font-black opacity-20">#1</div>
                                        <Crown className="w-12 h-12" />
                                    </div>
                                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-4xl font-black mb-4 mx-auto">
                                        {topThree[0].avatar ? (
                                            <img src={topThree[0].avatar} alt={topThree[0].name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            topThree[0].name[0].toUpperCase()
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-black text-center mb-2">{topThree[0].name}</h3>
                                    <div className="text-center space-y-1">
                                        <div className="text-3xl font-black">{topThree[0].xp.toLocaleString()} XP</div>
                                        <div className="text-sm font-bold opacity-80">Level {topThree[0].level}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 3rd Place */}
                        {topThree[2] && (
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="order-3 relative overflow-hidden rounded-[2.5rem] p-8 bg-gradient-to-br from-orange-400 to-amber-600 text-white shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-6xl font-black opacity-20">#3</div>
                                        <Medal className="w-12 h-12" />
                                    </div>
                                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-3xl font-black mb-4 mx-auto">
                                        {topThree[2].avatar ? (
                                            <img src={topThree[2].avatar} alt={topThree[2].name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            topThree[2].name[0].toUpperCase()
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black text-center mb-2">{topThree[2].name}</h3>
                                    <div className="text-center space-y-1">
                                        <div className="text-2xl font-black">{topThree[2].xp.toLocaleString()} XP</div>
                                        <div className="text-sm font-bold opacity-80">Level {topThree[2].level}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Rest of Leaderboard */}
                {restOfList.length > 0 && (
                    <motion.div variants={item} className="space-y-3">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">Rankings 4-10</h3>
                        {restOfList.map((user, index) => (
                            <motion.div
                                key={user._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "p-6 rounded-3xl border transition-all",
                                    user.isCurrentUser
                                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-200 dark:border-indigo-800 ring-2 ring-indigo-500/20"
                                        : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800"
                                )}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="text-3xl font-black text-slate-300 dark:text-slate-600 w-12 text-center">
                                        #{user.rank}
                                    </div>
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            user.name[0].toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                            {user.name}
                                            {user.isCurrentUser && (
                                                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black">YOU</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            {user.completedChallenges} challenges completed
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-slate-900 dark:text-white">{user.xp.toLocaleString()}</div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">XP</div>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                                        <div className="text-sm font-black text-slate-600 dark:text-slate-300">Lvl {user.level}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Current User Rank (if not in top 10) */}
                {data?.currentUserRank && (
                    <motion.div variants={item} className="pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-3">Your Position</h3>
                        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-2 border-indigo-200 dark:border-indigo-800 ring-4 ring-indigo-500/20">
                            <div className="flex items-center gap-6">
                                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 w-12 text-center">
                                    #{data.currentUserRank.rank}
                                </div>
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black">
                                    {data.currentUserRank.avatar ? (
                                        <img src={data.currentUserRank.avatar} alt={data.currentUserRank.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        data.currentUserRank.name[0].toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                        {data.currentUserRank.name}
                                        <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-full text-xs font-black">YOU</span>
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        {data.currentUserRank.completedChallenges} challenges completed
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">{data.currentUserRank.xp.toLocaleString()}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">XP</div>
                                </div>
                                <div className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                    <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">Lvl {data.currentUserRank.level}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}
