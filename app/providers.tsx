'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode, useEffect } from 'react'
import i18n from '@/lib/i18n'

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);

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
