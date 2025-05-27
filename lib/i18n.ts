import { createContext, useContext } from 'react'

export type Language = 'ja' | 'en'

export interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined)

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// Translation keys and their values
export const translations = {
  ja: {
    // Header
    'site.title': 'AITuberList',
    'site.count': '名',
    'lastUpdated': '最終更新日',
    
    // Overview section
    'overview.title': '概要',
    'overview.description1': 'このWebサイトではAITuberの情報をまとめています。',
    'overview.description2': '1日に2回更新されます。',
    'overview.description3': 'タグの分類は誤っている可能性があります。',
    'overview.description4': 'コンテンツの一つとしてAIキャラクターが登場するチャンネルも含まれています。',
    'overview.feedback': 'ご意見・ご要望・不具合報告は開発者のXまでお願いします：',
    'overview.githubRepo': 'GitHub リポジトリ',
    
    // Filters section
    'filters.title': 'フィルター',
    'filters.active': '個のフィルターが有効',
    'filters.showing': '件表示',
    'filters.nameSearch': '名前で検索',
    'filters.nameSearchPlaceholder': 'AITuber名を入力...',
    'filters.tags': 'タグ',
    'filters.searchCondition': '検索条件：',
    'filters.tagsDescription': 'タグの説明を表示',
    'filters.lastUpdate': '最終更新日',
    'filters.subscriberCount': '登録者数',
    'filters.all': 'すべて',
    
    // Date filters
    'dateFilter.all': '全期間',
    'dateFilter.1month': '1ヶ月以内',
    'dateFilter.3months': '3ヶ月以内',
    'dateFilter.6months': '6ヶ月以内',
    'dateFilter.1year': '1年以内',
    'dateFilter.older': '1年以上前',
    
    // Subscriber filters
    'subscriberFilter.100': '100人以上',
    'subscriberFilter.500': '500人以上',
    'subscriberFilter.1000': '1000人以上',
    'subscriberFilter.10000': '1万人以上',
    
    // Card content
    'card.subscriberCount': '登録者数',
    'card.people': '人',
    'card.upcoming': '配信予定',
    'card.noVideo': '動画はまだありません',
    'card.latestVideo': 'の最新動画',
    
    // Footer
    'footer.terms': '利用規約',
    'footer.privacy': 'プライバシーポリシー',
    
    // Loading
    'loading.scrollMore': 'スクロールして更に読み込む',
    'button.scrollTop': 'ページトップへ戻る',
    
    // Tag descriptions
    'tagDesc.コメント応答': 'ライブチャット欄のコメントに対してAIが自動で応答する',
    'tagDesc.解説': '解説動画がある',
    'tagDesc.歌唱あり': '歌唱枠がある',
    'tagDesc.海外': '日本語以外のAITuber',
    'tagDesc.ゲーム実況': 'ゲームの実況配信を行う',
    'tagDesc.AIパートナー': '人間配信者のパートナーとしてAIが参加する',
    'tagDesc.複数キャラ': '複数のAIキャラクターが登場する',
    'tagDesc.一部AITuber': 'コンテンツの一部でAIキャラクターを活用している',
    'tagDesc.default': 'タグの説明がありません',
  },
  en: {
    // Header
    'site.title': 'AITuberList',
    'site.count': ' AITubers',
    'lastUpdated': 'Last Updated',
    
    // Overview section
    'overview.title': 'Overview',
    'overview.description1': 'This website aggregates information about AITubers.',
    'overview.description2': 'Updated twice daily.',
    'overview.description3': 'Tag classifications may contain errors.',
    'overview.description4': 'Includes channels featuring AI characters as part of their content.',
    'overview.feedback': 'For feedback, requests, or bug reports, please contact the developer on X:',
    'overview.githubRepo': 'GitHub Repository',
    
    // Filters section
    'filters.title': 'Filters',
    'filters.active': ' filters active',
    'filters.showing': ' shown',
    'filters.nameSearch': 'Search by name',
    'filters.nameSearchPlaceholder': 'Enter AITuber name...',
    'filters.tags': 'Tags',
    'filters.searchCondition': 'Search condition:',
    'filters.tagsDescription': 'Show tag descriptions',
    'filters.lastUpdate': 'Last Update',
    'filters.subscriberCount': 'Subscriber Count',
    'filters.all': 'All',
    
    // Date filters
    'dateFilter.all': 'All time',
    'dateFilter.1month': 'Within 1 month',
    'dateFilter.3months': 'Within 3 months',
    'dateFilter.6months': 'Within 6 months',
    'dateFilter.1year': 'Within 1 year',
    'dateFilter.older': 'Over 1 year ago',
    
    // Subscriber filters
    'subscriberFilter.100': '100+ subscribers',
    'subscriberFilter.500': '500+ subscribers',
    'subscriberFilter.1000': '1000+ subscribers',
    'subscriberFilter.10000': '10K+ subscribers',
    
    // Card content
    'card.subscriberCount': 'Subscribers',
    'card.people': '',
    'card.upcoming': 'Scheduled',
    'card.noVideo': 'No videos yet',
    'card.latestVideo': '\'s latest video',
    
    // Footer
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    
    // Loading
    'loading.scrollMore': 'Scroll to load more',
    'button.scrollTop': 'Back to top',
    
    // Tag descriptions
    'tagDesc.コメント応答': 'AI automatically responds to live chat comments',
    'tagDesc.解説': 'Has explanatory videos',
    'tagDesc.歌唱あり': 'Has singing streams',
    'tagDesc.海外': 'Non-Japanese AITuber',
    'tagDesc.ゲーム実況': 'Performs game commentary streams',
    'tagDesc.AIパートナー': 'AI participates as a partner to human streamers',
    'tagDesc.複数キャラ': 'Features multiple AI characters',
    'tagDesc.一部AITuber': 'Utilizes AI characters as part of content',
    'tagDesc.default': 'No description available',
  }
} as const

export type TranslationKey = keyof typeof translations.ja

export const getTranslation = (key: TranslationKey, language: Language): string => {
  return translations[language][key] || translations.ja[key] || key
}