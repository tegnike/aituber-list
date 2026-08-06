'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import type { DateFilter, PlatformFilter, SubscriberFilter, SortOrder, TagFilterMode } from '@/components/aituber-list/types'
import { PARTIAL_AITUBER_TAG } from '@/components/aituber-list/types'

export interface UrlState {
  tags: string[]
  tagMode: TagFilterMode
  date: DateFilter
  subscriber: SubscriberFilter | null
  platform: PlatformFilter
  search: string
  sort: SortOrder
  mainOnly: boolean
  upcoming: boolean
}

export interface UseUrlStateReturn {
  initialState: UrlState
  updateUrl: (state: Partial<UrlState>) => void
  isInitialized: boolean
}

const DEFAULT_STATE: UrlState = {
  tags: [],
  tagMode: 'or',
  date: 'all',
  subscriber: null,
  platform: 'all',
  search: '',
  sort: 'latest',
  mainOnly: false,
  upcoming: false
}

export function useUrlState(): UseUrlStateReturn {
  const pathname = usePathname()
  const [isInitialized, setIsInitialized] = useState(false)
  const [initialState, setInitialState] = useState<UrlState>(DEFAULT_STATE)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const state: UrlState = { ...DEFAULT_STATE }

    const tagsParam = params.get('tags')
    if (tagsParam) {
      state.tags = tagsParam
        .split(',')
        .filter(Boolean)
        .filter(tag => tag !== PARTIAL_AITUBER_TAG)
    }

    const tagModeParam = params.get('tagMode') as TagFilterMode
    if (tagModeParam && ['and', 'or', 'not'].includes(tagModeParam)) {
      state.tagMode = tagModeParam
    }

    const dateParam = params.get('date') as DateFilter
    if (dateParam && ['all', '1month', '3months', '6months', '1year', 'older'].includes(dateParam)) {
      state.date = dateParam
    }

    const subscriberParam = params.get('subscriber') as SubscriberFilter
    if (subscriberParam && ['100', '500', '1000', '10000'].includes(subscriberParam)) {
      state.subscriber = subscriberParam
    }

    const platformParam = params.get('platform') as PlatformFilter
    if (platformParam && ['all', 'youtube', 'twitch'].includes(platformParam)) {
      state.platform = platformParam
    }

    const searchParam = params.get('search')
    if (searchParam) {
      state.search = searchParam
    }

    const sortParam = params.get('sort') as SortOrder
    if (sortParam && ['subscribers', 'latest', 'name', 'random'].includes(sortParam)) {
      state.sort = sortParam
    }

    const mainOnlyParam = params.get('mainOnly')
    if (mainOnlyParam === 'true') {
      state.mainOnly = true
    }

    const upcomingParam = params.get('upcoming')
    if (upcomingParam === 'true') {
      state.upcoming = true
    }

    setInitialState(state)
    setIsInitialized(true)
  }, [])

  const updateUrl = useCallback((state: Partial<UrlState>) => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)

    if (state.tags !== undefined) {
      const selectableTags = state.tags.filter(tag => tag !== PARTIAL_AITUBER_TAG)
      if (selectableTags.length > 0) {
        params.set('tags', selectableTags.join(','))
      } else {
        params.delete('tags')
      }
    }

    if (state.tagMode !== undefined) {
      const selectableTags = state.tags?.filter(tag => tag !== PARTIAL_AITUBER_TAG)
      if (state.tagMode !== 'or' && selectableTags && selectableTags.length > 0) {
        params.set('tagMode', state.tagMode)
      } else {
        params.delete('tagMode')
      }
    }

    if (state.date !== undefined) {
      if (state.date !== 'all') {
        params.set('date', state.date)
      } else {
        params.delete('date')
      }
    }

    if (state.subscriber !== undefined) {
      if (state.subscriber) {
        params.set('subscriber', state.subscriber)
      } else {
        params.delete('subscriber')
      }
    }

    if (state.platform !== undefined) {
      if (state.platform !== 'all') {
        params.set('platform', state.platform)
      } else {
        params.delete('platform')
      }
    }

    if (state.search !== undefined) {
      if (state.search) {
        params.set('search', state.search)
      } else {
        params.delete('search')
      }
    }

    if (state.sort !== undefined) {
      if (state.sort !== 'latest') {
        params.set('sort', state.sort)
      } else {
        params.delete('sort')
      }
    }

    if (state.mainOnly !== undefined) {
      if (state.mainOnly) {
        params.set('mainOnly', 'true')
      } else {
        params.delete('mainOnly')
      }
    }

    if (state.upcoming !== undefined) {
      if (state.upcoming) {
        params.set('upcoming', 'true')
      } else {
        params.delete('upcoming')
      }
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    window.history.replaceState({}, '', newUrl)
  }, [pathname])

  return {
    initialState,
    updateUrl,
    isInitialized
  }
}
