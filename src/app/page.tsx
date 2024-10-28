'use client'

import { useState } from 'react'
// コンポーネントのimportパスを修正
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Youtube, Twitter } from "lucide-react"

// AITuberのデータ型を更新
type AITuber = {
  id: number
  name: string
  description: string
  tags: string[]
  imageUrl: string
  youtubeUrl: string
  twitterUrl: string
}

// サンプルAITuberデータを更新
const aitubers: AITuber[] = [
  { id: 1, name: "AI-Chan", description: "歌って踊れるAIアイドル", tags: ["アイドル", "歌手", "ダンサー"], imageUrl: "/nikechan_icon.jpg?height=100&width=100", youtubeUrl: "https://youtube.com", twitterUrl: "https://twitter.com" },
  { id: 2, name: "Robo-Sensei", description: "プログラミングを教えるAI講師", tags: ["教育", "プログラミング"], imageUrl: "/nikechan_icon.jpg?height=100&width=100", youtubeUrl: "https://youtube.com", twitterUrl: "https://twitter.com" },
  { id: 3, name: "Virtual Chef", description: "料理レシピを紹介するAIシェフ", tags: ["料理", "レシピ"], imageUrl: "/nikechan_icon.jpg?height=100&width=100", youtubeUrl: "https://youtube.com", twitterUrl: "https://twitter.com" },
  { id: 4, name: "Digi-Artist", description: "デジタルアートを生成するAI", tags: ["アート", "クリエイティブ"], imageUrl: "/nikechan_icon.jpg?height=100&width=100", youtubeUrl: "https://youtube.com", twitterUrl: "https://twitter.com" },
  { id: 5, name: "News-Bot", description: "最新ニュースを報告するAIアナウンサー", tags: ["ニュース", "アナウンサー"], imageUrl: "/nikechan_icon.jpg?height=100&width=100", youtubeUrl: "https://youtube.com", twitterUrl: "https://twitter.com" },
  { id: 6, name: "Fit-AI", description: "フィットネスアドバイスを提供するAIトレーナー", tags: ["フィットネス", "健康"], imageUrl: "/nikechan_icon.jpg?height=100&width=100", youtubeUrl: "https://youtube.com", twitterUrl: "https://twitter.com" },
  { id: 7, name: "Tech-Guru", description: "最新テクノロジーを解説するAI", tags: ["テクノロジー", "ガジェット"], imageUrl: "/nikechan_icon.jpg?height=100&width=100", youtubeUrl: "https://youtube.com", twitterUrl: "https://twitter.com" },
  { id: 8, name: "Story-Teller", description: "オリジナルストーリーを語るAI", tags: ["物語", "エンターテイメント"], imageUrl: "/nikechan_icon.jpg?height=100&width=100", youtubeUrl: "https://youtube.com", twitterUrl: "https://twitter.com" },
  { id: 9, name: "Medi-Bot", description: "医療アドバイスを提供するAI医師", tags: ["医療", "健康"], imageUrl: "/nikechan_icon.jpg?height=100&width=100", youtubeUrl: "https://youtube.com", twitterUrl: "https://twitter.com" },
  { id: 10, name: "Eco-Guide", description: "環境保護について啓発するAI", tags: ["環境", "教育"], imageUrl: "/nikechan_icon.jpg?height=100&width=100", youtubeUrl: "https://youtube.com", twitterUrl: "https://twitter.com" },
]

// 全てのタグを抽出
const allTags = Array.from(new Set(aitubers.flatMap(aituber => aituber.tags)))

export default function Component() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const filteredAITubers = aitubers.filter(aituber =>
    selectedTags.length === 0 || selectedTags.some(tag => aituber.tags.includes(tag))
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">AITuberリスト</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">タグでフィルター</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <div key={tag} className="flex items-center">
              <Checkbox
                id={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              />
              <label htmlFor={tag} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {tag}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAITubers.map(aituber => (
          <Card key={aituber.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <img src={aituber.imageUrl} alt={aituber.name} className="w-10 h-10 rounded-full" />
                {aituber.name}
              </CardTitle>
              <CardDescription>{aituber.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {aituber.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={aituber.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-4 h-4 mr-2" />
                    YouTube
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={aituber.twitterUrl} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
