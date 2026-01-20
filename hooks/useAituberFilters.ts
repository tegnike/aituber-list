'use client'

import { useMemo } from 'react'
import type { AITuber, DateFilter, SubscriberFilter, TagFilterMode } from '@/components/aituber-list/types'
import { isWithinDateRange, SUBSCRIBER_FILTER_LABELS } from '@/components/aituber-list/types'

export interface FilterOptions {
  selectedTags: string[]
  tagFilterMode: TagFilterMode
  selectedDateFilter: DateFilter
  selectedSubscriberFilter: SubscriberFilter | null
  nameFilter: string
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
    showUpcomingOnly,
    showFavoritesOnly,
    favorites
  } = options

  const filteredAITubers = useMemo(() => {
    const matchesTags = (aituber: AITuber): boolean => {
      if (selectedTags.length === 0) return true

      switch (tagFilterMode) {
        case 'and':
          return selectedTags.every(tag => aituber.tags.includes(tag))
        case 'not':
          return selectedTags.every(tag => !aituber.tags.includes(tag))
        case 'or':
        default:
          return selectedTags.some(tag => aituber.tags.includes(tag))
      }
    }

    return aitubers.filter(aituber =>
      isWithinDateRange(aituber.latestVideoDate, selectedDateFilter) &&
      matchesTags(aituber) &&
      (!selectedSubscriberFilter ||
        aituber.youtubeSubscribers >= SUBSCRIBER_FILTER_LABELS[selectedSubscriberFilter].threshold) &&
      (nameFilter === '' ||
        aituber.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        aituber.description.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (!showUpcomingOnly || aituber.isUpcoming) &&
      (!showFavoritesOnly || favorites.includes(aituber.youtubeChannelID))
    )
  }, [
    aitubers,
    selectedDateFilter,
    selectedTags,
    tagFilterMode,
    selectedSubscriberFilter,
    nameFilter,
    showUpcomingOnly,
    showFavoritesOnly,
    favorites
  ])

  const activeFilterCount = useMemo(() => {
    return (
      (selectedTags.length > 0 ? 1 : 0) +
      (selectedSubscriberFilter ? 1 : 0) +
      (nameFilter ? 1 : 0) +
      (selectedDateFilter !== 'all' ? 1 : 0) +
      (showUpcomingOnly ? 1 : 0) +
      (showFavoritesOnly ? 1 : 0)
    )
  }, [selectedTags, selectedSubscriberFilter, nameFilter, selectedDateFilter, showUpcomingOnly, showFavoritesOnly])

  return {
    filteredAITubers,
    activeFilterCount
  }
}
