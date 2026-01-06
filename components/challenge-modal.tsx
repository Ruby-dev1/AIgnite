"use client"

import { useState } from "react"
import { X, Zap } from "lucide-react"

interface ChallengeModalProps {
  challengeId: number
  careers: any[]
  onComplete: (challengeId: number) => void
  onClose: () => void
}

const challengeData: Record<number, any> = {
  1: {
    title: "Build Your First Website",
    type: "simulation",
    points: 100,
    description: "Create a simple portfolio website using HTML and CSS",
    questions: [
      {
        q: "What is HTML primarily used for?",
        options: ["Styling", "Structure & Content", "Animations", "Databases"],
        correct: 1,
      },
      {
        q: "Which tag defines a paragraph?",
        options: ["<para>", "<p>", "<paragraph>", "<text>"],
        correct: 1,
      },
      {
        q: "What does CSS stand for?",
        options: ["Computer Style Sheet", "Cascading Style Sheet", "Creative Style System", "Code Style Service"],
        correct: 1,
      },
    ],
  },
  2: {
    title: "Debug a Real App",
    type: "practical",
    points: 150,
    description: "Fix bugs in a real application and learn debugging techniques",
    scenario: "A user registration form is not working. Find and fix 3 bugs in the code.",
  },
  3: {
    title: "Create an API",
    type: "project",
    points: 200,
    description: "Build a REST API that manages a list of tasks",
  },
  4: {
    title: "Patient Case Study",
    type: "simulation",
    points: 100,
    description: "Analyze a patient case and recommend treatment",
    scenario: "Patient presents with symptoms. What diagnosis would you suggest?",
  },
  5: {
    title: "Medical Quiz Challenge",
    type: "quiz",
    points: 120,
    description: "Test your medical knowledge",
    questions: [
      {
        q: "What is the normal human body temperature?",
        options: ["36.5°C", "37.5°C", "38.5°C", "35.5°C"],
        correct: 0,
      },
      {
        q: "How many bones are in an adult human body?",
        options: ["186", "206", "216", "196"],
        correct: 1,
      },
      {
        q: "What is the largest organ in the human body?",
        options: ["Heart", "Brain", "Skin", "Liver"],
        correct: 2,
      },
    ],
  },
  7: {
    title: "Startup Pitch Challenge",
    type: "simulation",
    points: 150,
    description: "Create and pitch a business idea to investors",
  },
  10: {
    title: "Design Your Collection",
    type: "project",
    points: 130,
    description: "Design a 5-piece fashion collection",
  },
  13: {
    title: "Create an Artwork",
    type: "project",
    points: 140,
    description: "Create digital art inspired by a theme",
  },
}

export default function ChallengeModal({ challengeId, onComplete, onClose }: ChallengeModalProps) {
  const challenge = challengeData[challengeId] || { title: "Unknown Challenge", points: 0 }
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{challenge.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!completed ? (
            <>
              {isQuiz && challenge.questions ? (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">
                        Question {currentQuestion + 1} of {challenge.questions.length}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((currentQuestion / challenge.questions.length) * 100)}%
                      </div>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all"
                        style={{ width: `${((currentQuestion + 1) / challenge.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold mb-4 text-foreground">
                    {challenge.questions[currentQuestion].q}
                  </h4>

                  <div className="space-y-3">
                    {challenge.questions[currentQuestion].options.map((option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium ${
                          selectedAnswers[currentQuestion] === idx
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                            : "border-border hover:border-indigo-300 dark:hover:border-indigo-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-foreground mb-4">{challenge.scenario || "Complete this challenge!"}</p>
                  <button
                    onClick={handleComplete}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    Mark as Complete
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Challenge Completed!</h3>
              <p className="text-muted-foreground mb-4">You earned {isQuiz ? score : challenge.points} points</p>
              <button
                onClick={() => {
                  onComplete(challengeId)
                  onClose()
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
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
