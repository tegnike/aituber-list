import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { aitubers, aituberLastUpdated, getMainAitubers } from '@/lib/aitubers'
import { absoluteUrl, serializeJsonLd, SITE_URL } from '@/lib/seo'

const mainAituberCount = getMainAitubers().length

export const metadata: Metadata = {
  title: 'AITuberとは？仕組み・VTuberとの違い・探し方',
  description: 'AITuber（AI VTuber／AIVTuber）の意味、配信の仕組み、VTuberとの違い、自動化の範囲、好みに合うAITuberの探し方をわかりやすく解説します。',
  alternates: {
    canonical: '/about/',
  },
  openGraph: {
    title: 'AITuberとは？仕組み・VTuberとの違い・探し方',
    description: 'AITuberの意味から配信の仕組み、VTuberとの違い、探し方までを解説します。',
    url: '/about/',
    type: 'article',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${SITE_URL}/about/#article`,
      headline: 'AITuberとは？仕組み・VTuberとの違い・探し方',
      description: 'AITuber（AI VTuber／AIVTuber）の意味、配信の仕組み、VTuberとの違い、自動化の範囲、探し方を解説します。',
      url: absoluteUrl('/about/'),
      inLanguage: 'ja',
      dateModified: aituberLastUpdated,
      author: {
        '@type': 'Person',
        name: 'ニケちゃん',
        url: 'https://x.com/tegnike',
      },
      publisher: {
        '@type': 'Organization',
        name: 'AITuberList',
        url: SITE_URL,
        logo: absoluteUrl('/images/aituber-list-logo.png'),
      },
      about: {
        '@type': 'Thing',
        name: 'AITuber',
        alternateName: ['AI VTuber', 'AIVTuber'],
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'AITuber一覧',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'AITuberとは',
          item: absoluteUrl('/about/'),
        },
      ],
    },
  ],
}

const steps = [
  ['コメント取得', 'YouTubeやTwitchなどの配信コメントをプログラムで受け取ります。'],
  ['安全確認と文脈整理', '不適切な内容を除外し、会話履歴やキャラクター設定と組み合わせます。'],
  ['応答生成', '大規模言語モデル（LLM）などが、設定や会話の流れに沿った返答を作ります。'],
  ['音声・表情の出力', '音声合成で読み上げ、Live2Dや3Dモデルの口・表情・動きと連携します。'],
  ['配信', 'OBSなどの配信ソフトを通して、映像と音声を視聴者へ届けます。'],
]

