'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Calendar, ChevronDown, Heart, LayoutGrid, List, ArrowUpDown, RotateCcw } from "lucide-react"
import { YoutubeIcon, XIcon } from "@/components/icons"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { useLanguage } from "@/contexts/LanguageContext"
import { formatDate, formatSubscriberCount, getTagDescription, getTagName } from "@/lib/i18n"
import Image from "next/image"
import aituberData from '../app/data/aitubers.json'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

// AITuberの型定義は残します
type AITuber = {
  name: string
  description: string
  tags: string[]
  twitterID: string
  youtubeChannelID: string
  youtubeURL: string
  imageUrl: string
  youtubeSubscribers: number
  latestVideoTitle: string
  latestVideoThumbnail: string
  latestVideoUrl: string
  latestVideoDate: string
  isUpcoming?: boolean
}

// 日付フィルターの型定義
type DateFilter = 'all' | '1month' | '3months' | '6months' | '1year' | 'older'

// 登録者数フィルターの型定義
type SubscriberFilter = '100' | '500' | '1000' | '10000'

// 並び替えの型定義
type SortOrder = 'subscribers' | 'latest' | 'name' | 'random'

// 表示モードの型定義
type ViewMode = 'grid' | 'list'

// 登録者数フィルターの閾値
const SUBSCRIBER_FILTER_LABELS: Record<SubscriberFilter, { threshold: number }> = {
  '100': { threshold: 100 },
  '500': { threshold: 500 },
  '1000': { threshold: 1000 },
  '10000': { threshold: 10000 }
}

// 日付フィルターの判定関数
const isWithinDateRange = (dateString: string, filter: DateFilter): boolean => {
  if (filter === 'all') return true;
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInMonths = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30.44) // より正確な月数の計算

  switch (filter) {
    case '1month':
      return diffInMonths <= 1
    case '3months':
      return diffInMonths > 1 && diffInMonths <= 3
    case '6months':
      return diffInMonths > 3 && diffInMonths <= 6
    case '1year':
      return diffInMonths > 6 && diffInMonths <= 12
    case 'older':
      return diffInMonths > 12
    default:
      return false
  }
}

// JSONからデータを取得し、チャンネルIDが存在するもののみをフィルタリングして日付でソート
const aitubers: AITuber[] = aituberData.aitubers
  .filter(aituber => aituber.youtubeChannelID !== '') // チャンネルIDが空でないものだけを表示
  .sort((a, b) => {
    const dateA = new Date(a.latestVideoDate);
    const dateB = new Date(b.latestVideoDate);
    return dateB.getTime() - dateA.getTime();  // 降順（新しい順）でソート
  });

// 全てのタグを抽出
const allTags = Array.from(new Set(aitubers.flatMap(aituber => aituber.tags)))


// YouTubeのURLからビデオIDを抽出する関数
const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // 通常のYouTube URLからIDを抽出
  const normalMatch = url.match(/[?&]v=([^&]+)/);
  if (normalMatch) return normalMatch[1];
  
  // 短縮URLからIDを抽出
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return shortMatch[1];
  
  return null;
};

// Add this CSS at the top of the file, after the imports
const styles = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;            /* Chrome, Safari and Opera */
  }
