'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { FALLBACK_IMAGE } from './types'

interface AITuberImageProps {
  src: string
  alt: string
  size?: number
  className?: string
  priority?: boolean
}

// 画像URLを正規化する関数（コンポーネント外に配置してメモ化効率を上げる）
function normalizeImageSrc(src: string): string {
  if (src.startsWith('http')) return src
  if (src.startsWith('/')) return src
  if (src) return `/images/aitubers/${src}`
  return FALLBACK_IMAGE
}

export function AITuberImage({
  src,
  alt,
  size = 40,
  className = '',
  priority = false
}: AITuberImageProps) {
  const [hasError, setHasError] = useState(false)

  const handleError = useCallback(() => {
    setHasError(true)
  }, [])

  const imageSrc = hasError ? FALLBACK_IMAGE : normalizeImageSrc(src)

  return (
    <div
      className={`relative overflow-hidden bg-muted ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={size}
        height={size}
        className={`${className} transition-opacity duration-200`}
        onError={handleError}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        unoptimized={imageSrc.includes('yt3.ggpht.com')}
      />
    </div>
  )
}
