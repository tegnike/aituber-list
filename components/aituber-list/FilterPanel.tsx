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
import { getTagName, getTagDescription, TranslationKey, Locale } from "@/lib/i18n"
import { getLatestContentDate } from './types'
import type { AITuber, DateFilter, SubscriberFilter, TagFilterMode } from './types'
import { isWithinDateRange, SUBSCRIBER_FILTER_LABELS } from './types'

interface FilterPanelProps {
  // フィルター状態
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  tagFilterMode: TagFilterMode
  onTagFilterModeChange: (mode: TagFilterMode) => void
  selectedDateFilter: DateFilter
  onDateFilterChange: (filter: DateFilter) => void
  selectedSubscriberFilter: SubscriberFilter | null
  onSubscriberFilterChange: (filter: SubscriberFilter | null) => void
  nameFilter: string
  onNameFilterChange: (value: string) => void
  showMainAITubersOnly: boolean
  onMainAITubersOnlyChange: (value: boolean) => void
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
  locale: Locale
  t: (key: TranslationKey, params?: Record<string, string | number>) => string

  // 開閉状態
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function FilterPanel({
  selectedTags,
  onTagToggle,
  tagFilterMode,
  onTagFilterModeChange,
  selectedDateFilter,
  onDateFilterChange,
  selectedSubscriberFilter,
  onSubscriberFilterChange,
  nameFilter,
  onNameFilterChange,
  showMainAITubersOnly,
  onMainAITubersOnlyChange,
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
    <Card className="mb-6 overflow-hidden border-violet-200/80 bg-card/95 shadow-[0_16px_50px_-36px_hsl(258_84%_45%/0.55)] dark:border-violet-400/20">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CardHeader className="bg-muted/45 px-4 py-4 sm:px-6">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between gap-2 group">
              <CardTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
                {t('filter.title')}
                {activeFilterCount > 0 && (
                  <Badge className="border-0 bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-200" variant="secondary">
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
                    className="h-7 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground"
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
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/70">
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                </span>
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-7 border-t border-border/60 px-4 py-6 sm:px-6">
            {/* 名前フィルター */}
            <div className="space-y-4">
              <div className="text-sm font-bold">{t('filter.searchByName')}</div>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => onNameFilterChange(e.target.value)}
                placeholder={t('filter.searchPlaceholder')}
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/70 hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:hover:border-violet-400/40"
              />
            </div>

            {/* タグフィルター */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-sm font-bold">{t('filter.tags')}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{t('filter.searchCondition')}</span>
                  <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/60 p-1">
                    <Button
                      variant={tagFilterMode === 'or' ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => onTagFilterModeChange('or')}
                      className="h-8 rounded-lg px-3 text-xs sm:px-4 sm:text-sm"
                    >
                      OR
                    </Button>
                    <Button
                      variant={tagFilterMode === 'and' ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => onTagFilterModeChange('and')}
                      className="h-8 rounded-lg px-3 text-xs sm:px-4 sm:text-sm"
                    >
                      AND
                    </Button>
                    <Button
                      variant={tagFilterMode === 'not' ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => onTagFilterModeChange('not')}
                      className="h-8 rounded-lg px-3 text-xs sm:px-4 sm:text-sm"
                    >
                      NOT
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
                            className="cursor-pointer rounded-full px-3 py-1 text-xs transition-colors hover:border-violet-300 hover:bg-violet-50 sm:text-sm dark:hover:bg-violet-400/10"
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
                  <div className="space-y-2 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
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
                    className="cursor-pointer rounded-full px-3 py-1 text-xs transition-all hover:border-violet-300 hover:bg-violet-50 sm:text-sm dark:hover:bg-violet-400/10"
                    onClick={() => onDateFilterChange(value)}
                  >
                    {t(`date.${value}` as `date.${DateFilter}`)}
                    <span className="ml-1 text-xs">
                      ({aitubers.filter(a => isWithinDateRange(getLatestContentDate(a), value)).length})
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
                  className="cursor-pointer rounded-full px-3 py-1 text-xs transition-all hover:border-violet-300 hover:bg-violet-50 sm:text-sm dark:hover:bg-violet-400/10"
                  onClick={() => onSubscriberFilterChange(null)}
                >
                  {t('filter.all')}
                </Badge>
                {(Object.keys(SUBSCRIBER_FILTER_LABELS) as SubscriberFilter[]).map((value) => (
                  <Badge
                    key={value}
                    variant={selectedSubscriberFilter === value ? "default" : "outline"}
                    className="cursor-pointer rounded-full px-3 py-1 text-xs transition-all hover:border-violet-300 hover:bg-violet-50 sm:text-sm dark:hover:bg-violet-400/10"
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
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/60">
                  <input
                    type="checkbox"
                    checked={showMainAITubersOnly}
                    onChange={(e) => onMainAITubersOnlyChange(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{t('filter.mainAITubersOnly')}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/60">
                  <input
                    type="checkbox"
                    checked={showUpcomingOnly}
                    onChange={(e) => onUpcomingChange(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{t('filter.upcomingOnly')}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/60">
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
