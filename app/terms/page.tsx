import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">利用規約</h1>
      
      <div className="prose dark:prose-invert">
        <p className="text-sm text-gray-600 mb-8">最終更新日: 2024年11月26日</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. はじめに</h2>
          <p>
            本利用規約（以下「本規約」）は、[サービス名]（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆様は、本規約に同意の上、本サービスをご利用ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. 定義</h2>
          <ul className="list-disc pl-6">
            <li>「AITuber」とは、動画投稿者が配信・投稿のために用意した、AI技術によって動作するバーチャルキャラクターを指します。</li>
            <li>「動画投稿者」とは、AITuberを用いてYouTubeやTikTokなどのプラットフォームで動画を配信・投稿する個人または団体を指します。</li>
            <li>「ユーザー」とは、本サービスを利用するすべての方を指します。</li>
            <li>「コンテンツ」とは、本サービスで提供される、AITuberに関する情報、テキスト、画像、動画リンクなどを指します。</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. サービスの内容</h2>
          <p>本サービスは、AITuberに関する情報を収集・整理し、ユーザーに提供する情報プラットフォームです。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. 禁止事項</h2>
          <p>以下の行為を禁止します：</p>
          <ol className="list-decimal pl-6">
            <li>法令違反行為</li>
            <li>他のユーザーや第三者の権利を侵害する行為</li>
            <li>AITuber、動画投稿者、およびそれらに関連する知的財産権を侵害する行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>本サービスの不正な利用やアクセス</li>
            <li>AITuberや動画投稿者に関する誹謗中傷</li>
            <li>本サービスのコンテンツの無断複製、転載、または不正な使用</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. 知的財産権</h2>
          <ol className="list-decimal pl-6">
            <li>本サービスに掲載されているコンテンツの著作権は、運営者または正当な権利者に帰属します。</li>
            <li>AITuberに関連する知的財産権は、各動画投稿者または権利者に帰属します。</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. 免責事項</h2>
          <ol className="list-decimal pl-6">
            <li>本サービスは「現状有姿」で提供され、その完全性、正確性、有用性等について一切保証しません。</li>
            <li>運営者は、本サービスの利用により生じた損害について、一切の責任を負いません。</li>
            <li>AITuberに関する情報は、可能な限り正確な情報の提供に努めますが、その正確性を保証するものではありません。</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. 規約の変更</h2>
          <p>
            運営者は、必要に応じて本規約を変更することができます。変更後の規約は、本サービス上で告知した時点から効力を生じるものとします。
          </p>
        </section>

        <h1 className="text-3xl font-bold mb-6 mt-12">プライバシーポリシー</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. 収集する情報</h2>
          <p>当サービスでは、以下の情報を収集する可能性があります：</p>
          <ol className="list-decimal pl-6">
            <li>自動的に収集される情報
              <ul className="list-disc pl-6">
                <li>IPアドレス</li>
                <li>ブラウザの種類</li>
                <li>アクセス日時</li>
                <li>クッキー情報</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. 情報の利用目的</h2>
          <p>収集した情報は、以下の目的で利用します：</p>
          <ol className="list-decimal pl-6">
            <li>サービスの提供・運営</li>
            <li>サービス改善</li>
            <li>利用状況の分析</li>
            <li>セキュリティの確保</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. 情報の共有</h2>
          <p>収集した情報は、以下の場合を除き、第三者に提供しません：</p>
          <ol className="list-decimal pl-6">
            <li>法令に基づく場合</li>
            <li>サービス運営に必要な外部委託先との共有</li>
            <li>統計データとして個人を特定できない形での利用</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. データの保護</h2>
          <p>当サービスは、収集した情報の保護のため、適切な安全管理措置を講じます：</p>
          <ol className="list-decimal pl-6">
            <li>不正アクセス防止措置</li>
            <li>データの暗号化</li>
            <li>アクセス制限の実施</li>
            <li>セキュリティソフトウェアの利用</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. クッキーの使用</h2>
          <p>本サービスでは、サービス向上のためにクッキーを使用しています。ブラウザの設定により、クッキーの受け入れを制御することができます。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. お問い合わせ</h2>
          <p>本プライバシーポリシーに関するお問い合わせは、以下のXアカウントのDMまでお願いします：</p>
          <a href="https://x.com/tegnike" className="hover:underline">https://x.com/tegnike</a>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. 改定</h2>
          <p>本プライバシーポリシーは、必要に応じて改定されることがあります。重要な変更がある場合は、本サービス上で通知します。</p>
        </section>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          トップページに戻る
        </Link>
      </div>
    </div>
  )
}
