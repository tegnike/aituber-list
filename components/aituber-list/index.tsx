'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { useLanguage } from "@/contexts/LanguageContext"
import { formatDate } from "@/lib/i18n"
import Link from 'next/link'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import aituberData from '@/app/data/aitubers.json'

// Types
import type { AITuber, DateFilter, SubscriberFilter, SortOrder, ViewMode } from './types'

// Components
import { FilterPanel } from './FilterPanel'
import { SortControls } from './SortControls'
import { AituberCard } from './AituberCard'
import { AituberListItem } from './AituberListItem'

// Hooks
import { useFavorites } from '@/hooks/useFavorites'
import { useUrlState } from '@/hooks/useUrlState'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useAituberFilters } from '@/hooks/useAituberFilters'
import { useAituberSort } from '@/hooks/useAituberSort'

// CSS for hiding scrollbar
const styles = `
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`

// JSONからデータを取得し、チャンネルIDが存在するもののみをフィルタリングして日付でソート
const aitubers: AITuber[] = aituberData.aitubers
  .filter(aituber => aituber.youtubeChannelID !== '')
  .sort((a, b) => {
    const dateA = new Date(a.latestVideoDate)
    const dateB = new Date(b.latestVideoDate)
    return dateB.getTime() - dateA.getTime()
  })

// 全てのタグを抽出
const allTags = Array.from(new Set(aitubers.flatMap(aituber => aituber.tags)))

