'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import i18n from '@/lib/i18n'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
