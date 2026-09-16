import { Crown } from 'lucide-react'
import type { AITuber } from './types'

export function MembershipBadge({ aituber, label, compact = false }: { aituber: AITuber; label: string; compact?: boolean }) {
  if (!aituber.youtubeChannelID || !aituber.youtubeMembership?.confirmedAt) return null

  return (
    <a
      href={`https://www.youtube.com/channel/${aituber.youtubeChannelID}/join`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
      aria-label={label}
      title={`${label} · ${aituber.youtubeMembership.confirmedAt.slice(0, 10)}`}
    >
      <Crown className="h-4 w-4 fill-amber-200 dark:fill-amber-800" aria-hidden="true" />
      <span className={compact ? "hidden sm:inline" : undefined}>{label}</span>
    </a>
  )
}
