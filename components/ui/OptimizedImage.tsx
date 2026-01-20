'use client'

import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
}

function getOptimizedSources(src: string): { avif: string; webp: string; original: string } {
  // Only process local images in /images/
  if (!src.startsWith('/images/') && !src.startsWith('images/')) {
    return { avif: src, webp: src, original: src }
  }

  const ext = src.match(/\.(png|jpg|jpeg)$/i)?.[0] || ''
  if (!ext) {
    return { avif: src, webp: src, original: src }
  }

  const basePath = src.replace(ext, '')

  return {
    avif: `${basePath}.avif`,
    webp: `${basePath}.webp`,
    original: src,
  }
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
}: OptimizedImageProps) {
  const [error, setError] = useState(false)
  const sources = getOptimizedSources(src)

  // If optimized formats failed, just use original
  if (error) {
    return (
      <img
        src={sources.original}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
      />
    )
  }

  return (
    <picture>
      <source
        srcSet={sources.avif}
        type="image/avif"
      />
      <source
        srcSet={sources.webp}
        type="image/webp"
      />
      <img
        src={sources.original}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onError={() => setError(true)}
        sizes={sizes}
      />
    </picture>
  )
}
