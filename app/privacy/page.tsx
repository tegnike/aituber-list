import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
      
      <div className="prose dark:prose-invert">
        <p className="text-sm text-gray-600 mb-8">最終更新日: 2024年11月26日</p>

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

        <div className="mt-8 flex justify-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            トップページに戻る
          </Link>
          <Link href="/terms" className="hover:underline">
            利用規約
          </Link>
        </div>
      </div>
    </div>
  )
} 