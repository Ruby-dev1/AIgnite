"use client"

interface BadgeShowcaseProps {
  id: number
  name: string
  icon: string
  unlocked: boolean
}

export default function BadgeShowcase({ id, name, icon, unlocked }: BadgeShowcaseProps) {
  return (
    <div className={`relative group ${unlocked ? "animate-badge-unlock" : ""}`}>
      <div
        className={`aspect-square rounded-lg flex items-center justify-center text-4xl transition-all transform group-hover:scale-110 ${
          unlocked
            ? "bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-300 shadow-lg shadow-yellow-300/50"
            : "bg-muted text-muted-foreground opacity-50"
        }`}
      >
        {icon}
      </div>
      <p className="text-center text-sm font-medium mt-2 text-foreground">{name}</p>
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
          <span className="text-xl">🔒</span>
        </div>
      )}
    </div>
  )
}
