'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Locale } from '@/lib/i18n'

type AboutCopy = {
  backToList: string
  guide: string
  title: string
  subtitle: string
  intro: string
  lastUpdated: string
  definitionTitle: string
  definition: string
  totalChannels: string
  mainChannels: string
  updateFrequency: string
  twiceDaily: string
  people: string
  differenceTitle: string
  differenceIntro: string
  comparison: string
  regularVtuber: string
  conversation: string[]
  voice: string[]
  commentResponse: string[]
  operation: string[]
  mechanismTitle: string
  mechanismIntro: string
  steps: [string, string][]
  findingTitle: string
  findingIntro: string
  findingLinks: [string, string][]
  informationTitle: string
  informationParagraphs: [string, string]
  operatorX: string
  or: string
  github: string
  faqTitle: string
  faqs: [string, string][]
  ctaTitle: string
  ctaDescription: string
  ctaButton: string
  list: string
  terms: string
  privacy: string
}

const copy: Record<Locale, AboutCopy> = {
  ja: {
    backToList: 'AITuber一覧へ', guide: 'AITuber入門ガイド', title: 'AITuberとは？', subtitle: '仕組み・VTuberとの違い・探し方',
    intro: 'AITuber（AI VTuber／AIVTuber）は、AI技術を使って会話や配信を行うバーチャルキャラクターです。すべてを自動で行うタイプだけでなく、人間とAIが一緒に出演するタイプ、歌やゲームの一部にAIを使うタイプもあります。',
    lastUpdated: '最終データ更新', definitionTitle: 'AITuberの定義',
    definition: '「AITuber」に業界共通の厳密な定義はまだありません。AITuberListでは、AIがキャラクターの発言、応答、歌唱、ゲーム操作など、配信・動画の中核に継続的に関わるチャンネルをAITuberとして扱います。AIキャラクターが一部の企画だけに登場する場合は「一部AITuber」と分けています。',
    totalChannels: '掲載チャンネル総数', mainChannels: 'AITuberメインの掲載数', updateFrequency: 'チャンネル情報の更新', twiceDaily: '1日2回', people: '名',
    differenceTitle: 'VTuberとの違い', differenceIntro: '見た目はどちらもバーチャルキャラクターですが、発言や行動を決める主体が異なります。実際には完全自動と人間主導の間に多くの段階があり、AITuberごとに構成は違います。',
    comparison: '比較', regularVtuber: '一般的なVTuber', conversation: ['会話', '演者が考えて話す', 'AIが文脈から応答を生成する'], voice: ['声', '演者の声やボイスチェンジャー', '音声合成を使うことが多い'], commentResponse: ['コメント応答', '演者がコメントを選んで返す', '取得・選択・返答を自動化できる'], operation: ['運用', '人間の出演時間に依存する', '自動・半自動・共同出演など幅がある'],
    mechanismTitle: 'AITuber配信の仕組み', mechanismIntro: 'コメントに返事をするAITuberは、一般に次のような流れで動きます。使用するモデルや安全対策、記憶の扱い、どこまで自動化するかはチャンネルごとに異なります。',
    steps: [['コメント取得', 'YouTubeやTwitchなどの配信コメントをプログラムで受け取ります。'], ['安全確認と文脈整理', '不適切な内容を除外し、会話履歴やキャラクター設定と組み合わせます。'], ['応答生成', '大規模言語モデル（LLM）などが、設定や会話の流れに沿った返答を作ります。'], ['音声・表情の出力', '音声合成で読み上げ、Live2Dや3Dモデルの口・表情・動きと連携します。'], ['配信', 'OBSなどの配信ソフトを通して、映像と音声を視聴者へ届けます。']],
    findingTitle: '好みに合うAITuberの探し方', findingIntro: 'AITuberListでは、名前だけでなく活動の特徴から探せます。まず気になるタグで絞り込み、登録者・フォロワー数や最新の配信日を見比べるのがおすすめです。', findingLinks: [['コメントに返事をする', 'コメント応答'], ['ゲーム配信を見る', 'ゲーム実況'], ['歌を聴く', '歌唱あり'], ['海外のAITuberを見る', '海外'], ['人間とAIのコンビを見る', 'AIパートナー']],
    informationTitle: '掲載情報について', informationParagraphs: ['チャンネル名、登録者・フォロワー数、最新コンテンツなどはYouTube・Twitchの公開情報をもとに更新しています。説明文は各チャンネルの公開プロフィールを掲載しています。', '活動内容のタグはAIによる判定を含むため、誤りや活動方針の変化がありえます。公式情報は各プロフィールからチャンネルを確認してください。掲載内容の訂正・削除は'], operatorX: '運営者のX', or: 'または', github: 'GitHub',
    faqTitle: 'よくある質問', faqs: [['AITuberとAIVTuber、AI VTuberは違いますか？', '表記の違いとして使われることが多く、統一された使い分けはありません。このサイトでは検索しやすいように、まとめてAITuberと表記しています。'], ['AITuberはすべて完全自動ですか？', 'いいえ。会話だけをAIが担当するもの、人間とAIが共同出演するもの、配信全体を自動化するものなど、自動化の範囲はさまざまです。'], ['掲載されているAITuberはどう更新されますか？', '公開APIを使い、登録者・フォロワー数や最新コンテンツを原則1日2回更新します。新規掲載や分類の修正は人の確認も交えて行います。']],
    ctaTitle: '気になるAITuberを探してみる', ctaDescription: '名の一覧から、配信内容やタグで絞り込めます。', ctaButton: 'AITuber一覧を見る', list: 'AITuber一覧', terms: '利用規約', privacy: 'プライバシーポリシー',
  },
  en: {
    backToList: 'Back to AITuber directory', guide: 'Beginner’s guide to AITubers', title: 'What is an AITuber?', subtitle: 'How they work, how they differ from VTubers, and how to find one',
    intro: 'An AITuber (AI VTuber or AIVTuber) is a virtual character that uses AI technology to converse and stream. Some operate fully automatically, while others appear with a human or use AI for only part of their singing, gaming, or other content.',
    lastUpdated: 'Data last updated', definitionTitle: 'Definition of an AITuber', definition: 'There is not yet a strict, industry-wide definition of “AITuber.” AITuberList treats a channel as an AITuber when AI continuously plays a central role in its streams or videos, such as character speech, responses, singing, or game control. Channels where an AI character appears only in some projects are labeled “Partial AITuber.”',
    totalChannels: 'Total listed channels', mainChannels: 'Main AITuber channels', updateFrequency: 'Channel data updates', twiceDaily: 'Twice daily', people: '',
    differenceTitle: 'How AITubers differ from VTubers', differenceIntro: 'Both appear as virtual characters, but the entity deciding what to say and do is different. In practice, there are many stages between full automation and human control, and every AITuber is built differently.',
    comparison: 'Comparison', regularVtuber: 'Typical VTuber', conversation: ['Conversation', 'A performer decides what to say', 'AI generates responses from context'], voice: ['Voice', 'Performer’s voice or a voice changer', 'Often uses speech synthesis'], commentResponse: ['Comment responses', 'Performer selects and answers comments', 'Collection, selection, and replies can be automated'], operation: ['Operation', 'Depends on a human performer’s availability', 'May be automatic, semi-automatic, or co-hosted'],
    mechanismTitle: 'How an AITuber stream works', mechanismIntro: 'AITubers that answer comments generally follow the process below. Models, safety measures, memory handling, and the degree of automation vary by channel.',
    steps: [['Collect comments', 'A program receives stream comments from YouTube, Twitch, or another platform.'], ['Safety and context', 'Inappropriate content is filtered and comments are combined with conversation history and character settings.'], ['Generate a response', 'A large language model (LLM) or similar system creates a reply that follows the character and conversation.'], ['Output voice and expression', 'Speech synthesis reads the reply and connects it to the mouth, face, and movement of a Live2D or 3D model.'], ['Stream', 'Streaming software such as OBS delivers the video and audio to viewers.']],
    findingTitle: 'How to find an AITuber you like', findingIntro: 'AITuberList lets you search by activity as well as by name. Start with a tag you are interested in, then compare audience size and the date of the latest stream.', findingLinks: [['Answers comments', 'コメント応答'], ['Watch game streams', 'ゲーム実況'], ['Listen to singing', '歌唱あり'], ['Explore overseas AITubers', '海外'], ['See human–AI duos', 'AIパートナー']],
    informationTitle: 'About the listed information', informationParagraphs: ['Channel names, subscriber and follower counts, and latest content are updated from public YouTube and Twitch information. Descriptions come from each channel’s public profile.', 'Activity tags include AI-based classification, so errors or changes in activity may occur. Check the official channel from each profile. For corrections or removal requests, contact'], operatorX: 'the operator on X', or: 'or', github: 'GitHub',
    faqTitle: 'Frequently asked questions', faqs: [['Are AITuber, AIVTuber, and AI VTuber different?', 'They are usually alternative spellings, with no standardized distinction. This site uses “AITuber” consistently to make them easier to find.'], ['Are all AITubers fully automatic?', 'No. AI may handle only conversation, appear alongside a human, or automate the entire stream. The degree of automation varies.'], ['How is the directory updated?', 'Public APIs normally update subscriber and follower counts and latest content twice daily. New listings and classification corrections also receive human review.']],
    ctaTitle: 'Find an AITuber that interests you', ctaDescription: ' AITubers can be filtered by content and tags.', ctaButton: 'Browse the AITuber directory', list: 'AITuber directory', terms: 'Terms of Service', privacy: 'Privacy Policy',
  },
  'zh-CN': {
    backToList: '返回AITuber列表', guide: 'AITuber入门指南', title: '什么是AITuber？', subtitle: '运作方式、与VTuber的区别及查找方法',
    intro: 'AITuber（AI VTuber／AIVTuber）是使用AI技术进行对话和直播的虚拟角色。除了完全自动运行的类型，也有人类与AI共同出演，或只在唱歌、游戏等部分内容中使用AI的类型。',
    lastUpdated: '数据最后更新', definitionTitle: 'AITuber的定义', definition: '目前“AITuber”尚无全行业统一的严格定义。AITuberList将AI持续参与角色发言、应答、歌唱、游戏操作等直播或视频核心内容的频道视为AITuber。AI角色仅在部分企划中出现的频道会标记为“部分AITuber”。',
    totalChannels: '收录频道总数', mainChannels: '以AITuber为主的频道', updateFrequency: '频道信息更新', twiceDaily: '每天2次', people: '位',
    differenceTitle: '与VTuber的区别', differenceIntro: '两者外观上都是虚拟角色，但决定发言和行动的主体不同。实际情况从完全自动到人类主导有许多层次，每个AITuber的构成都不相同。',
    comparison: '比较项目', regularVtuber: '一般VTuber', conversation: ['对话', '由出演者思考并发言', 'AI根据上下文生成回答'], voice: ['声音', '出演者原声或变声器', '通常使用语音合成'], commentResponse: ['评论应答', '出演者选择评论并回复', '可自动获取、选择和回复'], operation: ['运营', '受人类出演时间限制', '可采用自动、半自动或共同出演'],
    mechanismTitle: 'AITuber直播的运作方式', mechanismIntro: '会回复评论的AITuber通常按以下流程运行。所用模型、安全措施、记忆处理方式和自动化程度因频道而异。',
    steps: [['获取评论', '程序从YouTube、Twitch等平台接收直播评论。'], ['安全检查与整理上下文', '过滤不适当内容，并结合对话历史和角色设定。'], ['生成回答', '大型语言模型（LLM）等根据角色设定和对话流程生成回复。'], ['输出语音和表情', '通过语音合成朗读，并与Live2D或3D模型的口型、表情和动作联动。'], ['直播', '通过OBS等直播软件向观众传送视频和音频。']],
    findingTitle: '如何寻找喜欢的AITuber', findingIntro: 'AITuberList不仅支持按名称搜索，也可按活动特点查找。建议先用感兴趣的标签筛选，再比较订阅者、关注者数量及最近直播日期。', findingLinks: [['会回复评论', 'コメント応答'], ['观看游戏直播', 'ゲーム実況'], ['听唱歌', '歌唱あり'], ['查看海外AITuber', '海外'], ['观看人类与AI组合', 'AIパートナー']],
    informationTitle: '关于收录信息', informationParagraphs: ['频道名称、订阅者和关注者数量、最新内容等均根据YouTube和Twitch公开信息更新。说明文字来自各频道公开简介。', '活动标签包含AI判断，因此可能出现错误或活动方向变化。请从各资料页查看官方频道。需要更正或删除收录内容时，请联系'], operatorX: '运营者的X', or: '或', github: 'GitHub',
    faqTitle: '常见问题', faqs: [['AITuber、AIVTuber和AI VTuber有区别吗？', '它们通常只是不同写法，目前没有统一的区分标准。本站为方便搜索，统一使用“AITuber”。'], ['AITuber都是完全自动的吗？', '不是。AI可能只负责对话，也可能与人类共同出演，或自动完成整场直播，自动化程度各不相同。'], ['收录的AITuber如何更新？', '原则上每天通过公开API更新两次订阅者、关注者数量和最新内容。新增收录和分类修正也会结合人工确认。']],
    ctaTitle: '寻找感兴趣的AITuber', ctaDescription: '位AITuber可按直播内容和标签筛选。', ctaButton: '查看AITuber列表', list: 'AITuber列表', terms: '使用条款', privacy: '隐私政策',
  },
  'zh-TW': {
    backToList: '返回AITuber列表', guide: 'AITuber入門指南', title: '什麼是AITuber？', subtitle: '運作方式、與VTuber的差異及尋找方法',
    intro: 'AITuber（AI VTuber／AIVTuber）是使用AI技術進行對話和直播的虛擬角色。除了完全自動運作的類型，也有人類與AI共同演出，或只在唱歌、遊戲等部分內容中使用AI的類型。',
    lastUpdated: '資料最後更新', definitionTitle: 'AITuber的定義', definition: '目前「AITuber」尚無全產業統一的嚴格定義。AITuberList將AI持續參與角色發言、回應、歌唱、遊戲操作等直播或影片核心內容的頻道視為AITuber。AI角色僅在部分企劃中出現的頻道會標記為「部分AITuber」。',
    totalChannels: '收錄頻道總數', mainChannels: '以AITuber為主的頻道', updateFrequency: '頻道資訊更新', twiceDaily: '每天2次', people: '位',
    differenceTitle: '與VTuber的差異', differenceIntro: '兩者外觀上都是虛擬角色，但決定發言和行動的主體不同。實際情況從完全自動到人類主導有許多層次，每個AITuber的組成都不相同。',
    comparison: '比較項目', regularVtuber: '一般VTuber', conversation: ['對話', '由演出者思考並發言', 'AI根據上下文生成回答'], voice: ['聲音', '演出者原聲或變聲器', '通常使用語音合成'], commentResponse: ['留言回應', '演出者選擇留言並回覆', '可自動取得、選擇和回覆'], operation: ['營運', '受人類演出時間限制', '可採用自動、半自動或共同演出'],
    mechanismTitle: 'AITuber直播的運作方式', mechanismIntro: '會回覆留言的AITuber通常按以下流程運作。所用模型、安全措施、記憶處理方式和自動化程度因頻道而異。',
    steps: [['取得留言', '程式從YouTube、Twitch等平台接收直播留言。'], ['安全檢查與整理上下文', '過濾不適當內容，並結合對話紀錄和角色設定。'], ['生成回答', '大型語言模型（LLM）等根據角色設定和對話流程生成回覆。'], ['輸出語音和表情', '透過語音合成朗讀，並與Live2D或3D模型的嘴型、表情和動作連動。'], ['直播', '透過OBS等直播軟體向觀眾傳送影像和聲音。']],
    findingTitle: '如何尋找喜歡的AITuber', findingIntro: 'AITuberList不僅支援依名稱搜尋，也可依活動特點尋找。建議先用感興趣的標籤篩選，再比較訂閱者、追蹤者人數及最近直播日期。', findingLinks: [['會回覆留言', 'コメント応答'], ['觀看遊戲直播', 'ゲーム実況'], ['聽唱歌', '歌唱あり'], ['查看海外AITuber', '海外'], ['觀看人類與AI組合', 'AIパートナー']],
    informationTitle: '關於收錄資訊', informationParagraphs: ['頻道名稱、訂閱者和追蹤者人數、最新內容等均根據YouTube和Twitch公開資訊更新。說明文字來自各頻道公開簡介。', '活動標籤包含AI判斷，因此可能出現錯誤或活動方向變化。請從各資料頁查看官方頻道。需要更正或刪除收錄內容時，請聯絡'], operatorX: '營運者的X', or: '或', github: 'GitHub',
    faqTitle: '常見問題', faqs: [['AITuber、AIVTuber和AI VTuber有差別嗎？', '它們通常只是不同寫法，目前沒有統一的區分標準。本站為方便搜尋，統一使用「AITuber」。'], ['AITuber都是完全自動的嗎？', '不是。AI可能只負責對話，也可能與人類共同演出，或自動完成整場直播，自動化程度各不相同。'], ['收錄的AITuber如何更新？', '原則上每天透過公開API更新兩次訂閱者、追蹤者人數和最新內容。新增收錄和分類修正也會結合人工確認。']],
    ctaTitle: '尋找感興趣的AITuber', ctaDescription: '位AITuber可依直播內容和標籤篩選。', ctaButton: '查看AITuber列表', list: 'AITuber列表', terms: '使用條款', privacy: '隱私權政策',
  },
  ko: {
    backToList: 'AITuber 목록으로', guide: 'AITuber 입문 가이드', title: 'AITuber란?', subtitle: '작동 방식, VTuber와의 차이, 찾는 방법',
    intro: 'AITuber(AI VTuber/AIVTuber)는 AI 기술로 대화하고 방송하는 가상 캐릭터입니다. 모든 과정을 자동으로 수행하는 유형뿐 아니라 사람과 AI가 함께 출연하거나 노래와 게임 등 일부 콘텐츠에만 AI를 사용하는 유형도 있습니다.',
    lastUpdated: '데이터 최종 업데이트', definitionTitle: 'AITuber의 정의', definition: '현재 “AITuber”에 대한 업계 공통의 엄격한 정의는 없습니다. AITuberList는 AI가 캐릭터의 발언, 응답, 노래, 게임 조작 등 방송과 영상의 핵심에 지속적으로 관여하는 채널을 AITuber로 분류합니다. AI 캐릭터가 일부 기획에만 등장하는 채널은 “일부 AITuber”로 구분합니다.',
    totalChannels: '전체 등록 채널', mainChannels: 'AITuber 중심 채널', updateFrequency: '채널 정보 업데이트', twiceDaily: '하루 2회', people: '명',
    differenceTitle: 'VTuber와의 차이', differenceIntro: '둘 다 가상 캐릭터의 모습이지만 발언과 행동을 결정하는 주체가 다릅니다. 실제로는 완전 자동과 사람 중심 운영 사이에 여러 단계가 있으며 AITuber마다 구성이 다릅니다.',
    comparison: '비교', regularVtuber: '일반적인 VTuber', conversation: ['대화', '출연자가 생각하고 말함', 'AI가 맥락을 바탕으로 응답 생성'], voice: ['목소리', '출연자의 목소리 또는 보이스 체인저', '음성 합성을 주로 사용'], commentResponse: ['댓글 응답', '출연자가 댓글을 골라 답변', '수집, 선택, 답변을 자동화 가능'], operation: ['운영', '사람의 출연 가능 시간에 의존', '자동, 반자동, 공동 출연 등 다양함'],
    mechanismTitle: 'AITuber 방송의 작동 방식', mechanismIntro: '댓글에 답하는 AITuber는 일반적으로 다음 흐름으로 작동합니다. 사용하는 모델, 안전 대책, 기억 처리 방식, 자동화 범위는 채널마다 다릅니다.',
    steps: [['댓글 수집', '프로그램이 YouTube나 Twitch 등의 방송 댓글을 받습니다.'], ['안전 확인과 맥락 정리', '부적절한 내용을 제외하고 대화 기록 및 캐릭터 설정과 결합합니다.'], ['응답 생성', '대규모 언어 모델(LLM) 등이 설정과 대화 흐름에 맞는 답변을 만듭니다.'], ['음성과 표정 출력', '음성 합성으로 읽고 Live2D 또는 3D 모델의 입, 표정, 움직임과 연동합니다.'], ['방송', 'OBS 등의 방송 소프트웨어를 통해 영상과 음성을 시청자에게 전달합니다.']],
    findingTitle: '취향에 맞는 AITuber 찾기', findingIntro: 'AITuberList에서는 이름뿐 아니라 활동 특징으로도 찾을 수 있습니다. 관심 있는 태그로 먼저 필터링한 뒤 구독자·팔로워 수와 최근 방송일을 비교해 보세요.', findingLinks: [['댓글에 답하는 채널', 'コメント応答'], ['게임 방송 보기', 'ゲーム実況'], ['노래 듣기', '歌唱あり'], ['해외 AITuber 보기', '海外'], ['사람과 AI 듀오 보기', 'AIパートナー']],
    informationTitle: '등록 정보 안내', informationParagraphs: ['채널명, 구독자·팔로워 수, 최신 콘텐츠 등은 YouTube와 Twitch의 공개 정보를 바탕으로 업데이트합니다. 설명문은 각 채널의 공개 프로필을 사용합니다.', '활동 태그에는 AI 분류가 포함되어 오류나 활동 방향의 변화가 있을 수 있습니다. 각 프로필에서 공식 채널을 확인해 주세요. 정보 수정 또는 삭제 요청은'], operatorX: '운영자의 X', or: '또는', github: 'GitHub',
    faqTitle: '자주 묻는 질문', faqs: [['AITuber, AIVTuber, AI VTuber는 다른가요?', '대체로 표기 차이로 사용되며 통일된 구분 기준은 없습니다. 이 사이트에서는 검색하기 쉽도록 AITuber로 통일합니다.'], ['AITuber는 모두 완전 자동인가요?', '아닙니다. AI가 대화만 담당하거나 사람과 함께 출연하거나 방송 전체를 자동화하는 등 범위가 다양합니다.'], ['등록된 AITuber는 어떻게 업데이트되나요?', '공개 API를 이용해 구독자·팔로워 수와 최신 콘텐츠를 원칙적으로 하루 두 번 업데이트합니다. 신규 등록과 분류 수정에는 사람의 확인도 포함됩니다.']],
    ctaTitle: '관심 있는 AITuber 찾아보기', ctaDescription: '명의 목록을 방송 내용과 태그로 필터링할 수 있습니다.', ctaButton: 'AITuber 목록 보기', list: 'AITuber 목록', terms: '이용약관', privacy: '개인정보처리방침',
  },
}