export default function AboutPage() {
  const updatedAt = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Tokyo',
  }).format(new Date(aituberLastUpdated))

  return (
    <main id="main-content" className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />

      <header className="border-b border-border/70 bg-background/90">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="AITuberList トップ">
            <Image
              src="/images/aituber-list-logo.png"
              alt="AITuberList"
              width={2166}
              height={350}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">
            AITuber一覧へ
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-sm font-semibold text-primary">AITuber入門ガイド</p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
          AITuberとは？
          <span className="mt-2 block text-2xl text-muted-foreground sm:text-3xl">
            仕組み・VTuberとの違い・探し方
          </span>
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
          AITuber（AI VTuber／AIVTuber）は、AI技術を使って会話や配信を行うバーチャルキャラクターです。
          すべてを自動で行うタイプだけでなく、人間とAIが一緒に出演するタイプ、歌やゲームの一部にAIを使うタイプもあります。
        </p>
        <p className="mt-4 text-sm text-muted-foreground">最終データ更新: {updatedAt}</p>

        <section className="mt-12 rounded-[1.5rem] border border-violet-200/70 bg-gradient-to-br from-violet-100/70 via-card to-cyan-100/60 p-6 dark:border-violet-400/20 dark:from-violet-400/10 dark:via-card dark:to-cyan-400/10 sm:p-8">
          <h2 className="text-2xl font-bold">AITuberの定義</h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            「AITuber」に業界共通の厳密な定義はまだありません。AITuberListでは、AIがキャラクターの発言、応答、歌唱、ゲーム操作など、配信・動画の中核に継続的に関わるチャンネルをAITuberとして扱います。
            AIキャラクターが一部の企画だけに登場する場合は「一部AITuber」と分けています。
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-card/85 p-4">
              <p className="text-2xl font-bold">{aitubers.length}名</p>
              <p className="mt-1 text-sm text-muted-foreground">掲載チャンネル総数</p>
            </div>
            <div className="rounded-xl border bg-card/85 p-4">
              <p className="text-2xl font-bold">{mainAituberCount}名</p>
              <p className="mt-1 text-sm text-muted-foreground">AITuberメインの掲載数</p>
            </div>
            <div className="rounded-xl border bg-card/85 p-4">
              <p className="text-2xl font-bold">1日2回</p>
              <p className="mt-1 text-sm text-muted-foreground">チャンネル情報の更新</p>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold sm:text-3xl">VTuberとの違い</h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            見た目はどちらもバーチャルキャラクターですが、発言や行動を決める主体が異なります。実際には完全自動と人間主導の間に多くの段階があり、AITuberごとに構成は違います。
          </p>
          <div className="mt-6 overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/70">
                <tr>
                  <th className="px-5 py-4 font-semibold">比較</th>
                  <th className="px-5 py-4 font-semibold">一般的なVTuber</th>
                  <th className="px-5 py-4 font-semibold">AITuber</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <th className="px-5 py-4 font-semibold">会話</th>
                  <td className="px-5 py-4 text-muted-foreground">演者が考えて話す</td>
                  <td className="px-5 py-4 text-muted-foreground">AIが文脈から応答を生成する</td>
                </tr>
                <tr>
                  <th className="px-5 py-4 font-semibold">声</th>
                  <td className="px-5 py-4 text-muted-foreground">演者の声やボイスチェンジャー</td>
                  <td className="px-5 py-4 text-muted-foreground">音声合成を使うことが多い</td>
                </tr>
                <tr>
                  <th className="px-5 py-4 font-semibold">コメント応答</th>
                  <td className="px-5 py-4 text-muted-foreground">演者がコメントを選んで返す</td>
                  <td className="px-5 py-4 text-muted-foreground">取得・選択・返答を自動化できる</td>
                </tr>
                <tr>
                  <th className="px-5 py-4 font-semibold">運用</th>
                  <td className="px-5 py-4 text-muted-foreground">人間の出演時間に依存する</td>
                  <td className="px-5 py-4 text-muted-foreground">自動・半自動・共同出演など幅がある</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold sm:text-3xl">AITuber配信の仕組み</h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            コメントに返事をするAITuberは、一般に次のような流れで動きます。使用するモデルや安全対策、記憶の扱い、どこまで自動化するかはチャンネルごとに異なります。
          </p>
          <ol className="mt-7 grid gap-4">
            {steps.map(([title, description], index) => (
              <li key={title} className="flex gap-4 rounded-2xl border bg-card p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 leading-7 text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold sm:text-3xl">好みに合うAITuberの探し方</h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            AITuberListでは、名前だけでなく活動の特徴から探せます。まず気になるタグで絞り込み、登録者・フォロワー数や最新の配信日を見比べるのがおすすめです。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              ['コメントに返事をする', 'コメント応答'],
              ['ゲーム配信を見る', 'ゲーム実況'],
              ['歌を聴く', '歌唱あり'],
              ['海外のAITuberを見る', '海外'],
              ['人間とAIのコンビを見る', 'AIパートナー'],
            ].map(([label, tag]) => (
              <Link
                key={tag}
                href={`/?tags=${encodeURIComponent(tag)}`}
                className="rounded-full border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-400/10"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold sm:text-3xl">掲載情報について</h2>
          <div className="mt-5 space-y-4 leading-8 text-muted-foreground">
            <p>
              チャンネル名、登録者・フォロワー数、最新コンテンツなどはYouTube・Twitchの公開情報をもとに更新しています。説明文は各チャンネルの公開プロフィールを掲載しています。
            </p>
            <p>
              活動内容のタグはAIによる判定を含むため、誤りや活動方針の変化がありえます。公式情報は各プロフィールからチャンネルを確認してください。掲載内容の訂正・削除は
              <a href="https://x.com/tegnike" className="font-semibold text-primary hover:underline"> 運営者のX </a>
              または
              <a href="https://github.com/tegnike/aituber-list" className="font-semibold text-primary hover:underline"> GitHub </a>
              で受け付けています。
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold sm:text-3xl">よくある質問</h2>
          <div className="mt-6 divide-y rounded-2xl border bg-card px-5 sm:px-7">
            <div className="py-6">
              <h3 className="font-bold">AITuberとAIVTuber、AI VTuberは違いますか？</h3>
              <p className="mt-2 leading-7 text-muted-foreground">
                表記の違いとして使われることが多く、統一された使い分けはありません。このサイトでは検索しやすいように、まとめてAITuberと表記しています。
              </p>
            </div>
            <div className="py-6">
              <h3 className="font-bold">AITuberはすべて完全自動ですか？</h3>
              <p className="mt-2 leading-7 text-muted-foreground">
                いいえ。会話だけをAIが担当するもの、人間とAIが共同出演するもの、配信全体を自動化するものなど、自動化の範囲はさまざまです。
              </p>
            </div>
            <div className="py-6">
              <h3 className="font-bold">掲載されているAITuberはどう更新されますか？</h3>
              <p className="mt-2 leading-7 text-muted-foreground">
                公開APIを使い、登録者・フォロワー数や最新コンテンツを原則1日2回更新します。新規掲載や分類の修正は人の確認も交えて行います。
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-[1.5rem] bg-primary px-6 py-8 text-primary-foreground sm:px-9">
          <h2 className="text-2xl font-bold">気になるAITuberを探してみる</h2>
          <p className="mt-2 text-primary-foreground/80">
            {aitubers.length}名の一覧から、配信内容やタグで絞り込めます。
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-background px-5 py-3 text-sm font-bold text-foreground transition-opacity hover:opacity-90"
          >
            AITuber一覧を見る
          </Link>
        </section>

        <footer className="mt-12 flex flex-wrap gap-5 border-t pt-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">AITuber一覧</Link>
          <Link href="/terms/" className="hover:underline">利用規約</Link>
          <Link href="/privacy/" className="hover:underline">プライバシーポリシー</Link>
        </footer>
      </article>
    </main>
  )
}
