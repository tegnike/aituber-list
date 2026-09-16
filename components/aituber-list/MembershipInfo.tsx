import type { Locale } from '@/lib/i18n'

const copy = {
  ja: {
    title: 'メンバーシップの表示・開設条件について',
    meaning: '王冠はYouTubeの加入ボタンを確認できたチャンネルです。表示がない場合も、未開設とは限りません。',
    threshold: '日本など対象地域の拡充版YPPへの申請条件：登録者500人以上、直近90日間に有効な公開動画3本以上。さらに、直近12か月の有効な公開動画の総再生時間3,000時間以上、または直近90日の有効な公開Shorts視聴300万回以上が必要です。',
    extra: '開設にはYPPの審査・承認、18歳以上、対象地域に居住、課金型製品モジュールへの同意などが必要です。子ども向けチャンネルや、子ども向け・音楽の権利申し立てがある動画が多いチャンネルなどは対象外です。条件達成だけで自動開設されるものではありません。',
    date: '2026年9月16日確認。条件は変更される場合があります。',
    ypp: 'YPPの申請条件', membership: 'メンバーシップの利用資格',
  },
  en: {
    title: 'About membership icons and eligibility',
    meaning: 'The crown marks a channel with a confirmed YouTube Join button. No icon does not mean memberships are unavailable.',
    threshold: 'In eligible regions, expanded YPP applications require 500 subscribers and 3 valid public uploads in 90 days, plus either 3,000 valid public watch hours in 12 months or 3 million valid public Shorts views in 90 days.',
    extra: 'Memberships also require YPP approval, age 18+, an eligible location and acceptance of the Commerce Product Module. Channels made for kids, or with many ineligible videos (including music claims), do not qualify. Reaching the numbers does not automatically enable memberships.',
    date: 'Checked September 16, 2026. Requirements may change.',
    ypp: 'YPP requirements', membership: 'Membership eligibility',
  },
  'zh-CN': {
    title: '会员图标与开通条件',
    meaning: '皇冠表示已确认该频道有YouTube加入按钮。没有图标不代表未开通。',
    threshold: '适用地区的扩展版YPP申请条件：500名订阅者、90天内3个有效公开视频，并满足12个月内3,000小时有效公开观看时长，或90天内300万次有效公开Shorts观看。',
    extra: '还需通过YPP审核、年满18岁、居住在适用地区并接受商务产品模块。面向儿童或含大量不符合资格视频（包括音乐版权声明）的频道不适用。达到数量门槛不会自动开通。',
    date: '核实日期：2026年9月16日。条件可能变更。',
    ypp: 'YPP申请条件', membership: '会员资格要求',
  },
  'zh-TW': {
    title: '會員圖示與開通條件',
    meaning: '皇冠表示已確認該頻道有YouTube加入按鈕。沒有圖示不代表未開通。',
    threshold: '適用地區的擴大版YPP申請條件：500名訂閱者、90天內3部有效公開影片，並滿足12個月內3,000小時有效公開觀看時數，或90天內300萬次有效公開Shorts觀看。',
    extra: '還需通過YPP審核、年滿18歲、居住在適用地區並接受商務產品模組。兒童專屬或含大量不符資格影片（包括音樂版權聲明）的頻道不適用。達到數量門檻不會自動開通。',
    date: '確認日期：2026年9月16日。條件可能變更。',
    ypp: 'YPP申請條件', membership: '會員資格要求',
  },
  ko: {
    title: '멤버십 아이콘 및 개설 조건',
    meaning: '왕관은 YouTube 가입 버튼이 확인된 채널입니다. 아이콘이 없어도 멤버십이 없다는 뜻은 아닙니다.',
    threshold: '지원 지역의 확대 YPP 신청 조건: 구독자 500명, 최근 90일간 유효한 공개 업로드 3개 및 최근 12개월간 유효한 공개 시청 시간 3,000시간 또는 최근 90일간 유효한 공개 Shorts 조회수 300만 회.',
    extra: 'YPP 심사 승인, 만 18세 이상, 지원 지역 거주 및 상거래 제품 모듈 동의 등이 필요합니다. 아동용 채널이나 음악 저작권 주장 등 부적격 동영상이 많은 채널은 대상이 아닙니다. 수치 달성만으로 자동 개설되지 않습니다.',
    date: '2026년 9월 16일 확인. 조건은 변경될 수 있습니다.',
    ypp: 'YPP 신청 조건', membership: '멤버십 자격 요건',
  },
}

export function MembershipInfo({ locale }: { locale: Locale }) {
  const text = copy[locale]
  return (
    <details className="text-xs leading-6 text-muted-foreground">
      <summary className="w-fit cursor-pointer rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{text.title}</summary>
      <div className="mt-2 max-w-3xl space-y-2 rounded-lg border bg-muted/20 p-3">
        <p>{text.meaning}</p>
        <p>{text.threshold}</p>
        <p>{text.extra}</p>
        <p>{text.date}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <a className="underline underline-offset-2" href={`https://support.google.com/youtube/answer/13429240?hl=${locale}`} target="_blank" rel="noopener noreferrer">{text.ypp}</a>
          <a className="underline underline-offset-2" href={`https://support.google.com/youtube/answer/7636690?hl=${locale}`} target="_blank" rel="noopener noreferrer">{text.membership}</a>
        </div>
      </div>
    </details>
  )
}
