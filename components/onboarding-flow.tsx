"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, ArrowRight, X, GraduationCap, Heart, Rocket, Users } from "lucide-react"
import { OnboardingStep } from "./onboarding-step"
import { generateCareerPath, type UserProfile, type CareerRecommendation } from "@/lib/ai-career-service"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface OnboardingFlowProps {
    onComplete: (recommendation: CareerRecommendation, userData: UserProfile) => void
    onSkip: () => void
}

const steps = [
    { title: "Welcome", icon: Rocket },
    { title: "Academics", icon: GraduationCap },
    { title: "Interests", icon: Heart },
    { title: "Skills", icon: Sparkles },
    { title: "ECA", icon: Users },
]

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
    const [step, setStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    // State for user data
    const [data, setData] = useState<UserProfile>({
        academics: { gpa: "", favoriteSubjects: [] },
        interests: [],
        skills: [],
        ecas: []
    })

    // Temporary inputs
    const [subjectInput, setSubjectInput] = useState("")
    const [interestInput, setInterestInput] = useState("")
    const [skillInput, setSkillInput] = useState("")
    const [ecaInput, setEcaInput] = useState("")

    const handleNext = () => setStep((prev) => prev + 1)
    const handleBack = () => setStep((prev) => prev - 1)

    const addItem = (category: keyof UserProfile | "academics.favoriteSubjects", value: string) => {
        if (!value.trim()) return
        if (category === "academics.favoriteSubjects") {
            if (data.academics.favoriteSubjects.includes(value)) return
            setData(prev => ({
                ...prev,
                academics: { ...prev.academics, favoriteSubjects: [...prev.academics.favoriteSubjects, value] }
            }))
            setSubjectInput("")
        } else {
            const list = data[category as keyof UserProfile] as string[]
            if (list.includes(value)) return
            setData(prev => ({
                ...prev,
                [category]: [...list, value]
            }))
            if (category === "interests") setInterestInput("")
            if (category === "skills") setSkillInput("")
            if (category === "ecas") setEcaInput("")
        }
    }

    const removeItem = (category: keyof UserProfile | "academics.favoriteSubjects", index: number) => {
        if (category === "academics.favoriteSubjects") {
            setData(prev => ({
                ...prev,
                academics: { ...prev.academics, favoriteSubjects: prev.academics.favoriteSubjects.filter((_, i) => i !== index) }
            }))
        } else {
            setData(prev => ({
                ...prev,
                [category]: (prev[category as keyof UserProfile] as string[]).filter((_, i) => i !== index)
            }))
        }
    }

    const handleFinish = async () => {
        setIsLoading(true)
        setStep(5) // Move to loading step
        try {
            const recommendation = await generateCareerPath(data)
            onComplete(recommendation, data)
        } catch (error) {
            console.error("Failed to generate", error)
            setIsLoading(false)
        }
    }

    const progress = (step / (steps.length - 1)) * 100

    return (
        <div className="fixed inset-0 z-50 bg-slate-50/40 dark:bg-slate-950/40 backdrop-blur-md flex flex-col items-center justify-center p-4">

            {/* Progress Bar Container */}
            {step > 0 && step < 5 && (
                <div className="w-full max-w-2xl mb-8 space-y-4">
                    <div className="flex justify-between items-center px-2">
                        {steps.map((s, i) => (
                            <div key={i} className="flex flex-col items-center space-y-2">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                    step >= i ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-white dark:bg-slate-800 text-slate-400"
                                )}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <span className={cn(
                                    "text-xs font-semibold uppercase tracking-wider",
                                    step >= i ? "text-blue-600" : "text-slate-400"
                                )}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {/* Step 0: Welcome */}
                {step === 0 && (
                    <OnboardingStep
                        key="step0"
                        isActive={true}
                        title="Discover Your Future"
                        description="Unlock your potential with our AI-driven career path analysis. Your journey starts here."
                    >
                        <div className="flex justify-center mb-10">
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    rotate: [0, 2, -2, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative w-48 h-48"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-[3rem] blur-2xl opacity-20 animate-pulse" />
                                <div className="relative w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]" />
                                    <Sparkles className="w-24 h-24 text-white drop-shadow-lg" />
                                </div>
                            </motion.div>
                        </div>
                        <Button
                            size="lg"
                            className="w-full text-xl h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/25 mb-4"
                            onClick={handleNext}
                        >
                            Start Journey <ArrowRight className="ml-2 w-6 h-6" />
                        </Button>
                        <button
                            onClick={onSkip}
                            className="w-full py-3 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors"
                        >
                            Skip for now
                        </button>
                    </OnboardingStep>
                )}

                {/* Step 1: Academics */}
                {step === 1 && (
                    <OnboardingStep
                        key="step1"
                        isActive={true}
                        title="Academic Profile"
                        description="Let's start with your academic achievements."
                    >
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold ml-1">Current GPA / Percentage</Label>
                                <Input
                                    placeholder="e.g. 3.9 or 92%"
                                    value={data.academics.gpa}
                                    onChange={(e) => setData({ ...data, academics: { ...data.academics, gpa: e.target.value } })}
                                    className="h-14 text-xl rounded-2xl border-2 focus-visible:ring-blue-500 bg-white/50 dark:bg-slate-800/50"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold ml-1">Favorite Subjects</Label>
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Add subject..."
                                        value={subjectInput}
                                        onChange={(e) => setSubjectInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addItem("academics.favoriteSubjects", subjectInput)}
                                        className="h-14 text-lg rounded-2xl border-2 bg-white/50 dark:bg-slate-800/50"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => addItem("academics.favoriteSubjects", subjectInput)}
                                        className="h-14 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700"
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4 min-h-10">
                                    {data.academics.favoriteSubjects.map((sub, i) => (
                                        <Badge
                                            key={i}
                                            className="px-4 py-2 text-sm rounded-xl bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 transition-all hover:pr-8 relative group"
                                        >
                                            {sub}
                                            <button
                                                onClick={() => removeItem("academics.favoriteSubjects", i)}
                                                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-12 gap-4">
                            <Button variant="ghost" size="lg" onClick={handleBack} className="rounded-xl h-14 px-8">Back</Button>
                            <Button
                                size="lg"
                                onClick={handleNext}
                                disabled={!data.academics.gpa || data.academics.favoriteSubjects.length === 0}
                                className="rounded-xl h-14 px-10 bg-blue-600 hover:bg-blue-700"
                            >
                                Next <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </OnboardingStep>
                )}

                {/* Step 2: Interests */}
                {step === 2 && (
                    <OnboardingStep
                        key="step2"
                        isActive={true}
                        title="Passions & Interests"
                        description="What makes you lose track of time?"
                    >
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold ml-1">Your Interests</Label>
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Gaming, Writing, Tech..."
                                        value={interestInput}
                                        onChange={(e) => setInterestInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addItem("interests", interestInput)}
                                        className="h-14 text-lg rounded-2xl border-2 bg-white/50 dark:bg-slate-800/50"
                                    />
                                    <Button
                                        onClick={() => addItem("interests", interestInput)}
                                        className="h-14 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700"
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4 min-h-10">
                                    {data.interests.map((item, i) => (
                                        <Badge
                                            key={i}
                                            className="px-4 py-2 text-sm rounded-xl bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 transition-all hover:pr-8 relative group"
                                        >
                                            {item}
                                            <button
                                                onClick={() => removeItem("interests", i)}
                                                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-12 gap-4">
                            <Button variant="ghost" size="lg" onClick={handleBack} className="rounded-xl h-14 px-8">Back</Button>
                            <Button
                                size="lg"
                                onClick={handleNext}
                                disabled={data.interests.length === 0}
                                className="rounded-xl h-14 px-10 bg-blue-600 hover:bg-blue-700"
                            >
                                Next <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </OnboardingStep>
                )}

                {/* Step 3: Skills */}
                {step === 3 && (
                    <OnboardingStep
                        key="step3"
                        isActive={true}
                        title="Core Skills"
                        description="Identify your superpowers."
                    >
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold ml-1">Add Skills</Label>
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Design, Logic, Leadership..."
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addItem("skills", skillInput)}
                                        className="h-14 text-lg rounded-2xl border-2 bg-white/50 dark:bg-slate-800/50"
                                    />
                                    <Button
                                        onClick={() => addItem("skills", skillInput)}
                                        className="h-14 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700"
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4 min-h-10">
                                    {data.skills.map((item, i) => (
                                        <Badge
                                            key={i}
                                            className="px-4 py-2 text-sm rounded-xl bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 transition-all hover:pr-8 relative group"
                                        >
                                            {item}
                                            <button
                                                onClick={() => removeItem("skills", i)}
                                                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-12 gap-4">
                            <Button variant="ghost" size="lg" onClick={handleBack} className="rounded-xl h-14 px-8">Back</Button>
                            <Button
                                size="lg"
                                onClick={handleNext}
                                disabled={data.skills.length === 0}
                                className="rounded-xl h-14 px-10 bg-blue-600 hover:bg-blue-700"
                            >
                                Next <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </OnboardingStep>
                )}

                {/* Step 4: ECAs */}
                {step === 4 && (
                    <OnboardingStep
                        key="step4"
                        isActive={true}
                        title="Active Involvement"
                        description="Clubs, sports, and volunteering."
                    >
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold ml-1">Extracurriculars</Label>
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Debate, Volunteering, Sports..."
                                        value={ecaInput}
                                        onChange={(e) => setEcaInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addItem("ecas", ecaInput)}
                                        className="h-14 text-lg rounded-2xl border-2 bg-white/50 dark:bg-slate-800/50"
                                    />
                                    <Button
                                        onClick={() => addItem("ecas", ecaInput)}
                                        className="h-14 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700"
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4 min-h-10">
                                    {data.ecas.map((item, i) => (
                                        <Badge
                                            key={i}
                                            className="px-4 py-2 text-sm rounded-xl bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 transition-all hover:pr-8 relative group"
                                        >
                                            {item}
                                            <button
                                                onClick={() => removeItem("ecas", i)}
                                                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-12 gap-4">
                            <Button variant="ghost" size="lg" onClick={handleBack} className="rounded-xl h-14 px-8">Back</Button>
                            <Button
                                size="lg"
                                onClick={handleFinish}
                                className="rounded-xl h-14 px-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-xl transition-all"
                            >
                                Reveal My Path <Sparkles className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </OnboardingStep>
                )}

                {/* Step 5: Loading */}
                {step === 5 && (
                    <OnboardingStep
                        key="step5"
                        isActive={true}
                        title="Connecting the Dots"
                        description="Analyzing millions of data points to find your perfect fit."
                    >
                        <div className="flex flex-col items-center justify-center py-16 space-y-10">
                            <div className="relative w-32 h-32">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-4 border-dashed border-blue-600/30"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-2 rounded-full border-4 border-dashed border-purple-600/30"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                                </div>
                            </div>
                            <LoadingMessages />
                        </div>
                    </OnboardingStep>
                )}
            </AnimatePresence>
        </div>
    )
}

function LoadingMessages() {
    const [index, setIndex] = useState(0)
    const messages = [
        "Analyzing your academic potential...",
        "Evaluating your unique interests...",
        "Identifying core strengths...",
        "Cross-referencing industry demands...",
        "Generating personalized roadmap..."
    ]

    // Cycle through messages
    if (index < messages.length - 1) {
        setTimeout(() => setIndex(index + 1), 1200)
    }

    return (
        <div className="space-y-2 text-center">
            <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
                {messages[index]}
            </motion.p>
            <p className="text-slate-400 font-medium tracking-wide">Hang tight, excellence takes time.</p>
        </div>
    )
}