`;

// 代替画像のパス
const FALLBACK_IMAGE = '/images/preparing-icon.png';

// AITuberImage component with fallback support
const AITuberImage = ({
  src,
  alt,
  size = 40,
  className = ''
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // srcが変更されたらリセット
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  const imageSrc = imgSrc.startsWith('http')
    ? imgSrc
    : imgSrc.startsWith('/')
      ? imgSrc
      : imgSrc
        ? `/images/aitubers/${imgSrc}`
        : FALLBACK_IMAGE;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={size}
      height={size}
      className={className}
      onError={handleError}
    />
  );
};

// LazyVideo component for optimized video loading
const LazyVideo = ({ videoUrl, title }: { videoUrl: string; title: string }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoId = extractYouTubeVideoId(videoUrl);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      {
        threshold: 0.1
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [videoUrl]);

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-full">
      {shouldLoad && (
        <iframe
          key={videoId}
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
            isIntersecting ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ pointerEvents: isIntersecting ? 'auto' : 'none' }}
        />
      )}
    </div>
  );
};

export function AituberList() {
  const { locale, t } = useLanguage()
  const pathname = usePathname()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isAndCondition, setIsAndCondition] = useState(false)
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilter>('all')
  const [selectedSubscriberFilter, setSelectedSubscriberFilter] = useState<SubscriberFilter | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isOverviewOpen, setIsOverviewOpen] = useState(false)
  const [nameFilter, setNameFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTagDescriptionOpen, setIsTagDescriptionOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>('subscribers')
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isInitialized, setIsInitialized] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const itemsPerPage = 12

  // URLパラメータからStateを初期化
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)

    // タグの復元
    const tagsParam = params.get('tags')
    if (tagsParam) {
      setSelectedTags(tagsParam.split(',').filter(Boolean))
    }

    // タグ条件の復元
    const tagModeParam = params.get('tagMode')
    if (tagModeParam === 'and') {
      setIsAndCondition(true)
    }

    // 日付フィルターの復元
    const dateParam = params.get('date') as DateFilter
    if (dateParam && ['all', '1month', '3months', '6months', '1year', 'older'].includes(dateParam)) {
      setSelectedDateFilter(dateParam)
    }

    // 登録者数フィルターの復元
    const subscriberParam = params.get('subscriber') as SubscriberFilter
    if (subscriberParam && ['100', '500', '1000', '10000'].includes(subscriberParam)) {
      setSelectedSubscriberFilter(subscriberParam)
    }

    // 検索キーワードの復元
    const searchParam = params.get('search')
    if (searchParam) {
      setNameFilter(searchParam)
    }

    // ソート順の復元
    const sortParam = params.get('sort') as SortOrder
    if (sortParam && ['subscribers', 'latest', 'name', 'random'].includes(sortParam)) {
      setSortOrder(sortParam)
    }

    // 配信予定フィルターの復元
    const upcomingParam = params.get('upcoming')
    if (upcomingParam === 'true') {
      setShowUpcomingOnly(true)
    }

    // フィルターがある場合はフィルターセクションを開く
    if (tagsParam || dateParam !== 'all' || subscriberParam || searchParam || upcomingParam === 'true') {
      setIsFiltersOpen(true)
    }

    setIsInitialized(true)
  }, [])

  // State変更時にURLを更新
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return

    const params = new URLSearchParams()

    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','))
    }
    if (isAndCondition && selectedTags.length > 0) {
      params.set('tagMode', 'and')
    }
    if (selectedDateFilter !== 'all') {
      params.set('date', selectedDateFilter)
    }
    if (selectedSubscriberFilter) {
      params.set('subscriber', selectedSubscriberFilter)
    }
    if (nameFilter) {
      params.set('search', nameFilter)
    }
    if (sortOrder !== 'subscribers') {
      params.set('sort', sortOrder)
    }
    if (showUpcomingOnly) {
      params.set('upcoming', 'true')
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    window.history.replaceState({}, '', newUrl)
  }, [isInitialized, selectedTags, isAndCondition, selectedDateFilter, selectedSubscriberFilter, nameFilter, sortOrder, showUpcomingOnly, pathname])

  // LocalStorageからお気に入りと表示モードを読み込む
  useEffect(() => {
    const savedFavorites = localStorage.getItem('aituber-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    const savedViewMode = localStorage.getItem('aituber-view-mode') as ViewMode
    if (savedViewMode) {
      setViewMode(savedViewMode)
    }
  }, [])

  // お気に入り機能
  const toggleFavorite = (channelId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
      localStorage.setItem('aituber-favorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const isFavorite = (channelId: string) => favorites.includes(channelId)

  // 表示モード切替
  const toggleViewMode = () => {
    setViewMode(prev => {
      const newMode = prev === 'grid' ? 'list' : 'grid'
      localStorage.setItem('aituber-view-mode', newMode)
      return newMode
    })
  }

  // 全フィルターリセット
  const resetAllFilters = () => {
    setSelectedTags([])
    setIsAndCondition(false)
    setSelectedDateFilter('all')
    setSelectedSubscriberFilter(null)
    setNameFilter('')
    setShowUpcomingOnly(false)
    setShowFavoritesOnly(false)
    setCurrentPage(1)
  }

  // 現在のタブに該当するAITuberをフィルタリング
  const filteredAITubers = useMemo(() => {
    return aitubers.filter(aituber =>
      isWithinDateRange(aituber.latestVideoDate, selectedDateFilter) &&
      (selectedTags.length === 0 ||
      (isAndCondition
        ? selectedTags.every(tag => aituber.tags.includes(tag))
        : selectedTags.some(tag => aituber.tags.includes(tag))
      )) &&
      (!selectedSubscriberFilter ||
        aituber.youtubeSubscribers >= SUBSCRIBER_FILTER_LABELS[selectedSubscriberFilter].threshold) &&
      (nameFilter === '' ||
        aituber.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        aituber.description.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (!showUpcomingOnly || aituber.isUpcoming) &&
      (!showFavoritesOnly || favorites.includes(aituber.youtubeChannelID))
    )
  }, [selectedDateFilter, selectedTags, isAndCondition, selectedSubscriberFilter, nameFilter, showUpcomingOnly, showFavoritesOnly, favorites])

  // ソートされたAITuber
  const sortedAITubers = useMemo(() => {
    const sorted = [...filteredAITubers]
    switch (sortOrder) {
      case 'subscribers':
        return sorted.sort((a, b) => b.youtubeSubscribers - a.youtubeSubscribers)
      case 'latest':
        return sorted.sort((a, b) => new Date(b.latestVideoDate).getTime() - new Date(a.latestVideoDate).getTime())
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'ja'))
      case 'random':
        return sorted.sort(() => Math.random() - 0.5)
      default:
        return sorted
    }
  }, [filteredAITubers, sortOrder])

  // インフィニティスクロールの実装
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !isLoading) {
          // 次のページがある場合のみページを増やす
          if (currentPage < Math.ceil(sortedAITubers.length / itemsPerPage)) {
            setIsLoading(true)
            // 少し遅延を入れてローディング状態を見せる
            setTimeout(() => {
              setCurrentPage(prev => prev + 1)
              setIsLoading(false)
            }, 500)
          }
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [currentPage, sortedAITubers.length, isLoading])

  // スクロール位置を監視
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // スクロールトップ関数
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
    setCurrentPage(1) // タグ変更時にページをリセット
  }

  // フィルター変更時のページリセット
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedDateFilter, selectedSubscriberFilter, nameFilter, showUpcomingOnly, showFavoritesOnly, sortOrder])

  // 表示するAITuberの配列を作成
  const displayedAITubers = sortedAITubers.slice(0, currentPage * itemsPerPage)

  // アクティブなフィルターの数を計算
  const activeFilterCount = (selectedTags.length > 0 ? 1 : 0) +
    (selectedSubscriberFilter ? 1 : 0) +
    (nameFilter ? 1 : 0) +
    (selectedDateFilter !== 'all' ? 1 : 0) +
    (showUpcomingOnly ? 1 : 0) +
    (showFavoritesOnly ? 1 : 0);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4">
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 462.799"><path fill-rule="nonzero" d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"/></svg>
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

      <Card className="mb-6 border-2 dark:border-gray-700">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
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
                        resetAllFilters()
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
                    {t('filter.showCount', { filtered: filteredAITubers.length, total: aitubers.length })}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? 'transform rotate-180' : ''}`} />
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
                  onChange={(e) => setNameFilter(e.target.value)}
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
                        onClick={() => setIsAndCondition(false)}
                        className="text-xs sm:text-sm h-7 px-2 sm:px-4"
                      >
                        OR
                      </Button>
                      <Button
                        variant={isAndCondition ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setIsAndCondition(true)}
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
                            onClick={() => toggleTag(tag)}
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
                      onClick={() => setSelectedDateFilter(value)}
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
                    onClick={() => setSelectedSubscriberFilter(null)}
                  >
                    {t('filter.all')}
                  </Badge>
                  {(Object.keys(SUBSCRIBER_FILTER_LABELS) as SubscriberFilter[]).map((value) => (
                    <Badge
                      key={value}
                      variant={selectedSubscriberFilter === value ? "default" : "outline"}
                      className="cursor-pointer hover:opacity-80 transition-all text-xs sm:text-sm py-1 px-2 sm:px-3"
                      onClick={() => setSelectedSubscriberFilter(value)}
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
                      onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{t('filter.upcomingOnly')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showFavoritesOnly}
                      onChange={(e) => setShowFavoritesOnly(e.target.checked)}
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

      {/* ソートと表示モード */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{t('sort.title')}:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="text-sm rounded-md border border-input bg-background px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="subscribers">{t('sort.subscribers')}</option>
            <option value="latest">{t('sort.latest')}</option>
            <option value="name">{t('sort.name')}</option>
            <option value="random">{t('sort.random')}</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => toggleViewMode()}
            aria-label={t('view.grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => toggleViewMode()}
            aria-label={t('view.list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* リスト表示 */
        <div className="flex flex-col gap-2">
          {displayedAITubers.map((aituber, index) => (
            <Card key={index} className="border-2 dark:border-gray-700 overflow-hidden">
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
                      />
                    </a>
                  ) : (
                    <AITuberImage
                      src={aituber.imageUrl}
                      alt={aituber.name}
                      size={36}
                      className="rounded-full"
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
                      onClick={() => {
                        setSelectedTags([tag]);
                        setIsAndCondition(false);
                        setCurrentPage(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
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
                    aria-label={t('card.latestVideo', { name: aituber.name })}
                  >
                    <YoutubeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 hover:text-red-600" />
                  </a>
                )}

                {/* お気に入りボタン */}
                <button
                  onClick={() => toggleFavorite(aituber.youtubeChannelID)}
                  className="shrink-0 p-1 sm:p-1.5 rounded-full hover:bg-muted transition-colors"
                  aria-label={isFavorite(aituber.youtubeChannelID) ? t('card.removeFavorite') : t('card.addFavorite')}
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isFavorite(aituber.youtubeChannelID) ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                  />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* グリッド表示 */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedAITubers.map((aituber, index) => (
            <Card key={index} className="flex flex-col border-2 dark:border-gray-700 relative">
              {/* お気に入りボタン */}
              <button
                onClick={() => toggleFavorite(aituber.youtubeChannelID)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                aria-label={isFavorite(aituber.youtubeChannelID) ? t('card.removeFavorite') : t('card.addFavorite')}
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${isFavorite(aituber.youtubeChannelID) ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
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
                      />
                    </a>
                  ) : (
                    <AITuberImage
                      src={aituber.imageUrl}
                      alt={aituber.name}
                      size={40}
                      className="rounded-full"
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
                          onClick={() => {
                            setSelectedTags([tag]);
                            setIsAndCondition(false);
                            setCurrentPage(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
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
          ))}
        </div>
      )}

      {/* ローディングインジケーターとIntersection Observer用の要素 */}
      {displayedAITubers.length < sortedAITubers.length && (
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

      {/* スクロールトップボタン */}
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

      <footer className="mt-8 flex justify-center gap-4 text-sm text-muted-foreground">
        <Link href="/terms" className="hover:underline">
          {t('footer.terms')}
        </Link>
        <Link href="/privacy" className="hover:underline">
          {t('footer.privacy')}
        </Link>
      </footer>
    </div>
  )
}