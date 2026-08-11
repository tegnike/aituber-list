import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "AITuber一覧・検索 | 日本と海外のAI VTuberを探す",
    template: "%s | AITuberList",
  },
  description: "日本・海外のAITuber（AI VTuber／AIVTuber）を、活動内容・登録者数・最新配信・タグから探せる専門リストです。チャンネル情報を定期更新しています。",
  keywords: ["AITuber", "AIVTuber", "AI VTuber", "AITuber 一覧", "AI配信者"],
  applicationName: "AITuberList",
  authors: [{ name: "ニケちゃん", url: "https://x.com/tegnike" }],
  creator: "ニケちゃん",
  publisher: "AITuberList",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aituberlist.net"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "AITuber一覧・検索 | AITuberList",
    description: "日本・海外のAITuberを、活動内容・登録者数・最新配信・タグから探せる専門リスト。チャンネル情報を定期更新。",
    url: "https://aituberlist.net",
    siteName: "AITuberList",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "日本と海外のAITuberを探せるAITuberList",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AITuber一覧・検索 | AITuberList",
    description: "日本・海外のAITuberを活動内容・登録者数・最新配信・タグから探せます。",
    creator: "@tegnike",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <GoogleAnalytics />
          {children}
        </Providers>
      </body>
    </html>
  );
}
