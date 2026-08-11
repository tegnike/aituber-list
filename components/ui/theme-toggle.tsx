'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

const themeLabels = {
  ja: 'テーマを切り替える',
  en: 'Toggle theme',
  'zh-CN': '切换主题',
  'zh-TW': '切換主題',
  ko: '테마 전환',
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const { locale } = useLanguage()

  // useEffectはクライアントサイドでのみ実行されるため、
  // マウント後にのみレンダリングを行い、SSRとの不一致を防ぎます
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{themeLabels[locale]}</span>
    </Button>
  )
}
