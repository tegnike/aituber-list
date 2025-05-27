'use client'

import { useI18n } from '@/lib/i18n'
import { useEffect } from 'react'

export function LayoutWrapper() {
  const { language } = useI18n()

  useEffect(() => {
    // Update the html lang attribute when language changes
    document.documentElement.lang = language
  }, [language])

  return null
}