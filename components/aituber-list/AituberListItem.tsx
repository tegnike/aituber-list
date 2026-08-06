'use client'

import { memo } from 'react'
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Calendar, Heart, Twitch } from "lucide-react"
import { YoutubeIcon } from "@/components/icons"
import { formatSubscriberCount, getTagName, TranslationKey, Locale } from "@/lib/i18n"
import { AITuberImage } from './AITuberImage'
import { HighlightText } from './HighlightText'
import { getAituberProfileUrl, getLatestContent } from './types'
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
  searchTerm?: string
}

export const AituberListItem = memo(function AituberListItem({
  aituber,
  selectedTags,
  onTagSelect,
  isFavorite,
  onFavoriteToggle,
  locale,
  t,
  priority = false,
  searchTerm = ''
}: AituberListItemProps) {
  const profileUrl = getAituberProfileUrl(aituber)
  const latestContent = getLatestContent(aituber)

  return (
    <Card className="overflow-hidden border-border/70 bg-card/95 shadow-sm transition-all hover:border-violet-300/80 hover:shadow-md dark:hover:border-violet-400/35">
      <div className="flex items-center gap-2 p-3 sm:gap-4 sm:px-4">
        {/* アイコン */}
        <div className="shrink-0">
          {profileUrl ? (
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              <AITuberImage
                src={aituber.imageUrl}
                alt={aituber.name}
                size={36}
                className="rounded-full ring-2 ring-violet-100 ring-offset-2 ring-offset-card transition-opacity hover:opacity-80 dark:ring-violet-400/25"
                priority={priority}
              />
            </a>
          ) : (
            <AITuberImage
              src={aituber.imageUrl}
              alt={aituber.name}
              size={36}
              className="rounded-full ring-2 ring-violet-100 ring-offset-2 ring-offset-card dark:ring-violet-400/25"
              priority={priority}
            />
          )}
        </div>

        {/* 名前 */}
        <div className="min-w-0 flex-1 truncate text-sm font-semibold tracking-[-0.01em] sm:text-base">
          <HighlightText text={aituber.name} searchTerm={searchTerm} />
        </div>

        {/* タグ */}
        <div className="hidden lg:flex flex-wrap gap-1 shrink-0 max-w-[200px]">
          {aituber.tags.slice(0, 2).map((tag, tagIndex) => (
            <Badge
              key={tagIndex}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer rounded-full px-2 py-0.5 text-xs transition-all hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-400/10"
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
        {(aituber.youtubeChannelID || typeof aituber.twitchFollowers === 'number') && (
          <div className="hidden w-20 shrink-0 text-right text-sm text-muted-foreground sm:block">
            {formatSubscriberCount(
              aituber.youtubeChannelID ? aituber.youtubeSubscribers : (aituber.twitchFollowers || 0),
              locale
            )}
          </div>
        )}

        {/* 最終更新日 */}
        <div className="hidden md:flex w-24 shrink-0 items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span className="truncate">
            {latestContent?.date ? new Date(latestContent.date).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US') : '-'}
          </span>
        </div>

        {/* 配信予定バッジ */}
        {latestContent?.isLive ? (
          <Badge className="hidden shrink-0 bg-red-600 px-1 text-xs text-white hover:bg-red-600 sm:inline-flex">
            {t('card.liveNow')}
          </Badge>
        ) : aituber.isUpcoming ? (
          <Badge variant="secondary" className="hidden shrink-0 bg-blue-100 px-1 text-xs text-blue-800 dark:bg-blue-400/20 dark:text-blue-200 sm:inline-flex">
            {t('card.upcomingStream')}
          </Badge>
        ) : null}

        {/* 最新動画リンク */}
        {latestContent && (
          <a
            href={latestContent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-transparent p-1.5 transition-colors hover:border-border hover:bg-muted"
            aria-label={t('card.latestVideo')}
          >
            {latestContent.platform === 'twitch' ? (
              <Twitch className="h-4 w-4 text-purple-600 hover:text-purple-700 sm:h-5 sm:w-5" />
            ) : (
              <YoutubeIcon className="h-4 w-4 text-red-500 hover:text-red-600 sm:h-5 sm:w-5" />
            )}
          </a>
        )}

        {/* お気に入りボタン */}
        <button
          onClick={onFavoriteToggle}
          className="shrink-0 rounded-full border border-transparent p-1.5 transition-colors hover:border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={isFavorite ? t('card.removeFavorite') : t('card.addFavorite')}
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
          />
        </button>
      </div>
    </Card>
  )
})
