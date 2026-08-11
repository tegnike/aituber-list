'use client'

import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Calendar, Heart, Twitch } from "lucide-react"
import { YoutubeIcon, XIcon } from "@/components/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatDate, formatSubscriberCount, getTagName, getTagDescription, TranslationKey, Locale } from "@/lib/i18n"
import { AITuberImage } from './AITuberImage'
import { LazyVideo } from './LazyVideo'
import { HighlightText } from './HighlightText'
import { getAituberDetailPath, getLatestContent } from './types'
import type { AITuber } from './types'

interface AituberCardProps {
  aituber: AITuber
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  isFavorite: boolean
  onFavoriteToggle: () => void
  locale: Locale
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  priority?: boolean
  searchTerm?: string
}

export const AituberCard = memo(function AituberCard({
  aituber,
  selectedTags,
  onTagSelect,
  isFavorite,
  onFavoriteToggle,
  locale,
  t,
  priority = false,
  searchTerm = ''
}: AituberCardProps) {
  const detailPath = getAituberDetailPath(aituber)
  const twitchUrl = aituber.twitchURL || (aituber.twitchLogin ? `https://www.twitch.tv/${aituber.twitchLogin}` : '')
  const latestContent = getLatestContent(aituber)

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-border/70 bg-card/95 shadow-sm transition-colors duration-200 hover:border-violet-300/80 hover:bg-violet-50/20 dark:hover:border-violet-400/35 dark:hover:bg-violet-400/[0.03]">
      {/* お気に入りボタン */}
      <button
        onClick={onFavoriteToggle}
        className="absolute right-3 top-3 z-10 rounded-full border border-border/60 bg-background/90 p-2 shadow-sm backdrop-blur transition-colors hover:border-violet-300 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-violet-400/10"
        aria-label={isFavorite ? t('card.removeFavorite') : t('card.addFavorite')}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
        />
      </button>
      <CardHeader className="space-y-3 p-4 pb-3 sm:p-5 sm:pb-3">
        <CardTitle className="flex items-center gap-3 pr-10 text-base">
          <Link href={detailPath} aria-label={`${aituber.name}の詳細を見る`}>
            <AITuberImage
              src={aituber.imageUrl}
              alt={aituber.name}
              size={44}
              className="rounded-full ring-2 ring-violet-100 ring-offset-2 ring-offset-card transition-opacity hover:opacity-80 dark:ring-violet-400/25"
              priority={priority}
            />
          </Link>
          <Link href={detailPath} className="truncate tracking-[-0.02em]">
            <HighlightText text={aituber.name} searchTerm={searchTerm} />
          </Link>
        </CardTitle>
        <div className="flex flex-wrap gap-1.5">
          {aituber.tags.map((tag, tagIndex) => (
            <TooltipProvider key={tagIndex}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] transition-all hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-400/10"
                    onClick={() => onTagSelect(tag)}
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
      </CardHeader>
      <CardContent className="flex flex-grow flex-col px-4 pb-4 pt-1 sm:px-5">
        <div className="text-sm text-muted-foreground">
          <TooltipProvider>
            <Tooltip>
            <TooltipTrigger className="w-full text-left">
                <p className="line-clamp-3 min-h-[3.75rem] leading-5 hover:cursor-help">
                  <HighlightText text={aituber.description} searchTerm={searchTerm} />
                </p>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] whitespace-pre-wrap">
                {aituber.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-3">
          {(aituber.youtubeChannelID || typeof aituber.twitchFollowers === 'number') && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-foreground/80">
              {aituber.youtubeChannelID && (
                <div className="flex items-center gap-1.5">
                  <YoutubeIcon className="h-4 w-4 text-red-600" />
                  {t('card.subscriberCount', { count: formatSubscriberCount(aituber.youtubeSubscribers, locale) })}
                </div>
              )}
              {typeof aituber.twitchFollowers === 'number' && (
                <div className="flex items-center gap-1.5">
                  <Twitch className="h-4 w-4 text-purple-600" />
                  {t('card.followerCount', { count: formatSubscriberCount(aituber.twitchFollowers, locale) })}
                </div>
              )}
            </div>
          )}
          <div className="flex gap-2">
            {aituber.youtubeChannelID && (
              <Button variant="outline" size="sm" className="rounded-lg border-border/80" asChild>
                <a href={`https://www.youtube.com/channel/${aituber.youtubeChannelID}`} target="_blank" rel="noopener noreferrer">
                  <YoutubeIcon className="h-4 w-4 text-red-600" />
                  YouTube
                </a>
              </Button>
            )}
            {twitchUrl && (
              <Button variant="outline" size="sm" className="rounded-lg border-purple-300/70 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-400/10" asChild>
                <a href={twitchUrl} target="_blank" rel="noopener noreferrer">
                  <Twitch className="h-4 w-4 text-purple-600" />
                  Twitch
                </a>
              </Button>
            )}
            {aituber.twitterID && (
              <Button variant="outline" size="sm" className="rounded-lg border-border/80" asChild>
                <a href={`https://twitter.com/${aituber.twitterID}`} target="_blank" rel="noopener noreferrer">
                  <XIcon className="w-4 h-4 mr-2" />
                  X
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col overflow-hidden rounded-b-xl border-t border-border/60 p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {latestContent?.platform === 'youtube' ? (
            <LazyVideo
              videoUrl={latestContent.url}
              title={t('card.latestVideo', { name: aituber.name })}
              priority={priority}
            />
          ) : latestContent ? (
            <a
              href={latestContent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/twitch absolute inset-0 block bg-purple-950"
              aria-label={t('card.latestStream', { name: aituber.name })}
            >
              {latestContent.thumbnail ? (
                <Image
                  src={latestContent.thumbnail}
                  alt={latestContent.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="h-full w-full object-cover transition-opacity group-hover/twitch:opacity-85"
                  priority={priority}
                  unoptimized
                />
              ) : null}
              <span className="absolute bottom-3 left-3 right-3 line-clamp-2 rounded-md bg-black/70 px-3 py-2 text-sm font-medium text-white">
                {latestContent.title}
              </span>
            </a>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">{t('card.noVideo')}</span>
            </div>
          )}
        </div>
        <div className="flex w-full items-center justify-end bg-muted/35 px-3 py-2 text-xs text-muted-foreground">
          <Calendar className="w-4 h-4 mr-1" />
          {latestContent?.date ? (
            <span className="flex items-center gap-1">
              {formatDate(latestContent.date, locale)}
              {latestContent.isLive ? (
                <Badge className="bg-red-600 text-white hover:bg-red-600">
                  {t('card.liveNow')}
                </Badge>
              ) : aituber.isUpcoming ? (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-400/20 dark:text-blue-200">
                  {t('card.upcomingStream')}
                </Badge>
              ) : null}
            </span>
          ) : ''}
        </div>
      </CardFooter>
    </Card>
  )
})
