'use client'

import { useMemo } from 'react'
import { getAudienceCount, getLatestContentDate } from '@/components/aituber-list/types'
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
        return sorted.sort((a, b) => getAudienceCount(b) - getAudienceCount(a))
      case 'latest':
        return sorted.sort((a, b) => new Date(getLatestContentDate(b)).getTime() - new Date(getLatestContentDate(a)).getTime())
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
