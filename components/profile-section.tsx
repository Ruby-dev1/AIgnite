"use client"

import { User, Mail, GraduationCap, Briefcase, Award, Sparkles, ChevronRight, Edit2, Check, X, Camera } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { AuthService, type UserProfile } from "@/lib/auth-service"
import { cn } from "@/lib/utils"

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

interface ProfileSectionProps {
    onLogout: () => void
}

export default function ProfileSection({ onLogout }: ProfileSectionProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [userData, setUserData] = useState<UserProfile | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [lastFile, setLastFile] = useState<File | null>(null)

    useEffect(() => {
        const session = AuthService.getSession()
        if (session) {
            setUserData(session)
        }
    }, [])

    const handleSave = () => {
        if (!userData) return
        setIsEditing(false)
        AuthService.updateProfile(userData)
    }

    const handleCancel = () => {
        const session = AuthService.getSession()
        if (session) setUserData(session)
        setIsEditing(false)
    }

    const uploadFile = (file: File) => {
        if (!userData) return
        setUploadError(null)
        setIsUploading(true)
        setUploadProgress(0)

        const form = new FormData()
        form.append("file", file)

        const token = AuthService.getToken()
        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/api/upload/avatar", true)
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`)

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100)
                setUploadProgress(percent)
            }
        }

        xhr.onload = () => {
            setIsUploading(false)
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText)
                    if (data.user) {
                        AuthService.setSession(data.user, token || undefined)
                        setUserData(data.user)
                        setLastFile(null)
                        setUploadProgress(100)
                    } else {
                        const errMsg = data?.error || "Upload failed"
                        setUploadError(errMsg)
                    }
                } catch (err) {
                    setUploadError("Unexpected server response")
                }
            } else {
                try {
                    const data = JSON.parse(xhr.responseText)
                    setUploadError(data?.error || "Upload failed")
                } catch (err) {
                    setUploadError("Upload failed")
                }
            }
        }

        xhr.onerror = () => {
            setIsUploading(false)
            setUploadError("Network error during upload")
        }

        xhr.send(form)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !userData) return
        setLastFile(file)

        // preview locally
        const url = URL.createObjectURL(file)
        setUserData({ ...userData, avatar: url })

        uploadFile(file)
    }

    const handleRetry = () => {
        if (lastFile) uploadFile(lastFile)
    }

    if (!userData) return null

    const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase()

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Profile Header */}
                <motion.div variants={item} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative group">
                    <div className="absolute top-8 right-8 flex gap-2">
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <label className={cn(
                                "w-32 h-32 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative overflow-hidden block",
                                "cursor-pointer group/avatar"
                            )}>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                                {userData.avatar ? (
                                    <img
                                        src={userData.avatar}
                                        alt={userData.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-black text-white">
                                        {initials}
                                    </span>
                                )}

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                                    {isUploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Spinner className="w-8 h-8 text-white" />
                                            <div className="text-xs text-white">{uploadProgress}%</div>
                                        </div>
                                    ) : (
                                        <Camera className="w-8 h-8 text-white" />
                                    )}
                                </div>
                            </label>
                            {uploadError && (
                                <div className="mt-2 text-xs text-red-600 font-medium flex items-center gap-2">
                                    <span>{uploadError}</span>
                                    <button onClick={handleRetry} className="underline text-xs">Retry</button>
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg border-2 border-white dark:border-slate-900">
                                LVL {userData.level}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left w-full">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        className="text-3xl font-black bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <textarea
                                        value={userData.bio}
                                        onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                                        className="text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                                    />
                                    <div className="flex gap-2 justify-center md:justify-start">
                                        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6">
                                            <Check className="w-4 h-4 mr-2" /> Save
                                        </Button>
                                        <Button variant="outline" onClick={handleCancel} className="rounded-xl px-6">
                                            <X className="w-4 h-4 mr-2" /> Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{userData.name}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-4 max-w-lg">
                                        {userData.bio}
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {userData.email}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4" />
                                            {userData.role}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="mt-6">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Experience Points</span>
                                    <span className="text-sm font-black text-indigo-600">{userData.xp} / {userData.maxXp} XP</span>
                                </div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(userData.xp / userData.maxXp) * 100}%` }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {!userData.onboardingCompleted ? (
                    <motion.div variants={item} className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] p-12 text-center text-white shadow-xl shadow-indigo-500/20">
                        <Sparkles className="w-16 h-16 mx-auto mb-6 text-indigo-200" />
                        <h3 className="text-3xl font-black mb-4">Discover Your Future</h3>
                        <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto font-medium">
                            Complete our AI-powered onboarding to unlock personalized career paths and specialized challenges.
                        </p>
                        <Button
                            onClick={() => window.location.reload()} // Reload to trigger onboarding flow
                            className="bg-white text-indigo-600 hover:bg-slate-50 px-12 py-8 rounded-[2rem] font-black text-xl shadow-xl shadow-black/10 transition-all"
                        >
                            Start Onboarding
                        </Button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Stats */}
                        <motion.div variants={item} className="md:col-span-1 space-y-4">
                            <h3 className="text-xl font-bold px-2 text-slate-900 dark:text-white">Achievements</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <div className="text-3xl font-black text-indigo-600 mb-1">{userData.badges}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Badges</div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <div className="text-3xl font-black text-pink-600 mb-1">{userData.completedChallenges}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Challenges</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Skills & Interests */}
                        <motion.div variants={item} className="md:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    Skills & Interests
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">Top Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {userData.skills.length > 0 ? (
                                                userData.skills.map(skill => (
                                                    <span key={skill} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold border border-indigo-100/50 dark:border-indigo-900/30">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-400 italic">No skills added yet.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">Key Interests</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {userData.interests.length > 0 ? (
                                                userData.interests.map(interest => (
                                                    <span key={interest} className="px-4 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-xl text-sm font-bold border border-pink-100/50 dark:border-pink-900/30">
                                                        {interest}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-400 italic">No interests added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                <motion.div
                    variants={item}
                    className="flex justify-center pt-8"
                >
                    <Button
                        onClick={onLogout}
                        variant="outline"
                        className="rounded-2xl px-12 py-6 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold transition-all"
                    >
                        Sign Out
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}
