'use client'

import { useState, useEffect, useRef } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Youtube, Twitter, Calendar, ChevronDown } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Image from "next/image"
import aituberData from '../app/data/aitubers.json'
import Link from 'next/link'
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

// 日付フィルターの表示名
const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  'all': '全期間',
  '1month': '1ヶ月以内',
  '3months': '3ヶ月以内',
  '6months': '6ヶ月以内',
  '1year': '1年以内',
  'older': '1年以上前'
}

// 登録者数フィルターの表示名と閾値
const SUBSCRIBER_FILTER_LABELS: Record<SubscriberFilter, { label: string; threshold: number }> = {
  '100': { label: '100人以上', threshold: 100 },
  '500': { label: '500人以上', threshold: 500 },
  '1000': { label: '1000人以上', threshold: 1000 },
  '10000': { label: '1万人以上', threshold: 10000 }
}

// タグの説明
const TAG_DESCRIPTIONS: Record<string, string> = {
  'コメント応答': 'ライブチャット欄のコメントに対してAIが自動で応答する',
  '解説': '解説動画がある',
  '歌唱あり': '歌唱枠がある',
  '海外': '日本語以外のAITuber',
  'ゲーム実況': 'ゲームの実況配信を行う',
  'AIパートナー': '人間配信者のパートナーとしてAIが参加する',
  '複数キャラ': '複数のAIキャラクターが登場する',
  '一部AITuber': 'コンテンツの一部でAIキャラクターを活用している',
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

// 日付フォーマット用の関数を修正
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo'
  });
};

