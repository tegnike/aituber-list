'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SkipLink } from '@/components/ui/skip-link'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <SkipLink />
        {children}
      </LanguageProvider>
    </ThemeProvider>
  )
}