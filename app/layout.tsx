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
  title: "AITuber リスト | AIVTuber 一覧 - AITuberの情報をまとめています",
  description: "AITuber（AIVTuber）の情報をまとめたサイトです。コメント応答型、歌唱系、ゲーム実況など様々なタイプのAI配信者を掲載。タグによる分類で検索も可能です。毎日2回更新。",
  keywords: "AITuber,AIVTuber,AI VTuber,AITuber リスト,AIVTuber 一覧,AITuber 検索,AITuber データベース,バーチャルYouTuber AI,AI配信者,AIストリーマー",
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
    title: "AITuber リスト | AIVTuber 一覧",
    description: "AITuber（AIVTuber）の情報をまとめたサイト。タグによる分類で検索可能。毎日2回更新。",
    url: "https://aituberlist.net",
    siteName: "AITuberList",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "AITuberList",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AITuberList",
    description: "AITuber（AIVTuber）の情報をまとめたサイト。タグによる分類で検索可能。",
    creator: "@tegnike",
    images: ["/ogp.png"],
  },
  verification: {
    google: "google-site-verification-code",
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
