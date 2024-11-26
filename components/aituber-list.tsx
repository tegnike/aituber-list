'use client'

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Youtube, Twitter, Calendar } from "lucide-react"
import Image from "next/image"
import aituberData from '../app/data/aitubers.json'
import Link from 'next/link'

// AITuberの型定義は残します
type AITuber = {
  name: string
  description: string
  tags: string[]
  twitterID: string
  youtubeURL: string
  imageUrl: string
  youtubeSubscribers: number
  latestVideoThumbnail: string
  latestVideoUrl: string
  latestVideoDate: string
  isUpcoming: boolean
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

export function AituberList() {
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
      <h1 className="text-3xl font-bold text-center mb-2">AITuberリスト</h1>
      <p className="text-center text-sm text-muted-foreground mb-4">
        最終更新日: {formatDate(aituberData.lastUpdated)}
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          タグでフィルター
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({filteredAITubers.length} / {aitubers.length})
          </span>
        </h2>
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
        {filteredAITubers.map((aituber, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {aituber.youtubeURL ? (
                  <a href={`https://www.youtube.com/@${aituber.youtubeURL}`} target="_blank" rel="noopener noreferrer">
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
                {aituber.name}
              </CardTitle>
              <CardDescription>{aituber.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-4">
                {aituber.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">
                  登録者数: {formatSubscriberCount(aituber.youtubeSubscribers)}人
                </div>
                <div className="flex gap-2">
                  {aituber.youtubeURL && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://www.youtube.com/@${aituber.youtubeURL}`} target="_blank" rel="noopener noreferrer">
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
              <a href={aituber.latestVideoUrl} target="_blank" rel="noopener noreferrer" className="w-full aspect-video relative">
                <Image
                  src={aituber.latestVideoThumbnail || '/images/preparing-thumbnail.png'}
                  alt={`${aituber.name}の最新動画`}
                  fill
                  className="object-cover object-center"
                />
              </a>
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