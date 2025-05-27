'use client'

import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function LanguageToggle() {
  const [mounted, setMounted] = useState(false)
  const { i18n, t } = useTranslation()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ja' ? 'en' : 'ja'
    i18n.changeLanguage(newLang)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="h-9 w-9 rounded-full"
      title={t('ui.toggleLanguage')}
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">{t('ui.toggleLanguage')}</span>
    </Button>
  )
}
