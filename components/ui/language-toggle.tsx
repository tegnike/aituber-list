'use client'

import { Button } from '@/components/ui/button'
import { useI18n, Language } from '@/lib/i18n'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { language, setLanguage } = useI18n()

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'ja' ? 'en' : 'ja'
    setLanguage(newLanguage)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {language === 'ja' ? 'EN' : 'JP'}
      </span>
    </Button>
  )
}