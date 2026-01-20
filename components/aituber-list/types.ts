export type AITuber = {
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

export type DateFilter = 'all' | '1month' | '3months' | '6months' | '1year' | 'older'
export type SubscriberFilter = '100' | '500' | '1000' | '10000'
export type SortOrder = 'subscribers' | 'latest' | 'name' | 'random'
export type ViewMode = 'grid' | 'list'
export type TagFilterMode = 'or' | 'and' | 'not'

export const SUBSCRIBER_FILTER_LABELS: Record<SubscriberFilter, { threshold: number }> = {
  '100': { threshold: 100 },
  '500': { threshold: 500 },
  '1000': { threshold: 1000 },
  '10000': { threshold: 10000 }
}

export const ITEMS_PER_PAGE = 12

export const FALLBACK_IMAGE = '/images/preparing-icon.png'

// 日付フィルターの判定関数
export const isWithinDateRange = (dateString: string, filter: DateFilter): boolean => {
  if (filter === 'all') return true

  const date = new Date(dateString)
  const now = new Date()
  const diffInMonths = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30.44)

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

// YouTubeのURLからビデオIDを抽出する関数
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null

  const normalMatch = url.match(/[?&]v=([^&]+)/)
  if (normalMatch) return normalMatch[1]

  const shortMatch = url.match(/youtu\.be\/([^?]+)/)
  if (shortMatch) return shortMatch[1]

  return null
}