// 登録者数のフォーマット用関数を追加
const formatSubscriberCount = (count: number): string => {
  if (count >= 10000000) {
    return `${(count / 10000000).toFixed(2)}千万`;
  } else if (count >= 10000) {
    return `${(count / 10000).toFixed(2)}万`;
  } else if (count >= 1000) {
    return `${count.toLocaleString()}`;
  }
  return `${count}`;
};

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
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const itemsPerPage = 12

  // 現在のタブに該当するAITuberをフィルタリング
  const filteredAITubers = aitubers.filter(aituber => 
    isWithinDateRange(aituber.latestVideoDate, selectedDateFilter) &&
    (selectedTags.length === 0 || 
    (isAndCondition 
      ? selectedTags.every(tag => aituber.tags.includes(tag))
      : selectedTags.some(tag => aituber.tags.includes(tag))
    )) &&
    (!selectedSubscriberFilter || 
      aituber.youtubeSubscribers >= SUBSCRIBER_FILTER_LABELS[selectedSubscriberFilter].threshold) &&
    (nameFilter === '' || aituber.name.toLowerCase().includes(nameFilter.toLowerCase()))
  )

  // インフィニティスクロールの実装
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !isLoading) {
          // 次のページがある場合のみページを増やす
          if (currentPage < Math.ceil(filteredAITubers.length / itemsPerPage)) {
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
  }, [currentPage, filteredAITubers.length, isLoading])

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
  }, [selectedDateFilter, selectedSubscriberFilter, nameFilter])

  // 表示するAITuberの配列を作成
  const displayedAITubers = filteredAITubers.slice(0, currentPage * itemsPerPage)

  // アクティブなフィルターの数を計算
  const activeFilterCount = (selectedTags.length > 0 ? 1 : 0) + 
    (selectedSubscriberFilter ? 1 : 0) + 
    (nameFilter ? 1 : 0) +
    (selectedDateFilter !== 'all' ? 1 : 0);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4">
      <style jsx global>{styles}</style>
      <div className="flex justify-end mb-2">
        <ThemeToggle />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
        AITuberList
        <span className="text-lg sm:text-xl font-normal text-muted-foreground ml-2">
          ({aitubers.length}名)
        </span>
      </h1>
      <p className="text-center text-sm text-muted-foreground mb-4">
        最終更新日: {formatDate(aituberData.lastUpdated)}
      </p>

      <Card className="mb-6 border-2 dark:border-gray-700">
        <Collapsible open={isOverviewOpen} onOpenChange={setIsOverviewOpen}>
          <CardHeader className="py-3 px-3 sm:px-6">
            <CollapsibleTrigger className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 group">
                <CardTitle className="text-lg sm:text-xl flex items-center flex-wrap gap-2">
                  概要
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
                <li>このWebサイトではAITuberの情報をまとめています。</li>
                <li>1日に2回更新されます。</li>
                <li>タグの分類は誤っている可能性があります。</li>
                <li>コンテンツの一つとしてAIキャラクターが登場するチャンネルも含まれています。</li>
              </ul>
            </CardContent>
            <CardContent>
              <div className="space-y-4">
                <p>ご意見・ご要望・不具合報告は開発者のXまでお願いします：</p>
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
                      GitHub リポジトリ
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
                  フィルター
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary">
                      {activeFilterCount}個のフィルターが有効
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {filteredAITubers.length} / {aitubers.length} 件表示
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
                <div className="text-sm font-bold">名前で検索</div>
                <input
                  type="text"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="AITuber名を入力..."
                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                />
              </div>

              {/* タグフィルター */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-sm font-bold">タグ</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">検索条件：</span>
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
                            {tag}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {TAG_DESCRIPTIONS[tag] || 'タグの説明がありません'}
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
                    タグの説明を表示
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="space-y-2 text-sm text-muted-foreground border rounded-lg p-4">
                      {Object.entries(TAG_DESCRIPTIONS).map(([tag, description]) => (
                        <div key={tag} className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5 shrink-0">
                            {tag}
                          </Badge>
                          <span>{description}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* 最終更新日フィルター */}
              <div className="space-y-4">
                <div className="text-sm font-bold">最終更新日</div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {(Object.entries(DATE_FILTER_LABELS) as [DateFilter, string][]).map(([value, label]) => (
                    <Badge
                      key={value}
                      variant={selectedDateFilter === value ? "default" : "outline"}
                      className="cursor-pointer hover:opacity-80 transition-all text-xs sm:text-sm py-1 px-2 sm:px-3"
                      onClick={() => setSelectedDateFilter(value)}
                    >
                      {label}
                      <span className="ml-1 text-xs">
                        ({aitubers.filter(a => isWithinDateRange(a.latestVideoDate, value)).length})
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 登録者数フィルター */}
              <div className="space-y-4">
                <div className="text-sm font-bold">登録者数</div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge
                    variant={selectedSubscriberFilter === null ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 transition-all text-xs sm:text-sm py-1 px-2 sm:px-3"
                    onClick={() => setSelectedSubscriberFilter(null)}
                  >
                    すべて
                  </Badge>
                  {(Object.entries(SUBSCRIBER_FILTER_LABELS) as [SubscriberFilter, { label: string }][]).map(([value, { label }]) => (
                    <Badge
                      key={value}
                      variant={selectedSubscriberFilter === value ? "default" : "outline"}
                      className="cursor-pointer hover:opacity-80 transition-all text-xs sm:text-sm py-1 px-2 sm:px-3"
                      onClick={() => setSelectedSubscriberFilter(value)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedAITubers.map((aituber, index) => (
          <Card key={index} className="flex flex-col border-2 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {aituber.youtubeURL ? (
                  <a href={`https://www.youtube.com/channel/${aituber.youtubeChannelID}`} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={aituber.imageUrl.startsWith('http')
                        ? aituber.imageUrl
                        : aituber.imageUrl
                          ? `/images/aitubers/${aituber.imageUrl}`
                          : '/images/preparing-icon.png'
                      }
                      alt={aituber.name}
                      width={40}
                      height={40}
                      className="rounded-full hover:opacity-80 transition-opacity"
                    />
                  </a>
                ) : (
                  <Image
                    src={aituber.imageUrl.startsWith('http')
                      ? aituber.imageUrl
                      : aituber.imageUrl
                        ? `/images/aitubers/${aituber.imageUrl}`
                        : '/images/preparing-icon.png'
                    }
                    alt={aituber.name}
                    width={40}
                    height={40}
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
                          {tag}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {TAG_DESCRIPTIONS[tag] || 'タグの説明がありません'}
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
                  登録者数: {formatSubscriberCount(aituber.youtubeSubscribers)}人
                </div>
                <div className="flex gap-2">
                  {aituber.youtubeURL && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://www.youtube.com/channel/${aituber.youtubeChannelID}`} target="_blank" rel="noopener noreferrer">
                        <Youtube className="w-4 h-4 mr-2" />
                        YouTube
                      </a>
                    </Button>
                  )}
                  {aituber.twitterID && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://twitter.com/${aituber.twitterID}`} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
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
                    title={`${aituber.name}の最新動画`}
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">動画はまだありません</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end w-full p-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                {aituber.latestVideoDate ? (
                  <span className="flex items-center gap-1">
                    {formatDate(aituber.latestVideoDate)}
                    {aituber.isUpcoming && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        配信予定
                      </Badge>
                    )}
                  </span>
                ) : ''}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* ローディングインジケーターとIntersection Observer用の要素 */}
      {displayedAITubers.length < filteredAITubers.length && (
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
            <div className="text-sm text-muted-foreground">スクロールして更に読み込む</div>
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
          aria-label="ページトップへ戻る"
        >
          <ChevronDown className="h-6 w-6 transform rotate-180" />
        </Button>
      )}

      <footer className="mt-8 flex justify-center gap-4 text-sm text-muted-foreground">
        <Link href="/terms" className="hover:underline">
          利用規約
        </Link>
        <Link href="/privacy" className="hover:underline">
          プライバシーポリシー
        </Link>
      </footer>
    </div>
  )
}