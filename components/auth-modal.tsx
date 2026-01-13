"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, User, ChevronDown, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
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
    const [generalError, setGeneralError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Field-specific errors
    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: "",
        name: "",
        bio: ""
    })

    // Reset state when mode changes
    useEffect(() => {
        setGeneralError("")
        setFieldErrors({ email: "", password: "", name: "", bio: "" })
        if (mode === "login") {
            setName("")
            setBio("")
        }
    }, [mode])

    const switchMode = (newMode: "login" | "signup" | "forgot") => {
        setSuccessMessage("") // Clear success message on manual switch
        setMode(newMode)
    }

    const validateForm = () => {
        let isValid = true
        const newFieldErrors = { email: "", password: "", name: "", bio: "" }

        // Email validation
        if (!email) {
            newFieldErrors.email = "Email is required"
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newFieldErrors.email = "Please enter a valid email address"
            isValid = false
        }

        if (mode !== "forgot") {
            // Password validation
            if (!password) {
                newFieldErrors.password = "Password is required"
                isValid = false
            } else if (mode === "signup" && password.length < 8) {
                newFieldErrors.password = "Password must be at least 8 characters"
                isValid = false
            }
        }

        if (mode === "signup") {
            // Name validation
            if (!name) {
                newFieldErrors.name = "Full Name is required"
                isValid = false
            } else if (name.length < 3) {
                newFieldErrors.name = "Name must be usually longer than 2 characters"
                isValid = false
            }

            // Bio validation is optional but good to check if too short if provided
            if (bio && bio.length < 10) {
                newFieldErrors.bio = "Please tell us a bit more (at least 10 chars)"
                isValid = false
            }
        }

        setFieldErrors(newFieldErrors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setGeneralError("")

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            if (mode === "signup") {
                const result = await AuthService.signup(name, email, password, bio, role)
                if (result.error) {
                    setGeneralError(result.error)
                } else {
                    toast.success("Verification email sent!", {
                        description: "Please check your inbox to verify your account.",
                    })
                    setSuccessMessage("Verification email sent! Please check your inbox.")
                    setMode("login")
                }
            } else if (mode === "forgot") {
                const result = await AuthService.forgotPassword(email)
                if (result.error) {
                    setGeneralError(result.error)
                } else {
                    toast.success("Reset link sent!", {
                        description: "If an account exists, you will receive an email shortly.",
                    })
                    setSuccessMessage("Reset link sent! If an account exists, you will receive an email shortly.")
                    setMode("login")
                }
            } else {
                const result = await AuthService.login(email, password)
                if (result.error) {
                    setGeneralError(result.error)
                } else if (result.user) {
                    onSuccess(result.user)
                    onClose()
                }
            }
        } catch (err) {
            setGeneralError("Something went wrong. Please try again.")
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
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        {/* Decorative Gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative p-8 sm:p-10 max-h-[90vh] overflow-y-auto no-scrollbar">


                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black mb-2 text-slate-800 dark:text-white">
                                    {getTitle()}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    {getSubtitle()}
                                </p>
                            </div>

                            {generalError && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-semibold text-center flex items-center justify-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {generalError}
                                </div>
                            )}

                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm font-semibold text-center flex items-center justify-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === "signup" && (
                                    <>
                                        <div className="space-y-1">
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    value={name}
                                                    onChange={(e) => {
                                                        setName(e.target.value)
                                                        if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: "" }))
                                                    }}
                                                    className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.name ? 'border-red-500' : 'border-transparent dark:border-white/5'} rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none placeholder:text-slate-400`}
                                                />
                                            </div>
                                            {fieldErrors.name && (
                                                <p className="text-red-500 text-xs px-4">{fieldErrors.name}</p>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <select
                                                required
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-white/5 rounded-2xl py-4 px-4 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none appearance-none cursor-pointer"
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

                                        <div className="space-y-1">
                                            <div className="relative">
                                                <textarea
                                                    placeholder="Tell us a bit about your goals..."
                                                    value={bio}
                                                    onChange={(e) => {
                                                        setBio(e.target.value)
                                                        if (fieldErrors.bio) setFieldErrors(prev => ({ ...prev, bio: "" }))
                                                    }}
                                                    className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.name ? 'border-red-500' : 'border-transparent dark:border-white/5'} rounded-2xl py-4 px-4 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none min-h-[100px] resize-none placeholder:text-slate-400`}
                                                />
                                            </div>
                                            {fieldErrors.bio && (
                                                <p className="text-red-500 text-xs px-4">{fieldErrors.bio}</p>
                                            )}
                                        </div>
                                    </>
                                )}

                                <div className="space-y-1">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: "" }))
                                            }}
                                            className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.email ? 'border-red-500' : 'border-transparent dark:border-white/5'} rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none placeholder:text-slate-400`}
                                        />
                                    </div>
                                    {fieldErrors.email && (
                                        <p className="text-red-500 text-xs px-4">{fieldErrors.email}</p>
                                    )}
                                </div>

                                {mode !== "forgot" && (
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value)
                                                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: "" }))
                                                }}
                                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.password ? 'border-red-500' : 'border-transparent dark:border-white/5'} rounded-2xl py-4 pl-12 pr-12 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none placeholder:text-slate-400`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {fieldErrors.password && (
                                            <p className="text-red-500 text-xs px-4">{fieldErrors.password}</p>
                                        )}
                                    </div>
                                )}

                                {mode === "login" && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => switchMode("forgot")}
                                            className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-7 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-black text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        mode === "login" ? "Sign In" : mode === "signup" ? "Sign Up" : "Send Reset Link"
                                    )}
                                </Button>
                            </form>

                            <div className="mt-8 text-center space-y-4">
                                {mode !== "signup" && (
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Don't have an account?{" "}
                                        <button
                                            onClick={() => switchMode("signup")}
                                            className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors hover:underline"
                                        >
                                            Sign up
                                        </button>
                                    </p>
                                )}
                                {mode !== "login" && (
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Already have an account?{" "}
                                        <button
                                            onClick={() => switchMode("login")}
                                            className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors hover:underline"
                                        >
                                            Sign in
                                        </button>
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
