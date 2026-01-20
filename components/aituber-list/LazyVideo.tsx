'use client'

import { useState, useEffect, useRef } from 'react'
import { extractYouTubeVideoId } from './types'

interface LazyVideoProps {
  videoUrl: string
  title: string
}

export function LazyVideo({ videoUrl, title }: LazyVideoProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoId = extractYouTubeVideoId(videoUrl)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting) {
          setShouldLoad(true)
        }
      },
      {
        threshold: 0.1
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [videoUrl])

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-full">
      {shouldLoad && (
        <iframe
          key={videoId}
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
            isIntersecting ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ pointerEvents: isIntersecting ? 'auto' : 'none' }}
        />
      )}
    </div>
  )
}
