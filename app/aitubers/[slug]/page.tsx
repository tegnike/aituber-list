import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, ExternalLink, Twitch } from 'lucide-react'
import { YoutubeIcon, XIcon } from '@/components/icons'
import {
  getAituberDetailPath,
  getAituberProfileUrl,
  getAituberSlug,
  getAudienceCount,
  getLatestContent,
} from '@/components/aituber-list/types'
import { aitubers, aituberLastUpdated, findAituberBySlug } from '@/lib/aitubers'
import { absoluteUrl, serializeJsonLd, SITE_URL, truncateText } from '@/lib/seo'

type PageProps = {
  params: {
    slug: string
  }
}

export const dynamicParams = false

export function generateStaticParams() {
  return aitubers.map((aituber) => ({ slug: getAituberSlug(aituber) }))
}

const formatAudience = (count: number): string =>
  new Intl.NumberFormat('ja-JP').format(count)

const getProfileImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '/images/preparing-icon.png'
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl
  return `/images/aitubers/${imageUrl}`
}

const RELATED_TAG_EXCLUSIONS = new Set(['一部AITuber'])

const tagFrequencies = aitubers.reduce<Map<string, number>>((frequencies, aituber) => {
  aituber.tags.forEach((tag) => {
    if (!RELATED_TAG_EXCLUSIONS.has(tag)) {
      frequencies.set(tag, (frequencies.get(tag) || 0) + 1)
    }
  })
  return frequencies
}, new Map())

const getTagWeight = (tag: string): number =>
  1 + Math.log((aitubers.length + 1) / ((tagFrequencies.get(tag) || 0) + 1))

const getProfileTitle = (aituber: (typeof aitubers)[number]): string => {
  const hasDuplicateName = aitubers.some(
    (candidate) => candidate !== aituber && candidate.name === aituber.name
  )
  const discriminator = aituber.youtubeChannelID
    ? `YouTube ${aituber.youtubeChannelID.slice(-6)}`
    : `Twitch ${aituber.twitchLogin}`

  return hasDuplicateName
    ? `${aituber.name}（${discriminator}）｜AITuberプロフィール`
    : `${aituber.name}｜AITuberプロフィール`
}

const getPageDescription = (aituber: (typeof aitubers)[number]): string => {
  const audiences = [
    aituber.youtubeChannelID ? `YouTube登録者${formatAudience(aituber.youtubeSubscribers)}人` : '',
    (aituber.twitchLogin || aituber.twitchUserID) ? `Twitchフォロワー${formatAudience(aituber.twitchFollowers || 0)}人` : '',
  ].filter(Boolean)
  const facts = `${audiences.join('、')}。活動タグ: ${aituber.tags.join('、')}。`
  const channelDescription = aituber.description
    ? truncateText(aituber.description, 100)
    : '公式チャンネル、最新コンテンツ、活動情報を掲載しています。'

  return truncateText(`${aituber.name}のAITuberプロフィール。${facts}${channelDescription}`, 155)
}

