'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ITEMS_PER_PAGE } from '@/components/aituber-list/types'

export interface UseInfiniteScrollReturn<T> {
  displayedItems: T[]
  loadMoreRef: React.RefObject<HTMLDivElement>
  isLoading: boolean
  hasMore: boolean
  showScrollTop: boolean
  scrollToTop: () => void
  resetPage: () => void
}

export function useInfiniteScroll<T>(
  items: T[],
  itemsPerPage: number = ITEMS_PER_PAGE
): UseInfiniteScrollReturn<T> {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const displayedItems = items.slice(0, currentPage * itemsPerPage)
  const hasMore = displayedItems.length < items.length

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !isLoading) {
          if (currentPage < Math.ceil(items.length / itemsPerPage)) {
            setIsLoading(true)
            setTimeout(() => {
              setCurrentPage(prev => prev + 1)
              setIsLoading(false)
            }, 500)
          }
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [currentPage, items.length, isLoading, itemsPerPage])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const resetPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  return {
    displayedItems,
    loadMoreRef: loadMoreRef as React.RefObject<HTMLDivElement>,
    isLoading,
    hasMore,
    showScrollTop,
    scrollToTop,
    resetPage
  }
}
