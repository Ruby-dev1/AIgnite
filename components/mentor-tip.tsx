"use client"

interface MentorTipProps {
  mentor: string
  role: string
  avatar: string
  tip: string
  icon: string
}

export default function MentorTip({ mentor, role, avatar, tip, icon }: MentorTipProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {avatar}
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-foreground">{mentor}</h4>
          <p className="text-sm text-muted-foreground mb-3">{role}</p>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border-l-4 border-indigo-500">
            <p className="text-sm text-foreground flex items-start gap-2">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <span>{tip}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
