"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Target, Zap, Clock, Trophy, ChevronRight, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChallengeModal from "./challenge-modal"
import { AuthService, type UserProfile } from "@/lib/auth-service"
import { cn } from "@/lib/utils"

const categories = ["All", "Tech", "Health", "Business", "Design", "Arts"]

const allChallenges = [
    { id: 1, title: "Build Your First Website", points: 100, type: "simulation", difficulty: "Beginner", category: "Tech", description: "Create a simple portfolio website using HTML and CSS" },
    { id: 2, title: "Debug a Real App", points: 150, type: "practical", difficulty: "Intermediate", category: "Tech", description: "Fix bugs in a real application and learn debugging techniques" },
    { id: 3, title: "Create an API", points: 200, type: "project", difficulty: "Advanced", category: "Tech", description: "Build a REST API that manages a list of tasks" },
    { id: 4, title: "Patient Case Study", points: 100, type: "simulation", difficulty: "Beginner", category: "Health", description: "Analyze a patient case and recommend treatment" },
    { id: 5, title: "Medical Quiz Challenge", points: 120, type: "quiz", difficulty: "Beginner", category: "Health", description: "Test your medical knowledge with a quick quiz" },
    { id: 6, title: "Health Campaign Design", points: 150, type: "project", difficulty: "Intermediate", category: "Health", description: "Design a community health awareness campaign" },
    { id: 7, title: "Startup Pitch Challenge", points: 150, type: "simulation", difficulty: "Intermediate", category: "Business", description: "Create and pitch a business idea to investors" },
    { id: 8, title: "Market Analysis", points: 120, type: "practical", difficulty: "Beginner", category: "Business", description: "Analyze market trends for a new product" },
    { id: 10, title: "Design Your Collection", points: 130, type: "project", difficulty: "Intermediate", category: "Design", description: "Design a 5-piece fashion collection" },
    { id: 13, title: "Create an Artwork", points: 140, type: "project", difficulty: "Intermediate", category: "Arts", description: "Create digital art inspired by a theme" },
    // New Challenges
    { id: 16, title: "UI/UX Audit", points: 180, type: "practical", difficulty: "Intermediate", category: "Design", description: "Perform a usability audit on a popular mobile app" },
    { id: 17, title: "Data Visualization", points: 200, type: "project", difficulty: "Advanced", category: "Tech", description: "Turn raw complex data into an interactive dashboard" },
    { id: 18, title: "Ethical Leadership Case", points: 110, type: "simulation", difficulty: "Beginner", category: "Business", description: "Solve a complex ethical dilemma in a corporate setting" },
    { id: 19, title: "Public Speaking Simulator", points: 140, type: "simulation", difficulty: "Intermediate", category: "All", description: "Deliver a 5-minute pitch in a virtual room" }
]

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

export default function ChallengesSection() {
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)
    const [user, setUser] = useState<UserProfile | null>(null)

    useEffect(() => {
        const session = AuthService.getSession()
        if (session) setUser(session)
    }, [])

    const filteredChallenges = allChallenges.filter(c =>
        selectedCategory === "All" || c.category === selectedCategory || c.category === "All"
    )

    const handleChallengeComplete = (challengeId: number) => {
        if (!user) return

        // Check if challenge is already completed
        if (user.completedChallengeIds?.includes(challengeId)) {
            console.log("Challenge already completed")
            setSelectedChallenge(null)
            return
        }

        const challenge = allChallenges.find(c => c.id === challengeId)
        if (challenge) {
            const newCompletedIds = [...(user.completedChallengeIds || []), challengeId]

            AuthService.updateProfile({
                xp: user.xp + challenge.points,
                completedChallenges: user.completedChallenges + 1,
                completedChallengeIds: newCompletedIds
            })
            // Reload user state
            const updated = AuthService.getSession()
            if (updated) setUser(updated)
        }
        setSelectedChallenge(null)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Header Section */}
                <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800/50">
                            <Star className="w-3 h-3 fill-current" />
                            Elite Challenges
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            Level Up Your <br />
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Professional Grit</span> 🎯
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-lg">
                            Real-world simulations designed by industry experts to test your creativity and technical prowess.
                        </p>
                    </div>

                    <div className="flex gap-1 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-[1.5rem] border border-slate-200/50 dark:border-slate-700/50 overflow-x-auto no-scrollbar relative">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "relative px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap z-10",
                                    selectedCategory === cat
                                        ? "text-white"
                                        : "text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                                )}
                            >
                                {selectedCategory === cat && (
                                    <motion.div
                                        layoutId="activeCategory"
                                        className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{cat}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Challenges Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredChallenges.map(challenge => (
                            <motion.div
                                key={challenge.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -8 }}
                                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative group overflow-hidden flex flex-col h-full"
                            >
                                <div className={cn(
                                    "absolute top-0 left-0 w-2 h-full bg-gradient-to-b",
                                    challenge.category === "Tech" ? "from-blue-500 to-cyan-500" :
                                        challenge.category === "Health" ? "from-red-500 to-pink-500" :
                                            challenge.category === "Business" ? "from-emerald-500 to-teal-500" :
                                                "from-indigo-600 to-purple-600"
                                )} />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            {challenge.difficulty} • {challenge.category}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                            {challenge.title}
                                        </h3>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-amber-500 border border-slate-100 dark:border-slate-800">
                                        <Zap className="w-5 h-5 fill-current" />
                                    </div>
                                </div>

                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 line-clamp-2">
                                    {challenge.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Trophy className="w-4 h-4" />
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">{challenge.points} XP</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs font-bold">15m</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedChallenge(challenge.id)}
                                        className="p-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredChallenges.length === 0 && (
                    <motion.div variants={item} className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No challenges here yet!</h3>
                        <p className="text-slate-500 font-medium">Try another category to find your next mission.</p>
                    </motion.div>
                )}
            </motion.div>

            {selectedChallenge !== null && (
                <ChallengeModal
                    challengeId={selectedChallenge}
                    careers={[]}
                    onComplete={handleChallengeComplete}
                    onClose={() => setSelectedChallenge(null)}
                    isCompleted={user?.completedChallengeIds?.includes(selectedChallenge) || false}
                />
            )}
        </div>
    )
}
