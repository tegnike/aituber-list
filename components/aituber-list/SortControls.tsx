'use client'

import { Button } from "@/components/ui/button"
import { ArrowUpDown, LayoutGrid, List } from "lucide-react"
import type { TranslationKey } from "@/lib/i18n"
import type { SortOrder, ViewMode } from './types'

interface SortControlsProps {
  sortOrder: SortOrder
  onSortChange: (order: SortOrder) => void
  viewMode: ViewMode
  onViewModeChange: () => void
  t: (key: TranslationKey) => string
}

export function SortControls({
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  t
}: SortControlsProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/75 p-3 shadow-sm backdrop-blur-sm sm:px-4">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">{t('sort.title')}:</span>
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          className="h-9 rounded-xl border border-input bg-background px-3 text-sm shadow-sm outline-none transition-shadow focus:ring-4 focus:ring-violet-500/10"
        >
          <option value="subscribers">{t('sort.subscribers')}</option>
          <option value="latest">{t('sort.latest')}</option>
          <option value="name">{t('sort.name')}</option>
          <option value="random">{t('sort.random')}</option>
        </select>
      </div>
      <div className="flex items-center gap-1 rounded-xl bg-muted/70 p-1">
        <Button
          variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onViewModeChange}
          aria-label={t('view.grid')}
          className="rounded-lg"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onViewModeChange}
          aria-label={t('view.list')}
          className="rounded-lg"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
