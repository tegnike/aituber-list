export type Locale = 'ja' | 'en' | 'zh-CN' | 'zh-TW' | 'ko'

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
    'filter.searchByName': '名前・説明で検索',
    'filter.searchPlaceholder': 'AITuber名または説明を入力...',
    'filter.tags': 'タグ',
    'filter.searchCondition': '検索条件：',
    'filter.tagDescription': 'タグの説明を表示',
    'filter.noTagDescription': 'タグの説明がありません',
    'filter.lastUpdated': '最終更新日',
    'filter.subscriberCount': '登録者数',
    'filter.all': 'すべて',
    'filter.reset': 'リセット',
    
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
    
    // Tag names
    'tagName.コメント応答': 'コメント応答',
    'tagName.複数キャラ': '複数キャラ',
    'tagName.歌唱あり': '歌唱あり',
    'tagName.ゲーム実況': 'ゲーム実況',
    'tagName.海外': '海外',
    'tagName.一部AITuber': '一部AITuber',
    'tagName.AIパートナー': 'AIパートナー',
    'tagName.解説': '解説',

    // Sort options
    'sort.title': '並び替え',
    'sort.subscribers': '登録者数順',
    'sort.latest': '最新動画順',
    'sort.name': '名前順',
    'sort.random': 'ランダム',

    // Favorites
    'filter.favoritesOnly': 'お気に入りのみ',
    'card.addFavorite': 'お気に入りに追加',
    'card.removeFavorite': 'お気に入りから削除',

    // Additional filters
    'filter.additionalFilters': 'その他',

    // Upcoming filter
    'filter.upcomingOnly': '配信予定のみ',

    // View mode
    'view.grid': 'グリッド表示',
    'view.list': 'リスト表示',

    // Accessibility
    'a11y.skipToMain': 'メインコンテンツへスキップ',
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
    'filter.searchByName': 'Search by name or description',
    'filter.searchPlaceholder': 'Enter AITuber name or description...',
    'filter.tags': 'Tags',
    'filter.searchCondition': 'Search condition:',
    'filter.tagDescription': 'Show tag descriptions',
    'filter.noTagDescription': 'No description available',
    'filter.lastUpdated': 'Last updated',
    'filter.subscriberCount': 'Subscriber count',
    'filter.all': 'All',
    'filter.reset': 'Reset',

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
    
    // Tag names
    'tagName.コメント応答': 'Comment Response',
    'tagName.複数キャラ': 'Multiple Characters',
    'tagName.歌唱あり': 'Singing',
    'tagName.ゲーム実況': 'Game Streaming',
    'tagName.海外': 'International',
    'tagName.一部AITuber': 'Partial AITuber',
    'tagName.AIパートナー': 'AI Partner',
    'tagName.解説': 'Explanation',

    // Sort options
    'sort.title': 'Sort by',
    'sort.subscribers': 'Subscribers',
    'sort.latest': 'Latest video',
    'sort.name': 'Name',
    'sort.random': 'Random',

    // Favorites
    'filter.favoritesOnly': 'Favorites only',
    'card.addFavorite': 'Add to favorites',
    'card.removeFavorite': 'Remove from favorites',

    // Additional filters
    'filter.additionalFilters': 'Others',

    // Upcoming filter
    'filter.upcomingOnly': 'Upcoming only',

    // View mode
    'view.grid': 'Grid view',
    'view.list': 'List view',

    // Accessibility
    'a11y.skipToMain': 'Skip to main content',
  },

  'zh-CN': {
    // Header
    'site.title': 'AITuberList',
    'site.count': '（{count}位）',
    'site.lastUpdated': '最后更新：{date}',

    // Overview section
    'overview.title': '概述',
    'overview.description1': '本网站汇总了AITuber的信息。',
    'overview.description2': '每天更新两次。',
    'overview.description3': '标签分类可能存在错误。',
    'overview.description4': '包含将AI角色作为内容一部分的频道。',
    'overview.contactTitle': '如有意见、需求或错误报告，请联系开发者的X：',
    'overview.github': 'GitHub 仓库',

    // Filter section
    'filter.title': '筛选',
    'filter.activeCount': '{count}个筛选条件已启用',
    'filter.showCount': '显示 {filtered} / {total}',
    'filter.searchByName': '按名称或描述搜索',
    'filter.searchPlaceholder': '输入AITuber名称或描述...',
    'filter.tags': '标签',
    'filter.searchCondition': '搜索条件：',
    'filter.tagDescription': '显示标签说明',
    'filter.noTagDescription': '暂无标签说明',
    'filter.lastUpdated': '最后更新',
    'filter.subscriberCount': '订阅数',
    'filter.all': '全部',
    'filter.reset': '重置',

    // Date filters
    'date.all': '全部时间',
    'date.1month': '1个月内',
    'date.3months': '3个月内',
    'date.6months': '6个月内',
    'date.1year': '1年内',
    'date.older': '1年以上',

    // Subscriber filters
    'subscriber.100': '100+订阅',
    'subscriber.500': '500+订阅',
    'subscriber.1000': '1000+订阅',
    'subscriber.10000': '1万+订阅',

    // Card content
    'card.subscriberCount': '订阅数：{count}',
    'card.latestVideo': '{name}的最新视频',
    'card.noVideo': '暂无视频',
    'card.upcomingStream': '即将直播',

    // Loading
    'loading.scrollMore': '滚动加载更多',
    'loading.backToTop': '返回顶部',

    // Footer
    'footer.terms': '使用条款',
    'footer.privacy': '隐私政策',

    // Terms page
    'terms.title': '使用条款',
    'terms.lastUpdated': '最后更新：2024年11月26日',
    'terms.backToTop': '返回首页',

    // Privacy page
    'privacy.title': '隐私政策',
    'privacy.lastUpdated': '最后更新：2024年11月26日',
    'privacy.backToTop': '返回首页',

    // Tag descriptions
    'tag.コメント応答': 'AI自动回复直播聊天评论',
    'tag.解説': '有解说视频',
    'tag.歌唱あり': '有歌唱直播',
    'tag.海外': '非日语AITuber',
    'tag.ゲーム実況': '进行游戏直播',
    'tag.AIパートナー': 'AI作为人类主播的搭档参与',
    'tag.複数キャラ': '多个AI角色出场',
    'tag.一部AITuber': '部分内容使用AI角色',

    // Tag names
    'tagName.コメント応答': '评论回复',
    'tagName.複数キャラ': '多角色',
    'tagName.歌唱あり': '歌唱',
    'tagName.ゲーム実況': '游戏直播',
    'tagName.海外': '海外',
    'tagName.一部AITuber': '部分AITuber',
    'tagName.AIパートナー': 'AI搭档',
    'tagName.解説': '解说',

    // Sort options
    'sort.title': '排序',
    'sort.subscribers': '订阅数',
    'sort.latest': '最新视频',
    'sort.name': '名称',
    'sort.random': '随机',

    // Favorites
    'filter.favoritesOnly': '仅收藏',
    'card.addFavorite': '添加收藏',
    'card.removeFavorite': '取消收藏',

    // Additional filters
    'filter.additionalFilters': '其他',

    // Upcoming filter
    'filter.upcomingOnly': '仅即将直播',

    // View mode
    'view.grid': '网格视图',
    'view.list': '列表视图',

    // Accessibility
    'a11y.skipToMain': '跳转到主内容',
  },

  'zh-TW': {
    // Header
    'site.title': 'AITuberList',
    'site.count': '（{count}位）',
    'site.lastUpdated': '最後更新：{date}',

    // Overview section
    'overview.title': '概述',
    'overview.description1': '本網站彙整了AITuber的資訊。',
    'overview.description2': '每天更新兩次。',
    'overview.description3': '標籤分類可能有誤。',
    'overview.description4': '包含將AI角色作為內容一部分的頻道。',
    'overview.contactTitle': '如有意見、需求或錯誤回報，請聯繫開發者的X：',
    'overview.github': 'GitHub 儲存庫',

    // Filter section
    'filter.title': '篩選',
    'filter.activeCount': '{count}個篩選條件已啟用',
    'filter.showCount': '顯示 {filtered} / {total}',
    'filter.searchByName': '依名稱或描述搜尋',
    'filter.searchPlaceholder': '輸入AITuber名稱或描述...',
    'filter.tags': '標籤',
    'filter.searchCondition': '搜尋條件：',
    'filter.tagDescription': '顯示標籤說明',
    'filter.noTagDescription': '暫無標籤說明',
    'filter.lastUpdated': '最後更新',
    'filter.subscriberCount': '訂閱數',
    'filter.all': '全部',
    'filter.reset': '重設',

    // Date filters
    'date.all': '全部時間',
    'date.1month': '1個月內',
    'date.3months': '3個月內',
    'date.6months': '6個月內',
    'date.1year': '1年內',
    'date.older': '1年以上',

    // Subscriber filters
    'subscriber.100': '100+訂閱',
    'subscriber.500': '500+訂閱',
    'subscriber.1000': '1000+訂閱',
    'subscriber.10000': '1萬+訂閱',

    // Card content
    'card.subscriberCount': '訂閱數：{count}',
    'card.latestVideo': '{name}的最新影片',
    'card.noVideo': '暫無影片',
    'card.upcomingStream': '即將直播',

    // Loading
    'loading.scrollMore': '滾動載入更多',
    'loading.backToTop': '返回頂部',

    // Footer
    'footer.terms': '使用條款',
    'footer.privacy': '隱私權政策',

    // Terms page
    'terms.title': '使用條款',
    'terms.lastUpdated': '最後更新：2024年11月26日',
    'terms.backToTop': '返回首頁',

    // Privacy page
    'privacy.title': '隱私權政策',
    'privacy.lastUpdated': '最後更新：2024年11月26日',
    'privacy.backToTop': '返回首頁',

    // Tag descriptions
    'tag.コメント応答': 'AI自動回覆直播聊天留言',
    'tag.解説': '有解說影片',
    'tag.歌唱あり': '有歌唱直播',
    'tag.海外': '非日語AITuber',
    'tag.ゲーム実況': '進行遊戲直播',
    'tag.AIパートナー': 'AI作為人類實況主的搭檔參與',
    'tag.複数キャラ': '多個AI角色登場',
    'tag.一部AITuber': '部分內容使用AI角色',

    // Tag names
    'tagName.コメント応答': '留言回覆',
    'tagName.複数キャラ': '多角色',
    'tagName.歌唱あり': '歌唱',
    'tagName.ゲーム実況': '遊戲直播',
    'tagName.海外': '海外',
    'tagName.一部AITuber': '部分AITuber',
    'tagName.AIパートナー': 'AI搭檔',
    'tagName.解説': '解說',

    // Sort options
    'sort.title': '排序',
    'sort.subscribers': '訂閱數',
    'sort.latest': '最新影片',
    'sort.name': '名稱',
    'sort.random': '隨機',

    // Favorites
    'filter.favoritesOnly': '僅收藏',
    'card.addFavorite': '加入收藏',
    'card.removeFavorite': '取消收藏',

    // Additional filters
    'filter.additionalFilters': '其他',

    // Upcoming filter
    'filter.upcomingOnly': '僅即將直播',

    // View mode
    'view.grid': '網格檢視',
    'view.list': '列表檢視',

    // Accessibility
    'a11y.skipToMain': '跳至主內容',
  },

  ko: {
    // Header
    'site.title': 'AITuberList',
    'site.count': '({count}명)',
    'site.lastUpdated': '마지막 업데이트: {date}',

    // Overview section
    'overview.title': '개요',
    'overview.description1': '이 웹사이트는 AITuber 정보를 정리하고 있습니다.',
    'overview.description2': '하루에 두 번 업데이트됩니다.',
    'overview.description3': '태그 분류가 잘못되어 있을 수 있습니다.',
    'overview.description4': 'AI 캐릭터가 콘텐츠의 일부로 등장하는 채널도 포함되어 있습니다.',
    'overview.contactTitle': '의견, 요청, 버그 신고는 개발자 X로 연락주세요:',
    'overview.github': 'GitHub 저장소',

    // Filter section
    'filter.title': '필터',
    'filter.activeCount': '{count}개 필터 활성화',
    'filter.showCount': '{filtered} / {total} 표시',
    'filter.searchByName': '이름 또는 설명으로 검색',
    'filter.searchPlaceholder': 'AITuber 이름 또는 설명 입력...',
    'filter.tags': '태그',
    'filter.searchCondition': '검색 조건:',
    'filter.tagDescription': '태그 설명 표시',
    'filter.noTagDescription': '태그 설명이 없습니다',
    'filter.lastUpdated': '마지막 업데이트',
    'filter.subscriberCount': '구독자 수',
    'filter.all': '전체',
    'filter.reset': '초기화',

    // Date filters
    'date.all': '전체 기간',
    'date.1month': '1개월 이내',
    'date.3months': '3개월 이내',
    'date.6months': '6개월 이내',
    'date.1year': '1년 이내',
    'date.older': '1년 이상',

    // Subscriber filters
    'subscriber.100': '100명 이상',
    'subscriber.500': '500명 이상',
    'subscriber.1000': '1000명 이상',
    'subscriber.10000': '1만명 이상',

    // Card content
    'card.subscriberCount': '구독자: {count}명',
    'card.latestVideo': '{name}의 최신 영상',
    'card.noVideo': '영상이 없습니다',
    'card.upcomingStream': '예정된 방송',

    // Loading
    'loading.scrollMore': '스크롤하여 더 불러오기',
    'loading.backToTop': '맨 위로',

    // Footer
    'footer.terms': '이용약관',
    'footer.privacy': '개인정보처리방침',

    // Terms page
    'terms.title': '이용약관',
    'terms.lastUpdated': '마지막 업데이트: 2024년 11월 26일',
    'terms.backToTop': '메인으로 돌아가기',

    // Privacy page
    'privacy.title': '개인정보처리방침',
    'privacy.lastUpdated': '마지막 업데이트: 2024년 11월 26일',
    'privacy.backToTop': '메인으로 돌아가기',

    // Tag descriptions
    'tag.コメント応答': 'AI가 라이브 채팅 댓글에 자동으로 응답',
    'tag.解説': '해설 영상 있음',
    'tag.歌唱あり': '노래 방송 있음',
    'tag.海外': '비일본어 AITuber',
    'tag.ゲーム実況': '게임 방송 진행',
    'tag.AIパートナー': 'AI가 인간 스트리머의 파트너로 참여',
    'tag.複数キャラ': '여러 AI 캐릭터 등장',
    'tag.一部AITuber': '콘텐츠 일부에 AI 캐릭터 활용',

    // Tag names
    'tagName.コメント応答': '댓글 응답',
    'tagName.複数キャラ': '다중 캐릭터',
    'tagName.歌唱あり': '노래',
    'tagName.ゲーム実況': '게임 방송',
    'tagName.海外': '해외',
    'tagName.一部AITuber': '부분 AITuber',
    'tagName.AIパートナー': 'AI 파트너',
    'tagName.解説': '해설',

    // Sort options
    'sort.title': '정렬',
    'sort.subscribers': '구독자순',
    'sort.latest': '최신 영상순',
    'sort.name': '이름순',
    'sort.random': '랜덤',

    // Favorites
    'filter.favoritesOnly': '즐겨찾기만',
    'card.addFavorite': '즐겨찾기 추가',
    'card.removeFavorite': '즐겨찾기 해제',

    // Additional filters
    'filter.additionalFilters': '기타',

    // Upcoming filter
    'filter.upcomingOnly': '예정된 방송만',

    // View mode
    'view.grid': '그리드 보기',
    'view.list': '리스트 보기',

    // Accessibility
    'a11y.skipToMain': '메인 콘텐츠로 건너뛰기',
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

  const localeMap: Record<Locale, string> = {
    'ja': 'ja-JP',
    'en': 'en-US',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    'ko': 'ko-KR'
  };

  return date.toLocaleString(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo'
  });
};

