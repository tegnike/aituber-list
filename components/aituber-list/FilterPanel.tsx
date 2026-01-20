'use client'

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, RotateCcw } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { getTagName, getTagDescription, TranslationKey } from "@/lib/i18n"
import type { AITuber, DateFilter, SubscriberFilter } from './types'
import { isWithinDateRange, SUBSCRIBER_FILTER_LABELS } from './types'

interface FilterPanelProps {
  // フィルター状態
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  isAndCondition: boolean
  onConditionChange: (isAnd: boolean) => void
  selectedDateFilter: DateFilter
  onDateFilterChange: (filter: DateFilter) => void
  selectedSubscriberFilter: SubscriberFilter | null
  onSubscriberFilterChange: (filter: SubscriberFilter | null) => void
  nameFilter: string
  onNameFilterChange: (value: string) => void
  showUpcomingOnly: boolean
  onUpcomingChange: (value: boolean) => void
  showFavoritesOnly: boolean
  onFavoritesChange: (value: boolean) => void

  // 表示情報
  activeFilterCount: number
  filteredCount: number
  totalCount: number
  allTags: string[]
  aitubers: AITuber[]

  // ハンドラー
  onReset: () => void

  // i18n
  locale: 'ja' | 'en'
  t: (key: TranslationKey, params?: Record<string, string | number>) => string

  // 開閉状態
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function FilterPanel({
  selectedTags,
  onTagToggle,
  isAndCondition,
  onConditionChange,
  selectedDateFilter,
  onDateFilterChange,
  selectedSubscriberFilter,
  onSubscriberFilterChange,
  nameFilter,
  onNameFilterChange,
  showUpcomingOnly,
  onUpcomingChange,
  showFavoritesOnly,
  onFavoritesChange,
  activeFilterCount,
  filteredCount,
  totalCount,
  allTags,
  aitubers,
  onReset,
  locale,
  t,
  isOpen,
  onOpenChange
}: FilterPanelProps) {
  const [isTagDescriptionOpen, setIsTagDescriptionOpen] = useState(false)

  return (
    <Card className="mb-6 border-2 dark:border-gray-700">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CardHeader className="py-3 px-3 sm:px-6">
          <CollapsibleTrigger className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 group">
              <CardTitle className="text-lg sm:text-xl flex items-center flex-wrap gap-2">
                {t('filter.title')}
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">
                    {t('filter.activeCount', { count: activeFilterCount })}
                  </Badge>
                )}
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onReset()
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    {t('filter.reset')}
                  </Button>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t('filter.showCount', { filtered: filteredCount, total: totalCount })}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6 px-3 sm:px-6">
            {/* 名前フィルター */}
            <div className="space-y-4">
              <div className="text-sm font-bold">{t('filter.searchByName')}</div>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => onNameFilterChange(e.target.value)}
                placeholder={t('filter.searchPlaceholder')}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              />
            </div>

            {/* タグフィルター */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-sm font-bold">{t('filter.tags')}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{t('filter.searchCondition')}</span>
                  <div className="flex items-center rounded-lg border p-1 gap-1">
                    <Button
                      variant={!isAndCondition ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => onConditionChange(false)}
                      className="text-xs sm:text-sm h-7 px-2 sm:px-4"
                    >
                      OR
                    </Button>
                    <Button
                      variant={isAndCondition ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => onConditionChange(true)}
                      className="text-xs sm:text-sm h-7 px-2 sm:px-4"
                    >
                      AND
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {allTags.map(tag => (
                  <TooltipProvider key={tag}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:opacity-80 transition-all text-xs sm:text-sm py-1 px-2 sm:px-3"
                          onClick={() => onTagToggle(tag)}
                        >
                          {getTagName(tag, locale)}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getTagDescription(tag, locale)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            {/* タグの説明 */}
            <div className="space-y-2">
              <Collapsible open={isTagDescriptionOpen} onOpenChange={setIsTagDescriptionOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isTagDescriptionOpen ? 'rotate-180' : ''}`} />
                  {t('filter.tagDescription')}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="space-y-2 text-sm text-muted-foreground border rounded-lg p-4">
                    {allTags.map((tag) => (
                      <div key={tag} className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5 shrink-0">
                          {getTagName(tag, locale)}
                        </Badge>
                        <span>{getTagDescription(tag, locale)}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* 最終更新日フィルター */}
            <div className="space-y-4">
              <div className="text-sm font-bold">{t('filter.lastUpdated')}</div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {(['all', '1month', '3months', '6months', '1year', 'older'] as DateFilter[]).map((value) => (
                  <Badge
                    key={value}
                    variant={selectedDateFilter === value ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 transition-all text-xs sm:text-sm py-1 px-2 sm:px-3"
                    onClick={() => onDateFilterChange(value)}
                  >
                    {t(`date.${value}` as `date.${DateFilter}`)}
                    <span className="ml-1 text-xs">
                      ({aitubers.filter(a => isWithinDateRange(a.latestVideoDate, value)).length})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* 登録者数フィルター */}
            <div className="space-y-4">
              <div className="text-sm font-bold">{t('filter.subscriberCount')}</div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Badge
                  variant={selectedSubscriberFilter === null ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-80 transition-all text-xs sm:text-sm py-1 px-2 sm:px-3"
                  onClick={() => onSubscriberFilterChange(null)}
                >
                  {t('filter.all')}
                </Badge>
                {(Object.keys(SUBSCRIBER_FILTER_LABELS) as SubscriberFilter[]).map((value) => (
                  <Badge
                    key={value}
                    variant={selectedSubscriberFilter === value ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 transition-all text-xs sm:text-sm py-1 px-2 sm:px-3"
                    onClick={() => onSubscriberFilterChange(value)}
                  >
                    {t(`subscriber.${value}` as `subscriber.${SubscriberFilter}`)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* その他のフィルター */}
            <div className="space-y-4">
              <div className="text-sm font-bold">{t('filter.additionalFilters')}</div>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUpcomingOnly}
                    onChange={(e) => onUpcomingChange(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{t('filter.upcomingOnly')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={(e) => onFavoritesChange(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{t('filter.favoritesOnly')}</span>
                </label>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
