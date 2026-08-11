import { AituberList } from "@/components/aituber-list/index"
import { Metadata } from 'next'
import { aitubers, aituberLastUpdated } from '@/lib/aitubers'
import { getAituberDetailPath, getAituberProfileUrl, getAudienceCount } from '@/components/aituber-list/types'
import { absoluteUrl, serializeJsonLd, SITE_URL } from '@/lib/seo'

// 上位20件のAITuberを取得（登録者・フォロワー数順）
const topAitubers = aitubers
  .filter(a => (a.youtubeChannelID || a.twitchLogin) && !a.tags.includes('一部AITuber'))
  .sort((a, b) => getAudienceCount(b) - getAudienceCount(a))
  .slice(0, 20)

const pageDescription = `日本・海外のAITuber（AI VTuber／AIVTuber）${aitubers.length}名を、活動内容・登録者数・最新配信・タグから探せる専門リストです。チャンネル情報は定期更新しています。`

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "name": "AITuberList",
      "alternateName": ["AITuber リスト", "AIVTuber 一覧"],
      "url": SITE_URL,
      "description": pageDescription,
      "inLanguage": "ja",
      "publisher": { "@id": `${SITE_URL}/#organization` }
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "AITuberList",
      "url": SITE_URL,
      "logo": absoluteUrl('/images/aituber-list-logo.png'),
      "sameAs": [
        "https://github.com/tegnike/aituber-list",
        "https://x.com/tegnike"
      ],
      "founder": {
        "@type": "Person",
        "name": "ニケちゃん",
        "url": "https://x.com/tegnike"
      }
    },
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/#webpage`,
      "url": SITE_URL,
      "name": `AITuber一覧・検索（${aitubers.length}名）`,
      "description": pageDescription,
      "dateModified": aituberLastUpdated,
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "about": { "@type": "Thing", "name": "AITuber" },
      "mainEntity": { "@id": `${SITE_URL}/#aituber-list` }
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#aituber-list`,
      "name": "人気AITuber一覧",
      "numberOfItems": aitubers.length,
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "itemListElement": topAitubers.map((aituber, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": absoluteUrl(getAituberDetailPath(aituber)),
        "item": {
          "@type": "Person",
          "name": aituber.name,
          "url": absoluteUrl(getAituberDetailPath(aituber)),
          "sameAs": getAituberProfileUrl(aituber)
        }
      }))
    }
  ]
}

export const metadata: Metadata = {
  title: `AITuber一覧・検索（${aitubers.length}名） | AITuberList`,
  description: pageDescription,
  alternates: {
    canonical: '/',
  },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <AituberList />
    </>
  )
}
