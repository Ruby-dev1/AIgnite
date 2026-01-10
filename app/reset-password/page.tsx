"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthService } from "@/lib/auth-service"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

    const token = searchParams.get("token")
    const email = searchParams.get("email")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match")
            setStatus("error")
            return
        }

        if (!token || !email) {
            setErrorMessage("Invalid reset link")
            setStatus("error")
            return
        }

        setIsLoading(true)
        setStatus("idle")

        try {
            const result = await AuthService.resetPassword(token, email, password)
            if (result.error) {
                setErrorMessage(result.error)
                setStatus("error")
            } else {
                setStatus("success")
                setTimeout(() => {
                    router.push("/")
                }, 3000)
            }
        } catch (err) {
            setErrorMessage("Something went wrong. Please try again.")
            setStatus("error")
        } finally {
            setIsLoading(false)
        }
    }

    if (status === "success") {
        return (
            <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">Password Reset Successful!</h2>
                <p className="text-slate-500">You will be redirected to the home page shortly.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Create New Password
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Please enter your new password below.
                </p>
            </div>

            {status === "error" && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {errorMessage}
                </div>
            )}

            <div className="space-y-4">
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        required
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        required
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-7 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 font-black text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    "Reset Password"
                )}
            </Button>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8 sm:p-12"
            >
                <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>}>
                    <ResetPasswordForm />
                </Suspense>
            </motion.div>
        </div>
    )
}