export function generateMetadata({ params }: PageProps): Metadata {
  const aituber = findAituberBySlug(params.slug)

  if (!aituber) {
    return {}
  }

  const description = getPageDescription(aituber)
  const title = getProfileTitle(aituber)
  const detailPath = getAituberDetailPath(aituber)
  const image = aituber.imageUrl ? absoluteUrl(getProfileImageUrl(aituber.imageUrl)) : absoluteUrl('/ogp.png')

  return {
    title,
    description,
    alternates: {
      canonical: detailPath,
    },
    openGraph: {
      title,
      description,
      url: detailPath,
      type: 'profile',
      images: [{ url: image, alt: `${aituber.name}のプロフィール画像` }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [image],
    },
  }
}

export default function AituberProfilePage({ params }: PageProps) {
  const aituber = findAituberBySlug(params.slug)

  if (!aituber) {
    notFound()
  }

  const detailPath = getAituberDetailPath(aituber)
  const officialProfileUrl = getAituberProfileUrl(aituber)
  const latestContent = getLatestContent(aituber)
  const hasYouTube = Boolean(aituber.youtubeChannelID)
  const hasTwitch = Boolean(aituber.twitchLogin || aituber.twitchUserID)
  const platformName = hasYouTube && hasTwitch ? 'YouTube・Twitch' : hasYouTube ? 'YouTube' : 'Twitch'
  const relatedAitubers = aitubers
    .filter((candidate) => candidate !== aituber)
    .map((candidate) => {
      const sharedTags = candidate.tags
        .filter((tag) => aituber.tags.includes(tag) && !RELATED_TAG_EXCLUSIONS.has(tag))
        .sort((a, b) => getTagWeight(b) - getTagWeight(a))

      return {
        aituber: candidate,
        sharedTags,
        score: sharedTags.reduce((total, tag) => total + getTagWeight(tag), 0),
      }
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) =>
      b.score - a.score ||
      b.sharedTags.length - a.sharedTags.length ||
      getAudienceCount(b.aituber) - getAudienceCount(a.aituber)
    )
    .slice(0, 6)
  const sameAs = [
    aituber.youtubeChannelID ? `https://www.youtube.com/channel/${aituber.youtubeChannelID}` : '',
    aituber.twitchURL || (aituber.twitchLogin ? `https://www.twitch.tv/${aituber.twitchLogin}` : ''),
    aituber.twitterID ? `https://x.com/${aituber.twitterID}` : '',
  ].filter(Boolean)
  const pageDescription = getPageDescription(aituber)
  const profileTitle = getProfileTitle(aituber)
  const isPartialAituber = aituber.tags.includes('一部AITuber')

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': isPartialAituber ? 'WebPage' : 'ProfilePage',
        '@id': `${absoluteUrl(detailPath)}#webpage`,
        url: absoluteUrl(detailPath),
        name: profileTitle,
        description: pageDescription,
        inLanguage: 'ja',
        dateModified: aituberLastUpdated,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${absoluteUrl(detailPath)}#aituber` },
      },
      {
        '@type': isPartialAituber ? 'Thing' : 'Person',
        '@id': `${absoluteUrl(detailPath)}#aituber`,
        name: aituber.name,
        description: truncateText(aituber.description || pageDescription, 500),
        image: aituber.imageUrl ? absoluteUrl(getProfileImageUrl(aituber.imageUrl)) : undefined,
        url: absoluteUrl(detailPath),
        sameAs,
        knowsAbout: aituber.tags,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'AITuber一覧',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: aituber.name,
            item: absoluteUrl(detailPath),
          },
        ],
      },
    ],
  }

  return (
    <main id="main-content" className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />

      <header className="border-b border-border/70 bg-background/90">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="AITuberList トップ">
            <Image
              src="/images/aituber-list-logo.png"
              alt="AITuberList"
              width={2166}
              height={350}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <Link href="/about/" className="text-sm font-semibold text-primary hover:underline">
            AITuberとは？
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="パンくず" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground hover:underline">AITuber一覧</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="truncate">{aituber.name}</span>
        </nav>

        <article className="mt-6 overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-sm">
          <div className="bg-gradient-to-br from-violet-100/80 via-card to-cyan-100/70 p-6 dark:from-violet-400/10 dark:via-card dark:to-cyan-400/10 sm:p-9">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <Image
                src={getProfileImageUrl(aituber.imageUrl)}
                alt={`${aituber.name}のプロフィール画像`}
                width={144}
                height={144}
                className="h-28 w-28 rounded-3xl border-4 border-background object-cover shadow-md sm:h-36 sm:w-36"
                priority
                unoptimized
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary">AITuberプロフィール</p>
                <h1 className="mt-2 break-words text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                  {aituber.name}
                </h1>
                <div className="mt-4 flex flex-wrap gap-2">
                  {aituber.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/?tags=${encodeURIComponent(tag)}`}
                      className="rounded-full border border-violet-200 bg-background/80 px-3 py-1 text-xs font-semibold hover:border-violet-400 dark:border-violet-400/25"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {aituber.youtubeChannelID && (
                    <a
                      href={`https://www.youtube.com/channel/${aituber.youtubeChannelID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
                    >
                      <YoutubeIcon className="h-5 w-5" />
                      YouTube
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {(aituber.twitchURL || aituber.twitchLogin) && (
                    <a
                      href={aituber.twitchURL || `https://www.twitch.tv/${aituber.twitchLogin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-700"
                    >
                      <Twitch className="h-5 w-5" />
                      Twitch
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {aituber.twitterID && (
                    <a
                      href={`https://x.com/${aituber.twitterID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-bold hover:bg-muted"
                    >
                      <XIcon className="h-5 w-5" />
                      X
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={`grid gap-px border-y bg-border sm:grid-cols-2 ${hasYouTube && hasTwitch ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {hasYouTube && (
              <div className="min-w-0 bg-card p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <YoutubeIcon className="h-4 w-4 shrink-0 text-red-600" />
                  YouTube登録者数
                </div>
                <p className="mt-2 break-words text-2xl font-bold">{formatAudience(aituber.youtubeSubscribers)}人</p>
              </div>
            )}
            {hasTwitch && (
              <div className="min-w-0 bg-card p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Twitch className="h-4 w-4 shrink-0 text-purple-600" />
                  Twitchフォロワー数
                </div>
                <p className="mt-2 break-words text-2xl font-bold">{formatAudience(aituber.twitchFollowers || 0)}人</p>
              </div>
            )}
            <div className="bg-card p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {platformName === 'YouTube' ? <YoutubeIcon className="h-4 w-4 text-red-600" /> : <Twitch className="h-4 w-4 text-purple-600" />}
                主な掲載先
              </div>
              <p className="mt-2 text-2xl font-bold">{platformName}</p>
            </div>
            <div className="bg-card p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                最新コンテンツ
              </div>
              <p className="mt-2 text-lg font-bold">
                {latestContent?.date
                  ? new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium', timeZone: 'Asia/Tokyo' }).format(new Date(latestContent.date))
                  : '情報なし'}
              </p>
            </div>
          </div>

          <div className="grid gap-10 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <section>
                <h2 className="text-2xl font-bold">{aituber.name}について</h2>
                {aituber.description ? (
                  <p className="mt-4 whitespace-pre-line break-words leading-8 text-muted-foreground">
                    {aituber.description}
                  </p>
                ) : (
                  <p className="mt-4 leading-8 text-muted-foreground">
                    公開プロフィールに説明文が登録されていません。現在の活動内容は公式{platformName}チャンネルで確認できます。
                  </p>
                )}
                <p className="mt-4 text-xs leading-6 text-muted-foreground">
                  説明文は公式チャンネルの公開プロフィールをもとに掲載しています。
                </p>
              </section>

              {latestContent && (
                <section className="mt-10 border-t pt-8">
                  <h2 className="text-2xl font-bold">最新コンテンツ</h2>
                  <a
                    href={latestContent.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 block overflow-hidden rounded-2xl border transition-colors hover:border-violet-300 hover:bg-violet-50/30 dark:hover:bg-violet-400/5"
                  >
                    {latestContent.thumbnail && (
                      <div className="relative aspect-video bg-muted">
                        <Image
                          src={latestContent.thumbnail}
                          alt={latestContent.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 640px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="font-bold leading-7">{latestContent.title}</p>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                        {latestContent.platform === 'youtube' ? 'YouTubeで見る' : 'Twitchで見る'}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </p>
                    </div>
                  </a>
                </section>
              )}
            </div>

            <aside>
              <div className="rounded-2xl border bg-muted/35 p-5">
                <h2 className="font-bold">掲載情報について</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  登録者・フォロワー数、最新コンテンツは公開情報をもとに原則1日2回更新します。タグにはAI判定が含まれ、正確性を保証するものではありません。
                </p>
                {officialProfileUrl && (
                  <a
                    href={officialProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    公式情報を確認
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </aside>
          </div>
        </article>

        {relatedAitubers.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold">関連するAITuber</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedAitubers.map(({ aituber: related, sharedTags }) => (
                <Link
                  key={getAituberSlug(related)}
                  href={getAituberDetailPath(related)}
                  className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-violet-300 hover:bg-violet-50/30 dark:hover:bg-violet-400/5"
                >
                  <Image
                    src={getProfileImageUrl(related.imageUrl)}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-xl object-cover"
                    unoptimized
                  />
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-bold">{related.name}</span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {sharedTags.slice(0, 2).join('・')}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-12 flex flex-wrap gap-5 border-t pt-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">AITuber一覧</Link>
          <Link href="/about/" className="hover:underline">AITuberとは</Link>
          <Link href="/terms/" className="hover:underline">利用規約</Link>
          <Link href="/privacy/" className="hover:underline">プライバシーポリシー</Link>
        </footer>
      </div>
    </main>
  )
}
