"use client"

import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  color: string
}

export default function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl p-6 text-white shadow-lg`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
