"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, User, Github, Chrome, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthService, type UserProfile } from "@/lib/auth-service"
import { toast } from "sonner"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (user: UserProfile) => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "signup" | "forgot">("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [role, setRole] = useState("High School Senior")
    const [bio, setBio] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            if (mode === "signup") {
                const result = await AuthService.signup(name, email, password, bio, role)
                if (result.error) {
                    setError(result.error)
                } else {
                    toast.success("Verification email sent!", {
                        description: "Please check your inbox to verify your account.",
                    })
                    setMode("login")
                }
            } else if (mode === "forgot") {
                const result = await AuthService.forgotPassword(email)
                if (result.error) {
                    setError(result.error)
                } else {
                    toast.success("Reset link sent!", {
                        description: "If an account exists, you will receive an email shortly.",
                    })
                    setMode("login")
                }
            } else {
                const result = await AuthService.login(email, password)
                if (result.error) {
                    setError(result.error)
                } else if (result.user) {
                    onSuccess(result.user)
                    onClose()
                }
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const getTitle = () => {
        if (mode === "login") return "Welcome back"
        if (mode === "signup") return "Create Account"
        return "Reset Password"
    }

    const getSubtitle = () => {
        if (mode === "login") return "Ready to continue your journey?"
        if (mode === "signup") return "Start your professional adventure today."
        return "Enter your email to receive a reset link."
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800"
                    >
                        <div className="p-8 sm:p-10 max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {getTitle()}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    {getSubtitle()}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === "signup" && (
                                    <>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Full Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                            />
                                        </div>
                                        <div className="relative">
                                            <select
                                                required
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="High School Senior">High School Senior</option>
                                                <option value="College Student">College Student</option>
                                                <option value="Career Changer">Career Changer</option>
                                                <option value="Professional">Professional</option>
                                                <option value="Educator">Educator</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronDown className="w-5 h-5 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                required
                                                placeholder="Tell us a bit about your goals..."
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-h-[100px] resize-none"
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                    />
                                </div>
                                {mode !== "forgot" && (
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            required
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        />
                                    </div>
                                )}

                                {mode === "login" && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setMode("forgot")}
                                            className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-7 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 font-black text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        mode === "login" ? "Sign In" : mode === "signup" ? "Sign Up" : "Send Reset Link"
                                    )}
                                </Button>
                            </form>

                            <div className="mt-8">
                                <div className="relative flex items-center py-4">
                                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                                    <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Or continue with</span>
                                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <Button variant="outline" className="rounded-2xl py-6 border-slate-200 dark:border-slate-800 font-bold">
                                        <Chrome className="w-5 h-5 mr-2" /> Google
                                    </Button>
                                    <Button variant="outline" className="rounded-2xl py-6 border-slate-200 dark:border-slate-800 font-bold">
                                        <Github className="w-5 h-5 mr-2" /> GitHub
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-8 text-center space-y-2">
                                {mode !== "signup" && (
                                    <div>
                                        <button
                                            onClick={() => setMode("signup")}
                                            className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                                        >
                                            Don't have an account? Sign up
                                        </button>
                                    </div>
                                )}
                                {mode !== "login" && (
                                    <div>
                                        <button
                                            onClick={() => setMode("login")}
                                            className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                                        >
                                            Already have an account? Sign in
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
