'use client'

import { useMemo } from 'react'
import type { AITuber, SortOrder } from '@/components/aituber-list/types'

export interface UseAituberSortReturn {
  sortedAITubers: AITuber[]
}

export function useAituberSort(
  aitubers: AITuber[],
  sortOrder: SortOrder
): UseAituberSortReturn {
  const sortedAITubers = useMemo(() => {
    const sorted = [...aitubers]
    switch (sortOrder) {
      case 'subscribers':
        return sorted.sort((a, b) => b.youtubeSubscribers - a.youtubeSubscribers)
      case 'latest':
        return sorted.sort((a, b) => new Date(b.latestVideoDate).getTime() - new Date(a.latestVideoDate).getTime())
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'ja'))
      case 'random':
        return sorted.sort(() => Math.random() - 0.5)
      default:
        return sorted
    }
  }, [aitubers, sortOrder])

  return {
    sortedAITubers
  }
}
