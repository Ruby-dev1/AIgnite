"use client"

import type React from "react"

import { useState } from "react"
import { X, Send, MessageCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface QueryModalProps {
  mentor: {
    id: number
    name: string
    role: string
    avatar: string
    color: string
  }
  onClose: () => void
}

export default function QueryModal({ mentor, onClose }: QueryModalProps) {
  const [query, setQuery] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [previousQueries, setPreviousQueries] = useState([
    {
      id: 1,
      question: "How do I get started with web development?",
      timestamp: "2 days ago",
      answer:
        "Start with HTML, CSS, and JavaScript basics. Build small projects to practice. Check out freeCodeCamp or Codecademy.",
    },
    {
      id: 2,
      question: "What's the best way to learn Python?",
      timestamp: "1 week ago",
      answer:
        "Learn syntax first, then practice with real projects. Use Python documentation and practice daily coding challenges.",
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Simulate adding the query
      setPreviousQueries([
        {
          id: previousQueries.length + 1,
          question: query,
          timestamp: "just now",
          answer:
            "Thank you for your question! " +
            mentor.name +
            " will respond within " +
            (Math.floor(Math.random() * 3) + 1) +
            " hours.",
        },
        ...previousQueries,
      ])
      setSubmitted(true)
      setQuery("")
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-white dark:bg-slate-800 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${mentor.color} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
              {mentor.avatar}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{mentor.name}</h2>
              <p className="text-white/80 text-sm">{mentor.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-all">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {/* Previous Queries */}
          <div className="space-y-3">
            {previousQueries.map((prev) => (
              <div key={prev.id} className="space-y-2">
                {/* Question */}
                <div className="flex justify-end">
                  <div className="max-w-xs bg-indigo-500 text-white rounded-2xl rounded-tr-none px-4 py-2">
                    <p className="text-sm">{prev.question}</p>
                  </div>
                </div>
                {/* Answer */}
                <div className="flex">
                  <div className="max-w-xs bg-muted rounded-2xl rounded-tl-none px-4 py-2">
                    <p className="text-sm text-foreground">{prev.answer}</p>
                    <p className="text-xs text-muted-foreground mt-1">{prev.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-200 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Question submitted! {mentor.name} will review and respond soon.
              </p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask your question here..."
              className="resize-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              rows={3}
            />
            <Button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white self-end"
              disabled={!query.trim()}
            >
              {Send && <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
