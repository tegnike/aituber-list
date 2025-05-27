'use client'

import { useState, useEffect, ReactNode } from 'react'
import { I18nContext, Language, getTranslation, TranslationKey } from '@/lib/i18n'

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>('ja')

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('aituber-list-language') as Language
    if (savedLanguage && (savedLanguage === 'ja' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('aituber-list-language', language)
  }, [language])

  const t = (key: TranslationKey): string => {
    return getTranslation(key, language)
  }

  const value = {
    language,
    setLanguage,
    t,
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}