const dateLocales: Record<Locale, string> = {
  ja: 'ja-JP', en: 'en-US', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', ko: 'ko-KR',
}

export function AboutContent({ totalCount, mainCount, updatedAt }: { totalCount: number; mainCount: number; updatedAt: string }) {
  const { locale } = useLanguage()
  const text = copy[locale]
  const formattedDate = new Intl.DateTimeFormat(dateLocales[locale], {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo',
  }).format(new Date(updatedAt))
  const comparisonRows = [text.conversation, text.voice, text.commentResponse, text.operation]

  return (
    <main id="main-content" className="min-h-screen">
      <header className="border-b border-border/70 bg-background/90">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" aria-label="AITuberList">
            <Image src="/images/aituber-list-logo.png" alt="AITuberList" width={2166} height={350} className="h-7 w-auto" priority />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden text-sm font-semibold text-primary hover:underline sm:inline">{text.backToList}</Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-sm font-semibold text-primary">{text.guide}</p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
          {text.title}<span className="mt-2 block text-2xl text-muted-foreground sm:text-3xl">{text.subtitle}</span>
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{text.intro}</p>
        <p className="mt-4 text-sm text-muted-foreground">{text.lastUpdated}: {formattedDate}</p>

        <section className="mt-12 rounded-[1.5rem] border border-violet-200/70 bg-gradient-to-br from-violet-100/70 via-card to-cyan-100/60 p-6 dark:border-violet-400/20 dark:from-violet-400/10 dark:via-card dark:to-cyan-400/10 sm:p-8">
          <h2 className="text-2xl font-bold">{text.definitionTitle}</h2>
          <p className="mt-4 leading-8 text-muted-foreground">{text.definition}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[[`${totalCount}${text.people}`, text.totalChannels], [`${mainCount}${text.people}`, text.mainChannels], [text.twiceDaily, text.updateFrequency]].map(([value, label]) => (
              <div key={label} className="rounded-xl border bg-card/85 p-4"><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold sm:text-3xl">{text.differenceTitle}</h2>
          <p className="mt-4 leading-8 text-muted-foreground">{text.differenceIntro}</p>
          <div className="mt-6 overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/70"><tr><th className="px-5 py-4 font-semibold">{text.comparison}</th><th className="px-5 py-4 font-semibold">{text.regularVtuber}</th><th className="px-5 py-4 font-semibold">AITuber</th></tr></thead>
              <tbody className="divide-y">{comparisonRows.map(([label, regular, ai]) => <tr key={label}><th className="px-5 py-4 font-semibold">{label}</th><td className="px-5 py-4 text-muted-foreground">{regular}</td><td className="px-5 py-4 text-muted-foreground">{ai}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold sm:text-3xl">{text.mechanismTitle}</h2><p className="mt-4 leading-8 text-muted-foreground">{text.mechanismIntro}</p>
          <ol className="mt-7 grid gap-4">{text.steps.map(([title, description], index) => <li key={title} className="flex gap-4 rounded-2xl border bg-card p-5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{index + 1}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1 leading-7 text-muted-foreground">{description}</p></div></li>)}</ol>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold sm:text-3xl">{text.findingTitle}</h2><p className="mt-4 leading-8 text-muted-foreground">{text.findingIntro}</p>
          <div className="mt-6 flex flex-wrap gap-3">{text.findingLinks.map(([label, tag]) => <Link key={tag} href={`/?tags=${encodeURIComponent(tag)}`} className="rounded-full border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-400/10">{label}</Link>)}</div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold sm:text-3xl">{text.informationTitle}</h2>
          <div className="mt-5 space-y-4 leading-8 text-muted-foreground"><p>{text.informationParagraphs[0]}</p><p>{text.informationParagraphs[1]} <a href="https://x.com/tegnike" className="font-semibold text-primary hover:underline">{text.operatorX}</a> {text.or} <a href="https://github.com/tegnike/aituber-list" className="font-semibold text-primary hover:underline">{text.github}</a>.</p></div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold sm:text-3xl">{text.faqTitle}</h2>
          <div className="mt-6 divide-y rounded-2xl border bg-card px-5 sm:px-7">{text.faqs.map(([question, answer]) => <div key={question} className="py-6"><h3 className="font-bold">{question}</h3><p className="mt-2 leading-7 text-muted-foreground">{answer}</p></div>)}</div>
        </section>

        <section className="mt-14 rounded-[1.5rem] bg-primary px-6 py-8 text-primary-foreground sm:px-9">
          <h2 className="text-2xl font-bold">{text.ctaTitle}</h2><p className="mt-2 text-primary-foreground/80">{totalCount}{text.ctaDescription}</p>
          <Link href="/" className="mt-5 inline-flex rounded-lg bg-background px-5 py-3 text-sm font-bold text-foreground transition-opacity hover:opacity-90">{text.ctaButton}</Link>
        </section>

        <footer className="mt-12 flex flex-wrap gap-5 border-t pt-6 text-sm text-muted-foreground"><Link href="/" className="hover:underline">{text.list}</Link><Link href="/terms/" className="hover:underline">{text.terms}</Link><Link href="/privacy/" className="hover:underline">{text.privacy}</Link></footer>
      </article>
    </main>
  )
}
