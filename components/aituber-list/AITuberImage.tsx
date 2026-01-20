'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FALLBACK_IMAGE } from './types'

interface AITuberImageProps {
  src: string
  alt: string
  size?: number
  className?: string
  priority?: boolean
}

export function AITuberImage({
  src,
  alt,
  size = 40,
  className = '',
  priority = false
}: AITuberImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setImgSrc(src)
    setHasError(false)
  }, [src])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(FALLBACK_IMAGE)
    }
  }

  const imageSrc = imgSrc.startsWith('http')
    ? imgSrc
    : imgSrc.startsWith('/')
      ? imgSrc
      : imgSrc
        ? `/images/aitubers/${imgSrc}`
        : FALLBACK_IMAGE

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={size}
      height={size}
      className={className}
      onError={handleError}
      priority={priority}
    />
  )
}
