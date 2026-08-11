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
  recentYoutubeVideos?: RecentYoutubeVideo[]
  isUpcoming?: boolean
  twitchLogin?: string
  twitchUserID?: string
  twitchURL?: string
  twitchFollowers?: number
  twitchIsLive?: boolean
  twitchTitle?: string
  twitchThumbnail?: string
  twitchContentUrl?: string
  twitchContentDate?: string
}

export type RecentYoutubeVideo = {
  title: string
  thumbnail: string
  url: string
  date: string
}

export type ContentPlatform = 'youtube' | 'twitch'

export type LatestContent = {
  platform: ContentPlatform
  title: string
  thumbnail: string
  url: string
  date: string
  isLive: boolean
}

export type DateFilter = 'all' | '1month' | '3months' | '6months' | '1year' | 'older'
export type SubscriberFilter = '100' | '500' | '1000' | '10000'
export type SortOrder = 'subscribers' | 'latest' | 'name' | 'random'
export type ViewMode = 'grid' | 'list'
export type TagFilterMode = 'or' | 'and' | 'not'
export type PlatformFilter = 'all' | 'youtube' | 'twitch'

// 一部AITuberは通常のタグ選択肢ではなく、AITuberメイン判定用の特殊分類として扱う
export const PARTIAL_AITUBER_TAG = '一部AITuber'

export const SUBSCRIBER_FILTER_LABELS: Record<SubscriberFilter, { threshold: number }> = {
  '100': { threshold: 100 },
  '500': { threshold: 500 },
  '1000': { threshold: 1000 },
  '10000': { threshold: 10000 }
}

export const ITEMS_PER_PAGE = 12

export const FALLBACK_IMAGE = '/images/preparing-icon.png'

export const getAituberId = (aituber: AITuber): string =>
  aituber.youtubeChannelID || `twitch:${aituber.twitchUserID || aituber.twitchLogin || aituber.name}`

export const getAituberSlug = (aituber: AITuber): string => {
  if (aituber.youtubeChannelID) {
    return `youtube-${aituber.youtubeChannelID}`
  }

  if (aituber.twitchLogin) {
    return `twitch-${aituber.twitchLogin.toLowerCase()}`
  }

  return `twitch-id-${aituber.twitchUserID}`
}

export const getAituberDetailPath = (aituber: AITuber): string =>
  `/aitubers/${getAituberSlug(aituber)}/`

export const getAituberProfileUrl = (aituber: AITuber): string => {
  if (aituber.youtubeChannelID) {
    return `https://www.youtube.com/channel/${aituber.youtubeChannelID}`
  }
  return aituber.twitchURL || (aituber.twitchLogin ? `https://www.twitch.tv/${aituber.twitchLogin}` : '')
}

export const getAudienceCount = (aituber: AITuber): number =>
  aituber.youtubeChannelID ? aituber.youtubeSubscribers : (aituber.twitchFollowers || 0)

export const getRecentContents = (aituber: AITuber, limit = 3): LatestContent[] => {
  const youtubeContents = (aituber.recentYoutubeVideos?.length
    ? aituber.recentYoutubeVideos
    : aituber.latestVideoUrl
      ? [{
          title: aituber.latestVideoTitle,
          thumbnail: aituber.latestVideoThumbnail,
          url: aituber.latestVideoUrl,
          date: aituber.latestVideoDate,
        }]
      : []
  ).map((content) => ({
    platform: 'youtube' as const,
    ...content,
    isLive: false,
  }))
  const twitchContent = aituber.twitchContentUrl ? {
    platform: 'twitch' as const,
    title: aituber.twitchTitle || aituber.name,
    thumbnail: aituber.twitchThumbnail || '',
    url: aituber.twitchContentUrl,
    date: aituber.twitchContentDate || '',
    isLive: Boolean(aituber.twitchIsLive),
  } : null

  const contents = twitchContent ? [twitchContent, ...youtubeContents] : youtubeContents
  const uniqueContents = Array.from(new Map(contents.map((content) => [content.url, content])).values())

  return uniqueContents
    .sort((a, b) => {
      if (a.isLive !== b.isLive) return a.isLive ? -1 : 1
      const aTime = new Date(a.date).getTime() || 0
      const bTime = new Date(b.date).getTime() || 0
      return bTime - aTime
    })
    .slice(0, limit)
}

export const getLatestContent = (aituber: AITuber): LatestContent | null =>
  getRecentContents(aituber, 1)[0] || null

export const getLatestContentDate = (aituber: AITuber): string =>
  getLatestContent(aituber)?.date || ''

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

  const normalizeVideoId = (candidate: string | null | undefined): string | null =>
    candidate && /^[A-Za-z0-9_-]{11}$/.test(candidate) ? candidate : null

  try {
    const parsedUrl = new URL(url, 'https://www.youtube.com')
    const hostname = parsedUrl.hostname.replace(/^www\./, '')

    if (hostname === 'youtu.be') {
      return normalizeVideoId(parsedUrl.pathname.split('/').filter(Boolean)[0])
    }

    const isYouTubeHost = hostname === 'youtube.com' || hostname.endsWith('.youtube.com')
    if (!isYouTubeHost) return null

    if (parsedUrl.pathname === '/watch') {
      return normalizeVideoId(parsedUrl.searchParams.get('v'))
    }

    const pathParts = parsedUrl.pathname.split('/').filter(Boolean)
    if (['shorts', 'embed', 'live'].includes(pathParts[0])) {
      return normalizeVideoId(pathParts[1])
    }
  } catch {
    return null
  }

  return null
}
