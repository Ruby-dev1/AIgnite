"use client"

import { useState } from "react"
import { X, Zap, Check, Trophy } from "lucide-react"

interface ChallengeModalProps {
  challengeId: number
  careers: any[]
  onComplete: (challengeId: number) => void
  onClose: () => void
  isCompleted?: boolean
}

import { ALL_CHALLENGES, type Challenge } from "@/lib/challenges-data"

export default function ChallengeModal({ challengeId, onComplete, onClose, isCompleted = false }: ChallengeModalProps) {
  const challenge = ALL_CHALLENGES.find(c => c.id === challengeId) || { title: "Unknown Challenge", points: 0, description: "", questions: [] } as any
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [alreadyCompleted] = useState(isCompleted)

  const isQuiz = challenge.questions && challenge.questions.length > 0

  const handleAnswer = (answerIndex: number) => {
    if (!isQuiz) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)

    const isCorrect = answerIndex === challenge.questions[currentQuestion].correct
    if (isCorrect) {
      setScore(score + Math.floor(challenge.points / challenge.questions.length))
    }

    if (currentQuestion < challenge.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCompleted(true)
    }
  }

  const handleComplete = () => {
    setCompleted(true)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="sticky top-0 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex items-start justify-between">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-white mb-4">
              <Zap className="w-3 h-3 fill-current" />
              {challenge.points} XP
            </div>
            <h2 className="text-3xl font-black text-white mb-2">{challenge.title}</h2>
            <p className="text-white/80 font-medium">{challenge.description}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-md text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(85vh-200px)]">
          {alreadyCompleted ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Already Completed!</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">You've already earned {challenge.points} XP from this challenge.</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
              >
                Close
              </button>
            </div>
          ) : !completed ? (
            <>
              {isQuiz && challenge.questions ? (
                <>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        Question {currentQuestion + 1} of {challenge.questions.length}
                      </h3>
                      <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {Math.round((currentQuestion / challenge.questions.length) * 100)}%
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
                        style={{ width: `${((currentQuestion + 1) / challenge.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <h4 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                    {challenge.questions[currentQuestion].q}
                  </h4>

                  <div className="space-y-3">
                    {challenge.questions[currentQuestion].options.map((option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full p-5 rounded-2xl border-2 transition-all text-left font-semibold group ${selectedAnswers[currentQuestion] === idx
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shadow-lg ring-4 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedAnswers[currentQuestion] === idx
                            ? "border-indigo-500 bg-indigo-500"
                            : "border-slate-300 dark:border-slate-600 group-hover:border-indigo-400"
                            }`}>
                            {selectedAnswers[currentQuestion] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-700 dark:text-slate-300 text-lg mb-8 font-medium">{challenge.scenario || "Complete this challenge to earn XP!"}</p>
                  <button
                    onClick={handleComplete}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-indigo-500/30 transition-all hover:scale-105"
                  >
                    Mark as Complete
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40 animate-in zoom-in spin-in-12 duration-700">
                <Zap className="w-16 h-16 text-white fill-current" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Challenge Completed!</h3>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-8 shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
                <span className="text-xl font-black text-white">+{isQuiz ? score : challenge.points} XP</span>
              </div>
              <br />
              <button
                onClick={() => {
                  onComplete(challengeId)
                  onClose()
                }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-indigo-500/30 transition-all hover:scale-105"
              >
                Claim Rewards
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
