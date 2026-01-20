import { AituberList } from "@/components/aituber-list/index"
import { Metadata } from 'next'

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
      <AituberList />
    </>
  )
}