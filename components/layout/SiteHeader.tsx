'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatDate } from '@/lib/i18n'

export function SiteHeader({ count, lastUpdated }: { count: number; lastUpdated: string }) {
  const { locale, t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="AITuberList トップ">
          <Image
            src="/images/aituber-list-logo.png"
            alt=""
            width={2166}
            height={350}
            className="h-6 w-auto shrink-0 sm:h-7"
            priority
          />
          <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">
            {t('site.count', { count })}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="mr-2 hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_hsl(142_71%_45%/0.12)]" />
            {t('site.lastUpdated', { date: formatDate(lastUpdated, locale) })}
          </div>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
