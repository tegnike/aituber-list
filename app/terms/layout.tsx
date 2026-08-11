import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '利用規約',
  description: 'AITuberListの利用条件、掲載情報、禁止事項、知的財産権、免責事項について定めた利用規約です。',
  alternates: {
    canonical: '/terms/',
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
