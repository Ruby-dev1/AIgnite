"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Medal, Crown, Star, TrendingUp, Users, RefreshCw, Zap } from "lucide-react"
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
                    <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Leaderboard</span> 🏆
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg sm:text-xl max-w-3xl leading-relaxed">
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
                        <div className="text-3xl font-black text-slate-900 dark:text-white">{topThree[0]?.xp?.toLocaleString() || 0} XP</div>
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

                {/* Top 3 Podium (Hidden on Mobile) */}
                {topThree.length > 0 && (
                    <motion.div variants={item} className="hidden md:grid md:grid-cols-3 gap-6 items-end">
                        {/* 2nd Place */}
                        {topThree[1] && (
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="order-2 md:order-1 relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/40 dark:to-blue-900/40 border border-slate-200 dark:border-slate-700/50 shadow-xl"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                                    <span className="text-[10rem] font-black tracking-tighter text-slate-900 dark:text-white">2</span>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4 sm:mb-6 opacity-50">
                                        <div className="text-4xl sm:text-6xl font-black text-slate-300 dark:text-slate-700">#2</div>
                                        <Medal className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" />
                                    </div>
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-br from-slate-300 to-slate-500 shadow-lg mb-4 mx-auto">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-white/50 dark:border-slate-800/50">
                                            {topThree[1].avatar ? (
                                                <img src={topThree[1].avatar} alt={topThree[1].name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl sm:text-3xl font-black text-slate-600">{topThree[1].name[0].toUpperCase()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-2">{topThree[1].name}</h3>
                                    <div className="text-center space-y-1">
                                        <div className="text-2xl font-black text-slate-700 dark:text-slate-300">{topThree[1]?.xp?.toLocaleString() || 0} XP</div>
                                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Level {topThree[1]?.level || 1}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 1st Place */}
                        {topThree[0] && (
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="order-1 md:order-2 relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 border border-amber-200 dark:border-amber-700/50 shadow-2xl md:scale-110 md:z-10"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
                                    <span className="text-[12rem] font-black tracking-tighter text-amber-900 dark:text-amber-100">1</span>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4 sm:mb-6 opacity-80">
                                        <div className="text-4xl sm:text-6xl font-black text-amber-200 dark:text-amber-800/50">#1</div>
                                        <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500" />
                                    </div>
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-br from-amber-400 to-yellow-600 shadow-xl mb-4 mx-auto">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-white/50 dark:border-slate-800/50">
                                            {topThree[0].avatar ? (
                                                <img src={topThree[0].avatar} alt={topThree[0].name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl sm:text-4xl font-black text-amber-600">{topThree[0].name[0].toUpperCase()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-center text-slate-900 dark:text-white mb-2">{topThree[0].name}</h3>
                                    <div className="text-center space-y-1">
                                        <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{topThree[0]?.xp?.toLocaleString() || 0} XP</div>
                                        <div className="text-xs font-black text-amber-400/80 uppercase tracking-widest">Level {topThree[0]?.level || 1}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 3rd Place */}
                        {topThree[2] && (
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="order-3 relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/40 border border-orange-200 dark:border-orange-700/50 shadow-xl"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                                    <span className="text-[10rem] font-black tracking-tighter text-slate-900 dark:text-white">3</span>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4 sm:mb-6 opacity-50">
                                        <div className="text-4xl sm:text-6xl font-black text-orange-200 dark:text-orange-800/50">#3</div>
                                        <Medal className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400" />
                                    </div>
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-br from-orange-400 to-amber-700 shadow-lg mb-4 mx-auto">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-white/50 dark:border-slate-800/50">
                                            {topThree[2].avatar ? (
                                                <img src={topThree[2].avatar} alt={topThree[2].name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl sm:text-3xl font-black text-orange-700">{topThree[2].name[0].toUpperCase()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-2">{topThree[2].name}</h3>
                                    <div className="text-center space-y-1">
                                        <div className="text-2xl font-black text-slate-700 dark:text-slate-300">{topThree[2]?.xp?.toLocaleString() || 0} XP</div>
                                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Level {topThree[2]?.level || 1}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Leaderboard List */}
                <motion.div variants={item} className="space-y-3">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">Rankings</h3>

                    {/* Top 3 Banners (Mobile Only) */}
                    <div className="md:hidden space-y-4">
                        {topThree.map((user) => (
                            <motion.div
                                key={`banner-${user._id}`}
                                className={cn(
                                    "p-5 rounded-[2.5rem] border relative overflow-hidden shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all",
                                    user.rank === 1
                                        ? "bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800/50"
                                        : user.rank === 2
                                            ? "bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/20 dark:to-blue-900/20 border-slate-200 dark:border-slate-800/50"
                                            : "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800/50"
                                )}
                            >
                                {/* Decorative Background Elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl -ml-12 -mb-12" />

                                {/* Rank Watermark */}
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.07] dark:opacity-[0.15]">
                                    {user.rank === 1 ? (
                                        <Crown className="w-24 h-24 rotate-12" />
                                    ) : (
                                        <Trophy className="w-20 h-20 -rotate-12" />
                                    )}
                                </div>

                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className={cn(
                                                "w-16 h-16 rounded-full p-1 bg-gradient-to-br shadow-lg flex items-center justify-center",
                                                user.rank === 1 ? "from-amber-400 to-yellow-600" :
                                                    user.rank === 2 ? "from-slate-300 to-slate-500" :
                                                        "from-orange-400 to-amber-700"
                                            )}>
                                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-white/50 dark:border-slate-800/50">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className={cn(
                                                            "text-xl font-black",
                                                            user.rank === 1 ? "text-amber-600" :
                                                                user.rank === 2 ? "text-slate-600" :
                                                                    "text-orange-700"
                                                        )}>
                                                            {user.name[0].toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "text-2xl font-black tracking-tighter opacity-[0.4] dark:opacity-[0.6]",
                                                        user.rank === 1 ? "text-amber-600 dark:text-amber-400" :
                                                            user.rank === 2 ? "text-slate-600 dark:text-slate-400" :
                                                                "text-orange-700 dark:text-orange-400"
                                                    )}>
                                                        #{user.rank}
                                                    </span>
                                                    <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                                        {user.name.split(' ')[0]}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-full border border-white/20 dark:border-white/10 w-fit mt-1">
                                                    <Zap className="w-3 h-3 text-indigo-500" />
                                                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                        Level {user.level}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(
                                            "text-2xl font-black tracking-tighter",
                                            user.rank === 1 ? "text-amber-600 dark:text-amber-400" :
                                                user.rank === 2 ? "text-slate-600 dark:text-slate-400" :
                                                    "text-orange-700 dark:text-orange-400"
                                        )}>
                                            {user?.xp?.toLocaleString() || 0}
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">XP</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Full List */}
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
                            <div className="flex items-center gap-3 sm:gap-6">
                                <div className="text-xl sm:text-3xl font-black text-slate-300 dark:text-slate-600 w-8 sm:w-12 text-center">
                                    #{user.rank}
                                </div>
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-base sm:text-xl font-black flex-shrink-0">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        user.name[0].toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="hidden sm:inline">{user.name}</span>
                                        <span className="sm:hidden">{user.name.split(' ')[0]}</span>
                                        {user.isCurrentUser && (
                                            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] sm:text-xs font-black">YOU</span>
                                        )}
                                    </div>
                                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">
                                        {user.completedChallenges} challenges {window.innerWidth < 640 ? '' : 'completed'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">{user?.xp?.toLocaleString() || 0}</div>
                                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">XP</div>
                                </div>
                                <div className="hidden sm:block px-2 sm:px-4 py-1 sm:py-2 bg-slate-100 dark:bg-slate-700 rounded-lg sm:rounded-xl">
                                    <div className="text-xs sm:text-sm font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">Lvl {user.level}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Current User Rank (if not in top 10) */}
                {data?.currentUserRank && (
                    <motion.div variants={item} className="pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-3">Your Position</h3>
                        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-2 border-indigo-200 dark:border-indigo-800 ring-4 ring-indigo-500/20">
                            <div className="flex items-center gap-3 sm:gap-6">
                                <div className="text-xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 w-8 sm:w-12 text-center">
                                    #{data.currentUserRank.rank}
                                </div>
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-base sm:text-xl font-black text-white flex-shrink-0">
                                    {data.currentUserRank.avatar ? (
                                        <img src={data.currentUserRank.avatar} alt={data.currentUserRank.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        data.currentUserRank.name[0].toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                        <span className="hidden sm:inline">{data.currentUserRank.name}</span>
                                        <span className="sm:hidden">{data.currentUserRank.name.split(' ')[0]}</span>
                                        <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-full text-[10px] font-black">YOU</span>
                                    </div>
                                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">
                                        {data.currentUserRank.completedChallenges} challenges
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">{data.currentUserRank?.xp?.toLocaleString() || 0}</div>
                                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">XP</div>
                                </div>
                                <div className="hidden sm:block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
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
