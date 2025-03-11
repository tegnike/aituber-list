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
  title: "AITuberList",
  description: "AITuberの情報をまとめています",
  openGraph: {
    title: "AITuberList",
    description: "AITuberの情報をまとめています",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "AITuberList",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AITuberList",
    description: "AITuberの情報をまとめています",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
