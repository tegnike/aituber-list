import type { Metadata } from 'next'
import { AboutContent } from '@/components/about/AboutContent'
import { aitubers, aituberLastUpdated, getMainAitubers } from '@/lib/aitubers'
import { absoluteUrl, serializeJsonLd, SITE_URL } from '@/lib/seo'

const mainAituberCount = getMainAitubers().length

export const metadata: Metadata = {
  title: 'AITuberとは？仕組み・VTuberとの違い・探し方',
  description: 'AITuber（AI VTuber／AIVTuber）の意味、配信の仕組み、VTuberとの違い、自動化の範囲、好みに合うAITuberの探し方をわかりやすく解説します。',
  alternates: { canonical: '/about/' },
  openGraph: {
    title: 'AITuberとは？仕組み・VTuberとの違い・探し方',
    description: 'AITuberの意味から配信の仕組み、VTuberとの違い、探し方までを解説します。',
    url: '/about/',
    type: 'article',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${SITE_URL}/about/#article`,
      headline: 'AITuberとは？仕組み・VTuberとの違い・探し方',
      description: 'AITuber（AI VTuber／AIVTuber）の意味、配信の仕組み、VTuberとの違い、自動化の範囲、探し方を解説します。',
      url: absoluteUrl('/about/'),
      inLanguage: ['ja', 'en', 'zh-Hans', 'zh-Hant', 'ko'],
      dateModified: aituberLastUpdated,
      author: { '@type': 'Person', name: 'ニケちゃん', url: 'https://x.com/tegnike' },
      publisher: { '@type': 'Organization', name: 'AITuberList', url: SITE_URL, logo: absoluteUrl('/images/aituber-list-logo.png') },
      about: { '@type': 'Thing', name: 'AITuber', alternateName: ['AI VTuber', 'AIVTuber'] },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'AITuber一覧', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'AITuberとは', item: absoluteUrl('/about/') },
      ],
    },
  ],
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <AboutContent totalCount={aitubers.length} mainCount={mainAituberCount} updatedAt={aituberLastUpdated} />
    </>
  )
}
