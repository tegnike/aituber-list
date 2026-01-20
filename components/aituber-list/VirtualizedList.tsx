'use client'

import { useCallback, useRef, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { AituberCard } from './AituberCard'
import { AituberListItem } from './AituberListItem'
import type { AITuber, ViewMode } from './types'
import type { Locale, TranslationKey } from '@/lib/i18n'

// Constants for virtual scroll (initial estimates, will be measured dynamically)
const CARD_HEIGHT = 520 // Approximate height of AituberCard
const LIST_ITEM_HEIGHT = 76 // Approximate height of AituberListItem
const GAP = 16

interface VirtualizedListProps {
  sortedAITubers: AITuber[]
  viewMode: ViewMode
  columns: number
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  isFavorite: (id: string) => boolean
  onFavoriteToggle: (id: string) => void
  locale: Locale
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  nameFilter: string
  resultsLabel: string
}

export function VirtualizedList({
  sortedAITubers,
  viewMode,
  columns,
  selectedTags,
  onTagSelect,
  isFavorite,
  onFavoriteToggle,
  locale,
  t,
  nameFilter,
  resultsLabel,
}: VirtualizedListProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Calculate row count for virtual scroll
  const rowCount = useMemo(() => {
    if (viewMode === 'list') {
      return sortedAITubers.length
    }
    return Math.ceil(sortedAITubers.length / columns)
  }, [sortedAITubers.length, columns, viewMode])

  // Virtual scroll for grid/list with dynamic measurement
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => viewMode === 'list' ? LIST_ITEM_HEIGHT : CARD_HEIGHT + GAP,
    overscan: 5,
    measureElement: (element) => {
      // Measure the actual height of each row
      return element.getBoundingClientRect().height
    },
  })

  // Get items for a specific row
  const getRowItems = useCallback((rowIndex: number): AITuber[] => {
    if (viewMode === 'list') {
      return [sortedAITubers[rowIndex]]
    }
    const start = rowIndex * columns
    const end = Math.min(start + columns, sortedAITubers.length)
    return sortedAITubers.slice(start, end)
  }, [sortedAITubers, columns, viewMode])

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-200px)] overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        ref={resultsRef}
        tabIndex={-1}
        aria-label={resultsLabel}
        className="outline-none"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowItems = getRowItems(virtualRow.index)

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {viewMode === 'list' ? (
                <div className="pb-2">
                  {rowItems.map((aituber) => (
                    <AituberListItem
                      key={aituber.youtubeChannelID}
                      aituber={aituber}
                      selectedTags={selectedTags}
                      onTagSelect={onTagSelect}
                      isFavorite={isFavorite(aituber.youtubeChannelID)}
                      onFavoriteToggle={() => onFavoriteToggle(aituber.youtubeChannelID)}
                      locale={locale}
                      t={t}
                      priority={virtualRow.index < 12}
                      searchTerm={nameFilter}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="pb-4"
                  style={{
                    display: 'grid',
                    gap: '16px',
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  }}
                >
                  {rowItems.map((aituber) => (
                    <AituberCard
                      key={aituber.youtubeChannelID}
                      aituber={aituber}
                      selectedTags={selectedTags}
                      onTagSelect={onTagSelect}
                      isFavorite={isFavorite(aituber.youtubeChannelID)}
                      onFavoriteToggle={() => onFavoriteToggle(aituber.youtubeChannelID)}
                      locale={locale}
                      t={t}
                      priority={virtualRow.index < 3}
                      searchTerm={nameFilter}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
