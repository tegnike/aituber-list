'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { I18nProvider } from '@/components/i18n-provider'
import { LayoutWrapper } from '@/components/layout-wrapper'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        <LayoutWrapper />
        {children}
      </I18nProvider>
    </ThemeProvider>
  )
}