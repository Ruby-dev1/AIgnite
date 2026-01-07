import type React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface OnboardingStepProps {
    children: React.ReactNode
    title: string
    description?: string
    isActive: boolean
}

export function OnboardingStep({ children, title, description, isActive }: OnboardingStepProps) {
    if (!isActive) return null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            className={cn(
                "w-full max-w-2xl mx-auto space-y-6 sm:space-y-8",
                "p-6 sm:p-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/40 dark:border-slate-800/40"
            )}
        >
            <div className="space-y-3 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                >
                    {title}
                </motion.h2>
                {description && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium leading-relaxed max-w-md mx-auto"
                    >
                        {description}
                    </motion.p>
                )}
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4"
            >
                {children}
            </motion.div>
        </motion.div>
    )
}
