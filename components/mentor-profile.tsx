"use client"

import { X, Award, Users, Clock, MapPin, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MentorProfileProps {
  mentor: {
    id: number
    name: string
    field: string
    role: string
    expertise: string[]
    bio: string
    avatar: string
    rating: number
    responseTime: string
    location: string
    students: number
    color: string
    icon: string
    tips: string[]
  }
  onClose: () => void
  onAskQuestion: () => void
}

export default function MentorProfile({ mentor, onClose, onAskQuestion }: MentorProfileProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <Card className="bg-white dark:bg-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`h-32 bg-gradient-to-br ${mentor.color} relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar & Basic Info */}
          <div className="flex gap-6 -mt-16 mb-6 pb-6 border-b border-border">
            <div
              className={`w-28 h-28 rounded-full bg-gradient-to-br ${mentor.color} flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white dark:border-slate-800 flex-shrink-0`}
            >
              {mentor.avatar}
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-3xl font-bold text-foreground mb-1">{mentor.name}</h1>
              <p className="text-lg text-muted-foreground mb-3">{mentor.role}</p>
              <p className="text-sm text-foreground mb-4">{mentor.field}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-lg text-foreground">{mentor.rating}</span>
                </div>
                <div className="text-sm text-muted-foreground">Excellent match</div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">About</h3>
            <p className="text-foreground leading-relaxed">{mentor.bio}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">{mentor.students}</p>
              <p className="text-sm text-muted-foreground">Students Helped</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-pink-500" />
              </div>
              <p className="text-sm font-semibold text-foreground">{mentor.responseTime}</p>
              <p className="text-sm text-muted-foreground">Response Time</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-sm font-semibold text-foreground">{mentor.location}</p>
              <p className="text-sm text-muted-foreground">Based In</p>
            </div>
          </div>

          {/* Expertise */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-200 rounded-full text-sm font-medium border border-indigo-200 dark:border-indigo-800"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Pro Tips</h3>
            <div className="space-y-3">
              {mentor.tips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-muted rounded-lg">
                  <Award className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-border">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Close
            </Button>
            <Button onClick={onAskQuestion} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white">
              Ask Question
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