export function AituberList() {
  const { locale, t } = useLanguage()

  // URL state
  const { initialState, updateUrl, isInitialized } = useUrlState()

  // Filter states
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isAndCondition, setIsAndCondition] = useState(false)
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilter>('all')
  const [selectedSubscriberFilter, setSelectedSubscriberFilter] = useState<SubscriberFilter | null>(null)
  const [nameFilter, setNameFilter] = useState('')
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // UI states
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isOverviewOpen, setIsOverviewOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>('subscribers')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Favorites hook
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  // Initialize from URL state
  useEffect(() => {
    if (!isInitialized) return

    setSelectedTags(initialState.tags)
    setIsAndCondition(initialState.tagMode === 'and')
    setSelectedDateFilter(initialState.date)
    setSelectedSubscriberFilter(initialState.subscriber)
    setNameFilter(initialState.search)
    setSortOrder(initialState.sort)
    setShowUpcomingOnly(initialState.upcoming)

    // フィルターがある場合はフィルターセクションを開く
    if (
      initialState.tags.length > 0 ||
      initialState.date !== 'all' ||
      initialState.subscriber ||
      initialState.search ||
      initialState.upcoming
    ) {
      setIsFiltersOpen(true)
    }
  }, [isInitialized, initialState])

  // Load view mode from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('aituber-view-mode') as ViewMode
    if (savedViewMode) {
      setViewMode(savedViewMode)
    }
  }, [])

  // Update URL when filters change
  useEffect(() => {
    if (!isInitialized) return

    updateUrl({
      tags: selectedTags,
      tagMode: isAndCondition ? 'and' : 'or',
      date: selectedDateFilter,
      subscriber: selectedSubscriberFilter,
      search: nameFilter,
      sort: sortOrder,
      upcoming: showUpcomingOnly
    })
  }, [
    isInitialized,
    selectedTags,
    isAndCondition,
    selectedDateFilter,
    selectedSubscriberFilter,
    nameFilter,
    sortOrder,
    showUpcomingOnly,
    updateUrl
  ])

  // Filtering hook
  const { filteredAITubers, activeFilterCount } = useAituberFilters(aitubers, {
    selectedTags,
    isAndCondition,
    selectedDateFilter,
    selectedSubscriberFilter,
    nameFilter,
    showUpcomingOnly,
    showFavoritesOnly,
    favorites
  })

  // Sorting hook
  const { sortedAITubers } = useAituberSort(filteredAITubers, sortOrder)

  // Infinite scroll hook
  const {
    displayedItems: displayedAITubers,
    loadMoreRef,
    isLoading,
    hasMore,
    showScrollTop,
    scrollToTop,
    resetPage
  } = useInfiniteScroll(sortedAITubers)

  // Reset page when filters change
  useEffect(() => {
    resetPage()
  }, [selectedDateFilter, selectedSubscriberFilter, nameFilter, showUpcomingOnly, showFavoritesOnly, sortOrder, resetPage])

  // Handlers
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
    resetPage()
  }, [resetPage])

  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTags([tag])
    setIsAndCondition(false)
    resetPage()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [resetPage])

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => {
      const newMode = prev === 'grid' ? 'list' : 'grid'
      localStorage.setItem('aituber-view-mode', newMode)
      return newMode
    })
  }, [])

  const resetAllFilters = useCallback(() => {
    setSelectedTags([])
    setIsAndCondition(false)
    setSelectedDateFilter('all')
    setSelectedSubscriberFilter(null)
    setNameFilter('')
    setShowUpcomingOnly(false)
    setShowFavoritesOnly(false)
    resetPage()
  }, [resetPage])

  return (
    <main id="main-content" className="container mx-auto px-2 sm:px-4 py-4">
      <style jsx global>{styles}</style>
      <div className="flex justify-end mb-2 gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
        {t('site.title')}
        <span className="text-lg sm:text-xl font-normal text-muted-foreground ml-2">
          {t('site.count', { count: aitubers.length })}
        </span>
      </h1>
      <p className="text-center text-sm text-muted-foreground mb-4">
        {t('site.lastUpdated', { date: formatDate(aituberData.lastUpdated, locale) })}
      </p>

      {/* Overview Card */}
      <Card className="mb-6 border-2 dark:border-gray-700">
        <Collapsible open={isOverviewOpen} onOpenChange={setIsOverviewOpen}>
          <CardHeader className="py-3 px-3 sm:px-6">
            <CollapsibleTrigger className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 group">
                <CardTitle className="text-lg sm:text-xl flex items-center flex-wrap gap-2">
                  {t('overview.title')}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOverviewOpen ? 'transform rotate-180' : ''}`} />
                </div>
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>{t('overview.description1')}</li>
                <li>{t('overview.description2')}</li>
                <li>{t('overview.description3')}</li>
                <li>{t('overview.description4')}</li>
              </ul>
            </CardContent>
            <CardContent>
              <div className="space-y-4">
                <p>{t('overview.contactTitle')}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <a
                      href="https://x.com/tegnike"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 462.799"><path fillRule="nonzero" d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"/></svg>
                      ニケちゃん @tegnike
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://github.com/tegnike/aituber-list"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                      {t('overview.github')}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Filter Panel */}
      <FilterPanel
        selectedTags={selectedTags}
        onTagToggle={toggleTag}
        isAndCondition={isAndCondition}
        onConditionChange={setIsAndCondition}
        selectedDateFilter={selectedDateFilter}
        onDateFilterChange={setSelectedDateFilter}
        selectedSubscriberFilter={selectedSubscriberFilter}
        onSubscriberFilterChange={setSelectedSubscriberFilter}
        nameFilter={nameFilter}
        onNameFilterChange={setNameFilter}
        showUpcomingOnly={showUpcomingOnly}
        onUpcomingChange={setShowUpcomingOnly}
        showFavoritesOnly={showFavoritesOnly}
        onFavoritesChange={setShowFavoritesOnly}
        activeFilterCount={activeFilterCount}
        filteredCount={filteredAITubers.length}
        totalCount={aitubers.length}
        allTags={allTags}
        aitubers={aitubers}
        onReset={resetAllFilters}
        locale={locale}
        t={t}
        isOpen={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
      />

      {/* Sort Controls */}
      <SortControls
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        viewMode={viewMode}
        onViewModeChange={toggleViewMode}
        t={t}
      />

      {/* AITuber List/Grid */}
      {viewMode === 'list' ? (
        <div className="flex flex-col gap-2">
          {displayedAITubers.map((aituber, index) => (
            <AituberListItem
              key={index}
              aituber={aituber}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              isFavorite={isFavorite(aituber.youtubeChannelID)}
              onFavoriteToggle={() => toggleFavorite(aituber.youtubeChannelID)}
              locale={locale}
              t={t}
              priority={index < 12}
              searchTerm={nameFilter}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedAITubers.map((aituber, index) => (
            <AituberCard
              key={index}
              aituber={aituber}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              isFavorite={isFavorite(aituber.youtubeChannelID)}
              onFavoriteToggle={() => toggleFavorite(aituber.youtubeChannelID)}
              locale={locale}
              t={t}
              priority={index < 12}
              searchTerm={nameFilter}
            />
          ))}
        </div>
      )}

      {/* Loading indicator and Intersection Observer target */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="mt-8 flex justify-center items-center py-4"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{t('loading.scrollMore')}</div>
          )}
        </div>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={scrollToTop}
          aria-label={t('loading.backToTop')}
        >
          <ChevronDown className="h-6 w-6 transform rotate-180" />
        </Button>
      )}

      {/* Footer */}
      <footer className="mt-8 flex justify-center gap-4 text-sm text-muted-foreground">
        <Link href="/terms" className="hover:underline">
          {t('footer.terms')}
        </Link>
        <Link href="/privacy" className="hover:underline">
          {t('footer.privacy')}
        </Link>
      </footer>
    </main>
  )
}
