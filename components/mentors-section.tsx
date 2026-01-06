"use client"

import { useState } from "react"
import { MessageCircle, Star, Clock, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MentorProfile from "./mentor-profile"
import QueryModal from "./query-modal"

const mentorsData = [
  {
    id: 1,
    name: "Alex Chen",
    field: "IT & Technology",
    role: "Senior Software Engineer",
    expertise: ["Web Development", "AI/ML", "Cloud Computing"],
    bio: "10+ years in tech industry. Passionate about mentoring young developers.",
    avatar: "AC",
    rating: 4.9,
    responseTime: "2 hours",
    location: "Kathmandu",
    students: 145,
    color: "from-blue-500 to-cyan-500",
    icon: "💻",
    tips: [
      "Start with the fundamentals before jumping into advanced concepts",
      "Build projects to apply what you learn",
      "Never stop learning and stay updated with latest technologies",
    ],
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    field: "Health Sciences",
    role: "Medical Doctor & Educator",
    expertise: ["Medical Education", "Patient Care", "Public Health"],
    bio: "MD from top institution. Dedicated to nurturing the next generation of healthcare professionals.",
    avatar: "PS",
    rating: 4.8,
    responseTime: "4 hours",
    location: "Pokhara",
    students: 98,
    color: "from-red-500 to-pink-500",
    icon: "🏥",
    tips: [
      "Empathy is as important as knowledge in healthcare",
      "Keep yourself updated with latest medical research",
      "Balance theory with practical experience",
    ],
  },
  {
    id: 3,
    name: "Raj Patel",
    field: "Business",
    role: "Entrepreneur & Business Strategist",
    expertise: ["Startup Strategy", "Finance", "Leadership"],
    bio: "Founded 3 successful startups. Mentor to 20+ entrepreneurs.",
    avatar: "RP",
    rating: 4.9,
    responseTime: "1 hour",
    location: "Kathmandu",
    students: 167,
    color: "from-emerald-500 to-teal-500",
    icon: "📊",
    tips: [
      "Every failure is a learning opportunity",
      "Network effectively - connections are crucial",
      "Focus on solving real problems, not just ideas",
    ],
  },
  {
    id: 4,
    name: "Sophia Kramer",
    field: "Fashion & Design",
    role: "Fashion Designer & Creative Director",
    expertise: ["Fashion Design", "Trend Forecasting", "Sustainable Fashion"],
    bio: "Awarded designer with international recognition. Believer in sustainable fashion.",
    avatar: "SK",
    rating: 4.8,
    responseTime: "3 hours",
    location: "Bhaktapur",
    students: 87,
    color: "from-purple-500 to-pink-500",
    icon: "👗",
    tips: [
      "Creativity meets functionality in great design",
      "Research and understand your market deeply",
      "Sustainability is the future of fashion",
    ],
  },
  {
    id: 5,
    name: "Marco Rossi",
    field: "Arts & Creative",
    role: "Digital Artist & Animation Director",
    expertise: ["Digital Art", "Animation", "Concept Art"],
    bio: "Award-winning artist with works featured globally. Passionate about mentoring creative minds.",
    avatar: "MR",
    rating: 4.9,
    responseTime: "2 hours",
    location: "Kathmandu",
    students: 156,
    color: "from-orange-500 to-red-500",
    icon: "🎨",
    tips: [
      "Practice daily - art is a skill that improves with repetition",
      "Study anatomy and perspective fundamentals",
      "Your unique style comes from personal experiences",
    ],
  },
]

export default function MentorsSection() {
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [showQueryModal, setShowQueryModal] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const featuredMentors = mentorsData.filter((m) => m.rating >= 4.9)
  const displayedMentors = activeTab === "featured" ? featuredMentors : mentorsData

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-2">Meet Your Mentors</h2>
        <p className="text-muted-foreground text-lg">Get guidance from industry experts across all career paths</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            activeTab === "all" ? "bg-indigo-500 text-white shadow-lg" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          All Mentors ({mentorsData.length})
        </button>
        <button
          onClick={() => setActiveTab("featured")}
          className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            activeTab === "featured"
              ? "bg-amber-500 text-white shadow-lg"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Star className="w-4 h-4" />
          Top Rated ({featuredMentors.length})
        </button>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {displayedMentors.map((mentor) => (
          <Card
            key={mentor.id}
            className="bg-white dark:bg-slate-800 hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
            onClick={() => {
              setSelectedMentor(mentor)
            }}
          >
            {/* Header Background */}
            <div className={`h-24 bg-gradient-to-br ${mentor.color}`}></div>

            {/* Avatar */}
            <div className="px-4 -mt-12 pb-4 flex flex-col items-center relative z-10">
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${mentor.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white dark:border-slate-800 mb-3`}
              >
                {mentor.avatar}
              </div>

              <h3 className="text-lg font-bold text-foreground text-center">{mentor.name}</h3>
              <p className="text-sm text-muted-foreground text-center mb-3">{mentor.role}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">{mentor.rating}</span>
              </div>

              {/* Stats */}
              <div className="w-full space-y-2 mb-4 text-center text-sm">
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Responds in {mentor.responseTime}</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{mentor.location}</span>
                </div>
              </div>

              {/* Button */}
              <Button
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white gap-2 group-hover:shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedMentor(mentor)
                  setShowQueryModal(true)
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Ask a Question
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {selectedMentor && !showQueryModal && (
        <MentorProfile
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
          onAskQuestion={() => setShowQueryModal(true)}
        />
      )}

      {selectedMentor && showQueryModal && (
        <QueryModal
          mentor={selectedMentor}
          onClose={() => {
            setShowQueryModal(false)
            setSelectedMentor(null)
          }}
        />
      )}
    </div>
  )
}
