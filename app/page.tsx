import { AituberList } from "@/components/aituber-list/index"
import { Metadata } from 'next'
import aituberData from '@/app/data/aitubers.json'
import { getAituberProfileUrl, getAudienceCount } from '@/components/aituber-list/types'

// 上位10件のAITuberを取得（登録者数順）
const topAitubers = aituberData.aitubers
  .filter(a => a.youtubeChannelID || a.twitchLogin)
  .sort((a, b) => getAudienceCount(b) - getAudienceCount(a))
  .slice(0, 10)

// ItemListスキーマ
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "人気AITuberリスト",
  "numberOfItems": aituberData.aitubers.length,
  "itemListElement": topAitubers.map((aituber, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "item": {
      "@type": "Person",
      "name": aituber.name,
      "description": aituber.description,
      "url": getAituberProfileUrl(aituber)
    }
  }))
}

export const metadata: Metadata = {
  title: 'AITuberList',
  description: 'AITuber（AIVTuber）の情報をまとめたサイトです。コメント応答型、歌唱系、ゲーム実況などのタグで分類し、検索できます。',
  alternates: {
    canonical: 'https://aituberlist.net',
  },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AITuberList",
            "alternateName": ["AIVTuber 一覧", "AITuber リスト"],
            "url": "https://aituberlist.net",
            "description": "AITuber（AIVTuber）の情報をまとめたサイト。タグによる分類で検索可能。毎日2回更新。",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://aituberlist.net?search={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            },
            "inLanguage": "ja",
            "publisher": {
              "@type": "Person",
              "name": "ニケちゃん",
              "url": "https://x.com/tegnike"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <AituberList />
    </>
  )
}
