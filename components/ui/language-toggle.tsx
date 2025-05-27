'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  const toggleLanguage = () => {
    setLocale(locale === 'ja' ? 'en' : 'ja')
  }

  const currentFlag = locale === 'ja' ? '🇯🇵' : '🇺🇸'

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-8 w-8 px-0" 
      onClick={toggleLanguage}
    >
      <span className="text-base">{currentFlag}</span>
      <span className="sr-only">Toggle language</span>
    </Button>
  )
}