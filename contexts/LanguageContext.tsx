'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, getTranslation, TranslationKey } from '@/lib/i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('ja')

  useEffect(() => {
    try {
      // ローカルストレージから言語設定を読み込み
      const savedLocale = localStorage.getItem('locale') as Locale
      const validLocales: Locale[] = ['ja', 'en', 'zh-CN', 'zh-TW', 'ko']
      if (savedLocale && validLocales.includes(savedLocale)) {
        setLocaleState(savedLocale)
      }
    } catch (error) {
      console.warn('Failed to load locale from localStorage:', error)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    
    try {
      localStorage.setItem('locale', newLocale)
    } catch (error) {
      console.warn('Failed to save locale to localStorage:', error)
    }
    
    // HTMLのlang属性を更新（useEffect内で実行することを検討）
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
    }
  }

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    return getTranslation(locale, key, params)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}