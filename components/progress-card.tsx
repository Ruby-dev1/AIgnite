"use client"

interface ProgressCardProps {
  name: string
  progress: number
}

export default function ProgressCard({ name, progress }: ProgressCardProps) {
  const getColor = (progress: number) => {
    if (progress >= 70) return "from-emerald-500 to-teal-500"
    if (progress >= 50) return "from-blue-500 to-indigo-500"
    if (progress >= 30) return "from-yellow-500 to-amber-500"
    return "from-pink-500 to-rose-500"
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-foreground">{name}</p>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColor(progress)} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
