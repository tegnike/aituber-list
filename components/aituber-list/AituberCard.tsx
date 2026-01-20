'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Calendar, Heart } from "lucide-react"
import { YoutubeIcon, XIcon } from "@/components/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatDate, formatSubscriberCount, getTagName, getTagDescription, TranslationKey } from "@/lib/i18n"
import { AITuberImage } from './AITuberImage'
import { LazyVideo } from './LazyVideo'
import type { AITuber } from './types'

interface AituberCardProps {
  aituber: AITuber
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  isFavorite: boolean
  onFavoriteToggle: () => void
  locale: 'ja' | 'en'
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  priority?: boolean
}

export function AituberCard({
  aituber,
  selectedTags,
  onTagSelect,
  isFavorite,
  onFavoriteToggle,
  locale,
  t,
  priority = false
}: AituberCardProps) {
  return (
    <Card className="flex flex-col border-2 dark:border-gray-700 relative">
      {/* お気に入りボタン */}
      <button
        onClick={onFavoriteToggle}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
        aria-label={isFavorite ? t('card.removeFavorite') : t('card.addFavorite')}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
        />
      </button>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {aituber.youtubeURL ? (
            <a href={`https://www.youtube.com/channel/${aituber.youtubeChannelID}`} target="_blank" rel="noopener noreferrer">
              <AITuberImage
                src={aituber.imageUrl}
                alt={aituber.name}
                size={40}
                className="rounded-full hover:opacity-80 transition-opacity"
                priority={priority}
              />
            </a>
          ) : (
            <AITuberImage
              src={aituber.imageUrl}
              alt={aituber.name}
              size={40}
              className="rounded-full"
              priority={priority}
            />
          )}
          <div className="truncate">
            {aituber.name}
          </div>
        </CardTitle>
        <div className="flex flex-wrap gap-1.5">
          {aituber.tags.map((tag, tagIndex) => (
            <TooltipProvider key={tagIndex}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 transition-all text-xs py-0.5 px-2"
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
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full text-left">
                <p className="line-clamp-3 hover:cursor-help">
                  {aituber.description}
                </p>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] whitespace-pre-wrap">
                {aituber.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">
            {t('card.subscriberCount', { count: formatSubscriberCount(aituber.youtubeSubscribers, locale) })}
          </div>
          <div className="flex gap-2">
            {aituber.youtubeURL && (
              <Button variant="outline" size="sm" asChild>
                <a href={`https://www.youtube.com/channel/${aituber.youtubeChannelID}`} target="_blank" rel="noopener noreferrer">
                  <YoutubeIcon className="w-4 h-4 mr-2" />
                  YouTube
                </a>
              </Button>
            )}
            {aituber.twitterID && (
              <Button variant="outline" size="sm" asChild>
                <a href={`https://twitter.com/${aituber.twitterID}`} target="_blank" rel="noopener noreferrer">
                  <XIcon className="w-4 h-4 mr-2" />
                  X
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col p-0 rounded-b-lg overflow-hidden">
        <div className="w-full aspect-video relative">
          {aituber.latestVideoUrl ? (
            <LazyVideo
              videoUrl={aituber.latestVideoUrl}
              title={t('card.latestVideo', { name: aituber.name })}
              priority={priority}
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">{t('card.noVideo')}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end w-full p-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-1" />
          {aituber.latestVideoDate ? (
            <span className="flex items-center gap-1">
              {formatDate(aituber.latestVideoDate, locale)}
              {aituber.isUpcoming && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {t('card.upcomingStream')}
                </Badge>
              )}
            </span>
          ) : ''}
        </div>
      </CardFooter>
    </Card>
  )
}
