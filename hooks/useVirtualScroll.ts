'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

export interface UseVirtualScrollOptions {
  estimateSize: number
  overscan?: number
  horizontal?: boolean
  gap?: number
  columns?: number
}

export interface UseVirtualScrollReturn<T> {
  virtualItems: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>['getVirtualItems']
  totalSize: number
  containerRef: React.RefObject<HTMLDivElement>
  scrollContainerRef: React.RefObject<HTMLDivElement>
  showScrollTop: boolean
  scrollToTop: () => void
  virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>
  getItemStyle: (index: number) => React.CSSProperties
}

export function useVirtualScroll<T>(
  items: T[],
  options: UseVirtualScrollOptions
): UseVirtualScrollReturn<T> {
  const { estimateSize, overscan = 5, gap = 16, columns = 1 } = options

  const [showScrollTop, setShowScrollTop] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const rowCount = useMemo(() => Math.ceil(items.length / columns), [items.length, columns])

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => estimateSize + gap,
    overscan,
  })

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

  const getItemStyle = useCallback((virtualRowIndex: number): React.CSSProperties => {
    const virtualItem = virtualizer.getVirtualItems()[virtualRowIndex]
    if (!virtualItem) return {}

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: `${virtualItem.size - gap}px`,
      transform: `translateY(${virtualItem.start}px)`,
    }
  }, [virtualizer, gap])

  return {
    virtualItems: virtualizer.getVirtualItems,
    totalSize: virtualizer.getTotalSize(),
    containerRef,
    scrollContainerRef,
    showScrollTop,
    scrollToTop,
    virtualizer,
    getItemStyle,
  }
}

export interface UseVirtualGridOptions {
  estimateRowHeight: number
  overscan?: number
  gap?: number
}

export interface UseVirtualGridReturn<T> {
  virtualRows: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>['getVirtualItems']
  totalHeight: number
  parentRef: React.RefObject<HTMLDivElement>
  showScrollTop: boolean
  scrollToTop: () => void
  virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>
  columns: number
  getRowItems: (rowIndex: number) => T[]
}

export function useVirtualGrid<T>(
  items: T[],
  options: UseVirtualGridOptions
): UseVirtualGridReturn<T> {
  const { estimateRowHeight, overscan = 3, gap = 16 } = options

  const [showScrollTop, setShowScrollTop] = useState(false)
  const [columns, setColumns] = useState(4)
  const parentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 640) {
        setColumns(1)
      } else if (width < 1024) {
        setColumns(2)
      } else if (width < 1280) {
        setColumns(3)
      } else {
        setColumns(4)
      }
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  const rowCount = useMemo(() => Math.ceil(items.length / columns), [items.length, columns])

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateRowHeight + gap,
    overscan,
  })

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

  const getRowItems = useCallback((rowIndex: number): T[] => {
    const start = rowIndex * columns
    const end = Math.min(start + columns, items.length)
    return items.slice(start, end)
  }, [items, columns])

  return {
    virtualRows: virtualizer.getVirtualItems,
    totalHeight: virtualizer.getTotalSize(),
    parentRef,
    showScrollTop,
    scrollToTop,
    virtualizer,
    columns,
    getRowItems,
  }
}

export function useWindowVirtualizer<T>(
  items: T[],
  options: UseVirtualGridOptions
) {
  const { estimateRowHeight, overscan = 3, gap = 16 } = options

  const [showScrollTop, setShowScrollTop] = useState(false)
  const [columns, setColumns] = useState(4)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 640) {
        setColumns(1)
      } else if (width < 1024) {
        setColumns(2)
      } else if (width < 1280) {
        setColumns(3)
      } else {
        setColumns(4)
      }
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  const rowCount = useMemo(() => Math.ceil(items.length / columns), [items.length, columns])

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => null,
    estimateSize: () => estimateRowHeight + gap,
    overscan,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  })

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200)
      virtualizer.measure()
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [virtualizer])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const getRowItems = useCallback((rowIndex: number): T[] => {
    const start = rowIndex * columns
    const end = Math.min(start + columns, items.length)
    return items.slice(start, end)
  }, [items, columns])

  return {
    virtualRows: virtualizer.getVirtualItems(),
    totalHeight: virtualizer.getTotalSize(),
    listRef,
    showScrollTop,
    scrollToTop,
    virtualizer,
    columns,
    getRowItems,
  }
}
