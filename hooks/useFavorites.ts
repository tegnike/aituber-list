'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'aituber-favorites'

export interface UseFavoritesReturn {
  favorites: string[]
  toggleFavorite: (channelId: string) => void
  isFavorite: (channelId: string) => boolean
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem(STORAGE_KEY)
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const toggleFavorite = useCallback((channelId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites))
      return newFavorites
    })
  }, [])

  const isFavorite = useCallback((channelId: string) => {
    return favorites.includes(channelId)
  }, [favorites])

  return {
    favorites,
    toggleFavorite,
    isFavorite
  }
}
