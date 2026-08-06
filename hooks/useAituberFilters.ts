'use client'

import { useMemo } from 'react'
import type { AITuber, DateFilter, SubscriberFilter, TagFilterMode } from '@/components/aituber-list/types'
import {
  getAituberId,
  getAudienceCount,
  getLatestContentDate,
  isWithinDateRange,
  PARTIAL_AITUBER_TAG,
  SUBSCRIBER_FILTER_LABELS
} from '@/components/aituber-list/types'

export interface FilterOptions {
  selectedTags: string[]
  tagFilterMode: TagFilterMode
  selectedDateFilter: DateFilter
  selectedSubscriberFilter: SubscriberFilter | null
  nameFilter: string
  showMainAITubersOnly: boolean
  showUpcomingOnly: boolean
  showFavoritesOnly: boolean
  favorites: string[]
}

export interface UseAituberFiltersReturn {
  filteredAITubers: AITuber[]
  activeFilterCount: number
}

export function useAituberFilters(
  aitubers: AITuber[],
  options: FilterOptions
): UseAituberFiltersReturn {
  const {
    selectedTags,
    tagFilterMode,
    selectedDateFilter,
    selectedSubscriberFilter,
    nameFilter,
    showMainAITubersOnly,
    showUpcomingOnly,
    showFavoritesOnly,
    favorites
  } = options

  const filteredAITubers = useMemo(() => {
    const selectableTags = selectedTags.filter(tag => tag !== PARTIAL_AITUBER_TAG)

    const matchesTags = (aituber: AITuber): boolean => {
      if (selectableTags.length === 0) return true

      switch (tagFilterMode) {
        case 'and':
          return selectableTags.every(tag => aituber.tags.includes(tag))
        case 'not':
          return selectableTags.every(tag => !aituber.tags.includes(tag))
        case 'or':
        default:
          return selectableTags.some(tag => aituber.tags.includes(tag))
      }
    }

    return aitubers.filter(aituber =>
      isWithinDateRange(getLatestContentDate(aituber), selectedDateFilter) &&
      matchesTags(aituber) &&
      (!showMainAITubersOnly || !aituber.tags.includes(PARTIAL_AITUBER_TAG)) &&
      (!selectedSubscriberFilter ||
        getAudienceCount(aituber) >= SUBSCRIBER_FILTER_LABELS[selectedSubscriberFilter].threshold) &&
      (nameFilter === '' ||
        aituber.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        aituber.description.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (!showUpcomingOnly || aituber.isUpcoming || aituber.twitchIsLive) &&
      (!showFavoritesOnly || favorites.includes(getAituberId(aituber)))
    )
  }, [
    aitubers,
    selectedDateFilter,
    selectedTags,
    tagFilterMode,
    selectedSubscriberFilter,
    nameFilter,
    showMainAITubersOnly,
    showUpcomingOnly,
    showFavoritesOnly,
    favorites
  ])

  const activeFilterCount = useMemo(() => {
    return (
      (selectedTags.some(tag => tag !== PARTIAL_AITUBER_TAG) ? 1 : 0) +
      (selectedSubscriberFilter ? 1 : 0) +
      (nameFilter ? 1 : 0) +
      (selectedDateFilter !== 'all' ? 1 : 0) +
      (showMainAITubersOnly ? 1 : 0) +
      (showUpcomingOnly ? 1 : 0) +
      (showFavoritesOnly ? 1 : 0)
    )
  }, [selectedTags, selectedSubscriberFilter, nameFilter, selectedDateFilter, showMainAITubersOnly, showUpcomingOnly, showFavoritesOnly])

  return {
    filteredAITubers,
    activeFilterCount
  }
}
