'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Locale } from "@/lib/i18n"

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  const languages = [
    { value: 'ja' as Locale, label: '日本語', flag: '🇯🇵' },
    { value: 'en' as Locale, label: 'English', flag: '🇺🇸' },
  ]

  const currentLanguage = languages.find(lang => lang.value === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 px-0">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => setLocale(language.value)}
            className={locale === language.value ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}