'use client'

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Calendar, Heart } from "lucide-react"
import { YoutubeIcon } from "@/components/icons"
import { formatSubscriberCount, getTagName, TranslationKey, Locale } from "@/lib/i18n"
import { AITuberImage } from './AITuberImage'
import type { AITuber } from './types'

interface AituberListItemProps {
  aituber: AITuber
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  isFavorite: boolean
  onFavoriteToggle: () => void
  locale: Locale
  t: (key: TranslationKey) => string
  priority?: boolean
}

export function AituberListItem({
  aituber,
  selectedTags,
  onTagSelect,
  isFavorite,
  onFavoriteToggle,
  locale,
  t,
  priority = false
}: AituberListItemProps) {
  return (
    <Card className="border-2 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3">
        {/* アイコン */}
        <div className="shrink-0">
          {aituber.youtubeURL ? (
            <a href={`https://www.youtube.com/channel/${aituber.youtubeChannelID}`} target="_blank" rel="noopener noreferrer">
              <AITuberImage
                src={aituber.imageUrl}
                alt={aituber.name}
                size={36}
                className="rounded-full hover:opacity-80 transition-opacity"
                priority={priority}
              />
            </a>
          ) : (
            <AITuberImage
              src={aituber.imageUrl}
              alt={aituber.name}
              size={36}
              className="rounded-full"
              priority={priority}
            />
          )}
        </div>

        {/* 名前 */}
        <div className="flex-1 min-w-0 truncate font-medium text-sm sm:text-base">
          {aituber.name}
        </div>

        {/* タグ */}
        <div className="hidden lg:flex flex-wrap gap-1 shrink-0 max-w-[200px]">
          {aituber.tags.slice(0, 2).map((tag, tagIndex) => (
            <Badge
              key={tagIndex}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:opacity-80 transition-all text-xs py-0.5 px-2"
              onClick={() => onTagSelect(tag)}
            >
              {getTagName(tag, locale)}
            </Badge>
          ))}
          {aituber.tags.length > 2 && (
            <span className="text-xs text-muted-foreground">+{aituber.tags.length - 2}</span>
          )}
        </div>

        {/* 登録者数 */}
        <div className="hidden sm:block w-20 shrink-0 text-sm text-muted-foreground text-right">
          {formatSubscriberCount(aituber.youtubeSubscribers, locale)}
        </div>

        {/* 最終更新日 */}
        <div className="hidden md:flex w-24 shrink-0 items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span className="truncate">
            {aituber.latestVideoDate ? new Date(aituber.latestVideoDate).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US') : '-'}
          </span>
        </div>

        {/* 配信予定バッジ */}
        {aituber.isUpcoming && (
          <Badge variant="secondary" className="hidden sm:inline-flex bg-blue-100 text-blue-800 text-xs px-1 shrink-0">
            {t('card.upcomingStream')}
          </Badge>
        )}

        {/* 最新動画リンク */}
        {aituber.latestVideoUrl && (
          <a
            href={aituber.latestVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-1 sm:p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label={t('card.latestVideo')}
          >
            <YoutubeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 hover:text-red-600" />
          </a>
        )}

        {/* お気に入りボタン */}
        <button
          onClick={onFavoriteToggle}
          className="shrink-0 p-1 sm:p-1.5 rounded-full hover:bg-muted transition-colors"
          aria-label={isFavorite ? t('card.removeFavorite') : t('card.addFavorite')}
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
          />
        </button>
      </div>
    </Card>
  )
}
