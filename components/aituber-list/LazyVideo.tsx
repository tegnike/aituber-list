'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { extractYouTubeVideoId } from './types'

interface LazyVideoProps {
  videoUrl: string
  title: string
  priority?: boolean
}

// サムネイルサイズ最適化関数
const getThumbnailUrl = (videoId: string, size: 'hq' | 'mq' = 'mq') => {
  return `https://i.ytimg.com/vi/${videoId}/${size}default.jpg`
}

export function LazyVideo({ videoUrl, title, priority = false }: LazyVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = extractYouTubeVideoId(videoUrl)

  if (!videoId) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-muted">
        <span className="text-muted-foreground">動画を読み込めませんでした</span>
      </div>
    )
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {isPlaying ? (
        <iframe
          key={videoId}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      ) : (
        <button
          onClick={handlePlay}
          className="absolute top-0 left-0 w-full h-full group cursor-pointer"
          aria-label={`${title}を再生`}
        >
          <Image
            src={getThumbnailUrl(videoId, 'mq')}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
          />
          {/* 再生ボタンオーバーレイ */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-600 group-hover:bg-red-700 transition-colors shadow-lg">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        </button>
      )}
    </div>
  )
}
