export type Locale = 'ja' | 'en'

export const translations = {
  ja: {
    // Header
    'site.title': 'AITuberList',
    'site.count': '({count}名)',
    'site.lastUpdated': '最終更新日: {date}',
    
    // Overview section
    'overview.title': '概要',
    'overview.description1': 'このWebサイトではAITuberの情報をまとめています。',
    'overview.description2': '1日に2回更新されます。',
    'overview.description3': 'タグの分類は誤っている可能性があります。',
    'overview.description4': 'コンテンツの一つとしてAIキャラクターが登場するチャンネルも含まれています。',
    'overview.contactTitle': 'ご意見・ご要望・不具合報告は開発者のXまでお願いします：',
    'overview.github': 'GitHub リポジトリ',
    
    // Filter section
    'filter.title': 'フィルター',
    'filter.activeCount': '{count}個のフィルターが有効',
    'filter.showCount': '{filtered} / {total} 件表示',
    'filter.searchByName': '名前で検索',
    'filter.searchPlaceholder': 'AITuber名を入力...',
    'filter.tags': 'タグ',
    'filter.searchCondition': '検索条件：',
    'filter.tagDescription': 'タグの説明を表示',
    'filter.noTagDescription': 'タグの説明がありません',
    'filter.lastUpdated': '最終更新日',
    'filter.subscriberCount': '登録者数',
    'filter.all': 'すべて',
    
    // Date filters
    'date.all': '全期間',
    'date.1month': '1ヶ月以内',
    'date.3months': '3ヶ月以内',
    'date.6months': '6ヶ月以内',
    'date.1year': '1年以内',
    'date.older': '1年以上前',
    
    // Subscriber filters
    'subscriber.100': '100人以上',
    'subscriber.500': '500人以上',
    'subscriber.1000': '1000人以上',
    'subscriber.10000': '1万人以上',
    
    // Card content
    'card.subscriberCount': '登録者数: {count}人',
    'card.latestVideo': '{name}の最新動画',
    'card.noVideo': '動画はまだありません',
    'card.upcomingStream': '配信予定',
    
    // Loading
    'loading.scrollMore': 'スクロールして更に読み込む',
    'loading.backToTop': 'ページトップへ戻る',
    
    // Footer
    'footer.terms': '利用規約',
    'footer.privacy': 'プライバシーポリシー',
    
    // Terms page
    'terms.title': '利用規約',
    'terms.lastUpdated': '最終更新日: 2024年11月26日',
    'terms.backToTop': 'トップページに戻る',
    
    // Privacy page
    'privacy.title': 'プライバシーポリシー',
    'privacy.lastUpdated': '最終更新日: 2024年11月26日',
    'privacy.backToTop': 'トップページに戻る',
    
    // Tag descriptions
    'tag.コメント応答': 'ライブチャット欄のコメントに対してAIが自動で応答する',
    'tag.解説': '解説動画がある',
    'tag.歌唱あり': '歌唱枠がある',
    'tag.海外': '日本語以外のAITuber',
    'tag.ゲーム実況': 'ゲームの実況配信を行う',
    'tag.AIパートナー': '人間配信者のパートナーとしてAIが参加する',
    'tag.複数キャラ': '複数のAIキャラクターが登場する',
    'tag.一部AITuber': 'コンテンツの一部でAIキャラクターを活用している',
  },
  
  en: {
    // Header
    'site.title': 'AITuberList',
    'site.count': '({count} members)',
    'site.lastUpdated': 'Last updated: {date}',
    
    // Overview section
    'overview.title': 'Overview',
    'overview.description1': 'This website compiles information about AITubers.',
    'overview.description2': 'Updated twice a day.',
    'overview.description3': 'Tag classifications may be incorrect.',
    'overview.description4': 'Channels featuring AI characters as part of their content are also included.',
    'overview.contactTitle': 'For feedback, requests, and bug reports, please contact the developer on X:',
    'overview.github': 'GitHub Repository',
    
    // Filter section
    'filter.title': 'Filters',
    'filter.activeCount': '{count} filters active',
    'filter.showCount': 'Showing {filtered} / {total}',
    'filter.searchByName': 'Search by name',
    'filter.searchPlaceholder': 'Enter AITuber name...',
    'filter.tags': 'Tags',
    'filter.searchCondition': 'Search condition:',
    'filter.tagDescription': 'Show tag descriptions',
    'filter.noTagDescription': 'No description available',
    'filter.lastUpdated': 'Last updated',
    'filter.subscriberCount': 'Subscriber count',
    'filter.all': 'All',
    
    // Date filters
    'date.all': 'All time',
    'date.1month': 'Within 1 month',
    'date.3months': 'Within 3 months',
    'date.6months': 'Within 6 months',
    'date.1year': 'Within 1 year',
    'date.older': 'Over 1 year ago',
    
    // Subscriber filters
    'subscriber.100': '100+ subscribers',
    'subscriber.500': '500+ subscribers',
    'subscriber.1000': '1000+ subscribers',
    'subscriber.10000': '10K+ subscribers',
    
    // Card content
    'card.subscriberCount': 'Subscribers: {count}',
    'card.latestVideo': 'Latest video by {name}',
    'card.noVideo': 'No videos yet',
    'card.upcomingStream': 'Upcoming',
    
    // Loading
    'loading.scrollMore': 'Scroll to load more',
    'loading.backToTop': 'Back to top',
    
    // Footer
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    
    // Terms page
    'terms.title': 'Terms of Service',
    'terms.lastUpdated': 'Last updated: November 26, 2024',
    'terms.backToTop': 'Back to top page',
    
    // Privacy page
    'privacy.title': 'Privacy Policy',
    'privacy.lastUpdated': 'Last updated: November 26, 2024',
    'privacy.backToTop': 'Back to top page',
    
    // Tag descriptions
    'tag.コメント応答': 'AI automatically responds to live chat comments',
    'tag.解説': 'Has explanatory videos',
    'tag.歌唱あり': 'Has singing streams',
    'tag.海外': 'Non-Japanese AITuber',
    'tag.ゲーム実況': 'Performs game streaming',
    'tag.AIパートナー': 'AI participates as a partner to human streamers',
    'tag.複数キャラ': 'Multiple AI characters appear',
    'tag.一部AITuber': 'Utilizes AI characters as part of content',
  }
} as const

export type TranslationKey = keyof typeof translations.ja

export const getTranslation = (locale: Locale, key: TranslationKey, params?: Record<string, string | number>): string => {
  let text: string = translations[locale][key] || translations.ja[key] || key
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value))
    })
  }
  
  return text
}

export const formatDate = (dateString: string, locale: Locale = 'ja') => {
  const date = new Date(dateString);
  
  if (locale === 'en') {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tokyo'
    });
  } else {
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tokyo'
    });
  }
};

export const formatSubscriberCount = (count: number, locale: Locale = 'ja'): string => {
  if (locale === 'en') {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(2)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(2)}K`;
    }
    return `${count}`;
  } else {
    if (count >= 10000000) {
      return `${(count / 10000000).toFixed(2)}千万`;
    } else if (count >= 10000) {
      return `${(count / 10000).toFixed(2)}万`;
    } else if (count >= 1000) {
      return `${count.toLocaleString()}`;
    }
    return `${count}`;
  }
};

export const getTagDescription = (tag: string, locale: Locale = 'ja'): string => {
  const key = `tag.${tag}` as TranslationKey;
  return getTranslation(locale, key);
};