export const formatSubscriberCount = (count: number, locale: Locale = 'ja'): string => {
  // English uses K/M notation
  if (locale === 'en') {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(2)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(2)}K`;
    }
    return `${count}`;
  }

  // Korean uses 만 (man) for 10,000
  if (locale === 'ko') {
    if (count >= 10000000) {
      return `${(count / 10000000).toFixed(2)}천만`;
    } else if (count >= 10000) {
      return `${(count / 10000).toFixed(2)}만`;
    } else if (count >= 1000) {
      return `${count.toLocaleString()}`;
    }
    return `${count}`;
  }

  // Chinese (Simplified/Traditional) and Japanese use 万
  if (count >= 10000000) {
    const unit = locale === 'ja' ? '千万' : '千万';
    return `${(count / 10000000).toFixed(2)}${unit}`;
  } else if (count >= 10000) {
    const unit = locale === 'ja' ? '万' : '万';
    return `${(count / 10000).toFixed(2)}${unit}`;
  } else if (count >= 1000) {
    return `${count.toLocaleString()}`;
  }
  return `${count}`;
};

export const getTagDescription = (tag: string, locale: Locale = 'ja'): string => {
  const key = `tag.${tag}` as TranslationKey;
  return getTranslation(locale, key);
};

export const getTagName = (tag: string, locale: Locale = 'ja'): string => {
  const key = `tagName.${tag}` as TranslationKey;
  const translation = getTranslation(locale, key);
  // If translation not found, return original tag name
  return translation === key ? tag : translation;
};