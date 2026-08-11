import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'AITuberListが取り扱うアクセス情報、Cookie、利用目的、安全管理、問い合わせ方法について説明します。',
  alternates: {
    canonical: '/privacy/',
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
